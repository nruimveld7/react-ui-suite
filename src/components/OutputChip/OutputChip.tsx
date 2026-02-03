import * as React from "react";
import clsx from "clsx";
import "./OutputChip.css";
export type OutputChipProps = React.OutputHTMLAttributes<HTMLOutputElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
  label?: string;
};

export const OutputChip = React.forwardRef<HTMLOutputElement, OutputChipProps>(function OutputChip(
  { children, className, tone = "neutral", label, ...rest },
  ref
) {
  return (
    <output
      {...rest}
      ref={ref}
      data-tone={tone}
      className={clsx("rui-root", "rui-output-chip", className)}
    >
      {label ? <span className="rui-output-chip__label rui-text-wrap">{label}</span> : null}
      <span className="rui-output-chip__value rui-text-wrap">{children}</span>
    </output>
  );
});




