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
      <p className="rui-select-demo__u-font-size-0-875rem--fc7473ca09 rui-select-demo__u-rui-text-opacity-1--2d6fbf48fa rui-select-demo__u-rui-text-opacity-1--cc0274aad9">
        Adjust notifications and currency formatting.
      </p>
      <div className="rui-select-demo__u-display-grid--f3c543ad5f rui-select-demo__u-gap-0-75rem--1004c0c395 rui-select-demo__u-grid-template-columns-repeat-2-m--e00ad81645">
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
      <div className="rui-select-demo__u-display-flex--60fbb77139 rui-select-demo__u-align-items-center--3960ffc248 rui-select-demo__u-justify-content-space-between--8ef2268efb">
        <div>
          <p className="rui-select-demo__u-font-size-0-875rem--fc7473ca09 rui-select-demo__u-rui-text-opacity-1--2d6fbf48fa rui-select-demo__u-rui-text-opacity-1--cc0274aad9">Pick an accent for new docs.</p>
        </div>
        {active ? (
          <span
            className="rui-select-demo__u-display-flex--60fbb77139 rui-select-demo__u-align-items-center--3960ffc248 rui-select-demo__u-gap-0-5rem--77a2a20e90 rui-select-demo__u-border-radius-9999px--ac204c1088 rui-select-demo__u-background-color-rgb-255-255-255--6c21de570d rui-select-demo__u-padding-left-0-75rem--0e17f2bd90 rui-select-demo__u-padding-top-0-25rem--660d2effb8 rui-select-demo__u-font-size-11px--d058ca6de6 rui-select-demo__u-font-weight-600--e83a7042bc rui-select-demo__u-text-transform-uppercase--117ec720ea rui-select-demo__u-letter-spacing-0-025em--8baf13a3e9 rui-select-demo__u-rui-text-opacity-1--f5f136c41d rui-select-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-select-demo__u-background-color-rgb-15-23-42-0---d855d73915 rui-select-demo__u-rui-text-opacity-1--889e4e871c"
            style={{ boxShadow: `0 0 0 2px ${active.accent}` }}
          >
            <span className="rui-select-demo__u-display-block--0214b4b355 rui-select-demo__u-width-0-625rem--6b7265b65a rui-select-demo__u-border-radius-9999px--ac204c1088" style={{ background: active.accent }} />
            {active.label}
          </span>
        ) : null}
      </div>

      <div className="rui-select-demo__u-display-flex--60fbb77139 rui-select-demo__u-align-items-center--3960ffc248 rui-select-demo__u-gap-0-75rem--1004c0c395">
        <Select
          value={theme}
          onChange={(val) => setTheme(val ?? "sunrise")}
          aria-label="Select theme"
          options={themes}
          className="rui-select-demo__u-flex-1-1-0--36e579c0b4"
        />
      </div>
    </DemoExample>
  );
}

function SelectPreview() {
  return (
    <div className="rui-select-demo__u-display-grid--f3c543ad5f rui-select-demo__u-gap-1rem--0c3bc98565">
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
