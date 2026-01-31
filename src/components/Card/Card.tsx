import * as React from "react";
import clsx from "clsx";
import "./Card.css";
export type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  eyebrow?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  muted?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { eyebrow, title, actions, children, footer, muted, className, ...rest },
  ref
) {
  const hasHeader = Boolean(eyebrow || actions);

  return (
    <div
      {...rest}
      ref={ref}
      className={clsx("rui-card", "rui-root", "rui-surface", muted && "rui-card--muted", className)}
    >
      {hasHeader && (
        <div className="rui-card__header">
          {eyebrow ? (
            <p className="rui-card__eyebrow rui-text-wrap">{eyebrow}</p>
          ) : (
            <p className="rui-card__eyebrow rui-text-wrap rui-card__eyebrow--placeholder">Eyebrow</p>
          )}
          {actions ? <div className="rui-card__actions">{actions}</div> : null}
        </div>
      )}
      {title ? (
        <h3
          className={clsx(
            "rui-card__title rui-text-wrap",
            hasHeader && "rui-card__title--offset"
          )}
        >
          {title}
        </h3>
      ) : null}
      {children ? <div className="rui-card__body rui-text-wrap">{children}</div> : null}
      {footer ? (
        <div className="rui-card__footer rui-text-wrap">{footer}</div>
      ) : null}
    </div>
  );
});

