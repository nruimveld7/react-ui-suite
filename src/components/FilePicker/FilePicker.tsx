import * as React from "react";
import clsx from "clsx";
import "./FilePicker.css";

type NativeInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export type FilePickerMode = "path" | "content" | "both";

export type FileSelection = {
  file: File;
  path?: string;
  text?: string;
  bytes?: Uint8Array;
  size?: number;
};

export type FilePickerExternalRequest = {
  directory: boolean;
  multiple: boolean;
  mode: FilePickerMode;
  accept?: string;
  maxFiles?: number;
  currentSelections: FileSelection[];
};

export type FilePickerProps = NativeInputProps & {
  label?: string;
  description?: string;
  error?: string;
  dropzoneLabel?: string;
  maxFiles?: number;
  directory?: boolean;
  mode?: FilePickerMode;
  resolvePath?: (file: File) => string | undefined | Promise<string | undefined>;
  externalPicker?: (
    request: FilePickerExternalRequest
  ) => Promise<FileSelection[] | null | undefined>;
  onFilesChange?: (files: FileSelection[]) => void;
};

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: () => Promise<DirectoryPickerHandle>;
};

type DirectoryPickerHandle = {
  name: string;
  values?: () => AsyncIterable<DirectoryPickerEntryHandle>;
};

type DirectoryPickerEntryHandle = {
  kind?: "file" | "directory";
  getFile?: () => Promise<File>;
  values?: () => AsyncIterable<DirectoryPickerEntryHandle>;
};

function matchesAcceptToken(file: File, token: string) {
  const normalizedToken = token.trim().toLowerCase();
  if (!normalizedToken) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  if (normalizedToken.startsWith(".")) {
    return fileName.endsWith(normalizedToken);
  }

  if (normalizedToken.endsWith("/*")) {
    const prefix = normalizedToken.slice(0, -1);
    return fileType.startsWith(prefix);
  }

  return fileType === normalizedToken;
}

function filterFilesByAccept(files: File[], accept: string | undefined) {
  if (!accept?.trim()) return files;
  const tokens = accept
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  if (!tokens.length) return files;

  return files.filter((file) => tokens.some((token) => matchesAcceptToken(file, token)));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function decodeUtf8IfPossible(bytes: Uint8Array) {
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true });
    return decoder.decode(bytes);
  } catch {
    return undefined;
  }
}

async function derivePath(
  file: File,
  resolvePath: FilePickerProps["resolvePath"] | undefined
) {
  const resolved = await resolvePath?.(file);
  if (resolved) return resolved;

  const fileWithPath = file as File & { path?: string; webkitRelativePath?: string };
  if (typeof fileWithPath.path === "string" && fileWithPath.path.length > 0) {
    return fileWithPath.path;
  }
  if (
    typeof fileWithPath.webkitRelativePath === "string" &&
    fileWithPath.webkitRelativePath.length > 0
  ) {
    return fileWithPath.webkitRelativePath;
  }

  return undefined;
}

async function readFileBytes(file: File) {
  const fileWithArrayBuffer = file as File & { arrayBuffer?: () => Promise<ArrayBuffer> };
  if (typeof fileWithArrayBuffer.arrayBuffer === "function") {
    return new Uint8Array(await fileWithArrayBuffer.arrayBuffer());
  }

  if (typeof Blob !== "undefined" && typeof Blob.prototype.arrayBuffer === "function") {
    return new Uint8Array(await Blob.prototype.arrayBuffer.call(file as Blob));
  }

  if (typeof FileReader !== "undefined") {
    return await new Promise<Uint8Array | undefined>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        resolve(result instanceof ArrayBuffer ? new Uint8Array(result) : undefined);
      };
      reader.onerror = () => resolve(undefined);
      reader.readAsArrayBuffer(file);
    });
  }

  return undefined;
}

async function readDirectorySize(handle: DirectoryPickerHandle) {
  if (typeof handle.values !== "function") {
    return undefined;
  }

  let total = 0;
  for await (const entry of handle.values()) {
    if (entry.kind === "file" && typeof entry.getFile === "function") {
      const file = await entry.getFile();
      total += file.size;
      continue;
    }

    if (entry.kind === "directory" && typeof entry.values === "function") {
      const nestedSize = await readDirectorySize({
        name: "",
        values: entry.values,
      });
      if (typeof nestedSize === "number") {
        total += nestedSize;
      }
    }
  }

  return total;
}

export const FilePicker = React.forwardRef<HTMLInputElement, FilePickerProps>(function FilePicker(
  {
    label,
    description,
    error,
    dropzoneLabel = "Drop files here or click to browse",
    maxFiles,
    directory = false,
    mode = "path",
    resolvePath,
    externalPicker,
    id,
    className,
    accept,
    disabled,
    multiple,
    onFilesChange,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = React.useId();
  const errorId = React.useId();
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<FileSelection[]>([]);
  const [restrictedCount, setRestrictedCount] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const selectionRequestIdRef = React.useRef(0);
  const canUseDirectoryHandlePicker =
    typeof window !== "undefined" &&
    typeof (window as DirectoryPickerWindow).showDirectoryPicker === "function";
  const isFolderPathOnlyMode = directory && mode === "path";
  const useDirectoryInputAttributes = directory && (!isFolderPathOnlyMode || !canUseDirectoryHandlePicker);

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  const hintIds = [description ? descriptionId : null, error ? errorId : null].filter(Boolean);
  const resolvedAriaDescribedBy = hintIds.length ? hintIds.join(" ") : undefined;
  const resolvedMultiple = multiple || useDirectoryInputAttributes;
  const resolvedMaxFiles = React.useMemo(() => {
    if (typeof maxFiles !== "number" || !Number.isFinite(maxFiles)) return undefined;
    return Math.max(1, Math.floor(maxFiles));
  }, [maxFiles]);
  const directoryAttributes = useDirectoryInputAttributes
    ? ({ directory: "", webkitdirectory: "" } as Record<string, string>)
    : undefined;

  const selectDirectoryPath = React.useCallback(async () => {
    if (!isFolderPathOnlyMode || !canUseDirectoryHandlePicker) {
      return false;
    }

    const picker = (window as DirectoryPickerWindow).showDirectoryPicker;
    if (!picker) {
      return false;
    }

    try {
      const directoryHandle = await picker();
      const requestId = selectionRequestIdRef.current + 1;
      selectionRequestIdRef.current = requestId;
      const selection: FileSelection = {
        file: new File([], directoryHandle.name, { type: "application/x-directory" }),
        path: directoryHandle.name,
      };
      const directorySize = await readDirectorySize(directoryHandle);
      if (typeof directorySize === "number") {
        selection.size = directorySize;
      }
      const selectionLimit = multiple ? (resolvedMaxFiles ?? Infinity) : 1;
      const mergedSelections = multiple ? [...selectedFiles, selection] : [selection];
      const nextSelections = mergedSelections.slice(0, selectionLimit);
      const nextRestrictedCount = mergedSelections.length - nextSelections.length;

      setSelectedFiles(nextSelections);
      setRestrictedCount(nextRestrictedCount);
      onFilesChange?.(nextSelections);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return true;
      }
      return false;
    }
  }, [
    canUseDirectoryHandlePicker,
    isFolderPathOnlyMode,
    multiple,
    onFilesChange,
    resolvedMaxFiles,
    selectedFiles,
  ]);

  const applyExternalSelections = React.useCallback(
    (incomingSelections: FileSelection[]) => {
      const selectionLimit = resolvedMultiple ? (resolvedMaxFiles ?? Infinity) : 1;
      const nextSelections = incomingSelections.slice(0, selectionLimit);
      const nextRestrictedCount = incomingSelections.length - nextSelections.length;

      setSelectedFiles(nextSelections);
      setRestrictedCount(nextRestrictedCount);
      onFilesChange?.(nextSelections);
    },
    [onFilesChange, resolvedMaxFiles, resolvedMultiple]
  );

  const applySelectedFiles = React.useCallback(
    async (files: File[]) => {
      const acceptedFiles = filterFilesByAccept(files, accept);
      const selectionLimit = resolvedMultiple ? (resolvedMaxFiles ?? Infinity) : 1;
      const nextFiles = acceptedFiles.slice(0, selectionLimit);
      const nextRestrictedCount = files.length - nextFiles.length;
      const requestId = selectionRequestIdRef.current + 1;
      selectionRequestIdRef.current = requestId;

      const nextSelections = await Promise.all(
        nextFiles.map(async (file) => {
          const selection: FileSelection = { file };
          selection.path = await derivePath(file, resolvePath);

          if (mode === "content" || mode === "both") {
            const bytes = await readFileBytes(file);
            if (bytes) {
              selection.bytes = bytes;
              selection.text = decodeUtf8IfPossible(bytes);
            }
          }

          return selection;
        })
      );

      if (selectionRequestIdRef.current !== requestId) {
        return [];
      }

      setSelectedFiles(nextSelections);
      setRestrictedCount(nextRestrictedCount);
      onFilesChange?.(nextSelections);

      return nextSelections;
    },
    [accept, mode, onFilesChange, resolvePath, resolvedMaxFiles, resolvedMultiple]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    void applySelectedFiles(incomingFiles);
    onChange?.(event);
  };

  const openFileDialog = async () => {
    if (disabled) return;

    if (externalPicker) {
      try {
        const nextSelections = await externalPicker({
          directory,
          multiple: resolvedMultiple,
          mode,
          accept,
          maxFiles: resolvedMaxFiles,
          currentSelections: selectedFiles,
        });
        if (Array.isArray(nextSelections)) {
          applyExternalSelections(nextSelections);
        }
      } catch {
        // Ignore external picker failures to keep component non-throwing.
      }
      return;
    }

    const handledByDirectoryPicker = await selectDirectoryPath();
    if (handledByDirectoryPicker) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;

    if (isFolderPathOnlyMode && canUseDirectoryHandlePicker) {
      return;
    }

    setIsDragActive(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    void applySelectedFiles(files);
  };

  const hasSelection = selectedFiles.length > 0;
  const allowSelectionRemoval = Boolean(multiple);
  const removeSelection = React.useCallback(
    (indexToRemove: number) => {
      const nextSelections = selectedFiles.filter((_, index) => index !== indexToRemove);
      setSelectedFiles(nextSelections);
      setRestrictedCount(0);
      onFilesChange?.(nextSelections);
    },
    [onFilesChange, selectedFiles]
  );

  return (
    <div className="rui-file-picker rui-root">
      {label ? (
        <label htmlFor={inputId} className="rui-file-picker__label rui-text-wrap">
          {label}
        </label>
      ) : null}

      <div
        className={clsx(
          "rui-file-picker__dropzone",
          isDragActive && "rui-file-picker__dropzone--active",
          disabled && "rui-file-picker__dropzone--disabled",
          error && "rui-file-picker__dropzone--error"
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label ? `${label} file picker` : "File picker"}
        aria-disabled={disabled ? true : undefined}
        onClick={() => {
          void openFileDialog();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            void openFileDialog();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          setIsDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <input
          {...rest}
          {...directoryAttributes}
          id={inputId}
          ref={setRefs}
          type="file"
          className={clsx("rui-file-picker__input", className)}
          accept={accept}
          disabled={disabled}
          multiple={resolvedMultiple}
          onClick={(event) => {
            event.stopPropagation();
            if (isFolderPathOnlyMode && canUseDirectoryHandlePicker) {
              event.preventDefault();
              void openFileDialog();
            }
          }}
          onChange={handleInputChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={resolvedAriaDescribedBy}
        />
        <p className="rui-file-picker__prompt rui-text-wrap">{dropzoneLabel}</p>
        <p className="rui-file-picker__hint rui-text-wrap">
          {accept?.trim()
            ? `Accepted: ${accept}`
            : "Accepted: all file types"}
        </p>
        {resolvedMaxFiles ? (
          <p className="rui-file-picker__hint rui-text-wrap">
            Maximum files: {resolvedMaxFiles}
          </p>
        ) : null}
        {hasSelection ? (
          <ul className="rui-file-picker__list" aria-label="Selected files">
            {selectedFiles.map((selection, index) => (
              <li
                key={`${selection.file.name}-${selection.file.size}-${selection.file.lastModified}`}
                className="rui-file-picker__item"
              >
                <span className="rui-file-picker__file-name rui-text-wrap">
                  <span title={selection.path ?? selection.file.name}>
                    {selection.path ?? selection.file.name}
                  </span>
                </span>
                <div className="rui-file-picker__item-actions">
                  <span className="rui-file-picker__file-meta">
                    {formatBytes(selection.size ?? selection.file.size)}
                  </span>
                  {allowSelectionRemoval ? (
                    <button
                      type="button"
                      className="rui-file-picker__remove"
                      aria-label={`Remove ${selection.path ?? selection.file.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeSelection(index);
                      }}
                    >
                      x
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {description ? (
        <p id={descriptionId} className="rui-file-picker__description rui-text-wrap">
          {description}
        </p>
      ) : null}
      {restrictedCount > 0 ? (
        <p className="rui-file-picker__warning rui-text-wrap">
          {restrictedCount} file{restrictedCount === 1 ? "" : "s"}{" "}
          {restrictedCount === 1 ? "was" : "were"} ignored due to selection restrictions.
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="rui-file-picker__error rui-text-wrap">
          {error}
        </p>
      ) : null}
    </div>
  );
});
