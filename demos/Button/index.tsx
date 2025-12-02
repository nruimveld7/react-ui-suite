import { useState } from "react";
import { Button } from "react-ui-suite";
import type { ButtonProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

function ButtonShowcase() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setCount((value) => value + 1)}>Primary</Button>
      <Button className="bg-sky-500 text-white hover:bg-sky-400 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
        Accent
      </Button>
      <Button className="border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800">
        Ghost
      </Button>
      <Button disabled className="opacity-70">
        Disabled
      </Button>
      <span className="text-sm text-slate-400">Clicks: {count}</span>
    </div>
  );
}

function ButtonUsageExamples() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Forms
        </p>
        <Button type="submit" className="bg-emerald-500 text-white hover:bg-emerald-400">
          Save changes
        </Button>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Use the type prop to hook into forms.
        </p>
      </div>
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Destructive
        </p>
        <Button className="bg-rose-500 text-white hover:bg-rose-400 focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
          Delete
        </Button>
        <p className="text-xs text-slate-500 dark:text-slate-400">Override Tailwind styles while keeping layout.</p>
      </div>
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Icons
        </p>
        <Button className="flex items-center gap-2">
          <span role="img" aria-hidden="true">
            ✨
          </span>
          Magic
        </Button>
        <p className="text-xs text-slate-500 dark:text-slate-400">Buttons accept arbitrary children including icons.</p>
      </div>
    </div>
  );
}

function ButtonPreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <ButtonShowcase />
      </div>
      <ButtonUsageExamples />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "button",
  name: "Button",
  description:
    "Simple Tailwind button with sensible padding, rounded corners, and easy overrides via className.",
  tags: ["input", "action"],
  Preview: ButtonPreview,
  sourcePath: "src/components/Button/Button.tsx"
};

export default entry;
export { Button };
export type { ButtonProps };
