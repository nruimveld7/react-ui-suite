import { useState } from "react";
import { Button, InputField } from "react-ui-suite";
import type { InputFieldProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./InputField.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function ProfileFormPreview() {
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("Research");
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="rui-input-field-demo__u-style--3e7ce58d64"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
    >
      <InputField
        label="Full name"
        description="Shown across your workspace."
        value={name}
        onChange={(event) => setName(event.target.value)}
        leadingIcon={<span aria-hidden="true">👤</span>}
        placeholder="Your name"
      />
      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        leadingIcon={<span aria-hidden="true">✉️</span>}
        description="Used for login and notifications."
        error={!email && saved ? "Email is required" : undefined}
        trailingLabel="Required"
      />
      <InputField
        label="Team"
        value={team}
        onChange={(event) => setTeam(event.target.value)}
        placeholder="Team or department"
        description="Everyone sees this under your avatar."
      />
      <div className="rui-input-field-demo__u-display-flex--60fbb77139 rui-input-field-demo__u-align-items-center--3960ffc248 rui-input-field-demo__u-gap-0-75rem--1004c0c395 rui-input-field-demo__u-padding-top-0-5rem--f46b61a9b3">
        <Button type="submit">Save profile</Button>
        {saved && <span className="rui-input-field-demo__u-font-size-0-75rem--359090c2d5 rui-input-field-demo__u-color-rgb-16-185-129-1--ab3983747d">Saved!</span>}
      </div>
    </form>
  );
}

function PasswordFieldExample() {
  const [value, setValue] = useState("");
  return (
    <InputField
      label="Password"
      type="password"
      placeholder="Enter a strong password"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      description="At least 10 characters."
      error={value && value.length < 10 ? "Password is too short" : undefined}
    />
  );
}

function TrailingLabelExample() {
  return (
    <InputField
      label="Workspace slug"
      placeholder="acme"
      trailingLabel=".team"
      description="Used to build links like acme.team/app."
    />
  );
}

function DisabledFieldExample() {
  return (
    <InputField
      label="API token"
      value="sk_live_1234"
      description="Tokens are generated automatically."
      disabled
    />
  );
}

function InputFieldPreview() {
  return (
    <div className="rui-input-field-demo__u-style--3e7ce58d64">
      <DemoExample
        title="Profile"
        className="rui-input-field-demo__u-border-radius-1-5rem--ea189a088a rui-input-field-demo__u-border-width-1px--ca6bcd4b6f rui-input-field-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-input-field-demo__u-background-color-rgb-255-255-255--845918557e rui-input-field-demo__u-padding-1-25rem--c07e54fd14 rui-input-field-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-input-field-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-input-field-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      >
        <ProfileFormPreview />
      </DemoExample>
      <div className="rui-input-field-demo__u-display-grid--f3c543ad5f rui-input-field-demo__u-gap-1rem--0c3bc98565 rui-input-field-demo__u-grid-template-columns-repeat-2-m--e4d6f343b9">
        <DemoExample
          title="Validation"
          className="rui-input-field-demo__u-style--6ed543e2fb rui-input-field-demo__u-border-radius-1-5rem--ea189a088a rui-input-field-demo__u-border-width-1px--ca6bcd4b6f rui-input-field-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-input-field-demo__u-background-color-rgb-255-255-255--845918557e rui-input-field-demo__u-padding-1rem--8e63407b5c rui-input-field-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-input-field-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-input-field-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
        >
          <PasswordFieldExample />
        </DemoExample>
        <DemoExample
          title="Variations"
          className="rui-input-field-demo__u-style--6ed543e2fb rui-input-field-demo__u-border-radius-1-5rem--ea189a088a rui-input-field-demo__u-border-width-1px--ca6bcd4b6f rui-input-field-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-input-field-demo__u-background-color-rgb-255-255-255--845918557e rui-input-field-demo__u-padding-1rem--8e63407b5c rui-input-field-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-input-field-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-input-field-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
        >
          <TrailingLabelExample />
          <DisabledFieldExample />
        </DemoExample>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "input-field",
  name: "Input Field",
  description:
    "Accessible text input with labels, helper text, error treatment, and optional leading/trailing adornments.",
  tags: ["input", "form", "text"],
  Preview: InputFieldPreview,
  sourcePath: "src/components/InputField/InputField.tsx",
};

export default entry;
export { InputField };
export type { InputFieldProps };
