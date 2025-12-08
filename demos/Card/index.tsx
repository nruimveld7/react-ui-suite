import { Badge, Button, Card } from "react-ui-suite";
import type { CardProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$19/mo",
    description: "Best for small teams getting started.",
    badge: null,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$49/mo",
    description: "Priority support, advanced analytics, and automation rules.",
    badge: "Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Let's chat",
    description: "SAML SSO, custom limits, and dedicated success partner.",
    badge: "New",
  },
];

function PlanComparison() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Plan
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="pt-4"
            title={
              <span className="flex items-center gap-2">
                <span>{plan.name}</span>
                {plan.badge ? (
                  <Badge
                    variant="info"
                    className="ml-auto px-2.5 py-[3px] text-[0.65rem] leading-[0.9rem]"
                  >
                    {plan.badge}
                  </Badge>
                ) : null}
              </span>
            }
            footer={
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                Choose plan
              </Button>
            }
          >
            <div className="text-2xl font-semibold text-slate-900 dark:text-white">
              {plan.price}
            </div>
            <p className="mt-1 text-sm leading-relaxed">{plan.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyticsCardExample() {
  return (
    <Card
      eyebrow="Uptime"
      title="99.98%"
      actions={<span className="text-emerald-500">+0.2%</span>}
      footer="Last updated 5 minutes ago"
    >
      No incidents detected. All systems operational.
    </Card>
  );
}

function MutedCardExample() {
  return (
    <Card
      muted
      title="Invite your team"
      footer={<Button className="px-3 py-1 text-xs uppercase tracking-wide">Send invites</Button>}
    >
      Collaborate with teammates to share drafts, review changes, and sync releases.
    </Card>
  );
}

function CardPreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/50 dark:border-slate-800 dark:bg-demo-panel dark:shadow-none">
        <PlanComparison />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsCardExample />
        <MutedCardExample />
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "card",
  name: "Card",
  description: "Flexible surface with eyebrow, action zone, and footer for dashboards or settings.",
  tags: ["layout", "display", "surface"],
  Preview: CardPreview,
  sourcePath: "src/components/Card/Card.tsx",
};

export default entry;
export { Card };
export type { CardProps };
