import { useEffect, useState } from "react";
import { OutputChip } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./OutputChip.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function MetricCard() {
  const [latency, setLatency] = useState(122);
  const [status, setStatus] = useState<"neutral" | "success" | "warning" | "danger">("success");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLatency((prev) => {
        const next = Math.max(40, Math.min(420, prev + Math.round((Math.random() - 0.5) * 60)));
        if (next < 200) setStatus("success");
        else if (next < 320) setStatus("warning");
        else setStatus("danger");
        return next;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <DemoExample title="Latency" className="output-chip-demo-card">
      <div
        className="output-chip-demo-metric-row"
      >
        <OutputChip tone={status} label="p95">
          {latency}ms
        </OutputChip>
      </div>
      <p className="output-chip-demo-metric-note">
        Output element doubled as a status chip.
      </p>
      <div className="output-chip-demo-tone-grid">
        <OutputChip tone="success">Fast</OutputChip>
        <OutputChip tone="warning">Average</OutputChip>
        <OutputChip tone="danger">Slow</OutputChip>
      </div>
    </DemoExample>
  );
}

function UsageSummary() {
  return (
    <DemoExample
      title="Usage summary"
      className="output-chip-demo-card"
    >
      <div className="output-chip-demo-row">
        <span className="output-chip-demo-label">Monthly volume</span>
        <OutputChip tone="neutral" label="tokens">
          12.4k
        </OutputChip>
      </div>
      <p className="output-chip-demo-note">
        OutputChip uses an HTML output element for computed values.
      </p>
    </DemoExample>
  );
}

function OutputChipPreview() {
  return (
    <div className="output-chip-demo-grid">
      <MetricCard />
      <UsageSummary />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "output-chip",
  name: "Output Chip",
  description: "HTMLOutput styled as a pill for computed values and statuses.",
  tags: ["feedback", "status"],
  Preview: OutputChipPreview,
  sourcePath: "src/components/OutputChip/OutputChip.tsx",
};

export default entry;
export { OutputChip };
