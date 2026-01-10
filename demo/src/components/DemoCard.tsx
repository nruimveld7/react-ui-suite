import * as React from "react";
import clsx from "clsx";
import "./DemoCard.css";

export type DemoCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "muted";
};

export function DemoCard({ variant = "default", className, children, ...rest }: DemoCardProps) {
  return (
    <div
      {...rest}
      className={clsx("rui-demo-card", variant === "muted" && "rui-demo-card--muted", className)}
    >
      {children}
    </div>
  );
}

