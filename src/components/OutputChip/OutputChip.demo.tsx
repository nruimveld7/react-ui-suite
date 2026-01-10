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
    <DemoExample
      title="Latency"
      className="rui-output-chip-demo__u-border-radius-1-5rem--ea189a088a rui-output-chip-demo__u-border-width-1px--ca6bcd4b6f rui-output-chip-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-output-chip-demo__u-background-color-rgb-255-255-255--6c21de570d rui-output-chip-demo__u-padding-1rem--8e63407b5c rui-output-chip-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-output-chip-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-output-chip-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div
        className="rui-output-chip-demo__u-display-flex--60fbb77139 rui-output-chip-demo__u-align-items-center--3960ffc248 rui-output-chip-demo__u-justify-content-space-between--8ef2268efb"
        style={{ margin: "0px", justifyContent: "flex-end" }}
      >
        <OutputChip tone={status} label="p95">
          {latency}ms
        </OutputChip>
      </div>
      <p className="rui-output-chip-demo__u-margin-top-0-5rem--50d0d216a2 rui-output-chip-demo__u-font-size-0-875rem--fc7473ca09 rui-output-chip-demo__u-color-rgb-71-85-105-1--2d6fbf48fa rui-output-chip-demo__u-color-rgb-148-163-184-1--cc0274aad9">
        Output element doubled as a status chip.
      </p>
      <div className="rui-output-chip-demo__u-margin-top-0-75rem--eccd13ef4f rui-output-chip-demo__u-display-grid--f3c543ad5f rui-output-chip-demo__u-grid-template-columns-repeat-3-m--be2e831be5 rui-output-chip-demo__u-gap-0-5rem--77a2a20e90 rui-output-chip-demo__u-font-size-11px--d058ca6de6 rui-output-chip-demo__u-text-transform-uppercase--117ec720ea rui-output-chip-demo__u-letter-spacing-0-2em--2da1a7016e rui-output-chip-demo__u-color-rgb-148-163-184-1--8d44cef396 rui-output-chip-demo__u-color-rgb-100-116-139-1--15b16954d1">
        <OutputChip tone="success">Fast</OutputChip>
        <OutputChip tone="warning">Average</OutputChip>
        <OutputChip tone="danger">Slow</OutputChip>
      </div>
    </DemoExample>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "output-chip",
  name: "Output Chip",
  description: "HTMLOutput styled as a pill for computed values and statuses.",
  tags: ["feedback", "status"],
  Preview: MetricCard,
  sourcePath: "src/components/OutputChip/OutputChip.tsx",
};

export default entry;
export { OutputChip };
