import { useMemo, useState } from "react";
import { NumberInput, Slider } from "react-ui-suite";
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

function ScaleNumberInputDemo() {
  const [scale, setScale] = useState(1);
  const [value, setValue] = useState(6);

  return (
    <DemoExample
      title="Scale"
      className="rui-number-input-demo__example"
    >
      <div className="rui-number-input-demo__scale">
        <div className="rui-number-input-demo__scale-control">
          <Slider
            label="Scale"
            min={0.25}
            max={2}
            step={0.05}
            value={scale}
            onChange={setScale}
            formatValue={(val) => `${val.toFixed(2)}x`}
          />
        </div>
        <div className="rui-number-input-demo__scale-preview">
          <NumberInput
            label="Seats"
            value={value}
            onChange={setValue}
            min={0}
            step={1}
            scale={scale}
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
      <ScaleNumberInputDemo />
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
