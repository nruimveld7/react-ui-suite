import { Badge, Button, StackedList } from "react-ui-suite";
import type { StackedListItem, StackedListProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

const standupItems: StackedListItem[] = [
  {
    id: "one",
    title: "Design handoff",
    description: "Sync design tokens with the frontend before Friday.",
    meta: "Due tomorrow",
    icon: "🎨",
    action: <Badge variant="info">in progress</Badge>
  },
  {
    id: "two",
    title: "iOS beta feedback",
    description: "Collect notes from TestFlight build 2.3.1.",
    meta: "2 hrs ago",
    icon: "📱",
    action: <Button className="px-3 py-1 text-xs">View</Button>
  },
  {
    id: "three",
    title: "Marketing review",
    description: "Approve campaign assets for Q4 launch.",
    meta: "Next week",
    icon: "📣",
    action: <Badge variant="warning">pending</Badge>
  }
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
        { id: "p3", title: "Your plan renews tomorrow", meta: "Today" }
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
          action: <Button className="px-3 py-1 text-xs">Send invite</Button>
        }
      ]}
    />
  );
}

function StackedListPreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <StandupPreview />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Dense activity
          </p>
          <div className="mt-3">
            <DenseActivityExample />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Quick actions
          </p>
          <div className="mt-3">
            <QuickActionList />
          </div>
        </div>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "stacked-list",
  name: "Stacked List",
  description: "Composable list surface built on native lists, ideal for inboxes or activity feeds.",
  tags: ["display", "list"],
  Preview: StackedListPreview,
  sourcePath: "src/components/StackedList/StackedList.tsx"
};

export default entry;
export { StackedList };
export type { StackedListProps, StackedListItem };
