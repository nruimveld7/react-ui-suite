import * as React from "react";
import { twMerge } from "tailwind-merge";

export type AlertVariant = "info" | "success" | "warning" | "danger";

const variantStyles: Record<AlertVariant, { container: string; accent: string; icon: string }> = {
  info: {
    container: "bg-sky-50 text-sky-900 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:text-sky-100",
    accent: "bg-sky-400",
    icon: "ℹ️",
  },
  success: {
    container:
      "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-100",
    accent: "bg-emerald-400",
    icon: "✔️",
  },
  warning: {
    container:
      "bg-amber-50 text-amber-900 ring-1 ring-amber-100 dark:bg-amber-400/10 dark:text-amber-100",
    accent: "bg-amber-400",
    icon: "⚠️",
  },
  danger: {
    container:
      "bg-rose-50 text-rose-900 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-100",
    accent: "bg-rose-400",
    icon: "⛔",
  },
};

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  variant?: AlertVariant;
  onDismiss?: () => void;
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { title, description, variant = "info", onDismiss, className, ...rest },
  ref
) {
  const style = variantStyles[variant];
  return (
    <div
      {...rest}
      ref={ref}
      role="alert"
      className={twMerge(
        "relative flex items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm",
        style.container,
        className
      )}
    >
      <span className="mt-[2px] text-base" aria-hidden="true">
        {style.icon}
      </span>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {description ? <p className="text-sm/relaxed opacity-90">{description}</p> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1 text-xs font-semibold uppercase tracking-wide text-current/70 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          aria-label="Dismiss alert"
        >
          ×
        </button>
      ) : null}
      <span
        className={twMerge("absolute inset-y-2 left-1 w-1 rounded-full", style.accent)}
        aria-hidden="true"
      />
    </div>
  );
});
