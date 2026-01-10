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
      className={clsx("rui-card", muted && "rui-card--muted", className)}
    >
      {hasHeader && (
        <div className="rui-card__header">
          {eyebrow ? (
            <p className="rui-card__eyebrow">{eyebrow}</p>
          ) : (
            <p className="rui-card__eyebrow rui-card__eyebrow--placeholder">Eyebrow</p>
          )}
          {actions ? <div className="rui-card__actions">{actions}</div> : null}
        </div>
      )}
      {title ? (
        <h3
          className={clsx(
            "rui-card__title",
            hasHeader && "rui-card__title--offset"
          )}
        >
          {title}
        </h3>
      ) : null}
      {children ? <div className="rui-card__body">{children}</div> : null}
      {footer ? (
        <div className="rui-card__footer">{footer}</div>
      ) : null}
    </div>
  );
});
