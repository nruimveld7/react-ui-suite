import * as React from "react";
import clsx from "clsx";
import "./OutputChip.css";
export type OutputChipProps = React.OutputHTMLAttributes<HTMLOutputElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
  label?: string;
};

const toneStyles: Record<
  NonNullable<OutputChipProps["tone"]>,
  { bg: string; text: string; ring: string }
> = {
  neutral: {
    bg: "rui-output-chip__u-background-color-rgb-15-23-42-1--15821c2ff2",
    text: "rui-output-chip__u-color-rgb-255-255-255-1--72a4c7cdee",
    ring: "rui-output-chip__u-style--ac04a0392c",
  },
  success: {
    bg: "rui-output-chip__u-background-color-rgb-16-185-129---1d40adc8f0",
    text: "rui-output-chip__u-color-rgb-255-255-255-1--72a4c7cdee",
    ring: "rui-output-chip__u-style--5c915372ed",
  },
  warning: {
    bg: "rui-output-chip__u-background-color-rgb-245-158-11---931bc423fa",
    text: "rui-output-chip__u-color-rgb-255-255-255-1--72a4c7cdee",
    ring: "rui-output-chip__u-style--2e15338efe",
  },
  danger: {
    bg: "rui-output-chip__u-background-color-rgb-244-63-94-1--45a732a46e",
    text: "rui-output-chip__u-color-rgb-255-255-255-1--72a4c7cdee",
    ring: "rui-output-chip__u-style--e969a1cf72",
  },
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
      className={clsx(
        "rui-output-chip__u-display-inline-flex--52083e7da4 rui-output-chip__u-align-items-center--3960ffc248 rui-output-chip__u-justify-content-center--86843cf1e2 rui-output-chip__u-gap-0-5rem--77a2a20e90 rui-output-chip__u-border-radius-9999px--ac204c1088 rui-output-chip__u-padding-left-0-75rem--0e17f2bd90 rui-output-chip__u-padding-top-0-25rem--660d2effb8 rui-output-chip__u-font-size-0-75rem--359090c2d5 rui-output-chip__u-font-weight-600--e83a7042bc rui-output-chip__u-text-transform-uppercase--117ec720ea rui-output-chip__u-letter-spacing-0-25em--854c830ad6 rui-output-chip__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-output-chip__u-box-shadow-0-0-0-0px-fff-0-0-0-c--3daca9af08 rui-output-chip__u-text-align-center--ca6bf63030",
        styles.bg,
        styles.text,
        styles.ring,
        className
      )}
    >
      {label ? <span className="rui-output-chip__u-opacity-0-7--0c67ca474a">{label}</span> : null}
      <span>{children}</span>
    </output>
  );
});
