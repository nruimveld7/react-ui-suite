import { useState } from "react";
import { Select } from "react-ui-suite";
import type { SelectOption, SelectProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Select.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

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
    <DemoExample title="Workspace locale">
      <p className="rui-select-demo__copy">
        Adjust notifications and currency formatting.
      </p>
      <div className="rui-select-demo__grid">
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
    </DemoExample>
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
    <DemoExample title="Theme preset">
      <div className="rui-select-demo__header">
        <div>
          <p className="rui-select-demo__copy">Pick an accent for new docs.</p>
        </div>
        {active ? (
          <span
            className="rui-select-demo__accent-badge"
            style={{ boxShadow: `0 0 0 2px ${active.accent}` }}
          >
            <span className="rui-select-demo__accent-dot" style={{ background: active.accent }} />
            {active.label}
          </span>
        ) : null}
      </div>

      <div className="rui-select-demo__row">
        <Select
          value={theme}
          onChange={(val) => setTheme(val ?? "sunrise")}
          aria-label="Select theme"
          options={themes}
          className="rui-select-demo__select"
        />
      </div>
    </DemoExample>
  );
}

function SelectPreview() {
  return (
    <div className="rui-select-demo">
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
