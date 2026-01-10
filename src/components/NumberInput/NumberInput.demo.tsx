import { useMemo, useState } from "react";
import { NumberInput } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./NumberInput.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function BudgetPlanner() {
  const [budget, setBudget] = useState(4500);
  const [headcount, setHeadcount] = useState(8);
  const burnRate = useMemo(
    () => (headcount ? Math.round(budget / headcount) : 0),
    [budget, headcount]
  );

  return (
    <DemoExample
      title="Budget planner"
      className="rui-number-input-demo__example"
    >
      <div className="rui-number-input-demo__budget-planner">
        <div className="rui-number-input-demo__budget-planner__inputs">
          <NumberInput
            label="Monthly budget"
            description="Covers vendors, automation, and credits."
            value={budget}
            onChange={setBudget}
            step={250}
            suffix="USD"
          />
          <NumberInput
            label="Active seats"
            value={headcount}
            onChange={setHeadcount}
            step={1}
            suffix="Seats"
          />
        </div>
        <div className="rui-number-input-demo__budget-planner__forecast">
          <p className="rui-number-input-demo__forecast-title">Forecast</p>
          <p className="rui-number-input-demo__forecast-value">{burnRate} USD</p>
          <p className="rui-number-input-demo__forecast-desc">Per seat burn rate.</p>
        </div>
      </div>
    </DemoExample>
  );
}

function CompactNumberExamples() {
  const [tickets, setTickets] = useState(12);
  const [hours, setHours] = useState(32);
  return (
    <DemoExample
      title="Compact"
      className="rui-number-input-demo__example"
    >
      <div className="rui-number-input-demo__compact">
        <div className="rui-number-input-demo__compact-item">
          <NumberInput
            label="Tickets per sprint"
            value={tickets}
            onChange={setTickets}
            min={0}
            step={1}
          />
        </div>
        <div className="rui-number-input-demo__compact-item">
          <NumberInput
            label="Hours allocated"
            value={hours}
            onChange={setHours}
            min={0}
            step={4}
            suffix="h"
          />
        </div>
      </div>
    </DemoExample>
  );
}

function NumberInputPreview() {
  return (
    <div className="rui-number-input-demo__u-display-grid--f3c543ad5f rui-number-input-demo__u-gap-1rem--0c3bc98565">
      <BudgetPlanner />
      <CompactNumberExamples />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "number-input",
  name: "Number Input",
  description: "Stepper-based number input with Tailwind shell, suffix, and custom steps.",
  tags: ["input", "form", "number"],
  Preview: NumberInputPreview,
  sourcePath: "src/components/NumberInput/NumberInput.tsx",
};

export default entry;
export { NumberInput };
