import * as React from "react";
import clsx from "clsx";
import { DemoCard, type DemoCardProps } from "./DemoCard";
import { DemoBadge, type DemoBadgeProps } from "./DemoBadge";
import "./DemoExample.css";

export type DemoExampleBadge = true | string | React.ReactNode | DemoBadgeProps;

export type DemoExampleProps = Omit<DemoCardProps, "children"> & {
  title?: string;
  framed?: boolean;
  badge?: DemoExampleBadge;
  children: React.ReactNode;
};

export function DemoExample({
  title,
  framed = true,
  badge,
  className,
  children,
  ...rest
}: DemoExampleProps) {
  const rootClassName = clsx("rui-demo-example", !framed && "rui-demo-example--plain", className);
  const badgeNode = renderBadge(badge);

  if (!framed) {
    return (
      <div {...rest} className={rootClassName}>
        {title ? <p className="rui-demo-example__title">{title}</p> : null}
        {children}
        {badgeNode}
      </div>
    );
  }

  return (
    <DemoCard {...rest} className={rootClassName}>
      {title ? <p className="rui-demo-example__title">{title}</p> : null}
      {children}
      {badgeNode}
    </DemoCard>
  );
}

function renderBadge(badge?: DemoExampleBadge) {
  if (badge == null || badge === false) {
    return null;
  }

  if (badge === true) {
    return <DemoBadge label="Example" />;
  }

  if (typeof badge === "string") {
    return <DemoBadge label={badge} />;
  }

  if (React.isValidElement(badge)) {
    return <DemoBadge>{badge}</DemoBadge>;
  }

  if (typeof badge === "object") {
    return <DemoBadge {...badge} />;
  }

  return <DemoBadge>{badge}</DemoBadge>;
}
