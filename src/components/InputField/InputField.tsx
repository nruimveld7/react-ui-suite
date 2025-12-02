import * as React from "react";
import { twMerge } from "tailwind-merge";

export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingLabel?: string;
};

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  {
    label,
    description,
    error,
    leadingIcon,
    trailingLabel,
    className,
    id,
    disabled,
    ...rest
  },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = React.useId();
  const errorId = React.useId();

  const hintIds = [
    description ? descriptionId : null,
    error ? errorId : null,
  ].filter(Boolean);

  const resolvedAriaDescribedBy = hintIds.length ? hintIds.join(" ") : undefined;

  const containerClasses = twMerge(
    "flex items-center gap-3 rounded-2xl border border-slate-300 bg-white/70 px-3 py-2 transition focus-within:border-slate-400 focus-within:shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:focus-within:border-slate-500",
    disabled && "opacity-60",
    error && "border-rose-300 focus-within:border-rose-400 focus-within:shadow-[0_0_0_1px_rgba(248,113,113,0.35)] dark:border-rose-500/60"
  );

  const inputClasses = twMerge(
    "flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed dark:text-zinc-100 dark:placeholder:text-zinc-500",
    className
  );

  const leadingElm = leadingIcon ? (
    <span className="text-slate-400 dark:text-zinc-500" aria-hidden="true">
      {leadingIcon}
    </span>
  ) : null;

  const trailingElm = trailingLabel ? (
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
      {trailingLabel}
    </span>
  ) : null;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400"
        >
          {label}
        </label>
      ) : null}

      <div className={containerClasses}>
        {leadingElm}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={resolvedAriaDescribedBy}
          disabled={disabled}
        />
        {trailingElm}
      </div>

      {description ? (
        <p id={descriptionId} className="text-xs text-slate-500 dark:text-zinc-400">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});
