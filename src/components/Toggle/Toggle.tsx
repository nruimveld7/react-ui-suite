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
    "rui-toggle__button rui-root rui-toggle__u-position-relative--d89972fe17 rui-toggle__u-display-inline-flex--52083e7da4 rui-toggle__u-height-1-75rem--d0a52b312f rui-toggle__u-width-3rem--e7e371071b rui-toggle__u-flex-shrink-0--012fbd121f rui-toggle__u-cursor-pointer--3451683673 rui-toggle__u-align-items-center--3960ffc248 rui-toggle__u-border-radius-9999px--ac204c1088 rui-toggle__u-border-width-1px--ca6bcd4b6f rui-toggle__u-rui-border-opacity-1--85684b007e rui-toggle__u-rui-bg-opacity-1--5793d2cb69 rui-toggle__u-transition-property-color-backgr--ceb69a6b0e rui-toggle__u-transition-duration-200ms--625a4c3fbe rui-toggle__focus-visible",
    "rui-toggle__u-border-color-rgb-63-63-70-0-7--0e08197dba rui-toggle__u-background-color-rgb-24-24-27-0---5cd2915a74 rui-toggle__u-rui-ring-offset-color-020617--3b0cfe2894",
    resolvedChecked &&
      "rui-toggle__u-rui-border-opacity-1--6b0439773b rui-toggle__u-background-color-rgb-100-116-139--f98f825e4b rui-toggle__u-rui-border-opacity-1--5bf6e2c7d4 rui-toggle__u-rui-bg-opacity-1--f002a89a5c",
    disabled && "rui-toggle__u-cursor-not-allowed--29b733e4c1 rui-toggle__u-opacity-0-6--f2868c227f rui-toggle__is-disabled",
    className
  );

  const thumbClasses = clsx(
    "rui-toggle__u-pointer-events-none--a4326536b8 rui-toggle__u-position-absolute--da4dbfbc4f rui-toggle__u-left-0-25rem--7971386c27 rui-toggle__u-top-3px--651d3a8232 rui-toggle__u-width-1-25rem--add63bc675 rui-toggle__u-border-radius-9999px--ac204c1088 rui-toggle__u-rui-bg-opacity-1--5e10cdb8f1 rui-toggle__u-rui-text-opacity-1--03eea20e2a rui-toggle__u-transition-property-transform--eadef23823 rui-toggle__u-transition-duration-200ms--625a4c3fbe",
    resolvedChecked ? "rui-toggle__u-rui-translate-x-19px--4cb621eea7" : "rui-toggle__u-rui-translate-x-0px--850292e4ef",
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

