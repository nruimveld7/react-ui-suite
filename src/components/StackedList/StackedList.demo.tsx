import { Badge, Button, StackedList } from "react-ui-suite";
import type { StackedListItem, StackedListProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./StackedList.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const standupItems: StackedListItem[] = [
  {
    id: "one",
    title: "Design handoff",
    description: "Sync design tokens with the frontend before Friday.",
    meta: "Due tomorrow",
    icon: "🎨",
    action: <Badge variant="info">in progress</Badge>,
  },
  {
    id: "two",
    title: "iOS beta feedback",
    description: "Collect notes from TestFlight build 2.3.1.",
    meta: "2 hrs ago",
    icon: "📱",
    action: <Button className="rui-stacked-list-demo__u-padding-left-0-75rem--0e17f2bd90 rui-stacked-list-demo__u-padding-top-0-25rem--660d2effb8 rui-stacked-list-demo__u-font-size-0-75rem--359090c2d5">View</Button>,
  },
  {
    id: "three",
    title: "Marketing review",
    description: "Approve campaign assets for Q4 launch.",
    meta: "Next week",
    icon: "📣",
    action: <Badge variant="warning">pending</Badge>,
  },
];

function StandupPreview() {
  return <StackedList items={standupItems} />;
}

function DenseActivityExample() {
  return (
    <StackedList
      dense
      items={[
        { id: "p1", title: "Alice archived channel #leads", meta: "1m ago" },
        { id: "p2", title: "Jamal pushed to main", meta: "14m ago" },
        { id: "p3", title: "Your plan renews tomorrow", meta: "Today" },
      ]}
    />
  );
}

function QuickActionList() {
  return (
    <StackedList
      items={[
        {
          id: "invite",
          title: "Invite designers",
          description: "Send access to alice@example.com",
          action: <Button className="rui-stacked-list-demo__u-padding-left-0-75rem--0e17f2bd90 rui-stacked-list-demo__u-padding-top-0-25rem--660d2effb8 rui-stacked-list-demo__u-font-size-0-75rem--359090c2d5">Send invite</Button>,
        },
      ]}
    />
  );
}

function StackedListPreview() {
  return (
    <div className="rui-stacked-list-demo__u-style--3e7ce58d64">
      <DemoExample
        title="Standup"
        className="rui-stacked-list-demo__u-border-radius-1-5rem--ea189a088a rui-stacked-list-demo__u-border-width-1px--ca6bcd4b6f rui-stacked-list-demo__u-rui-border-opacity-1--52f4da2ca5 rui-stacked-list-demo__u-background-color-rgb-255-255-255--845918557e rui-stacked-list-demo__u-padding-1rem--8e63407b5c rui-stacked-list-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-stacked-list-demo__u-rui-border-opacity-1--2072c87505 rui-stacked-list-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      >
        <StandupPreview />
      </DemoExample>
      <div className="rui-stacked-list-demo__u-display-grid--f3c543ad5f rui-stacked-list-demo__u-gap-1rem--0c3bc98565 rui-stacked-list-demo__u-grid-template-columns-repeat-2-m--e4d6f343b9">
        <DemoExample
          title="Dense activity"
          className="rui-stacked-list-demo__u-border-radius-1-5rem--ea189a088a rui-stacked-list-demo__u-border-width-1px--ca6bcd4b6f rui-stacked-list-demo__u-rui-border-opacity-1--52f4da2ca5 rui-stacked-list-demo__u-background-color-rgb-255-255-255--845918557e rui-stacked-list-demo__u-padding-1rem--8e63407b5c rui-stacked-list-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-stacked-list-demo__u-rui-border-opacity-1--2072c87505 rui-stacked-list-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
        >
          <DenseActivityExample />
        </DemoExample>
        <DemoExample
          title="Quick actions"
          className="rui-stacked-list-demo__u-border-radius-1-5rem--ea189a088a rui-stacked-list-demo__u-border-width-1px--ca6bcd4b6f rui-stacked-list-demo__u-rui-border-opacity-1--52f4da2ca5 rui-stacked-list-demo__u-background-color-rgb-255-255-255--845918557e rui-stacked-list-demo__u-padding-1rem--8e63407b5c rui-stacked-list-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-stacked-list-demo__u-rui-border-opacity-1--2072c87505 rui-stacked-list-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
        >
          <QuickActionList />
        </DemoExample>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "stacked-list",
  name: "Stacked List",
  description:
    "Composable list surface built on native lists, ideal for inboxes or activity feeds.",
  tags: ["display", "list"],
  Preview: StackedListPreview,
  sourcePath: "src/components/StackedList/StackedList.tsx",
};

export default entry;
export { StackedList };
export type { StackedListProps, StackedListItem };
