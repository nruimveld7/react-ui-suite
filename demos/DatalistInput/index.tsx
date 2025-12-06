import { useMemo, useState } from "react";
import { DatalistInput } from "@react-ui-suite/core";
import type { ComponentRegistryEntry } from "../component-registry";

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
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Command palette
        </p>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
          Custom popover
        </span>
      </div>
      <div className="mt-3 space-y-3">
        <DatalistInput
          label="Search actions"
          placeholder="Type to filter commands"
          options={commands}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          description="Custom suggestions popover that matches the gallery styling."
        />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
          {matched.length ? (
            <ul className="space-y-1">
              {matched.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    cmd
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matches. Try "export".</p>
          )}
        </div>
      </div>
    </div>
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
