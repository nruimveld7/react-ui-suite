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
      className="rui-date-picker-demo__u-border-radius-1-5rem--ea189a088a rui-date-picker-demo__u-border-width-1px--ca6bcd4b6f rui-date-picker-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-date-picker-demo__u-background-color-rgb-255-255-255--6c21de570d rui-date-picker-demo__u-padding-1rem--8e63407b5c rui-date-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-date-picker-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-date-picker-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-date-picker-demo__u-display-flex--60fbb77139 rui-date-picker-demo__u-align-items-center--3960ffc248 rui-date-picker-demo__u-justify-content-space-between--8ef2268efb">
        <div>
          <p className="rui-date-picker-demo__u-font-size-0-875rem--fc7473ca09 rui-date-picker-demo__u-color-rgb-71-85-105-1--2d6fbf48fa rui-date-picker-demo__u-color-rgb-148-163-184-1--cc0274aad9">
            Custom date pickers with select-based time.
          </p>
        </div>
        <span className="rui-date-picker-demo__u-border-radius-9999px--ac204c1088 rui-date-picker-demo__u-background-color-rgb-15-23-42-1--15821c2ff2 rui-date-picker-demo__u-padding-left-0-75rem--0e17f2bd90 rui-date-picker-demo__u-padding-top-0-25rem--660d2effb8 rui-date-picker-demo__u-font-size-11px--d058ca6de6 rui-date-picker-demo__u-font-weight-600--e83a7042bc rui-date-picker-demo__u-text-transform-uppercase--117ec720ea rui-date-picker-demo__u-letter-spacing-0-025em--8baf13a3e9 rui-date-picker-demo__u-color-rgb-255-255-255-1--72a4c7cdee rui-date-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-date-picker-demo__u-background-color-rgb-255-255-255--e598448d8a rui-date-picker-demo__u-color-rgb-15-23-42-1--ea4519095b">
          Native-free
        </span>
      </div>
      <div className="rui-date-picker-demo__u-margin-top-0-75rem--eccd13ef4f rui-date-picker-demo__u-display-grid--f3c543ad5f rui-date-picker-demo__u-gap-0-75rem--1004c0c395 rui-date-picker-demo__u-grid-template-columns-repeat-3-m--9a638cfe82">
        <DatePicker label="Start date" value={start} onChange={setStart} type="date" />
        <DatePicker label="Deadline" value={deadline} onChange={setDeadline} type="date" />
        <DatePicker label="Daily checkpoint" value={daily} onChange={setDaily} type="time" />
      </div>
      <div className="rui-date-picker-demo__u-margin-top-0-75rem--eccd13ef4f rui-date-picker-demo__u-border-radius-1rem--68f2db624d rui-date-picker-demo__u-border-width-1px--ca6bcd4b6f rui-date-picker-demo__u-border-style-dashed--a29b7a649c rui-date-picker-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-date-picker-demo__u-background-color-rgb-248-250-252--2579b25ad0 rui-date-picker-demo__u-padding-left-0-75rem--0e17f2bd90 rui-date-picker-demo__u-padding-top-0-5rem--03b4dd7f17 rui-date-picker-demo__u-font-size-0-75rem--359090c2d5 rui-date-picker-demo__u-color-rgb-71-85-105-1--2d6fbf48fa rui-date-picker-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-date-picker-demo__u-background-color-rgb-2-6-23-0-6--ddf84eea43 rui-date-picker-demo__u-color-rgb-203-213-225-1--ca11017ff7">
        <p className="rui-date-picker-demo__u-font-weight-600--e83a7042bc rui-date-picker-demo__u-color-rgb-15-23-42-1--f5f136c41d rui-date-picker-demo__u-color-rgb-241-245-249-1--e1d41ccd69">Summary</p>
        <p>
          Starts {start}, ends {deadline}. Standups at {daily}.
        </p>
      </div>
    </DemoExample>
  );
}

function DatePickerPreview() {
  return (
    <div className="rui-date-picker-demo__u-display-grid--f3c543ad5f rui-date-picker-demo__u-gap-1rem--0c3bc98565">
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
