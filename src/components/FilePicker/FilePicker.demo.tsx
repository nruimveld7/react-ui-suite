import { useState } from "react";
import { FilePicker, NumberInput, Toggle } from "react-ui-suite";
import type { FilePickerProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import { DemoExample } from "../../../demo/src/components/DemoExample";
import "./FilePicker.demo.css";

function FileModeExample() {
  const [count, setCount] = useState(0);
  const [useContentMode, setUseContentMode] = useState(false);
  const selectedMode: FilePickerProps["mode"] = useContentMode ? "content" : "path";

  return (
    <DemoExample title="Files: Path vs Contents" className="file-picker-demo__card">
      <div className="file-picker-demo__stack">
        <div className="file-picker-demo__mode">
          <p className="file-picker-demo__toggle-label">Selection mode</p>
          <div className="file-picker-demo__toggle-row">
            <span className="file-picker-demo__toggle-side rui-text-wrap">File path</span>
            <Toggle
              checked={useContentMode}
              onChange={setUseContentMode}
              aria-label="Toggle between filepath and file contents mode"
            />
            <span className="file-picker-demo__toggle-side rui-text-wrap">File contents</span>
          </div>
        </div>
        <FilePicker
          label="Select files"
          description="Any file type."
          mode={selectedMode}
          onFilesChange={(files) => setCount(files.length)}
        />
        <p className="file-picker-demo__meta rui-text-wrap">
          Mode: {useContentMode ? "File contents" : "File path"} | {count} file(s) selected
        </p>
      </div>
    </DemoExample>
  );
}

function FileLimitExample() {
  const [names, setNames] = useState<string[]>([]);
  const [fileLimit, setFileLimit] = useState(3);

  return (
    <DemoExample title="Files: Max Count" className="file-picker-demo__card">
      <div className="file-picker-demo__stack">
        <div className="file-picker-demo__limit">
          <NumberInput
            label="Max files"
            min={1}
            max={10}
            value={fileLimit}
            onChange={(value) => setFileLimit(value)}
            scale={0.75}
          />
        </div>
        <FilePicker
          label="Attach files"
          description="No file-type restrictions."
          multiple
          maxFiles={fileLimit}
          onFilesChange={(files) => setNames(files.map((selection) => selection.file.name))}
        />
        <p className="file-picker-demo__meta rui-text-wrap">
          {names.length ? names.join(", ") : "No files selected yet"}
        </p>
      </div>
    </DemoExample>
  );
}

function FolderModeExample() {
  const [useContentMode, setUseContentMode] = useState(false);
  const selectedMode: FilePickerProps["mode"] = useContentMode ? "content" : "path";
  const [paths, setPaths] = useState<string[]>([]);
  const [fileCount, setFileCount] = useState(0);

  return (
    <DemoExample title="Folders: Path vs Contents" className="file-picker-demo__card">
      <div className="file-picker-demo__stack">
        <div className="file-picker-demo__mode">
          <p className="file-picker-demo__toggle-label">Folder mode</p>
          <div className="file-picker-demo__toggle-row">
            <span className="file-picker-demo__toggle-side rui-text-wrap">Folder path</span>
            <Toggle
              checked={useContentMode}
              onChange={setUseContentMode}
              aria-label="Toggle between folder path and folder contents mode"
            />
            <span className="file-picker-demo__toggle-side rui-text-wrap">Folder contents</span>
          </div>
        </div>
        <FilePicker
          label="Select folders"
          description="Select a directory and switch between relative paths and file contents."
          directory
          mode={selectedMode}
          onFilesChange={(files) => {
            setFileCount(files.length);
            setPaths(files.map((selection) => selection.path ?? selection.file.name));
          }}
        />
        <p className="file-picker-demo__meta rui-text-wrap">
          Mode: {useContentMode ? "Folder contents" : "Folder path"} |{" "}
          {fileCount ? `${fileCount} file(s) collected from folder` : "No folder selected yet"}
        </p>
        {paths.length && !useContentMode ? (
          <p className="file-picker-demo__meta rui-text-wrap">
            {paths.slice(0, 3).join(", ")}
            {paths.length > 3 ? ", ..." : ""}
          </p>
        ) : null}
      </div>
    </DemoExample>
  );
}

function FolderLimitExample() {
  const [folderLimit, setFolderLimit] = useState(3);
  const [paths, setPaths] = useState<string[]>([]);

  return (
    <DemoExample title="Folders: Max Count" className="file-picker-demo__card">
      <div className="file-picker-demo__stack">
        <div className="file-picker-demo__limit">
          <NumberInput
            label="Max folders"
            min={1}
            max={10}
            value={folderLimit}
            onChange={(value) => setFolderLimit(value)}
            scale={0.75}
          />
        </div>
        <FilePicker
          label="Select folders"
          description="Path mode with removable folder selections."
          directory
          multiple
          mode="path"
          maxFiles={folderLimit}
          onFilesChange={(files) => setPaths(files.map((selection) => selection.path ?? selection.file.name))}
        />
        <p className="file-picker-demo__meta rui-text-wrap">
          {paths.length ? paths.join(", ") : "No folders selected yet"}
        </p>
      </div>
    </DemoExample>
  );
}

function FilePickerPreview() {
  return (
    <div className="file-picker-demo">
      <FileModeExample />
      <FileLimitExample />
      <FolderModeExample />
      <FolderLimitExample />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "file-picker",
  name: "File Picker",
  description: "Dropzone-style file input with click-to-browse support and type filtering.",
  tags: ["input", "form", "upload"],
  Preview: FilePickerPreview,
  sourcePath: "src/components/FilePicker/FilePicker.tsx",
};

export default entry;
export { FilePicker };
export type { FilePickerProps };
