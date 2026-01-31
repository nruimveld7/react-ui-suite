import * as React from "react";
import clsx from "clsx";
import "./Radio.css";

export type RadioColor = "blue" | "green" | "red";
export type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "checked" | "defaultChecked"
> & {
  label: string;
  description?: string;
  color?: RadioColor;
  extra?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    description,
    color,
    extra,
    checked,
    defaultChecked = false,
    onChange,
    disabled,
    className,
    id,
    ...rest
  },
  forwardedRef
) {
  const generatedId = React.useId();
  const radioId = id ?? generatedId;
  const descriptionId = React.useId();

  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const resolvedChecked = isControlled ? !!checked : internalChecked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  return (
    <label
      htmlFor={radioId}
      className={clsx(
        "rui-radio rui-root rui-radio__u-display-flex--60fbb77139 rui-radio__u-align-items-center--3960ffc248 rui-radio__u-justify-content-space-between--8ef2268efb rui-radio__u-gap-0-75rem--1004c0c395 rui-radio__u-border-radius-1rem--68f2db624d rui-radio__u-border-width-1px--ca6bcd4b6f rui-radio__u-border-color-transparent--521fa0c7c4 rui-radio__u-padding-left-0-75rem--0e17f2bd90 rui-radio__u-padding-top-0-5rem--03b4dd7f17 rui-radio__u-text-align-left--2eba0d65d0 rui-radio__u-transition-property-color-backgr--56bf8ae82a rui-radio__u-rui-bg-opacity-1--ec704dd3ca rui-radio__u-rui-bg-opacity-1--a617f10ee4 rui-radio__u-background-color-rgb-24-24-27-0---68117f3a86 rui-radio__u-background-color-rgb-24-24-27-0---831d2602e5",
        color && `rui-radio--color-${color}`,
        disabled && "rui-radio--disabled",
        disabled && "rui-radio__u-cursor-not-allowed--29b733e4c1 rui-radio__u-opacity-0-6--f2868c227f",
        className
      )}
    >
      <span className="rui-radio__u-display-flex--60fbb77139 rui-radio__u-flex-1-1-0--36e579c0b4 rui-radio__u-align-items-center--3960ffc248 rui-radio__u-gap-0-75rem--1004c0c395">
        <span className="rui-radio__u-display-flex--60fbb77139 rui-radio__u-height-1-5rem--f6fe902450 rui-radio__u-width-1-5rem--7ec10f86d9 rui-radio__u-align-items-center--3960ffc248 rui-radio__u-justify-content-center--86843cf1e2">
          <input
            {...rest}
            ref={forwardedRef}
            id={radioId}
            type="radio"
            className="rui-radio__input rui-radio__u-outline-color-94a3b8--2b974ba4b4 rui-radio__u-position-absolute--2daa8e5e2f"
            checked={resolvedChecked}
            onChange={handleChange}
            aria-describedby={description ? descriptionId : rest["aria-describedby"]}
            disabled={disabled}
          />
          <span
            className="rui-radio__control rui-radio__u-display-grid--f3c543ad5f rui-radio__u-width-1-25rem--add63bc675 rui-radio__u-place-items-center--67d66567ca rui-radio__u-border-radius-9999px--ac204c1088 rui-radio__u-border-width-1px--ca6bcd4b6f rui-radio__u-rui-border-opacity-1--85684b007e rui-radio__u-rui-bg-opacity-1--5e10cdb8f1 rui-radio__u-rui-text-opacity-1--2d6fbf48fa rui-radio__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-radio__u-transition-property-color-backgr--56bf8ae82a rui-radio__u-transition-duration-150ms--233c0494b4 rui-radio__u-outline-style-solid--031bab38b3 rui-radio__u-style--1942091110 rui-radio__u-style--13305c0f2a rui-radio__u-style--91ac31aaa8 rui-radio__u-rui-border-opacity-1--2cf083d4da rui-radio__u-background-color-rgb-9-9-11-0-7--18f22f07a8 rui-radio__u-rui-text-opacity-1--270353156a"
            aria-hidden="true"
          >
            </span>
        </span>

        <span className="rui-radio__u-display-flex--60fbb77139 rui-radio__u-flex-1-1-0--36e579c0b4 rui-radio__u-flex-direction-column--8dddea0773">
          <span className="rui-radio__u-font-size-0-875rem--fc7473ca09 rui-radio__u-font-weight-600--e83a7042bc rui-radio__u-rui-text-opacity-1--f5f136c41d rui-radio__u-rui-text-opacity-1--3ddc1cab99 rui-text-wrap">{label}</span>
          {description ? (
            <span id={descriptionId} className="rui-radio__u-font-size-0-75rem--359090c2d5 rui-radio__u-rui-text-opacity-1--30426eb75c rui-radio__u-rui-text-opacity-1--6462b86910 rui-text-wrap">
              {description}
            </span>
          ) : null}
        </span>
      </span>

      {extra ? (
        <span className="rui-radio__u-align-self-center--dc60f81ef1 rui-radio__u-border-radius-0-75rem--a217b4eaa9 rui-radio__u-border-width-1px--ca6bcd4b6f rui-radio__u-rui-border-opacity-1--52f4da2ca5 rui-radio__u-background-color-rgb-255-255-255--845918557e rui-radio__u-padding-left-0-75rem--0e17f2bd90 rui-radio__u-padding-top-0-25rem--660d2effb8 rui-radio__u-font-size-0-75rem--359090c2d5 rui-radio__u-font-weight-600--e83a7042bc rui-radio__u-rui-text-opacity-1--2d6fbf48fa rui-radio__u-rui-border-opacity-1--4e12bcf58d rui-radio__u-background-color-rgb-24-24-27-0---5cb47d6e2f rui-radio__u-rui-text-opacity-1--270353156a rui-text-wrap">
          {extra}
        </span>
      ) : null}
    </label>
  );
});













