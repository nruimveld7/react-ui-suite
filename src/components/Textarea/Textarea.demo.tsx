import { useState } from "react";
import { Textarea } from "react-ui-suite";
import { Button } from "react-ui-suite";
import type { TextareaProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Textarea.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function ReleaseNotes() {
  const [notes, setNotes] = useState(
    "- Auto-save drafts and restore history\n- Faster search with typo tolerance\n- Added dark mode for dashboards"
  );

  return (
    <DemoExample
      title="Release notes"
      className="rui-textarea-demo__card"
    >
      <div className="rui-textarea-demo__stack">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={300}
          label="Summary"
          description="Use short, scannable bullet points."
        />
        <div className="rui-textarea-demo__preview">
          Preview:
          <div className="rui-textarea-demo__preview-text">{notes}</div>
        </div>
      </div>
    </DemoExample>
  );
}

function SupportPrompt() {
  const [message, setMessage] = useState("");
  return (
    <DemoExample
      title="Support prompt"
      className="rui-textarea-demo__card"
    >
      <div className="rui-textarea-demo__support">
        <div className="rui-textarea-demo__support-field">
          <Textarea
            label="Ask for help"
            placeholder="Tell us what happened..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            resizeDirection="both"
            showCount={false}
          />
        </div>
        <div className="rui-textarea-demo__support-tips">
          <div className="rui-textarea-demo__tips-card">
            <p className="rui-textarea-demo__tips-title">
              Tips
            </p>
            <ul className="rui-textarea-demo__tips-list">
              <li>Include a link to the page you were on.</li>
              <li>Mention steps to reproduce and expected behavior.</li>
              <li>Attach screenshots or a short Loom if possible.</li>
            </ul>
            <Button className="rui-textarea-demo__tips-submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </DemoExample>
  );
}

function TextareaPreview() {
  return (
    <div className="rui-textarea-demo">
      <ReleaseNotes />
      <SupportPrompt />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "textarea",
  name: "Textarea",
  description: "Multiline input with helper text, error states, and optional character counter.",
  tags: ["input", "form"],
  Preview: TextareaPreview,
  sourcePath: "src/components/Textarea/Textarea.tsx",
};

export default entry;
export { Textarea };
export type { TextareaProps };
