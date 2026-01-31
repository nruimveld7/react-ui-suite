import { useMemo, useState } from "react";
import { DatalistInput } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./DatalistInput.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const commands = [
  "Open dashboard",
  "Invite teammate",
  "Create automation",
  "View audit log",
  "Start walkthrough",
  "Switch theme",
  "Export CSV",
  "Schedule report",
];

function CommandPalette() {
  const [query, setQuery] = useState("");
  const matched = useMemo(
    () => commands.filter((cmd) => cmd.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <DemoExample title="Command palette" badge="Custom popover">
      <div className="rui-datalist-input-demo__u-style--6ed543e2fb">
        <DatalistInput
          label="Search actions"
          placeholder="Type to filter commands"
          options={commands}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          description="Custom suggestions popover that matches the gallery styling."
        />
        <div className="rui-datalist-input-demo__u-border-radius-1rem--68f2db624d rui-datalist-input-demo__u-border-width-1px--ca6bcd4b6f rui-datalist-input-demo__u-border-style-dashed--a29b7a649c rui-datalist-input-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-datalist-input-demo__u-background-color-rgb-248-250-252--2579b25ad0 rui-datalist-input-demo__u-padding-0-75rem--eb6e8b881a rui-datalist-input-demo__u-font-size-0-875rem--fc7473ca09 rui-datalist-input-demo__u-color-rgb-71-85-105-1--2d6fbf48fa rui-datalist-input-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-datalist-input-demo__u-background-color-rgb-2-6-23-0-6--ddf84eea43 rui-datalist-input-demo__u-color-rgb-203-213-225-1--ca11017ff7">
          {matched.length ? (
            <ul className="rui-datalist-input-demo__u-style--da7c36cd88">
              {matched.map((item) => (
                <li key={item} className="rui-datalist-input-demo__u-display-flex--60fbb77139 rui-datalist-input-demo__u-align-items-center--3960ffc248 rui-datalist-input-demo__u-gap-0-5rem--77a2a20e90">
                  <span className="rui-datalist-input-demo__u-font-size-10px--1dc571a360 rui-datalist-input-demo__u-text-transform-uppercase--117ec720ea rui-datalist-input-demo__u-letter-spacing-0-2em--2da1a7016e rui-datalist-input-demo__u-color-rgb-148-163-184-1--8d44cef396 rui-datalist-input-demo__u-color-rgb-100-116-139-1--15b16954d1">
                    cmd
                  </span>
                  <span className="rui-datalist-input-demo__u-font-weight-600--e83a7042bc rui-datalist-input-demo__u-color-rgb-15-23-42-1--f5f136c41d rui-datalist-input-demo__u-color-rgb-241-245-249-1--e1d41ccd69">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matches. Try &ldquo;export&rdquo;.</p>
          )}
        </div>
      </div>
    </DemoExample>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "datalist-input",
  name: "Datalist Input",
  description: "Input paired with a custom suggestions popover for lightweight autocompletes.",
  tags: ["input", "form", "search"],
  Preview: CommandPalette,
  sourcePath: "src/components/DatalistInput/DatalistInput.tsx",
};

export default entry;
export { DatalistInput };
