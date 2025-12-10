import { useMemo } from "react";
import { Badge } from "react-ui-suite";
import type { BadgeProps, BadgeVariant } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";

const statusCopy: Record<BadgeVariant, { label: string; description: string }> = {
  neutral: { label: "Draft", description: "Neutral defaults for unqualified states." },
  info: { label: "Scheduled", description: "Used for upcoming or informational items." },
  success: { label: "Active", description: "Signals success or availability." },
  warning: { label: "Pending", description: "Warns when something needs attention." },
  danger: { label: "Failed", description: "Marks destructive or blocked states." },
};

function BadgeLegend() {
  const entries = useMemo(() => Object.entries(statusCopy), []);

  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      {entries.map(([variant, meta]) => (
        <div key={variant} className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{meta.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{meta.description}</p>
          </div>
          <Badge variant={variant as BadgeVariant}>{meta.label}</Badge>
        </div>
      ))}
    </div>
  );
}

function BadgeUsageShowcase() {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick patterns</p>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-white/90 dark:text-slate-900">
          Inline
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <Badge variant="info" icon="🔔">
          Reminder
        </Badge>
        <Badge variant="success">Published</Badge>
        <Badge variant="neutral" className="text-[0.65rem] tracking-normal">
          24 new
        </Badge>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Mix and match icons, counters, and neutral pills for subtle status cues.
      </p>
    </div>
  );
}

function BadgePreview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BadgeLegend />
      <BadgeUsageShowcase />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "badge",
  name: "Badge",
  description: "Rounded status pill with Tailwind variants for success, warning, info, and more.",
  tags: ["display", "status"],
  Preview: BadgePreview,
  sourcePath: "src/components/Badge/Badge.tsx",
};

export default entry;
export { Badge };
export type { BadgeProps, BadgeVariant };
