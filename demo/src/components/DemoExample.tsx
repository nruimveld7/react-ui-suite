import * as React from "react";
import clsx from "clsx";
import { DemoCard, type DemoCardProps } from "./DemoCard";
import "./DemoExample.css";

export type DemoExampleProps = Omit<DemoCardProps, "children"> & {
  title?: string;
  framed?: boolean;
  children: React.ReactNode;
};

export function DemoExample({
  title,
  framed = true,
  className,
  children,
  ...rest
}: DemoExampleProps) {
  const rootClassName = clsx("rui-demo-example", !framed && "rui-demo-example--plain", className);

  if (!framed) {
    return (
      <div {...rest} className={rootClassName}>
        {title ? <p className="rui-demo-example__title">{title}</p> : null}
        {children}
      </div>
    );
  }

  return (
    <DemoCard {...rest} className={rootClassName}>
      {title ? <p className="rui-demo-example__title">{title}</p> : null}
      {children}
    </DemoCard>
  );
}
