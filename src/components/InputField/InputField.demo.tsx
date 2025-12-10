import { useState } from "react";
import { Button, InputField } from "react-ui-suite";
import type { InputFieldProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";

function ProfileFormPreview() {
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("Research");
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="space-y-4"
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
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit">Save profile</Button>
        {saved && <span className="text-xs text-emerald-500">Saved!</span>}
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
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <ProfileFormPreview />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Validation
          </p>
          <PasswordFieldExample />
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Variations
          </p>
          <TrailingLabelExample />
          <DisabledFieldExample />
        </div>
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
