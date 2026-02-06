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
        <DatePicker label="Start date" value={start} onChange={setStart} type="date" dateMode="local" />
        <DatePicker label="Deadline" value={deadline} onChange={setDeadline} type="date" dateMode="local" />
        <DatePicker label="Daily checkpoint" value={daily} onChange={setDaily} type="time" />
      </div>
      <div className="rui-date-picker-demo__summary">
        <p className="rui-date-picker-demo__summary-title">Summary</p>
        <p>
          Starts {start}, ends {deadline}. Standups at {daily} (local time).
        </p>
      </div>
    </DemoExample>
  );
}

function UtcOperations() {
  const [windowStart, setWindowStart] = useState("2026-02-10");
  const [windowEnd, setWindowEnd] = useState("2026-02-12");
  const [handoff, setHandoff] = useState("00:00");

  return (
    <DemoExample
      title="Global Ops (UTC)"
      badge="UTC"
      className="rui-date-picker-demo__card"
    >
      <div className="rui-date-picker-demo__intro">
        <div>
          <p className="rui-date-picker-demo__intro-text">
            All dates are anchored to UTC for cross-region scheduling.
          </p>
        </div>
      </div>
      <div className="rui-date-picker-demo__fields">
        <DatePicker
          label="Window start"
          value={windowStart}
          onChange={setWindowStart}
          type="date"
          dateMode="utc"
        />
        <DatePicker
          label="Window end"
          value={windowEnd}
          onChange={setWindowEnd}
          type="date"
          dateMode="utc"
        />
        <DatePicker label="Handoff" value={handoff} onChange={setHandoff} type="time" />
      </div>
      <div className="rui-date-picker-demo__summary">
        <p className="rui-date-picker-demo__summary-title">Summary</p>
        <p>
          Window {windowStart} to {windowEnd}. Handoff at {handoff} UTC.
        </p>
      </div>
    </DemoExample>
  );
}

function DatePickerPreview() {
  return (
    <div className="rui-date-picker-demo__preview">
      <Scheduling />
      <UtcOperations />
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
