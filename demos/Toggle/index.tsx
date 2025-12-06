import { useId, useState } from "react";
import { Toggle } from "@react-ui-suite/core";
import type { ToggleProps } from "@react-ui-suite/core";
import type { ComponentRegistryEntry } from "../component-registry";

type ToggleFieldProps = {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

function ToggleField({ title, description, checked, onChange, disabled }: ToggleFieldProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <p id={labelId} className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        {description ? (
          <p id={descriptionId} className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
      />
    </div>
  );
}

function ToggleSettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="space-y-3">
      <ToggleField
        title="Notifications"
        description="Push me when someone mentions my handle."
        checked={notifications}
        onChange={setNotifications}
      />
      <ToggleField
        title="Marketing emails"
        description="Occasional launch news and templates."
        checked={marketing}
        onChange={setMarketing}
      />
    </div>
  );
}

function ControlledToggleExample() {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2 text-center text-sm text-slate-600 dark:text-slate-300">
      <Toggle checked={enabled} onChange={setEnabled} aria-label="Enable integrations" />
      <span>{enabled ? "Integrations enabled" : "Integrations disabled"}</span>
    </div>
  );
}

function AccentToggleExample() {
  const [value, setValue] = useState(false);
  return (
    <Toggle
      checked={value}
      onChange={setValue}
      aria-label="Accent toggle"
      className="border-cyan-400/70 bg-cyan-500/80 data-[state=off]:border-cyan-800 data-[state=off]:bg-cyan-950/70 data-[state=on]:shadow-[0_0_20px_rgba(34,211,238,0.5)] dark:border-cyan-300/80 dark:bg-cyan-500/60 dark:data-[state=off]:border-cyan-950/80 dark:data-[state=off]:bg-cyan-950/70 dark:data-[state=on]:shadow-[0_0_32px_rgba(34,211,238,0.8)]"
    />
  );
}

function DisabledToggleExample() {
  return <Toggle defaultChecked disabled aria-label="Disabled toggle" className="opacity-70" />;
}

function TogglePreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <ToggleSettingsPanel />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Controlled state
          </p>
          <ControlledToggleExample />
        </div>
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Accent styling
          </p>
          <AccentToggleExample />
        </div>
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 text-center text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Disabled toggle
          </p>
          <DisabledToggleExample />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pass disabled to prevent interactions.
          </p>
        </div>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "toggle",
  name: "Toggle",
  description:
    "Minimal, accessible switch component with keyboard controls and Tailwind styling hooks.",
  tags: ["input", "form", "switch"],
  Preview: TogglePreview,
  sourcePath: "src/components/Toggle/Toggle.tsx",
};

export default entry;
export { Toggle };
export type { ToggleProps };
