import { useMemo, useState } from "react";
import { Radio } from "react-ui-suite";
import type { RadioProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Radio.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

type PlanOption = {
  id: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
};

const planOptions: PlanOption[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For side projects and prototypes that need a clean handoff.",
    price: "$12/mo",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Unlimited projects, team spaces, and workflow automations.",
    price: "$24/mo",
    badge: "Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Security reviews, custom terms, and premium onboarding.",
    price: "Contact sales",
  },
];

function PlanSelector() {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption["id"]>("pro");
  const activePlan = useMemo(
    () => planOptions.find((plan) => plan.id === selectedPlan),
    [selectedPlan]
  );

  return (
    <DemoExample
      title="Billing"
      className="radio-demo__panel radio-demo__panel--billing"
    >
      <div className="radio-demo__header">
        <div className="radio-demo__header-text">
          <p className="radio-demo__header-copy">Pick a workspace plan.</p>
        </div>
        {activePlan ? (
          <span className="radio-demo__header-badge">
            {activePlan.name}
          </span>
        ) : null}
      </div>

      <div className="radio-demo__stack">
        {planOptions.map((plan) => (
          <Radio
            key={plan.id}
            name="pricing"
            label={plan.name}
            description={plan.description}
            checked={selectedPlan === plan.id}
            onChange={() => setSelectedPlan(plan.id)}
            extra={
              <span className="radio-demo__plan-extra">
                <span className="radio-demo__plan-price">{plan.price}</span>
                {plan.badge ? (
                  <span className="radio-demo__plan-badge">
                    {plan.badge}
                  </span>
                ) : null}
              </span>
            }
          />
        ))}
      </div>
    </DemoExample>
  );
}

type LayoutOption = {
  id: string;
  title: string;
  copy: string;
};

const layoutOptions: LayoutOption[] = [
  { id: "compact", title: "Compact", copy: "Tight spacing and dense tables." },
  { id: "cozy", title: "Cozy", copy: "Balanced spacing for mixed content." },
  { id: "airy", title: "Airy", copy: "Roomy cards and generous whitespace." },
];

function LayoutPreference() {
  const [density, setDensity] = useState<LayoutOption["id"]>("cozy");
  const densityColors: Record<LayoutOption["id"], RadioProps["color"]> = {
    airy: "blue",
    cozy: "green",
    compact: "red",
  };

  return (
    <DemoExample
      title="Layout density"
      className="radio-demo__panel"
    >
      <div className="radio-demo__layout">
        <div className="radio-demo__density-grid">
          {layoutOptions.map((option) => (
            <Radio
              key={option.id}
              name="layout"
              label={option.title}
              description={option.copy}
              color={densityColors[option.id]}
              checked={density === option.id}
              onChange={() => setDensity(option.id)}
              className="radio-demo__density-card"
            />
          ))}
        </div>
        <p className="radio-demo__density-note">
          Current mode:{" "}
          <span className="radio-demo__density-value">{density}</span>
        </p>
      </div>
    </DemoExample>
  );
}

function DigestPreferences() {
  const [cadence, setCadence] = useState<"daily" | "weekly" | "monthly">("weekly");

  return (
    <DemoExample
      title="Digest"
      className="radio-demo__panel radio-demo__panel--stack-lg"
    >
      <Radio
        name="digest"
        label="Daily pulse"
        description="Top changes from the last 24 hours."
        checked={cadence === "daily"}
        onChange={() => setCadence("daily")}
      />
      <Radio
        name="digest"
        label="Weekly summary"
        description="A clean wrap-up every Monday at 8am."
        checked={cadence === "weekly"}
        onChange={() => setCadence("weekly")}
      />
      <Radio
        name="digest"
        label="Monthly report"
        description="Long-form report for leadership."
        checked={cadence === "monthly"}
        onChange={() => setCadence("monthly")}
      />

      <div className="radio-demo__delivery">
        <p className="radio-demo__delivery-title">
          Delivery:{" "}
          {cadence === "daily"
            ? "Every morning"
            : cadence === "weekly"
              ? "Mondays"
              : "First Monday"}
        </p>
        <p className="radio-demo__delivery-subtitle">Pause reasons (read only):</p>
        <div className="radio-demo__pause-stack">
          <Radio
            name="digest-paused"
            label="Policy hold"
            description="Administratively paused by security."
            defaultChecked
            disabled
          />
          <Radio
            name="digest-paused"
            label="Quiet hours"
            description="Muted between 9pm–7am."
            disabled
          />
        </div>
      </div>
    </DemoExample>
  );
}

function RadioPreview() {
  return (
    <div className="radio-demo__page">
      <PlanSelector />
      <div className="radio-demo__grid">
        <LayoutPreference />
        <DigestPreferences />
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "radio",
  name: "Radio",
  description:
    "Custom radio control with helper text, trailing metadata, and flexible card styling.",
  tags: ["input", "form", "selection"],
  Preview: RadioPreview,
  sourcePath: "src/components/Radio/Radio.tsx",
};

export default entry;
export { Radio };
export type { RadioProps };




