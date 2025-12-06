import * as React from "react";
import { twMerge } from "tailwind-merge";

export type OutputChipProps = React.OutputHTMLAttributes<HTMLOutputElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
  label?: string;
};

const toneStyles: Record<
  NonNullable<OutputChipProps["tone"]>,
  { bg: string; text: string; ring: string }
> = {
  neutral: { bg: "bg-slate-900", text: "text-white", ring: "ring-slate-300" },
  success: { bg: "bg-emerald-500", text: "text-white", ring: "ring-emerald-200" },
  warning: { bg: "bg-amber-500", text: "text-white", ring: "ring-amber-200" },
  danger: { bg: "bg-rose-500", text: "text-white", ring: "ring-rose-200" },
};

export const OutputChip = React.forwardRef<HTMLOutputElement, OutputChipProps>(function OutputChip(
  { children, className, tone = "neutral", label, ...rest },
  ref
) {
  const styles = toneStyles[tone];
  return (
    <output
      {...rest}
      ref={ref}
      className={twMerge(
        "inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] shadow-sm ring-1 text-center",
        styles.bg,
        styles.text,
        styles.ring,
        className
      )}
    >
      {label ? <span className="opacity-70">{label}</span> : null}
      <span>{children}</span>
    </output>
  );
});
