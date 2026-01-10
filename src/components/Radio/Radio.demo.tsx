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
      className="rui-radio-demo__u-border-radius-1-5rem--ea189a088a rui-radio-demo__u-border-width-1px--ca6bcd4b6f rui-radio-demo__u-rui-border-opacity-1--52f4da2ca5 rui-radio-demo__u-background-color-rgb-255-255-255--6c21de570d rui-radio-demo__u-padding-1-25rem--c07e54fd14 rui-radio-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-radio-demo__u-rui-shadow-color-rgb-226-232-240--f610086a01 rui-radio-demo__u-rui-border-opacity-1--2072c87505 rui-radio-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-radio-demo__u-display-flex--60fbb77139 rui-radio-demo__u-align-items-center--3960ffc248 rui-radio-demo__u-justify-content-space-between--8ef2268efb rui-radio-demo__u-gap-1rem--0c3bc98565">
        <div>
          <p className="rui-radio-demo__u-font-size-0-875rem--fc7473ca09 rui-radio-demo__u-rui-text-opacity-1--2d6fbf48fa rui-radio-demo__u-rui-text-opacity-1--cc0274aad9">Pick a workspace plan.</p>
        </div>
        {activePlan ? (
          <span className="rui-radio-demo__u-border-radius-9999px--ac204c1088 rui-radio-demo__u-background-color-rgb-15-23-42-0---3cfbc66be8 rui-radio-demo__u-padding-left-0-75rem--0e17f2bd90 rui-radio-demo__u-padding-top-0-25rem--660d2effb8 rui-radio-demo__u-font-size-11px--d058ca6de6 rui-radio-demo__u-font-weight-600--e83a7042bc rui-radio-demo__u-text-transform-uppercase--117ec720ea rui-radio-demo__u-letter-spacing-0-25em--854c830ad6 rui-radio-demo__u-rui-text-opacity-1--72a4c7cdee rui-radio-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-radio-demo__u-background-color-rgb-255-255-255--a978c46eef rui-radio-demo__u-rui-text-opacity-1--ea4519095b">
            {activePlan.name}
          </span>
        ) : null}
      </div>

      <div className="rui-radio-demo__u-style--6f7e013d64">
        {planOptions.map((plan) => (
          <Radio
            key={plan.id}
            name="pricing"
            label={plan.name}
            description={plan.description}
            checked={selectedPlan === plan.id}
            onChange={() => setSelectedPlan(plan.id)}
            extra={
              <span className="rui-radio-demo__u-display-flex--60fbb77139 rui-radio-demo__u-align-items-center--3960ffc248 rui-radio-demo__u-gap-0-5rem--77a2a20e90">
                <span className="rui-radio-demo__u-font-size-0-875rem--fc7473ca09 rui-radio-demo__u-font-weight-600--e83a7042bc rui-radio-demo__u-rui-text-opacity-1--f5f136c41d rui-radio-demo__u-rui-text-opacity-1--e1d41ccd69">
                  {plan.price}
                </span>
                {plan.badge ? (
                  <span className="rui-radio-demo__u-border-radius-9999px--ac204c1088 rui-radio-demo__u-rui-bg-opacity-1--15821c2ff2 rui-radio-demo__u-padding-left-0-5rem--d5eab218aa rui-radio-demo__u-padding-top-2px--10ecba24d6 rui-radio-demo__u-font-size-10px--1dc571a360 rui-radio-demo__u-font-weight-600--e83a7042bc rui-radio-demo__u-text-transform-uppercase--117ec720ea rui-radio-demo__u-letter-spacing-0-25em--854c830ad6 rui-radio-demo__u-rui-text-opacity-1--72a4c7cdee rui-radio-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-radio-demo__u-rui-bg-opacity-1--e598448d8a rui-radio-demo__u-rui-text-opacity-1--ea4519095b">
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

  return (
    <DemoExample
      title="Layout density"
      className="rui-radio-demo__u-border-radius-1-5rem--ea189a088a rui-radio-demo__u-border-width-1px--ca6bcd4b6f rui-radio-demo__u-rui-border-opacity-1--52f4da2ca5 rui-radio-demo__u-background-color-rgb-255-255-255--6c21de570d rui-radio-demo__u-padding-1rem--8e63407b5c rui-radio-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-radio-demo__u-rui-border-opacity-1--2072c87505 rui-radio-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-radio-demo__u-display-grid--f3c543ad5f rui-radio-demo__u-gap-0-5rem--77a2a20e90 rui-radio-demo__u-grid-template-columns-repeat-3-m--ab1b20c229">
        {layoutOptions.map((option) => (
          <Radio
            key={option.id}
            name="layout"
            label={option.title}
            description={option.copy}
            checked={density === option.id}
            onChange={() => setDensity(option.id)}
            className="rui-radio-demo__compact-shadow rui-radio-demo__u-height-100--668b21aa54 rui-radio-demo__u-width-100--6da6a3c3f7 rui-radio-demo__u-border-radius-1rem--68f2db624d rui-radio-demo__u-border-width-1px--ca6bcd4b6f rui-radio-demo__u-rui-border-opacity-1--52f4da2ca5 rui-radio-demo__u-background-color-rgb-255-255-255--845918557e rui-radio-demo__u-padding-left-0-75rem--0e17f2bd90 rui-radio-demo__u-padding-top-0-75rem--1b2d54a3fd rui-radio-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-radio-demo__u-rui-border-opacity-1--262753c115 rui-radio-demo__u-rui-border-opacity-1--30fb741464 rui-radio-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1"
          />
        ))}
      </div>
      <p className="rui-radio-demo__u-margin-top-0-75rem--eccd13ef4f rui-radio-demo__u-border-radius-0-75rem--a217b4eaa9 rui-radio-demo__u-border-width-1px--ca6bcd4b6f rui-radio-demo__u-border-style-dashed--a29b7a649c rui-radio-demo__u-rui-border-opacity-1--52f4da2ca5 rui-radio-demo__u-rui-bg-opacity-1--f97e9d36d1 rui-radio-demo__u-padding-left-0-75rem--0e17f2bd90 rui-radio-demo__u-padding-top-0-5rem--03b4dd7f17 rui-radio-demo__u-font-size-0-75rem--359090c2d5 rui-radio-demo__u-rui-text-opacity-1--2d6fbf48fa rui-radio-demo__u-rui-border-opacity-1--2072c87505 rui-radio-demo__u-background-color-rgb-2-6-23-0-5--719d9a74b1 rui-radio-demo__u-rui-text-opacity-1--ca11017ff7">
        Current mode:{" "}
        <span className="rui-radio-demo__u-font-weight-600--e83a7042bc rui-radio-demo__u-rui-text-opacity-1--f5f136c41d rui-radio-demo__u-rui-text-opacity-1--e1d41ccd69">{density}</span>
      </p>
    </DemoExample>
  );
}

function DigestPreferences() {
  const [cadence, setCadence] = useState<"daily" | "weekly" | "monthly">("weekly");

  return (
    <DemoExample
      title="Digest"
      className="rui-radio-demo__u-style--6ed543e2fb rui-radio-demo__u-border-radius-1-5rem--ea189a088a rui-radio-demo__u-border-width-1px--ca6bcd4b6f rui-radio-demo__u-rui-border-opacity-1--52f4da2ca5 rui-radio-demo__u-background-color-rgb-255-255-255--6c21de570d rui-radio-demo__u-padding-1rem--8e63407b5c rui-radio-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-radio-demo__u-rui-border-opacity-1--2072c87505 rui-radio-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
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

      <div className="rui-radio-demo__u-border-radius-1rem--68f2db624d rui-radio-demo__u-border-width-1px--ca6bcd4b6f rui-radio-demo__u-border-style-dashed--a29b7a649c rui-radio-demo__u-rui-border-opacity-1--52f4da2ca5 rui-radio-demo__u-background-color-rgb-248-250-252--2579b25ad0 rui-radio-demo__u-padding-left-0-75rem--0e17f2bd90 rui-radio-demo__u-padding-top-0-5rem--03b4dd7f17 rui-radio-demo__u-font-size-0-75rem--359090c2d5 rui-radio-demo__u-rui-text-opacity-1--2d6fbf48fa rui-radio-demo__u-rui-border-opacity-1--2072c87505 rui-radio-demo__u-background-color-rgb-2-6-23-0-6--ddf84eea43 rui-radio-demo__u-rui-text-opacity-1--ca11017ff7">
        <p className="rui-radio-demo__u-font-weight-600--e83a7042bc rui-radio-demo__u-rui-text-opacity-1--f5f136c41d rui-radio-demo__u-rui-text-opacity-1--e1d41ccd69">
          Delivery:{" "}
          {cadence === "daily"
            ? "Every morning"
            : cadence === "weekly"
              ? "Mondays"
              : "First Monday"}
        </p>
        <p className="rui-radio-demo__u-font-size-11px--d058ca6de6 rui-radio-demo__u-rui-text-opacity-1--30426eb75c rui-radio-demo__u-rui-text-opacity-1--cc0274aad9">Pause reasons (read only):</p>
        <div className="rui-radio-demo__u-margin-top-0-25rem--b6b02c0ebe rui-radio-demo__u-style--da7c36cd88">
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
    <div className="rui-radio-demo__u-style--3e7ce58d64">
      <PlanSelector />
      <div className="rui-radio-demo__u-display-grid--f3c543ad5f rui-radio-demo__u-gap-1rem--0c3bc98565 rui-radio-demo__u-grid-template-columns-1-1fr-0-9f--18b30daf10">
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
