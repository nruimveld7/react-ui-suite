import { useState } from "react";
import { Button, Checkbox, Dialog } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Dialog.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function ModalPlayground() {
  const [open, setOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(false);
  const [remind, setRemind] = useState(true);

  return (
    <div className="dialog-demo-stack">
      <style>{`
        .rui-dialog-demo__confirm.rui-button {
          border-color: rgb(5 150 105 / 1);
        }
        .rui-dialog-demo__confirm.rui-button:not(:disabled):hover {
          background-color: rgb(16 185 129 / 1);
          border-color: rgb(16 185 129 / 1);
          box-shadow: var(--rui-shadow-button);
        }
      `}</style>
      <DemoExample
        title="Schedule weekly digest"
        className="rui-dialog-demo__u-style--3e7ce58d64 rui-dialog-demo__u-border-radius-1-5rem--ea189a088a rui-dialog-demo__u-border-width-1px--ca6bcd4b6f rui-dialog-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-dialog-demo__u-background-color-rgb-255-255-255--6c21de570d rui-dialog-demo__u-padding-1-25rem--c07e54fd14 rui-dialog-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-dialog-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-dialog-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      >
        <div className="rui-dialog-demo__u-style--da7c36cd88">
          <p className="rui-dialog-demo__u-font-size-0-875rem--fc7473ca09 rui-dialog-demo__u-color-rgb-71-85-105-1--2d6fbf48fa rui-dialog-demo__u-color-rgb-148-163-184-1--cc0274aad9">
            Open a modal to confirm reminders and recipients.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="rui-dialog-demo__u-width-100--6da6a3c3f7">
          Launch digest modal
        </Button>
      </DemoExample>

      <DemoExample
        title="Site assistant"
        className="rui-dialog-demo__u-style--3e7ce58d64 rui-dialog-demo__u-border-radius-1-5rem--ea189a088a rui-dialog-demo__u-border-width-1px--ca6bcd4b6f rui-dialog-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-dialog-demo__u-background-color-rgb-255-255-255--6c21de570d rui-dialog-demo__u-padding-1-25rem--c07e54fd14 rui-dialog-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-dialog-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-dialog-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      >
        <div className="rui-dialog-demo__u-style--da7c36cd88">
          <p className="rui-dialog-demo__u-font-size-0-875rem--fc7473ca09 rui-dialog-demo__u-color-rgb-71-85-105-1--2d6fbf48fa rui-dialog-demo__u-color-rgb-148-163-184-1--cc0274aad9">
            Open a floating helper that stays while you work.
          </p>
        </div>
        <Button onClick={() => setInlineOpen(true)} className="rui-dialog-demo__u-width-100--6da6a3c3f7">
          Launch assistant
        </Button>
      </DemoExample>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Send weekly digest?"
        description="We email a summary every Monday at 8am. You can change this any time."
        footer={
          <>
            <Button
              onClick={() => setOpen(false)}
              className="rui-dialog-demo__u-min-width-120px--a9ef791a07 rui-dialog-demo__u-text-transform-uppercase--117ec720ea rui-dialog-demo__u-letter-spacing-0-025em--8baf13a3e9"
            >
              CANCEL
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="rui-dialog-demo__confirm rui-dialog-demo__u-min-width-120px--a9ef791a07 rui-dialog-demo__u-background-color-rgb-5-150-105-1--0e4e3f4b0e rui-dialog-demo__u-color-rgb-255-255-255-1--72a4c7cdee rui-dialog-demo__u-background-color-rgb-16-185-129---5fc9088aa4 rui-dialog-demo__u-color-rgb-15-23-42-1--ea4519095b"
            >
              CONFIRM
            </Button>
          </>
        }
      >
        <Checkbox label="Also send a reminder on Fridays." checked={remind} onChange={setRemind} />
        <p className="rui-dialog-demo__u-font-size-0-75rem--359090c2d5 rui-dialog-demo__u-color-rgb-100-116-139-1--30426eb75c rui-dialog-demo__u-color-rgb-148-163-184-1--cc0274aad9">
          Tip: click outside the card or press Esc to close.
        </p>
      </Dialog>

      <Dialog
        open={inlineOpen}
        onClose={() => setInlineOpen(false)}
        title="Persistent helper"
        description="Stays open while you work; click outside or Esc to close."
        footer={
          <Button onClick={() => setInlineOpen(false)} className="rui-dialog-demo__u-padding-left-0-75rem--0e17f2bd90 rui-dialog-demo__u-padding-top-0-5rem--03b4dd7f17">
            Dismiss
          </Button>
        }
        modal={false}
        draggable={false}
      >
        <p className="rui-dialog-demo__u-font-size-0-875rem--fc7473ca09 rui-dialog-demo__u-color-rgb-51-65-85-1--bcbca7a5be rui-dialog-demo__u-color-rgb-203-213-225-1--ca11017ff7">
          This non-modal dialog allows interacting with the rest of the page. Click outside or press
          Esc to close.
        </p>
      </Dialog>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "dialog",
  name: "Dialog",
  description:
    "Accessible overlay dialog with focus handling, ESC/backdrop close, and footer actions.",
  tags: ["overlay", "modal"],
  Preview: ModalPlayground,
  sourcePath: "src/components/Dialog/Dialog.tsx",
};

export default entry;
export { Dialog };
