import { useMemo, useState } from "react";
import { Radio } from "react-ui-suite";
import type { RadioProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

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
    price: "$12/mo"
  },
  {
    id: "pro",
    name: "Pro",
    description: "Unlimited projects, team spaces, and workflow automations.",
    price: "$24/mo",
    badge: "Popular"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Security reviews, custom terms, and premium onboarding.",
    price: "Contact sales"
  }
];

function PlanSelector() {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption["id"]>("pro");
  const activePlan = useMemo(
    () => planOptions.find((plan) => plan.id === selectedPlan),
    [selectedPlan]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Billing
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Pick a workspace plan.</p>
        </div>
        {activePlan ? (
          <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-sm dark:bg-white/90 dark:text-slate-900">
            {activePlan.name}
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {planOptions.map((plan) => (
          <Radio
            key={plan.id}
            name="pricing"
            label={plan.name}
            description={plan.description}
            checked={selectedPlan === plan.id}
            onChange={() => setSelectedPlan(plan.id)}
            extra={
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {plan.price}
                </span>
                {plan.badge ? (
                  <span className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.25em] text-white shadow-sm dark:bg-white dark:text-slate-900">
                    {plan.badge}
                  </span>
                ) : null}
              </span>
            }
          />
        ))}
      </div>
    </div>
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
  { id: "airy", title: "Airy", copy: "Roomy cards and generous whitespace." }
];

function LayoutPreference() {
  const [density, setDensity] = useState<LayoutOption["id"]>("cozy");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
        Layout density
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {layoutOptions.map((option) => (
          <Radio
            key={option.id}
            name="layout"
            label={option.title}
            description={option.copy}
            checked={density === option.id}
            onChange={() => setDensity(option.id)}
            className="h-full w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 shadow-sm hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60"
          />
        ))}
      </div>
      <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300">
        Current mode: <span className="font-semibold text-slate-900 dark:text-slate-100">{density}</span>
      </p>
    </div>
  );
}

function DigestPreferences() {
  const [cadence, setCadence] = useState<"daily" | "weekly" | "monthly">("weekly");

  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
        Digest
      </p>
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

      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          Delivery: {cadence === "daily" ? "Every morning" : cadence === "weekly" ? "Mondays" : "First Monday"}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Pause reasons (read only):
        </p>
        <div className="mt-1 space-y-1">
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
    </div>
  );
}

function RadioPreview() {
  return (
    <div className="space-y-4">
      <PlanSelector />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
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
  sourcePath: "src/components/Radio/Radio.tsx"
};

export default entry;
export { Radio };
export type { RadioProps };
