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
    <div className="rui-toggle-demo__u-display-flex--60fbb77139 rui-toggle-demo__u-align-items-center--3960ffc248 rui-toggle-demo__u-justify-content-space-between--8ef2268efb rui-toggle-demo__u-gap-1-5rem--0d304f904c rui-toggle-demo__u-border-radius-1rem--68f2db624d rui-toggle-demo__u-border-width-1px--ca6bcd4b6f rui-toggle-demo__u-rui-border-opacity-1--52f4da2ca5 rui-toggle-demo__u-background-color-rgb-255-255-255--6c21de570d rui-toggle-demo__u-padding-left-1rem--f0faeb26d6 rui-toggle-demo__u-padding-top-0-75rem--1b2d54a3fd rui-toggle-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-toggle-demo__u-rui-border-opacity-1--2072c87505 rui-toggle-demo__u-background-color-rgb-15-23-42-0---5212cbf15b">
      <div>
        <p id={labelId} className="rui-toggle-demo__u-font-size-0-875rem--fc7473ca09 rui-toggle-demo__u-font-weight-600--e83a7042bc rui-toggle-demo__u-rui-text-opacity-1--f5f136c41d rui-toggle-demo__u-rui-text-opacity-1--e1d41ccd69">
          {title}
        </p>
        {description ? (
          <p id={descriptionId} className="rui-toggle-demo__u-font-size-0-75rem--359090c2d5 rui-toggle-demo__u-rui-text-opacity-1--30426eb75c rui-toggle-demo__u-rui-text-opacity-1--cc0274aad9">
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
    <div className="rui-toggle-demo__u-style--6ed543e2fb">
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
    <div className="rui-toggle-demo__u-display-flex--60fbb77139 rui-toggle-demo__u-flex-direction-column--8dddea0773 rui-toggle-demo__u-align-items-center--3960ffc248 rui-toggle-demo__u-gap-0-5rem--77a2a20e90 rui-toggle-demo__u-text-align-center--ca6bf63030 rui-toggle-demo__u-font-size-0-875rem--fc7473ca09 rui-toggle-demo__u-rui-text-opacity-1--2d6fbf48fa rui-toggle-demo__u-rui-text-opacity-1--ca11017ff7">
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
      className="rui-toggle-demo__u-border-color-rgb-34-211-238-0-7--cfded47aa0 rui-toggle-demo__u-background-color-rgb-6-182-212-0--8b05b6eac3 rui-toggle-demo__u-style--5f1b969c93 rui-toggle-demo__u-style--44d8b39dc4 rui-toggle-demo__u-style--9f264d8e07 rui-toggle-demo__u-border-color-rgb-103-232-249-0-8--e18226057a rui-toggle-demo__u-background-color-rgb-6-182-212-0--c3a2148ab8 rui-toggle-demo__u-style--6609646bd7 rui-toggle-demo__u-style--ea1f48bbfa rui-toggle-demo__u-style--1d1cf22aab"
    />
  );
}

function DisabledToggleExample() {
  return <Toggle defaultChecked disabled aria-label="Disabled toggle" className="rui-toggle-demo__u-opacity-0-7--0c67ca474a" />;
}

function TogglePreview() {
  return (
    <div className="rui-toggle-demo__u-style--3e7ce58d64">
      <DemoExample
        title="Settings"
        className="rui-toggle-demo__u-border-radius-1-5rem--ea189a088a rui-toggle-demo__u-border-width-1px--ca6bcd4b6f rui-toggle-demo__u-rui-border-opacity-1--52f4da2ca5 rui-toggle-demo__u-background-color-rgb-255-255-255--845918557e rui-toggle-demo__u-padding-1rem--8e63407b5c rui-toggle-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-toggle-demo__u-rui-border-opacity-1--2072c87505 rui-toggle-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      >
        <ToggleSettingsPanel />
      </DemoExample>
      <div className="rui-toggle-demo__u-display-grid--f3c543ad5f rui-toggle-demo__u-gap-1rem--0c3bc98565 rui-toggle-demo__u-grid-template-columns-repeat-3-m--9a638cfe82">
        <DemoExample
          title="Controlled state"
          className="rui-toggle-demo__u-display-flex--60fbb77139 rui-toggle-demo__u-flex-direction-column--8dddea0773 rui-toggle-demo__u-align-items-center--3960ffc248 rui-toggle-demo__u-gap-0-75rem--1004c0c395 rui-toggle-demo__u-border-radius-1-5rem--ea189a088a rui-toggle-demo__u-border-width-1px--ca6bcd4b6f rui-toggle-demo__u-rui-border-opacity-1--52f4da2ca5 rui-toggle-demo__u-background-color-rgb-255-255-255--845918557e rui-toggle-demo__u-padding-1rem--8e63407b5c rui-toggle-demo__u-text-align-center--ca6bf63030 rui-toggle-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-toggle-demo__u-rui-border-opacity-1--2072c87505 rui-toggle-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
        >
          <ControlledToggleExample />
        </DemoExample>
        <DemoExample
          title="Accent styling"
          className="rui-toggle-demo__u-display-flex--60fbb77139 rui-toggle-demo__u-flex-direction-column--8dddea0773 rui-toggle-demo__u-align-items-center--3960ffc248 rui-toggle-demo__u-gap-0-75rem--1004c0c395 rui-toggle-demo__u-border-radius-1-5rem--ea189a088a rui-toggle-demo__u-border-width-1px--ca6bcd4b6f rui-toggle-demo__u-rui-border-opacity-1--52f4da2ca5 rui-toggle-demo__u-background-color-rgb-255-255-255--845918557e rui-toggle-demo__u-padding-1rem--8e63407b5c rui-toggle-demo__u-text-align-center--ca6bf63030 rui-toggle-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-toggle-demo__u-rui-border-opacity-1--2072c87505 rui-toggle-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
        >
          <AccentToggleExample />
        </DemoExample>
        <DemoExample
          title="Disabled toggle"
          className="rui-toggle-demo__u-display-flex--60fbb77139 rui-toggle-demo__u-flex-direction-column--8dddea0773 rui-toggle-demo__u-align-items-center--3960ffc248 rui-toggle-demo__u-gap-0-75rem--1004c0c395 rui-toggle-demo__u-border-radius-1-5rem--ea189a088a rui-toggle-demo__u-border-width-1px--ca6bcd4b6f rui-toggle-demo__u-rui-border-opacity-1--52f4da2ca5 rui-toggle-demo__u-background-color-rgb-255-255-255--845918557e rui-toggle-demo__u-padding-1rem--8e63407b5c rui-toggle-demo__u-text-align-center--ca6bf63030 rui-toggle-demo__u-font-size-0-875rem--fc7473ca09 rui-toggle-demo__u-rui-text-opacity-1--2d6fbf48fa rui-toggle-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-toggle-demo__u-rui-border-opacity-1--2072c87505 rui-toggle-demo__u-background-color-rgb-15-23-42-0---5212cbf15b rui-toggle-demo__u-rui-text-opacity-1--ca11017ff7"
        >
          <DisabledToggleExample />
          <p className="rui-toggle-demo__u-font-size-0-75rem--359090c2d5 rui-toggle-demo__u-rui-text-opacity-1--30426eb75c rui-toggle-demo__u-rui-text-opacity-1--cc0274aad9">
            Pass disabled to prevent interactions.
          </p>
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
