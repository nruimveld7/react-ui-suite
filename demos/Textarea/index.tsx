import { useState } from "react";
import { Textarea } from "react-ui-suite";
import type { TextareaProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

function ReleaseNotes() {
  const [notes, setNotes] = useState(
    "- Auto-save drafts and restore history\n- Faster search with typo tolerance\n- Added dark mode for dashboards"
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Release notes
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Ship a concise weekly update.</p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-white dark:text-slate-900">
          Public
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={300}
          label="Summary"
          description="Use short, scannable bullet points."
        />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400">
          Preview:
          <div className="mt-1 whitespace-pre-wrap text-slate-900 dark:text-slate-100">{notes}</div>
        </div>
      </div>
    </div>
  );
}

function SupportPrompt() {
  const [message, setMessage] = useState("");
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-start">
        <div className="min-w-[260px] flex-1 md:min-w-[320px]">
          <Textarea
            label="Ask for help"
            placeholder="Tell us what happened..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            resizeDirection="both"
            showCount={false}
          />
        </div>
        <div className="min-w-[220px] flex-1 md:flex-[0_1_260px] md:shrink-0">
          <div className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Tips
            </p>
            <ul className="space-y-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <li>Include a link to the page you were on.</li>
              <li>Mention steps to reproduce and expected behavior.</li>
              <li>Attach screenshots or a short Loom if possible.</li>
            </ul>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextareaPreview() {
  return (
    <div className="grid gap-4">
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
  sourcePath: "src/components/Textarea/Textarea.tsx"
};

export default entry;
export { Textarea };
export type { TextareaProps };
