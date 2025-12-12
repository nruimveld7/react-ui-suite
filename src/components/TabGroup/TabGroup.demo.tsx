import { useState } from "react";
import { Badge, TabGroup } from "react-ui-suite";
import type { TabGroupItem, TabGroupProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";

const roadmapTabs: TabGroupItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Status + owners",
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
            Messaging revamp
          </p>
          <Badge variant="success">on track</Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-zinc-300">
          Align engineering and brand crews on the April release milestones.
        </p>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
          <li className="flex items-center justify-between rounded-2xl border border-slate-100/70 px-4 py-2 dark:border-zinc-800/60">
            <span>App shell + tokens</span>
            <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-zinc-500">
              Dev
            </span>
          </li>
          <li className="flex items-center justify-between rounded-2xl border border-slate-100/70 px-4 py-2 dark:border-zinc-800/60">
            <span>Product narrative</span>
            <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-zinc-500">
              GTM
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "research",
    label: "Research",
    description: "Customer notes",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-zinc-300">
        <p className="text-base font-semibold text-slate-900 dark:text-zinc-100">
          Voice of Customer takeaways
        </p>
        <p>- 62% of teams want zero-downtime handoffs.</p>
        <p>- Admins requested a self-serve onboarding tour.</p>
        <p>- Beta users enjoy the simplified composer layout.</p>
      </div>
    ),
  },
  {
    id: "launch",
    label: "Launch",
    description: "Campaign tracker",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-zinc-300">
        <p className="text-base font-semibold text-slate-900 dark:text-zinc-100">
          Launch checklist
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">press kit</Badge>
          <Badge variant="warning">ads pending</Badge>
          <Badge>demo video</Badge>
        </div>
        <p>Next sync with revenue is scheduled for Tuesday 9 AM PT.</p>
      </div>
    ),
  },
];

const operationsTabs: TabGroupItem[] = [
  {
    id: "support",
    label: "Support",
    description: "Queue health",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
        <p className="text-base font-semibold text-slate-900 dark:text-zinc-100">Support load</p>
        <p>
          142 open tickets - high priority escalations cooled down after we rolled out new macros.
        </p>
        <Badge variant="warning">response target 42m</Badge>
      </div>
    ),
  },
  {
    id: "ops",
    label: "Biz ops",
    description: "Runbooks",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
        <p className="text-base font-semibold text-slate-900 dark:text-zinc-100">Critical docs</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Renewal playbook v4.2</li>
          <li>Incident command tree</li>
          <li>Budget checkpoint template</li>
        </ul>
      </div>
    ),
  },
  {
    id: "people",
    label: "People",
    description: "Wellness",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
        <p className="text-base font-semibold text-slate-900 dark:text-zinc-100">
          Team pulse summary
        </p>
        <p>Weekly morale score up 8% after we trimmed the on-call rotation.</p>
        <Badge variant="success">green</Badge>
      </div>
    ),
  },
];

function HorizontalTabExample() {
  return <TabGroup aria-label="Roadmap tabs" tabs={roadmapTabs} />;
}

function VerticalTabExample() {
  const [active, setActive] = useState("support");
  return (
    <TabGroup
      aria-label="Operations tabs"
      orientation="vertical"
      value={active}
      onChange={setActive}
      tabs={operationsTabs}
    />
  );
}

function TabGroupPreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Horizontal tabs
        </p>
        <div className="mt-3">
          <HorizontalTabExample />
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Vertical knowledge hub
        </p>
        <div className="mt-3">
          <VerticalTabExample />
        </div>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "tab-group",
  name: "Tab Group",
  description:
    "Accessible tabbed panels with roving keyboard focus that can lay out horizontally or vertically.",
  tags: ["navigation", "layout"],
  Preview: TabGroupPreview,
  sourcePath: "src/components/TabGroup/TabGroup.tsx",
};

export default entry;
export { TabGroup };
export type { TabGroupProps, TabGroupItem };
