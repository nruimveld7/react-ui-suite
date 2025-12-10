import { useState } from "react";
import { Select } from "react-ui-suite";
import type { SelectOption, SelectProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";

const countries: SelectOption[] = [
  { value: "usa", label: "United States", description: "EST/PST" },
  { value: "can", label: "Canada", description: "EST/PST" },
  { value: "mex", label: "Mexico", description: "CST" },
  { value: "bra", label: "Brazil", description: "BRT" },
  { value: "deu", label: "Germany", description: "CET" },
  { value: "jpn", label: "Japan", description: "JST" },
];

function CountrySelect() {
  const [country, setCountry] = useState("can");
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
        Workspace locale
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Adjust notifications and currency formatting.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Select
          label="Primary region"
          value={country}
          onChange={(val) => setCountry(val ?? "")}
          options={countries}
          placeholder="Choose a country"
        />
        <Select
          label="Backup region"
          description="Used during incidents."
          defaultValue="deu"
          options={countries}
        />
      </div>
    </div>
  );
}

type ThemeOption = { value: string; label: string; accent: string };

const themes: ThemeOption[] = [
  { value: "midnight", label: "Midnight", accent: "#22d3ee" },
  { value: "sunrise", label: "Sunrise", accent: "#f97316" },
  { value: "forest", label: "Forest", accent: "#22c55e" },
  { value: "lilac", label: "Lilac", accent: "#a855f7" },
];

function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeOption["value"]>("sunrise");
  const active = themes.find((item) => item.value === theme);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            Theme preset
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Pick an accent for new docs.</p>
        </div>
        {active ? (
          <span
            className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-900 shadow-sm dark:bg-slate-900/90 dark:text-white"
            style={{ boxShadow: `0 0 0 2px ${active.accent}` }}
          >
            <span className="block size-2.5 rounded-full" style={{ background: active.accent }} />
            {active.label}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Select
          value={theme}
          onChange={(val) => setTheme(val ?? "sunrise")}
          aria-label="Select theme"
          options={themes}
          className="flex-1"
        />
      </div>
    </div>
  );
}

function SelectPreview() {
  return (
    <div className="grid gap-4">
      <CountrySelect />
      <ThemeSelector />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "select",
  name: "Select",
  description: "Styled native select with label, helper text, and consistent shells.",
  tags: ["input", "form", "select"],
  Preview: SelectPreview,
  sourcePath: "src/components/Select/Select.tsx",
};

export default entry;
export { Select };
export type { SelectProps };
