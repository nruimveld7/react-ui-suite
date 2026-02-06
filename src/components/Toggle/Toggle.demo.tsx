import { useId, useState } from "react";
import { Toggle } from "react-ui-suite";
import type { ToggleProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Toggle.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

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
    <div className="rui-toggle-demo__field">
      <div>
        <p id={labelId} className="rui-toggle-demo__field-title">
          {title}
        </p>
        {description ? (
          <p id={descriptionId} className="rui-toggle-demo__field-description">
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
    <div className="rui-toggle-demo__settings">
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
    <div className="rui-toggle-demo__status">
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
      className="rui-toggle-demo__accent-toggle"
    />
  );
}

function DisabledToggleExample() {
  return (
    <Toggle
      defaultChecked
      disabled
      aria-label="Disabled toggle"
      className="rui-toggle-demo__disabled-toggle"
    />
  );
}

function TogglePreview() {
  return (
    <div className="rui-toggle-demo">
      <DemoExample title="Settings" className="rui-toggle-demo__panel">
        <ToggleSettingsPanel />
      </DemoExample>
      <div className="rui-toggle-demo__grid rui-toggle-demo__grid--three">
        <DemoExample title="Controlled state" className="rui-toggle-demo__card">
          <ControlledToggleExample />
        </DemoExample>
        <DemoExample title="Accent styling" className="rui-toggle-demo__card">
          <AccentToggleExample />
        </DemoExample>
        <DemoExample
          title="Disabled toggle"
          className="rui-toggle-demo__card rui-toggle-demo__card--muted"
        >
          <DisabledToggleExample />
          <p className="rui-toggle-demo__note">Pass disabled to prevent interactions.</p>
        </DemoExample>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "toggle",
  name: "Toggle",
  description:
    "Minimal, accessible switch component with keyboard controls and styling hooks.",
  tags: ["input", "form", "switch"],
  Preview: TogglePreview,
  sourcePath: "src/components/Toggle/Toggle.tsx",
};

export default entry;
export { Toggle };
export type { ToggleProps };
