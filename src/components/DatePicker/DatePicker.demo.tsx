import { useState } from "react";
import { DatePicker } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./DatePicker.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function Scheduling() {
  const [start, setStart] = useState("2025-12-05");
  const [deadline, setDeadline] = useState("2026-01-15");
  const [daily, setDaily] = useState("09:30");

  return (
    <DemoExample
      title="Scheduling"
      badge="Native-free"
      className="rui-date-picker-demo__card"
    >
      <div className="rui-date-picker-demo__intro">
        <div>
          <p className="rui-date-picker-demo__intro-text">
            Custom date pickers with select-based time.
          </p>
        </div>
      </div>
      <div className="rui-date-picker-demo__fields">
        <DatePicker label="Start date" value={start} onChange={setStart} type="date" />
        <DatePicker label="Deadline" value={deadline} onChange={setDeadline} type="date" />
        <DatePicker label="Daily checkpoint" value={daily} onChange={setDaily} type="time" />
      </div>
      <div className="rui-date-picker-demo__summary">
        <p className="rui-date-picker-demo__summary-title">Summary</p>
        <p>
          Starts {start}, ends {deadline}. Standups at {daily}.
        </p>
      </div>
    </DemoExample>
  );
}

function DatePickerPreview() {
  return (
    <div className="rui-date-picker-demo__preview">
      <Scheduling />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "date-picker",
  name: "Date Picker",
  description: "Custom date/time picker popovers with month navigation and quick time slots.",
  tags: ["input", "form", "date"],
  Preview: DatePickerPreview,
  sourcePath: "src/components/DatePicker/DatePicker.tsx",
};

export default entry;
export { DatePicker };
