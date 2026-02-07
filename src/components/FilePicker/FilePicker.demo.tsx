import { useState } from "react";
import { FilePicker, NumberInput } from "react-ui-suite";
import type { FilePickerProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import { DemoExample } from "../../../demo/src/components/DemoExample";
import "./FilePicker.demo.css";

function ImageOnlyExample() {
  const [count, setCount] = useState(0);

  return (
    <DemoExample title="Images only" className="file-picker-demo__card">
      <div className="file-picker-demo__stack">
        <FilePicker
          label="Upload gallery images"
          description="PNG, JPG, and SVG files only."
          accept="image/*,.svg"
          multiple
          onFilesChange={(files) => setCount(files.length)}
        />
        <p className="file-picker-demo__meta rui-text-wrap">{count} image file(s) selected</p>
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
          onFilesChange={(files) => setNames(files.map((file) => file.name))}
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
