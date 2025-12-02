import { useEffect, useState } from "react";
import { OutputChip } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

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
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Latency
        </p>
        <OutputChip tone={status} label="p95">
          {latency}ms
        </OutputChip>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Output element doubled as a status chip.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        <OutputChip tone="success">Fast</OutputChip>
        <OutputChip tone="warning">Average</OutputChip>
        <OutputChip tone="danger">Slow</OutputChip>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "output-chip",
  name: "Output Chip",
  description: "HTMLOutput styled as a pill for computed values and statuses.",
  tags: ["feedback", "status"],
  Preview: MetricCard,
  sourcePath: "src/components/OutputChip/OutputChip.tsx"
};

export default entry;
export { OutputChip };
