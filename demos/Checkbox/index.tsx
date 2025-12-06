import { useState } from "react";
import { Checkbox } from "@react-ui-suite/core";
import type { CheckboxProps } from "@react-ui-suite/core";
import type { ComponentRegistryEntry } from "../component-registry";

const preferences = [
  {
    id: "mentions",
    label: "Mentions",
    description: "Alerts when someone tags @you in a thread.",
  },
  {
    id: "summaries",
    label: "Weekly summary",
    description: "Digest of unread items every Monday.",
  },
  {
    id: "changelog",
    label: "Product changelog",
    description: "Major releases, experiments, and upcoming features.",
  },
];

function NotificationPreferences() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    mentions: true,
    summaries: false,
    changelog: true,
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
        Notifications
      </p>
      <div className="mt-3 space-y-1">
        {preferences.map((pref) => (
          <Checkbox
            key={pref.id}
            label={pref.label}
            description={pref.description}
            checked={!!selected[pref.id]}
            onChange={(value) =>
              setSelected((prev) => ({
                ...prev,
                [pref.id]: value,
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function IndeterminateExample() {
  const [tasks, setTasks] = useState({
    docs: true,
    qa: false,
    marketing: false,
  });
  const values = Object.values(tasks);
  const allChecked = values.every(Boolean);
  const someChecked = values.some(Boolean);

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <Checkbox
        label="Project rollout"
        description="Parent checkbox reflects child selections."
        checked={allChecked}
        indeterminate={!allChecked && someChecked}
        onChange={(value) =>
          setTasks({
            docs: value,
            qa: value,
            marketing: value,
          })
        }
      />
      {Object.entries(tasks).map(([key, value]) => (
        <Checkbox
          key={key}
          label={`Task: ${key}`}
          className="pl-6"
          checked={value}
          onChange={(next) => setTasks((prev) => ({ ...prev, [key]: next }))}
        />
      ))}
    </div>
  );
}

function DisabledCheckboxExample() {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
      <Checkbox
        label="Beta access"
        description="Invite-only at the moment."
        defaultChecked
        disabled
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Disabled state keeps layout stable.
      </p>
    </div>
  );
}

function CheckboxPreview() {
  return (
    <div className="space-y-4">
      <NotificationPreferences />
      <div className="grid gap-4 md:grid-cols-2">
        <IndeterminateExample />
        <DisabledCheckboxExample />
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "checkbox",
  name: "Checkbox",
  description: "Accessible checkbox with label, helper text, and indeterminate state support.",
  tags: ["input", "form"],
  Preview: CheckboxPreview,
  sourcePath: "src/components/Checkbox/Checkbox.tsx",
};

export default entry;
export { Checkbox };
export type { CheckboxProps };
