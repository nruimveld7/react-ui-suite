import { useMemo, useState } from "react";
import { NumberInput } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";

function BudgetPlanner() {
  const [budget, setBudget] = useState(4500);
  const [headcount, setHeadcount] = useState(8);
  const burnRate = useMemo(
    () => (headcount ? Math.round(budget / headcount) : 0),
    [budget, headcount]
  );

  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm md:grid-cols-[1.1fr_0.9fr] dark:border-slate-800 dark:bg-slate-900/70">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Budget planner
        </p>
        <NumberInput
          label="Monthly budget"
          description="Covers vendors, automation, and credits."
          value={budget}
          onChange={setBudget}
          step={250}
          suffix="USD"
        />
        <NumberInput
          label="Active seats"
          value={headcount}
          onChange={setHeadcount}
          step={1}
          suffix="Seats"
        />
      </div>
      <div className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Forecast
        </p>
        <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{burnRate} USD</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Per seat burn rate.</p>
      </div>
    </div>
  );
}

function CompactNumberExamples() {
  const [tickets, setTickets] = useState(12);
  const [hours, setHours] = useState(32);
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900/70">
      <NumberInput
        label="Tickets per sprint"
        value={tickets}
        onChange={setTickets}
        min={0}
        step={1}
      />
      <NumberInput
        label="Hours allocated"
        value={hours}
        onChange={setHours}
        min={0}
        step={4}
        suffix="h"
      />
    </div>
  );
}

function NumberInputPreview() {
  return (
    <div className="grid gap-4">
      <BudgetPlanner />
      <CompactNumberExamples />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "number-input",
  name: "Number Input",
  description: "Stepper-based number input with Tailwind shell, suffix, and custom steps.",
  tags: ["input", "form", "number"],
  Preview: NumberInputPreview,
  sourcePath: "src/components/NumberInput/NumberInput.tsx",
};

export default entry;
export { NumberInput };
