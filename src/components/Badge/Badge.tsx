import * as React from "react";
import clsx from "clsx";
import "./Badge.css";

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", icon, className, children, ...rest },
  ref
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={clsx("rui-badge", "rui-root", "rui-text-wrap", `rui-badge--${variant}`, className)}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  );
});

