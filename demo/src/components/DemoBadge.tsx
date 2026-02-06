import * as React from "react";
import clsx from "clsx";
import { Badge, type BadgeProps } from "react-ui-suite";
import "./DemoBadge.css";

export type DemoBadgeProps = BadgeProps & {
  label?: React.ReactNode;
  top?: number | string;
  right?: number | string;
  appearance?: "default" | "gradient";
};

export function DemoBadge({
  label,
  top,
  right,
  appearance = "default",
  style,
  className,
  children,
  ...rest
}: DemoBadgeProps) {
  const resolvedStyle: React.CSSProperties = { ...style };

  if (top !== undefined) {
    resolvedStyle.top = typeof top === "number" ? `${top}px` : top;
  }

  if (right !== undefined) {
    resolvedStyle.right = typeof right === "number" ? `${right}px` : right;
  }

  return (
    <Badge
      {...rest}
      className={clsx("rui-demo-badge", appearance === "gradient" && "rui-demo-badge--gradient", className)}
      style={resolvedStyle}
    >
      {children ?? label}
    </Badge>
  );
}
