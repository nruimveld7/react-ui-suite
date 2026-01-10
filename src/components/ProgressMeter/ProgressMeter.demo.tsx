import { useEffect, useMemo, useState } from "react";
import { Button, Meter, Progress } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./ProgressMeter.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function UploadCard() {
  const [progress, setProgress] = useState(24);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 12 : prev + Math.round(Math.random() * 12)));
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <DemoExample
      title="Uploads"
      className="rui-progress-meter-demo__u-border-radius-1-5rem--ea189a088a rui-progress-meter-demo__u-border-width-1px--ca6bcd4b6f rui-progress-meter-demo__u-rui-border-opacity-1--52f4da2ca5 rui-progress-meter-demo__u-background-color-rgb-255-255-255--6c21de570d rui-progress-meter-demo__u-padding-1rem--8e63407b5c rui-progress-meter-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-progress-meter-demo__u-rui-border-opacity-1--2072c87505 rui-progress-meter-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-progress-meter-demo__u-display-flex--60fbb77139 rui-progress-meter-demo__u-align-items-center--3960ffc248 rui-progress-meter-demo__u-justify-content-space-between--8ef2268efb">
        <div>
          <p className="rui-progress-meter-demo__u-font-size-0-875rem--fc7473ca09 rui-progress-meter-demo__u-rui-text-opacity-1--2d6fbf48fa rui-progress-meter-demo__u-rui-text-opacity-1--cc0274aad9">Syncing brand assets</p>
        </div>
        <span className="rui-progress-meter-demo__u-border-radius-9999px--ac204c1088 rui-progress-meter-demo__u-rui-bg-opacity-1--15821c2ff2 rui-progress-meter-demo__u-padding-left-0-75rem--0e17f2bd90 rui-progress-meter-demo__u-padding-top-0-25rem--660d2effb8 rui-progress-meter-demo__u-font-size-11px--d058ca6de6 rui-progress-meter-demo__u-font-weight-600--e83a7042bc rui-progress-meter-demo__u-text-transform-uppercase--117ec720ea rui-progress-meter-demo__u-letter-spacing-0-025em--8baf13a3e9 rui-progress-meter-demo__u-rui-text-opacity-1--72a4c7cdee rui-progress-meter-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-progress-meter-demo__u-rui-bg-opacity-1--e598448d8a rui-progress-meter-demo__u-rui-text-opacity-1--ea4519095b">
          {progress >= 100 ? "Complete" : "Running"}
        </span>
      </div>
      <div className="rui-progress-meter-demo__u-style--6f7e013d64">
        <Progress
          value={progress}
          label="Progress"
          description="We keep your browser responsive."
        />
        <div className="rui-progress-meter-demo__u-display-grid--f3c543ad5f rui-progress-meter-demo__u-grid-template-columns-repeat-2-m--8e75e3db48 rui-progress-meter-demo__u-gap-0-5rem--77a2a20e90 rui-progress-meter-demo__u-font-size-0-75rem--359090c2d5 rui-progress-meter-demo__u-rui-text-opacity-1--2d6fbf48fa rui-progress-meter-demo__u-rui-text-opacity-1--cc0274aad9">
          <span>Remaining files</span>
          <span className="rui-progress-meter-demo__u-text-align-right--308fc069e4 rui-progress-meter-demo__u-font-weight-600--e83a7042bc">
            {Math.max(0, 10 - Math.round(progress / 10))}
          </span>
          <span>Bandwidth</span>
          <span className="rui-progress-meter-demo__u-text-align-right--308fc069e4 rui-progress-meter-demo__u-font-weight-600--e83a7042bc">Fast</span>
        </div>
      </div>
    </DemoExample>
  );
}

function HealthMeter() {
  const thresholds = useMemo(
    () => [
      { value: 0, color: "#22c55e" },
      { value: 50, color: "#f59e0b" },
      { value: 80, color: "#ef4444" },
    ],
    []
  );

  const [score, setScore] = useState(42);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setScore((prev) => {
        const delta = Math.round((Math.random() - 0.4) * 18);
        return Math.max(0, Math.min(100, prev + delta));
      });
    }, 1500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <DemoExample
      title="System health"
      className="rui-progress-meter-demo__system-health rui-progress-meter-demo__u-display-grid--f3c543ad5f rui-progress-meter-demo__u-gap-0-75rem--1004c0c395 rui-progress-meter-demo__u-border-radius-1-5rem--ea189a088a rui-progress-meter-demo__u-border-width-1px--ca6bcd4b6f rui-progress-meter-demo__u-rui-border-opacity-1--52f4da2ca5 rui-progress-meter-demo__u-background-color-rgb-255-255-255--6c21de570d rui-progress-meter-demo__u-padding-1rem--8e63407b5c rui-progress-meter-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-progress-meter-demo__u-grid-template-columns-1-1fr-0-9f--5e2f7a1008 rui-progress-meter-demo__u-rui-border-opacity-1--2072c87505 rui-progress-meter-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-progress-meter-demo__health-panel">
        <p className="rui-progress-meter-demo__health-intro rui-progress-meter-demo__u-font-size-0-875rem--fc7473ca09 rui-progress-meter-demo__u-rui-text-opacity-1--2d6fbf48fa rui-progress-meter-demo__u-rui-text-opacity-1--cc0274aad9">
          Live risk score with thresholds.
        </p>
        <div className="rui-progress-meter-demo__u-style--6ed543e2fb">
          <Meter
            value={score}
            label="Signal"
            description="Composite score from uptime, latency, and error rate."
            thresholds={thresholds}
          />
          <div className="rui-progress-meter-demo__u-display-flex--60fbb77139 rui-progress-meter-demo__u-align-items-center--3960ffc248 rui-progress-meter-demo__u-gap-0-5rem--77a2a20e90 rui-progress-meter-demo__u-font-size-0-75rem--359090c2d5 rui-progress-meter-demo__u-rui-text-opacity-1--30426eb75c rui-progress-meter-demo__u-rui-text-opacity-1--cc0274aad9">
            {thresholds.map((t) => (
              <span
                key={t.value}
                className="rui-progress-meter-demo__u-display-flex--60fbb77139 rui-progress-meter-demo__u-align-items-center--3960ffc248 rui-progress-meter-demo__u-gap-0-25rem--44ee8ba0a4 rui-progress-meter-demo__u-border-radius-9999px--ac204c1088 rui-progress-meter-demo__u-border-width-1px--ca6bcd4b6f rui-progress-meter-demo__u-rui-border-opacity-1--52f4da2ca5 rui-progress-meter-demo__u-padding-left-0-5rem--d5eab218aa rui-progress-meter-demo__u-padding-top-0-25rem--660d2effb8 rui-progress-meter-demo__u-rui-border-opacity-1--30fb741464"
              >
                <span
                  className="rui-progress-meter-demo__u-display-block--0214b4b355 rui-progress-meter-demo__u-width-0-5rem--91aa108e8e rui-progress-meter-demo__u-border-radius-9999px--ac204c1088"
                  style={{ background: t.color }}
                  aria-hidden="true"
                />
                <span>{t.value}+</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="rui-progress-meter-demo__u-display-flex--60fbb77139 rui-progress-meter-demo__u-flex-direction-column--8dddea0773 rui-progress-meter-demo__u-justify-content-center--86843cf1e2 rui-progress-meter-demo__u-gap-0-75rem--1004c0c395 rui-progress-meter-demo__u-border-radius-1rem--68f2db624d rui-progress-meter-demo__u-border-width-1px--ca6bcd4b6f rui-progress-meter-demo__u-border-style-dashed--a29b7a649c rui-progress-meter-demo__u-rui-border-opacity-1--52f4da2ca5 rui-progress-meter-demo__u-background-color-rgb-248-250-252--2579b25ad0 rui-progress-meter-demo__u-padding-0-75rem--eb6e8b881a rui-progress-meter-demo__u-font-size-0-75rem--359090c2d5 rui-progress-meter-demo__u-rui-text-opacity-1--2d6fbf48fa rui-progress-meter-demo__u-rui-border-opacity-1--2072c87505 rui-progress-meter-demo__u-background-color-rgb-2-6-23-0-6--ddf84eea43 rui-progress-meter-demo__u-rui-text-opacity-1--ca11017ff7">
        <p className="rui-progress-meter-demo__anomaly-title rui-progress-meter-demo__u-font-size-0-875rem--fc7473ca09 rui-progress-meter-demo__u-font-weight-600--e83a7042bc rui-progress-meter-demo__u-rui-text-opacity-1--c69797100a rui-progress-meter-demo__u-rui-text-opacity-1--e1d41ccd69">
          Anomaly window
        </p>
        <p className="rui-progress-meter-demo__anomaly-description">
          We rotate through thresholds to help readers understand the meter ranges and colors.
        </p>
        <Button onClick={() => setScore((prev) => Math.min(100, prev + 12))}>
          Boost Signal
        </Button>
      </div>
    </DemoExample>
  );
}

function ProgressMeterPreview() {
  return (
    <div className="rui-progress-meter-demo__u-display-grid--f3c543ad5f rui-progress-meter-demo__u-gap-1rem--0c3bc98565">
      <UploadCard />
      <HealthMeter />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "progress-meter",
  name: "Progress & Meter",
  description: "Styled progress and meter bars with gradients, labels, and live updates.",
  tags: ["feedback", "status"],
  Preview: ProgressMeterPreview,
  sourcePath: "src/components/ProgressMeter/ProgressMeter.tsx",
};

export default entry;
export { Progress, Meter };
