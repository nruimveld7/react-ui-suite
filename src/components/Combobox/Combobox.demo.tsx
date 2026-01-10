import { useMemo, useState } from "react";
import { Combobox } from "react-ui-suite";
import type { ComboboxOption, ComboboxProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Combobox.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const languageOptions: ComboboxOption<string>[] = [
  { id: "ts", label: "TypeScript", value: "TypeScript" },
  { id: "js", label: "JavaScript", value: "JavaScript" },
  { id: "py", label: "Python", value: "Python" },
  { id: "rb", label: "Ruby", value: "Ruby" },
  { id: "go", label: "Go", value: "Go" },
  { id: "rs", label: "Rust", value: "Rust" },
  { id: "php", label: "PHP", value: "PHP" },
  { id: "c", label: "C", value: "C" },
  { id: "cpp", label: "C++", value: "C++" },
  { id: "cs", label: "C#", value: "C#" },
];

const frameworkOptions: ComboboxOption<string>[] = [
  { id: "next", label: "Next.js" },
  { id: "remix", label: "Remix" },
  { id: "astro", label: "Astro" },
  { id: "qwik", label: "Qwik", disabled: true },
];

function LanguageCombobox() {
  const [value, setValue] = useState<ComboboxOption<string> | null>(languageOptions[0]);

  return (
    <div className="rui-combobox-demo__stack">
      <Combobox
        ariaLabel="Languages"
        options={languageOptions}
        value={value}
        onChange={setValue}
        placeholder="Pick a language"
        className="rui-combobox-demo__combobox"
      />
      <p className="rui-combobox-demo__selected">Selected language: {value?.label ?? "None"}</p>
    </div>
  );
}

function CustomFilterCombobox() {
  const [value, setValue] = useState<ComboboxOption<string> | null>(null);
  const fuzzyOptions = useMemo(() => languageOptions, []);

  return (
    <Combobox
      ariaLabel="Fuzzy language filter"
      options={fuzzyOptions}
      value={value}
      onChange={setValue}
      placeholder="Search languages..."
      filter={(option, query) => {
        const tokens = query.trim().toLowerCase().split(/\s+/);
        return tokens.every((token) => option.label.toLowerCase().includes(token));
      }}
      className="rui-combobox-demo__combobox"
    />
  );
}

function DisabledOptionsCombobox() {
  const [value, setValue] = useState<ComboboxOption<string> | null>(null);
  return (
    <div className="rui-combobox-demo__stack">
      <Combobox
        ariaLabel="Frameworks"
        options={frameworkOptions}
        value={value}
        onChange={setValue}
        placeholder="Framework"
        className="rui-combobox-demo__combobox"
      />
      <p className="rui-combobox-demo__selected">Selected framework: {value?.label ?? "None"}</p>
    </div>
  );
}

function ComboboxPreview() {
  return (
    <div className="rui-combobox-demo__container">
      <DemoExample title="Controlled">
        <LanguageCombobox />
      </DemoExample>
      <DemoExample title="Custom filter">
        <CustomFilterCombobox />
        <p className="rui-combobox-demo__hint">Override the filter prop for fuzzy matching.</p>
      </DemoExample>
      <DemoExample title="Disabled options" className="rui-combobox-demo__card--span2">
        <DisabledOptionsCombobox />
      </DemoExample>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "combobox",
  name: "Combobox",
  description:
    "Accessible command palette style combobox with keyboard navigation, filtering, and composable overrides.",
  tags: ["input", "form", "search"],
  Preview: ComboboxPreview,
  sourcePath: "src/components/Combobox/Combobox.tsx",
};

export default entry;
export { Combobox };
export type { ComboboxOption, ComboboxProps };
