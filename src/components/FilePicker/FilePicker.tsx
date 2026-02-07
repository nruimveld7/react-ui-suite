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
};

export type FilePickerProps = NativeInputProps & {
  label?: string;
  description?: string;
  error?: string;
  dropzoneLabel?: string;
  maxFiles?: number;
  mode?: FilePickerMode;
  resolvePath?: (file: File) => string | undefined | Promise<string | undefined>;
  onFilesChange?: (files: FileSelection[]) => void;
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

export const FilePicker = React.forwardRef<HTMLInputElement, FilePickerProps>(function FilePicker(
  {
    label,
    description,
    error,
    dropzoneLabel = "Drop files here or click to browse",
    maxFiles,
    mode = "path",
    resolvePath,
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
  const resolvedMaxFiles = React.useMemo(() => {
    if (typeof maxFiles !== "number" || !Number.isFinite(maxFiles)) return undefined;
    return Math.max(1, Math.floor(maxFiles));
  }, [maxFiles]);

  const applySelectedFiles = React.useCallback(
    async (files: File[]) => {
      const acceptedFiles = filterFilesByAccept(files, accept);
      const selectionLimit = multiple ? (resolvedMaxFiles ?? Infinity) : 1;
      const nextFiles = acceptedFiles.slice(0, selectionLimit);
      const nextRestrictedCount = files.length - nextFiles.length;
      const requestId = selectionRequestIdRef.current + 1;
      selectionRequestIdRef.current = requestId;

      const nextSelections = await Promise.all(
        nextFiles.map(async (file) => {
          const selection: FileSelection = { file };

          if (mode === "path" || mode === "both") {
            selection.path = await derivePath(file, resolvePath);
          }

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
    [accept, mode, multiple, onFilesChange, resolvePath, resolvedMaxFiles]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    void applySelectedFiles(incomingFiles);
    onChange?.(event);
  };

  const openFileDialog = () => {
    if (disabled) return;
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragActive(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    void applySelectedFiles(files);
  };

  const hasSelection = selectedFiles.length > 0;

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
        onClick={openFileDialog}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileDialog();
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
          id={inputId}
          ref={setRefs}
          type="file"
          className={clsx("rui-file-picker__input", className)}
          accept={accept}
          disabled={disabled}
          multiple={multiple}
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
            {selectedFiles.map((selection) => (
              <li
                key={`${selection.file.name}-${selection.file.size}-${selection.file.lastModified}`}
                className="rui-file-picker__item"
              >
                <span className="rui-file-picker__file-name rui-text-wrap">
                  {selection.file.name}
                </span>
                <span className="rui-file-picker__file-meta">{formatBytes(selection.file.size)}</span>
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
