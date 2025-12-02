import * as React from "react";
import { twMerge } from "tailwind-merge";

export type NumberInputProps = {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  step?: number;
  suffix?: React.ReactNode;
  min?: number;
  max?: number;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { label, description, error, className, disabled, value, defaultValue = 0, onChange, step = 1, suffix, min, max },
  ref
) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = typeof value === "number";
  const resolved = isControlled ? value ?? 0 : internal;

  const update = (next: number) => {
    const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, next));
    if (!isControlled) setInternal(clamped);
    onChange?.(clamped);
  };

  return (
    <div className="space-y-1.5">
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">{label}</p>
      ) : null}
      <div
        className={twMerge(
          "flex items-center gap-3 rounded-2xl border border-slate-300 bg-white/80 px-3 py-2 shadow-sm transition focus-within:border-slate-400 focus-within:shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:focus-within:border-slate-500",
          disabled && "opacity-60",
          error && "border-rose-300 focus-within:border-rose-400 focus-within:shadow-[0_0_0_1px_rgba(248,113,113,0.35)] dark:border-rose-500/60"
        )}
      >
        <div className="flex flex-col gap-1">
          <button
            type="button"
            aria-label="Increase"
            onClick={() => update(resolved + step)}
            className="grid size-7 place-items-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            disabled={disabled}
          >
            +
          </button>
          <button
            type="button"
            aria-label="Decrease"
            onClick={() => update(resolved - step)}
            className="grid size-7 place-items-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            disabled={disabled}
          >
            -
          </button>
        </div>
        <input
          ref={ref}
          type="number"
          value={resolved}
          onChange={(e) => update(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={twMerge(
            "flex-1 border-none bg-transparent text-2xl font-semibold tabular-nums text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            className
          )}
        />
        {suffix ? (
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-300">
            {suffix}
          </span>
        ) : null}
      </div>
      {description ? <p className="text-xs text-slate-500 dark:text-zinc-400">{description}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-500 dark:text-rose-400">{error}</p> : null}
    </div>
  );
});
