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
    action: <Button className="rui-stacked-list-demo__action">View</Button>,
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
          action: <Button className="rui-stacked-list-demo__action">Send invite</Button>,
        },
      ]}
    />
  );
}

function StackedListPreview() {
  return (
    <div className="rui-stacked-list-demo">
      <DemoExample
        title="Standup"
        className="rui-stacked-list-demo__card"
      >
        <StandupPreview />
      </DemoExample>
      <div className="rui-stacked-list-demo__grid">
        <DemoExample
          title="Dense activity"
          className="rui-stacked-list-demo__card"
        >
          <DenseActivityExample />
        </DemoExample>
        <DemoExample
          title="Quick actions"
          className="rui-stacked-list-demo__card"
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
