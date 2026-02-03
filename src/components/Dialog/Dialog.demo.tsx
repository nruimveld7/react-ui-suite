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
        className="dialog-demo-card"
      >
        <div className="dialog-demo-card__body">
          <p className="dialog-demo-card__text">
            Open a modal to confirm reminders and recipients.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="dialog-demo-card__launch">
          Launch digest modal
        </Button>
      </DemoExample>

      <DemoExample
        title="Site assistant"
        className="dialog-demo-card"
      >
        <div className="dialog-demo-card__body">
          <p className="dialog-demo-card__text">
            Open a floating helper that stays while you work.
          </p>
        </div>
        <Button onClick={() => setInlineOpen(true)} className="dialog-demo-card__launch">
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
              className="dialog-demo-footer-button dialog-demo-footer-button--cancel"
            >
              CANCEL
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="rui-dialog-demo__confirm dialog-demo-footer-button dialog-demo-footer-button--confirm"
            >
              CONFIRM
            </Button>
          </>
        }
      >
        <Checkbox label="Also send a reminder on Fridays." checked={remind} onChange={setRemind} />
        <p className="dialog-demo-tip">
          Tip: click outside the card or press Esc to close.
        </p>
      </Dialog>

      <Dialog
        open={inlineOpen}
        onClose={() => setInlineOpen(false)}
        title="Persistent helper"
        description="Stays open while you work; click outside or Esc to close."
        footer={
          <Button onClick={() => setInlineOpen(false)} className="dialog-demo-inline-dismiss">
            Dismiss
          </Button>
        }
        modal={false}
        draggable={false}
      >
        <p className="dialog-demo-inline-description">
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
