import * as React from "react";
import { twMerge } from "tailwind-merge";

type CommonProps = {
  label?: string;
  description?: string;
  className?: string;
};

export type ProgressProps = CommonProps & {
  value: number;
  max?: number;
  showValue?: boolean;
};

export function Progress({
  label,
  description,
  value,
  max = 100,
  showValue = true,
  className,
}: ProgressProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const percent = max === 0 ? 0 : Math.round((clamped / max) * 100);

  return (
    <div className={twMerge("space-y-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-zinc-400">
            {label}
          </p>
          {showValue ? (
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
              {percent}%
            </span>
          ) : null}
        </div>
      ) : null}
      {description ? (
        <p className="text-[11px] text-slate-500 dark:text-zinc-400">{description}</p>
      ) : null}
      <div className="relative h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-white shadow-inner ring-1 ring-slate-100/80 dark:border-zinc-700 dark:bg-zinc-900/80 dark:ring-zinc-800/70">
        <progress
          value={clamped}
          max={max}
          className="absolute inset-0 h-full w-full appearance-none"
          aria-label={label}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 shadow-[0_0_0_1px_rgba(15,23,42,0.2)] transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export type MeterProps = CommonProps & {
  value: number;
  min?: number;
  max?: number;
  thresholds?: { value: number; color: string }[];
};

export function Meter({
  label,
  description,
  value,
  min = 0,
  max = 100,
  thresholds,
  className,
}: MeterProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100;
  const activeColor = thresholds
    ? thresholds.reduce(
        (acc, t) => (clamped >= t.value ? t.color : acc),
        thresholds[0]?.color ?? "linear-gradient(90deg, #22c55e, #0ea5e9)"
      )
    : "linear-gradient(90deg, #22c55e, #0ea5e9)";

  return (
    <div className={twMerge("space-y-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-zinc-400">
            {label}
          </p>
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300">{clamped}</span>
        </div>
      ) : null}
      {description ? (
        <p className="text-[11px] text-slate-500 dark:text-zinc-400">{description}</p>
      ) : null}
      <div className="relative h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-white shadow-inner ring-1 ring-slate-100/80 dark:border-zinc-700 dark:bg-zinc-900/80 dark:ring-zinc-800/70">
        <meter
          value={clamped}
          min={min}
          max={max}
          className="absolute inset-0 h-full w-full appearance-none"
          aria-label={label}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full shadow-[0_0_0_1px_rgba(15,23,42,0.2)] transition-[width]"
          style={{ width: `${percent}%`, background: activeColor }}
        />
      </div>
    </div>
  );
}
