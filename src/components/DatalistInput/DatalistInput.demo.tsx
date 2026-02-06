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
      <div className="rui-datalist-input-demo__stack">
        <DatalistInput
          label="Search actions"
          placeholder="Type to filter commands"
          options={commands}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          description="Custom suggestions popover that matches the gallery styling."
        />
        <div className="rui-datalist-input-demo__panel">
          {matched.length ? (
            <ul className="rui-datalist-input-demo__list">
              {matched.map((item) => (
                <li key={item} className="rui-datalist-input-demo__item">
                  <span className="rui-datalist-input-demo__item-key">
                    cmd
                  </span>
                  <span className="rui-datalist-input-demo__item-text">{item}</span>
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
