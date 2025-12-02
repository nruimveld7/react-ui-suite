import { useMemo, useState } from "react";
import { Combobox } from "react-ui-suite";
import type { ComboboxOption, ComboboxProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

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
  { id: "cs", label: "C#", value: "C#" }
];

const frameworkOptions: ComboboxOption<string>[] = [
  { id: "next", label: "Next.js" },
  { id: "remix", label: "Remix" },
  { id: "astro", label: "Astro" },
  { id: "qwik", label: "Qwik", disabled: true }
];

function LanguageCombobox() {
  const [value, setValue] = useState<ComboboxOption<string> | null>(
    languageOptions[0]
  );

  return (
    <div className="space-y-2">
      <Combobox
        ariaLabel="Languages"
        options={languageOptions}
        value={value}
        onChange={setValue}
        placeholder="Pick a language"
        className="max-w-md"
      />
      <p className="text-xs text-slate-400">
        Selected language: {value?.label ?? "None"}
      </p>
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
      className="max-w-md"
    />
  );
}

function DisabledOptionsCombobox() {
  const [value, setValue] = useState<ComboboxOption<string> | null>(null);
  return (
    <div className="space-y-2">
      <Combobox
        ariaLabel="Frameworks"
        options={frameworkOptions}
        value={value}
        onChange={setValue}
        placeholder="Framework"
        className="max-w-md"
      />
      <p className="text-xs text-slate-400">
        Selected framework: {value?.label ?? "None"}
      </p>
    </div>
  );
}

function ComboboxPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Controlled
        </p>
        <LanguageCombobox />
      </div>
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Custom filter
        </p>
        <CustomFilterCombobox />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Override the filter prop for fuzzy matching.
        </p>
      </div>
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 md:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Disabled options
        </p>
        <DisabledOptionsCombobox />
      </div>
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
  sourcePath: "src/components/Combobox/Combobox.tsx"
};

export default entry;
export { Combobox };
export type { ComboboxOption, ComboboxProps };
