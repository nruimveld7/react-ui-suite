import { Badge, Button, Card } from "react-ui-suite";
import type { CardProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Card.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--rui-space-3)" }}>
      <div className="card-demo-grid">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="card-demo-plan-card"
            title={
              <span className="card-demo-plan-title">
                <span>{plan.name}</span>
                {plan.badge ? (
                  <Badge variant="info" className="card-demo-plan-badge" style={{ marginLeft: "auto" }}>
                    {plan.badge}
                  </Badge>
                ) : null}
              </span>
            }
            footer={
              <Button className="card-demo-choose-button" style={{ width: "100%" }}>
                Choose plan
              </Button>
            }
          >
            <div className="card-demo-plan-price">{plan.price}</div>
            <p className="card-demo-plan-description">{plan.description}</p>
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
      actions={<span className="card-demo-stat-positive">+0.2%</span>}
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
      footer={
        <Button
          disabled
          style={{
            padding: "0.25rem 0.75rem",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Send invites
        </Button>
      }
    >
      Collaborate with teammates to share drafts, review changes, and sync releases.
    </Card>
  );
}

function CardPreview() {
  return (
    <div className="card-demo-stack">
      <DemoExample title="Plan">
        <PlanComparison />
      </DemoExample>
      <div className="card-demo-secondary-grid">
        <DemoExample title="Uptime">
          <AnalyticsCardExample />
        </DemoExample>
        <DemoExample title="Muted">
          <MutedCardExample />
        </DemoExample>
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
