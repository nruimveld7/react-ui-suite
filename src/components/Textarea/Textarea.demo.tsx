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
      className="rui-textarea-demo__u-border-radius-1-5rem--ea189a088a rui-textarea-demo__u-border-width-1px--ca6bcd4b6f rui-textarea-demo__u-rui-border-opacity-1--52f4da2ca5 rui-textarea-demo__u-background-color-rgb-255-255-255--6c21de570d rui-textarea-demo__u-padding-1rem--8e63407b5c rui-textarea-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-textarea-demo__u-rui-border-opacity-1--2072c87505 rui-textarea-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-textarea-demo__u-display-flex--60fbb77139 rui-textarea-demo__u-align-items-center--3960ffc248 rui-textarea-demo__u-justify-content-space-between--8ef2268efb">
        <div>
          <p className="rui-textarea-demo__u-font-size-0-875rem--fc7473ca09 rui-textarea-demo__u-rui-text-opacity-1--2d6fbf48fa rui-textarea-demo__u-rui-text-opacity-1--cc0274aad9">
            Ship a concise weekly update.
          </p>
        </div>
        <span className="rui-textarea-demo__u-border-radius-9999px--ac204c1088 rui-textarea-demo__u-rui-bg-opacity-1--15821c2ff2 rui-textarea-demo__u-padding-left-0-75rem--0e17f2bd90 rui-textarea-demo__u-padding-top-0-25rem--660d2effb8 rui-textarea-demo__u-font-size-11px--d058ca6de6 rui-textarea-demo__u-font-weight-600--e83a7042bc rui-textarea-demo__u-text-transform-uppercase--117ec720ea rui-textarea-demo__u-letter-spacing-0-025em--8baf13a3e9 rui-textarea-demo__u-rui-text-opacity-1--72a4c7cdee rui-textarea-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-textarea-demo__u-rui-bg-opacity-1--e598448d8a rui-textarea-demo__u-rui-text-opacity-1--ea4519095b">
          Public
        </span>
      </div>

      <div className="rui-textarea-demo__u-margin-top-0-75rem--eccd13ef4f rui-textarea-demo__u-style--6f7e013d64">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={300}
          label="Summary"
          description="Use short, scannable bullet points."
        />
        <div className="rui-textarea-demo__u-border-radius-1rem--68f2db624d rui-textarea-demo__u-border-width-1px--ca6bcd4b6f rui-textarea-demo__u-border-style-dashed--a29b7a649c rui-textarea-demo__u-rui-border-opacity-1--52f4da2ca5 rui-textarea-demo__u-rui-bg-opacity-1--f97e9d36d1 rui-textarea-demo__u-padding-left-0-75rem--0e17f2bd90 rui-textarea-demo__u-padding-top-0-5rem--03b4dd7f17 rui-textarea-demo__u-font-size-0-75rem--359090c2d5 rui-textarea-demo__u-rui-text-opacity-1--30426eb75c rui-textarea-demo__u-rui-border-opacity-1--30fb741464 rui-textarea-demo__u-background-color-rgb-2-6-23-0-6--ddf84eea43 rui-textarea-demo__u-rui-text-opacity-1--cc0274aad9">
          Preview:
          <div className="rui-textarea-demo__u-margin-top-0-25rem--b6b02c0ebe rui-textarea-demo__u-white-space-pre-wrap--a2edcb1a3a rui-textarea-demo__u-rui-text-opacity-1--f5f136c41d rui-textarea-demo__u-rui-text-opacity-1--e1d41ccd69">{notes}</div>
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
      className="rui-textarea-demo__u-border-radius-1-5rem--ea189a088a rui-textarea-demo__u-border-width-1px--ca6bcd4b6f rui-textarea-demo__u-rui-border-opacity-1--52f4da2ca5 rui-textarea-demo__u-background-color-rgb-255-255-255--6c21de570d rui-textarea-demo__u-padding-1rem--8e63407b5c rui-textarea-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-textarea-demo__u-rui-border-opacity-1--2072c87505 rui-textarea-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-textarea-demo__u-display-flex--60fbb77139 rui-textarea-demo__u-flex-direction-column--8dddea0773 rui-textarea-demo__u-gap-0-75rem--1004c0c395 rui-textarea-demo__u-flex-direction-row--4102dddfda rui-textarea-demo__u-flex-wrap-wrap--5cf89ec283 rui-textarea-demo__u-align-items-flex-start--41f460eda7">
        <div className="rui-textarea-demo__u-min-width-260px--9383c6919b rui-textarea-demo__u-flex-1-1-0--36e579c0b4 rui-textarea-demo__u-min-width-320px--8ca6498a63">
          <Textarea
            label="Ask for help"
            placeholder="Tell us what happened..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            resizeDirection="both"
            showCount={false}
          />
        </div>
        <div className="rui-textarea-demo__u-min-width-220px--cbc2088787 rui-textarea-demo__u-flex-1-1-0--36e579c0b4 rui-textarea-demo__u-flex-0-1-260px--9fc50dc66d rui-textarea-demo__u-flex-shrink-0--7513066a97">
          <div className="rui-textarea-demo__u-display-flex--60fbb77139 rui-textarea-demo__u-height-100--668b21aa54 rui-textarea-demo__u-flex-direction-column--8dddea0773 rui-textarea-demo__u-justify-content-space-between--8ef2268efb rui-textarea-demo__u-gap-0-75rem--1004c0c395 rui-textarea-demo__u-border-radius-1rem--68f2db624d rui-textarea-demo__u-border-width-1px--ca6bcd4b6f rui-textarea-demo__u-rui-border-opacity-1--52f4da2ca5 rui-textarea-demo__u-background-color-rgb-248-250-252--94a16de50c rui-textarea-demo__u-padding-0-75rem--eb6e8b881a rui-textarea-demo__u-font-size-0-875rem--fc7473ca09 rui-textarea-demo__u-rui-text-opacity-1--2d6fbf48fa rui-textarea-demo__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-textarea-demo__u-rui-border-opacity-1--2072c87505 rui-textarea-demo__u-background-color-rgb-2-6-23-0-6--ddf84eea43 rui-textarea-demo__u-rui-text-opacity-1--ca11017ff7">
            <p className="rui-textarea-demo__u-font-size-0-75rem--359090c2d5 rui-textarea-demo__u-font-weight-600--e83a7042bc rui-textarea-demo__u-text-transform-uppercase--117ec720ea rui-textarea-demo__u-letter-spacing-0-24em--a99336e23f rui-textarea-demo__u-rui-text-opacity-1--30426eb75c rui-textarea-demo__u-rui-text-opacity-1--cc0274aad9">
              Tips
            </p>
            <ul className="rui-textarea-demo__u-style--da7c36cd88 rui-textarea-demo__u-font-size-0-75rem--359090c2d5 rui-textarea-demo__u-line-height-1-625--6b189c6eda rui-textarea-demo__u-rui-text-opacity-1--30426eb75c rui-textarea-demo__u-rui-text-opacity-1--cc0274aad9">
              <li>Include a link to the page you were on.</li>
              <li>Mention steps to reproduce and expected behavior.</li>
              <li>Attach screenshots or a short Loom if possible.</li>
            </ul>
            <Button className="rui-textarea-demo__u-display-inline-flex--52083e7da4 rui-textarea-demo__u-align-items-center--3960ffc248 rui-textarea-demo__u-justify-content-center--86843cf1e2 rui-textarea-demo__u-border-radius-0-75rem--a217b4eaa9 rui-textarea-demo__u-border-width-1px--ca6bcd4b6f rui-textarea-demo__u-rui-border-opacity-1--85684b007e rui-textarea-demo__u-rui-bg-opacity-1--5e10cdb8f1 rui-textarea-demo__u-padding-left-0-75rem--0e17f2bd90 rui-textarea-demo__u-padding-top-0-5rem--03b4dd7f17 rui-textarea-demo__u-font-size-0-875rem--fc7473ca09 rui-textarea-demo__u-font-weight-600--e83a7042bc rui-textarea-demo__u-rui-text-opacity-1--bcbca7a5be rui-textarea-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-textarea-demo__u-transition-property-color-backgr--56bf8ae82a rui-textarea-demo__u-rui-translate-y-1px--2464a58ddc rui-textarea-demo__u-rui-shadow-0-4px-6px-1px-rgb-0-0--9e85ac05ca rui-textarea-demo__u-rui-border-opacity-1--30fb741464 rui-textarea-demo__u-rui-bg-opacity-1--f2a0c62312 rui-textarea-demo__u-rui-text-opacity-1--e1d41ccd69">
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
    <div className="rui-textarea-demo__u-display-grid--f3c543ad5f rui-textarea-demo__u-gap-1rem--0c3bc98565">
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
