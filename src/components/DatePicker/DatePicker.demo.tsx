import { useState } from "react";
import { DatePicker } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";

function Scheduling() {
  const [start, setStart] = useState("2025-12-05");
  const [deadline, setDeadline] = useState("2026-01-15");
  const [daily, setDaily] = useState("09:30");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Scheduling
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Custom date pickers with select-based time.
          </p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-white dark:text-slate-900">
          Native-free
        </span>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <DatePicker label="Start date" value={start} onChange={setStart} type="date" />
        <DatePicker label="Deadline" value={deadline} onChange={setDeadline} type="date" />
        <DatePicker label="Daily checkpoint" value={daily} onChange={setDaily} type="time" />
      </div>
      <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
        <p className="font-semibold text-slate-900 dark:text-slate-100">Summary</p>
        <p>
          Starts {start}, ends {deadline}. Standups at {daily}.
        </p>
      </div>
    </div>
  );
}

function DatePickerPreview() {
  return (
    <div className="grid gap-4">
      <Scheduling />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "date-picker",
  name: "Date Picker",
  description: "Custom date/time picker popovers with month navigation and quick time slots.",
  tags: ["input", "form", "date"],
  Preview: DatePickerPreview,
  sourcePath: "src/components/DatePicker/DatePicker.tsx",
};

export default entry;
export { DatePicker };
