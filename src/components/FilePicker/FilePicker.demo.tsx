import { useState } from "react";
import { FilePicker, NumberInput, Toggle } from "react-ui-suite";
import type { FilePickerProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import { DemoExample } from "../../../demo/src/components/DemoExample";
import "./FilePicker.demo.css";

function ImageOnlyExample() {
  const [count, setCount] = useState(0);
  const [useContentMode, setUseContentMode] = useState(false);
  const selectedMode: FilePickerProps["mode"] = useContentMode ? "content" : "path";

  return (
    <DemoExample title="Images only" className="file-picker-demo__card">
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
          label="Upload gallery images"
          description="PNG, JPG, and SVG files only."
          accept="image/*,.svg"
          mode={selectedMode}
          multiple
          onFilesChange={(files) => setCount(files.length)}
        />
        <p className="file-picker-demo__meta rui-text-wrap">
          Mode: {useContentMode ? "File contents" : "Filepath"} | {count} image file(s) selected
        </p>
      </div>
    </DemoExample>
  );
}

function AnyFileExample() {
  const [names, setNames] = useState<string[]>([]);
  const [fileLimit, setFileLimit] = useState(3);

  return (
    <DemoExample title="All file types" className="file-picker-demo__card">
      <div className="file-picker-demo__stack">
        <div className="file-picker-demo__limit">
          <NumberInput
            label="Max files"
            min={1}
            max={5}
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

function FilePickerPreview() {
  return (
    <div className="file-picker-demo">
      <ImageOnlyExample />
      <AnyFileExample />
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
