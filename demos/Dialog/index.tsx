import { useState } from "react";
import { Button, Checkbox, Dialog } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

function ModalPlayground() {
  const [open, setOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(false);
  const [remind, setRemind] = useState(true);

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Schedule weekly digest
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Open a modal to confirm reminders and recipients.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full">
          Launch digest modal
        </Button>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Site Assistant
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Open a floating helper that stays while you work.
          </p>
        </div>
        <Button onClick={() => setInlineOpen(true)} className="w-full">
          Launch assistant
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Send weekly digest?"
        description="We email a summary every Monday at 8am. You can change this any time."
        footer={
          <>
            <Button
              onClick={() => setOpen(false)}
              className="min-w-[120px] uppercase tracking-wide"
            >
              CANCEL
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="min-w-[120px] bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-600 dark:bg-emerald-500 dark:text-slate-900"
            >
              CONFIRM
            </Button>
          </>
        }
      >
        <Checkbox label="Also send a reminder on Fridays." checked={remind} onChange={setRemind} />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tip: click outside the card or press Esc to close.
        </p>
      </Dialog>

      <Dialog
        open={inlineOpen}
        onClose={() => setInlineOpen(false)}
        title="Persistent helper"
        description="Stays open while you work; click outside or Esc to close."
        footer={
          <Button onClick={() => setInlineOpen(false)} className="px-3 py-2">
            Dismiss
          </Button>
        }
        modal={false}
        draggable={false}
      >
        <p className="text-sm text-slate-700 dark:text-slate-300">
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
