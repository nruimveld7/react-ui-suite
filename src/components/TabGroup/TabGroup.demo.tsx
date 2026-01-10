import { useState } from "react";
import { Badge, TabGroup } from "react-ui-suite";
import type { TabGroupItem, TabGroupProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./TabGroup.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const roadmapTabs: TabGroupItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Status + owners",
    content: (
      <div className="rui-tab-group-demo__u-style--6ed543e2fb">
        <div className="rui-tab-group-demo__u-display-flex--60fbb77139 rui-tab-group-demo__u-align-items-center--3960ffc248 rui-tab-group-demo__u-justify-content-space-between--8ef2268efb">
          <p className="rui-tab-group-demo__u-font-size-1-125rem--42536e69e6 rui-tab-group-demo__u-font-weight-600--e83a7042bc rui-tab-group-demo__u-rui-text-opacity-1--f5f136c41d rui-tab-group-demo__u-rui-text-opacity-1--3ddc1cab99">
            Messaging revamp
          </p>
          <Badge variant="success">on track</Badge>
        </div>
        <p className="rui-tab-group-demo__u-font-size-0-875rem--fc7473ca09 rui-tab-group-demo__u-rui-text-opacity-1--2d6fbf48fa rui-tab-group-demo__u-rui-text-opacity-1--5b8efd1d78">
          Align engineering and brand crews on the April release milestones.
        </p>
        <ul className="rui-tab-group-demo__u-style--6f7e013d64 rui-tab-group-demo__u-font-size-0-875rem--fc7473ca09 rui-tab-group-demo__u-rui-text-opacity-1--2d6fbf48fa rui-tab-group-demo__u-rui-text-opacity-1--5b8efd1d78">
          <li className="rui-tab-group-demo__u-display-flex--60fbb77139 rui-tab-group-demo__u-align-items-center--3960ffc248 rui-tab-group-demo__u-justify-content-space-between--8ef2268efb rui-tab-group-demo__u-border-radius-1rem--68f2db624d rui-tab-group-demo__u-border-width-1px--ca6bcd4b6f rui-tab-group-demo__u-border-color-rgb-241-245-249-0-7--5ac1e0b6c2 rui-tab-group-demo__u-padding-left-1rem--f0faeb26d6 rui-tab-group-demo__u-padding-top-0-5rem--03b4dd7f17 rui-tab-group-demo__u-border-color-rgb-39-39-42-0-6--efd7e6fbb1">
            <span>App shell + tokens</span>
            <span className="rui-tab-group-demo__u-font-size-0-75rem--359090c2d5 rui-tab-group-demo__u-text-transform-uppercase--117ec720ea rui-tab-group-demo__u-letter-spacing-0-025em--8baf13a3e9 rui-tab-group-demo__u-rui-text-opacity-1--8d44cef396 rui-tab-group-demo__u-rui-text-opacity-1--28db7d8770">
              Dev
            </span>
          </li>
          <li className="rui-tab-group-demo__u-display-flex--60fbb77139 rui-tab-group-demo__u-align-items-center--3960ffc248 rui-tab-group-demo__u-justify-content-space-between--8ef2268efb rui-tab-group-demo__u-border-radius-1rem--68f2db624d rui-tab-group-demo__u-border-width-1px--ca6bcd4b6f rui-tab-group-demo__u-border-color-rgb-241-245-249-0-7--5ac1e0b6c2 rui-tab-group-demo__u-padding-left-1rem--f0faeb26d6 rui-tab-group-demo__u-padding-top-0-5rem--03b4dd7f17 rui-tab-group-demo__u-border-color-rgb-39-39-42-0-6--efd7e6fbb1">
            <span>Product narrative</span>
            <span className="rui-tab-group-demo__u-font-size-0-75rem--359090c2d5 rui-tab-group-demo__u-text-transform-uppercase--117ec720ea rui-tab-group-demo__u-letter-spacing-0-025em--8baf13a3e9 rui-tab-group-demo__u-rui-text-opacity-1--8d44cef396 rui-tab-group-demo__u-rui-text-opacity-1--28db7d8770">
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
      <div className="rui-tab-group-demo__u-style--6ed543e2fb rui-tab-group-demo__u-font-size-0-875rem--fc7473ca09 rui-tab-group-demo__u-rui-text-opacity-1--2d6fbf48fa rui-tab-group-demo__u-rui-text-opacity-1--5b8efd1d78">
        <p className="rui-tab-group-demo__u-font-size-1rem--4ee734926f rui-tab-group-demo__u-font-weight-600--e83a7042bc rui-tab-group-demo__u-rui-text-opacity-1--f5f136c41d rui-tab-group-demo__u-rui-text-opacity-1--3ddc1cab99">
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
      <div className="rui-tab-group-demo__u-style--6ed543e2fb rui-tab-group-demo__u-font-size-0-875rem--fc7473ca09 rui-tab-group-demo__u-rui-text-opacity-1--2d6fbf48fa rui-tab-group-demo__u-rui-text-opacity-1--5b8efd1d78">
        <p className="rui-tab-group-demo__u-font-size-1rem--4ee734926f rui-tab-group-demo__u-font-weight-600--e83a7042bc rui-tab-group-demo__u-rui-text-opacity-1--f5f136c41d rui-tab-group-demo__u-rui-text-opacity-1--3ddc1cab99">
          Launch checklist
        </p>
        <div className="rui-tab-group-demo__u-display-flex--60fbb77139 rui-tab-group-demo__u-flex-wrap-wrap--1eb5c6df38 rui-tab-group-demo__u-gap-0-5rem--77a2a20e90">
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
      <div className="rui-tab-group-demo__u-style--6f7e013d64 rui-tab-group-demo__u-font-size-0-875rem--fc7473ca09 rui-tab-group-demo__u-rui-text-opacity-1--2d6fbf48fa rui-tab-group-demo__u-rui-text-opacity-1--5b8efd1d78">
        <p className="rui-tab-group-demo__u-font-size-1rem--4ee734926f rui-tab-group-demo__u-font-weight-600--e83a7042bc rui-tab-group-demo__u-rui-text-opacity-1--f5f136c41d rui-tab-group-demo__u-rui-text-opacity-1--3ddc1cab99">Support load</p>
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
      <div className="rui-tab-group-demo__u-style--6f7e013d64 rui-tab-group-demo__u-font-size-0-875rem--fc7473ca09 rui-tab-group-demo__u-rui-text-opacity-1--2d6fbf48fa rui-tab-group-demo__u-rui-text-opacity-1--5b8efd1d78">
        <p className="rui-tab-group-demo__u-font-size-1rem--4ee734926f rui-tab-group-demo__u-font-weight-600--e83a7042bc rui-tab-group-demo__u-rui-text-opacity-1--f5f136c41d rui-tab-group-demo__u-rui-text-opacity-1--3ddc1cab99">Critical docs</p>
        <ul className="rui-tab-group-demo__u-list-style-type-disc--1f33b438c8 rui-tab-group-demo__u-style--da7c36cd88 rui-tab-group-demo__u-padding-left-1-25rem--1512159b61">
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
      <div className="rui-tab-group-demo__u-style--6f7e013d64 rui-tab-group-demo__u-font-size-0-875rem--fc7473ca09 rui-tab-group-demo__u-rui-text-opacity-1--2d6fbf48fa rui-tab-group-demo__u-rui-text-opacity-1--5b8efd1d78">
        <p className="rui-tab-group-demo__u-font-size-1rem--4ee734926f rui-tab-group-demo__u-font-weight-600--e83a7042bc rui-tab-group-demo__u-rui-text-opacity-1--f5f136c41d rui-tab-group-demo__u-rui-text-opacity-1--3ddc1cab99">
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
    <div className="rui-tab-group-demo__u-style--3e7ce58d64">
      <DemoExample
        title="Horizontal tabs"
        className="rui-tab-group-demo__u-border-radius-1-5rem--ea189a088a rui-tab-group-demo__u-border-width-1px--ca6bcd4b6f rui-tab-group-demo__u-rui-border-opacity-1--52f4da2ca5 rui-tab-group-demo__u-background-color-rgb-255-255-255--845918557e rui-tab-group-demo__u-padding-1rem--8e63407b5c rui-tab-group-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-tab-group-demo__u-rui-border-opacity-1--2072c87505 rui-tab-group-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      >
        <HorizontalTabExample />
      </DemoExample>
      <DemoExample
        title="Vertical knowledge hub"
        className="rui-tab-group-demo__u-border-radius-1-5rem--ea189a088a rui-tab-group-demo__u-border-width-1px--ca6bcd4b6f rui-tab-group-demo__u-rui-border-opacity-1--52f4da2ca5 rui-tab-group-demo__u-background-color-rgb-255-255-255--845918557e rui-tab-group-demo__u-padding-1rem--8e63407b5c rui-tab-group-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-tab-group-demo__u-rui-border-opacity-1--2072c87505 rui-tab-group-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      >
        <VerticalTabExample />
      </DemoExample>
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
