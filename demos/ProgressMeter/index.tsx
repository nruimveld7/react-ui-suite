import { useEffect, useMemo, useState } from "react";
import { Meter, Progress } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

function UploadCard() {
  const [progress, setProgress] = useState(24);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 12 : prev + Math.round(Math.random() * 12)));
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Uploads
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Syncing brand assets</p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-white dark:text-slate-900">
          {progress >= 100 ? "Complete" : "Running"}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        <Progress
          value={progress}
          label="Progress"
          description="We keep your browser responsive."
        />
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>Remaining files</span>
          <span className="text-right font-semibold">
            {Math.max(0, 10 - Math.round(progress / 10))}
          </span>
          <span>Bandwidth</span>
          <span className="text-right font-semibold">Fast</span>
        </div>
      </div>
    </div>
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
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm md:grid-cols-[1.1fr_0.9fr] dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          System health
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Live risk score with thresholds.
        </p>
        <div className="mt-3 space-y-3">
          <Meter
            value={score}
            label="Signal"
            description="Composite score from uptime, latency, and error rate."
            thresholds={thresholds}
          />
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {thresholds.map((t) => (
              <span
                key={t.value}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 dark:border-slate-700"
              >
                <span
                  className="block size-2 rounded-full"
                  style={{ background: t.color }}
                  aria-hidden="true"
                />
                <span>{t.value}+</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Anomaly window</p>
        <p>We rotate through thresholds to help readers understand the meter ranges and colors.</p>
        <button
          type="button"
          onClick={() => setScore((prev) => Math.min(100, prev + 12))}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          Boost Signal
        </button>
      </div>
    </div>
  );
}

function ProgressMeterPreview() {
  return (
    <div className="grid gap-4">
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
