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
      className="progress-meter-demo__card progress-meter-demo__card--uploads"
    >
      <div className="progress-meter-demo__header">
        <div>
        <p className="progress-meter-demo__title rui-text-wrap">Syncing brand assets</p>
        </div>
        <span className="progress-meter-demo__status">
          {progress >= 100 ? "Complete" : "Running"}
        </span>
      </div>
      <div className="progress-meter-demo__stack">
        <Progress
          value={progress}
          label="Progress"
          description="We keep your browser responsive."
        />
        <div className="progress-meter-demo__stats rui-text-wrap">
          <span>Remaining files</span>
          <span className="progress-meter-demo__stat-value">
            {Math.max(0, 10 - Math.round(progress / 10))}
          </span>
          <span>Bandwidth</span>
          <span className="progress-meter-demo__stat-value">Fast</span>
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
      className="progress-meter-demo__system-health progress-meter-demo__card progress-meter-demo__card--system"
    >
      <div className="progress-meter-demo__health-panel">
        <p className="progress-meter-demo__health-intro rui-text-wrap">
          Live risk score with thresholds.
        </p>
        <div className="progress-meter-demo__health-stack">
          <Meter
            value={score}
            label="Signal"
            description="Composite score from uptime, latency, and error rate."
            thresholds={thresholds}
          />
          <div className="progress-meter-demo__thresholds rui-text-wrap">
            {thresholds.map((t) => (
              <span
                key={t.value}
                className="progress-meter-demo__threshold"
              >
                <span
                  className="progress-meter-demo__threshold-dot"
                  style={{ background: t.color }}
                  aria-hidden="true"
                />
                <span>{t.value}+</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="progress-meter-demo__anomaly">
        <p className="progress-meter-demo__anomaly-title">
          Anomaly window
        </p>
        <p className="progress-meter-demo__anomaly-description rui-text-wrap">
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
    <div className="progress-meter-demo__grid">
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
