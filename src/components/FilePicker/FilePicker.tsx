import * as React from "react";
import clsx from "clsx";
import "./FilePicker.css";

type NativeInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export type FilePickerProps = NativeInputProps & {
  label?: string;
  description?: string;
  error?: string;
  dropzoneLabel?: string;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
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

export const FilePicker = React.forwardRef<HTMLInputElement, FilePickerProps>(function FilePicker(
  {
    label,
    description,
    error,
    dropzoneLabel = "Drop files here or click to browse",
    maxFiles,
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
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [restrictedCount, setRestrictedCount] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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
    (files: File[]) => {
      const acceptedFiles = filterFilesByAccept(files, accept);
      const selectionLimit = multiple ? (resolvedMaxFiles ?? Infinity) : 1;
      const nextFiles = acceptedFiles.slice(0, selectionLimit);
      const nextRestrictedCount = files.length - nextFiles.length;

      setSelectedFiles(nextFiles);
      setRestrictedCount(nextRestrictedCount);
      onFilesChange?.(nextFiles);

      return nextFiles;
    },
    [accept, multiple, onFilesChange, resolvedMaxFiles]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    applySelectedFiles(incomingFiles);
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
    applySelectedFiles(files);
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
            {selectedFiles.map((file) => (
              <li key={`${file.name}-${file.size}-${file.lastModified}`} className="rui-file-picker__item">
                <span className="rui-file-picker__file-name rui-text-wrap">{file.name}</span>
                <span className="rui-file-picker__file-meta">{formatBytes(file.size)}</span>
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
