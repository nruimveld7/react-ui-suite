import { useState } from "react";
import { Checkbox } from "react-ui-suite";
import type { CheckboxProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Checkbox.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

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
    <DemoExample title="Notifications">
      <div className="checkbox-demo-list">
        {preferences.map((pref) => (
          <Checkbox
            key={pref.id}
            label={pref.label}
            description={pref.description}
            uncheckedBoxColor={pref.id === "mentions" ? "#ecfdf5" : undefined}
            checkedBoxColor={pref.id === "mentions" ? "#d1fae5" : undefined}
            uncheckedBorderColor={pref.id === "mentions" ? "#86efac" : undefined}
            checkedBorderColor={pref.id === "mentions" ? "#22c55e" : undefined}
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
    </DemoExample>
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
    <DemoExample title="Project rollout">
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
          className="checkbox-demo-subtask"
          checked={value}
          onChange={(next) => setTasks((prev) => ({ ...prev, [key]: next }))}
        />
      ))}
    </DemoExample>
  );
}

function DisabledCheckboxExample() {
  return (
    <DemoExample title="Disabled">
      <Checkbox
        label="Beta access"
        description="Invite-only at the moment."
        defaultChecked
        disabled
      />
      <p className="checkbox-demo-note">
        Disabled state keeps layout stable.
      </p>
    </DemoExample>
  );
}

function CheckboxPreview() {
  return (
    <div className="checkbox-demo-stack">
      <NotificationPreferences />
      <div className="checkbox-demo-grid">
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
