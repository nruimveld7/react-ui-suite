import * as React from "react";
import clsx from "clsx";
import "./Toggle.css";
export type ToggleProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { checked, defaultChecked = false, onChange, disabled, className, onClick, ...rest },
  ref
) {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const resolvedChecked = isControlled ? !!checked : internalChecked;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    const next = !resolvedChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
    onClick?.(event);
  };

  const buttonClasses = clsx(
    "rui-toggle__button rui-root",
    resolvedChecked && "rui-toggle__button--checked",
    disabled && "rui-toggle__button--disabled rui-toggle__is-disabled",
    className
  );

  const thumbClasses = clsx(
    "rui-toggle__thumb",
    resolvedChecked ? "rui-toggle__thumb--checked" : "rui-toggle__thumb--unchecked",
    disabled && "rui-toggle__thumb--disabled"
  );

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={resolvedChecked}
      disabled={disabled}
      data-state={resolvedChecked ? "on" : "off"}
      className={buttonClasses}
      onClick={handleClick}
    >
      <span aria-hidden="true" className={thumbClasses} />
    </button>
  );
});

export default Toggle;

