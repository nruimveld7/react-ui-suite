import * as React from "react";
import clsx from "clsx";
import "./Alert.css";

export type AlertVariant = "info" | "success" | "warning" | "danger";

const variantIcons: Record<AlertVariant, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  danger: "⛔",
};

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  variant?: AlertVariant;
  onDismiss?: () => void;
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { title, description, variant = "info", onDismiss, className, ...rest },
  ref
) {
  return (
    <div
      {...rest}
      ref={ref}
      role="alert"
      className={clsx("rui-alert", `rui-alert--${variant}`, className)}
    >
      <span className="rui-alert__icon" aria-hidden="true">
        {variantIcons[variant]}
      </span>
      <div className="rui-alert__content">
        <p className="rui-alert__title">{title}</p>
        {description ? <p className="rui-alert__description">{description}</p> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rui-alert__dismiss"
          aria-label="Dismiss alert"
        >
          x
        </button>
      ) : null}
      <span className="rui-alert__accent" aria-hidden="true" />
    </div>
  );
});
