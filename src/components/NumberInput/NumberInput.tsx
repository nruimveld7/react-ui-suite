import * as React from "react";
import clsx from "clsx";
import Button from "../Button/Button";
import "./NumberInput.css";
export type NumberInputProps = {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  step?: number;
  suffix?: React.ReactNode;
  min?: number;
  max?: number;
  scale?: number;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      label,
      description,
      error,
      className,
      style,
      disabled,
      value,
      defaultValue = 0,
      onChange,
      step = 1,
      suffix,
      min,
      max,
      scale = 1,
    },
    ref
  ) {
    const [internal, setInternal] = React.useState(defaultValue);
    const isControlled = typeof value === "number";
    const resolved = isControlled ? (value ?? 0) : internal;

    const update = (next: number) => {
      const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, next));
      if (!isControlled) setInternal(clamped);
      onChange?.(clamped);
    };

    const resolvedText = `${resolved}`;
    const valueChars = Math.max(resolvedText.length, 1);

    const rootStyle = React.useMemo(
      () =>
        ({
          "--rui-number-input-scale": scale,
          "--rui-number-input-value-ch": valueChars,
          ...style,
        }) as React.CSSProperties,
      [scale, style, valueChars]
    );

    return (
      <div className="rui-number-input__u-style--5a2508227c rui-root" style={rootStyle}>
        {label ? (
          <p className="rui-number-input__u-font-size-0-75rem--359090c2d5 rui-number-input__u-font-weight-600--e83a7042bc rui-number-input__u-text-transform-uppercase--117ec720ea rui-number-input__u-letter-spacing-0-2em--2da1a7016e rui-number-input__u-color-rgb-100-116-139-1--30426eb75c rui-number-input__u-color-rgb-161-161-170-1--6462b86910 rui-text-wrap">
            {label}
          </p>
        ) : null}
        <div
          className={clsx(
            "rui-number-input__u-display-flex--60fbb77139 rui-number-input__u-align-items-center--3960ffc248 rui-number-input__u-gap-0-75rem--1004c0c395 rui-number-input__u-border-radius-1rem--68f2db624d rui-number-input__u-border-width-1px--ca6bcd4b6f rui-number-input__u-border-color-rgb-203-213-225-1--85684b007e rui-number-input__u-background-color-rgb-255-255-255--845918557e rui-number-input__u-padding-left-0-75rem--0e17f2bd90 rui-number-input__u-padding-top-0-5rem--03b4dd7f17 rui-number-input__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-number-input__u-transition-property-color-backgr--56bf8ae82a rui-number-input__u-border-color-rgb-148-163-184-1--0b0890deff rui-number-input__u-box-shadow-0-0-0000-0-0-0000-0-0--e431ff085e rui-number-input__u-border-color-rgb-63-63-70-1--4e12bcf58d rui-number-input__u-background-color-rgb-24-24-27-0---5cd2915a74 rui-number-input__u-border-color-rgb-100-116-139-1--7e4150ed84 rui-number-input__shell",
            disabled && "rui-number-input__u-opacity-0-6--f2868c227f",
            error &&
              "rui-number-input__u-border-color-rgb-253-164-175-1--3b7f978155 rui-number-input__u-border-color-rgb-251-113-133-1--6fe003501e rui-number-input__u-box-shadow-0-0-0000-0-0-0000-0-0--633a78b9cd rui-number-input__u-border-color-rgb-244-63-94-0-6--99963c86d9"
          )}
        >
          <div className="rui-number-input__u-display-flex--60fbb77139 rui-number-input__u-flex-direction-column--8dddea0773 rui-number-input__u-gap-0-25rem--44ee8ba0a4">
            <Button
              type="button"
              aria-label="Increase"
              onClick={() => update(resolved + step)}
              className="rui-number-input__step-button rui-number-input__u-display-grid--f3c543ad5f rui-number-input__u-width-1-75rem--cc46d0fa27 rui-number-input__u-place-items-center--67d66567ca rui-number-input__u-border-radius-0-75rem--a217b4eaa9 rui-number-input__u-border-width-1px--ca6bcd4b6f rui-number-input__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-number-input__u-background-color-rgb-255-255-255--5e10cdb8f1 rui-number-input__u-font-size-0-75rem--359090c2d5 rui-number-input__u-font-weight-600--e83a7042bc rui-number-input__u-color-rgb-51-65-85-1--bcbca7a5be rui-number-input__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-number-input__u-transition-property-color-backgr--56bf8ae82a rui-number-input__u-transform-translate-0-1px-rotate--2464a58ddc rui-number-input__u-box-shadow-0-0-0000-0-0-0000-0-4--9e85ac05ca rui-number-input__u-opacity-0-5--b29d8adbad rui-number-input__u-border-color-rgb-63-63-70-1--4e12bcf58d rui-number-input__u-background-color-rgb-24-24-27-1--6319578a41 rui-number-input__u-color-rgb-244-244-245-1--3ddc1cab99"
              disabled={disabled}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                width="1.1em"
                height="1.1em"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 12.79a.75.75 0 0 0 1.06-.02L10 8.828l3.71 3.94a.75.75 0 1 0 1.08-1.04l-4.24-4.5a.75.75 0 0 0-1.08 0l-4.24 4.5a.75.75 0 0 0 .02 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button
              type="button"
              aria-label="Decrease"
              onClick={() => update(resolved - step)}
              className="rui-number-input__step-button rui-number-input__u-display-grid--f3c543ad5f rui-number-input__u-width-1-75rem--cc46d0fa27 rui-number-input__u-place-items-center--67d66567ca rui-number-input__u-border-radius-0-75rem--a217b4eaa9 rui-number-input__u-border-width-1px--ca6bcd4b6f rui-number-input__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-number-input__u-background-color-rgb-255-255-255--5e10cdb8f1 rui-number-input__u-font-size-0-75rem--359090c2d5 rui-number-input__u-font-weight-600--e83a7042bc rui-number-input__u-color-rgb-51-65-85-1--bcbca7a5be rui-number-input__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-number-input__u-transition-property-color-backgr--56bf8ae82a rui-number-input__u-transform-translate-0-1px-rotate--2464a58ddc rui-number-input__u-box-shadow-0-0-0000-0-0-0000-0-4--9e85ac05ca rui-number-input__u-opacity-0-5--b29d8adbad rui-number-input__u-border-color-rgb-63-63-70-1--4e12bcf58d rui-number-input__u-background-color-rgb-24-24-27-1--6319578a41 rui-number-input__u-color-rgb-244-244-245-1--3ddc1cab99"
              disabled={disabled}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                width="1.1em"
                height="1.1em"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.172l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          <input
            ref={ref}
            type="number"
            value={resolved}
            onChange={(e) => update(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={clsx(
              "rui-number-input__u-flex-1-1-0--36e579c0b4 rui-number-input__u-border-style-none--4a5f0ea046 rui-number-input__u-background-color-transparent--7f19cdf4c5 rui-number-input__u-font-size-1-5rem--3febee094e rui-number-input__u-font-weight-600--e83a7042bc rui-number-input__u-font-variant-numeric-tabular-num--3032cae0ba rui-number-input__u-color-rgb-15-23-42-1--f5f136c41d rui-number-input__u-color-rgb-148-163-184-1--02904d54b5 rui-number-input__u-outline-2px-solid-transparent--55d048ebfb rui-number-input__u-color-rgb-244-244-245-1--3ddc1cab99 rui-number-input__u-color-rgb-113-113-122-1--8a97e48efc rui-number-input__u-webkit-appearance-none--eeea43674c rui-number-input__u-webkit-appearance-textfield--131dee0347 rui-number-input__u-webkit-appearance-none--02681522bc rui-number-input__u-webkit-appearance-none--92a3b1179a",
              className
            )}
          />
          {suffix ? (
            <span className="rui-number-input__u-font-size-0-875rem--fc7473ca09 rui-number-input__u-font-weight-600--e83a7042bc rui-number-input__u-text-transform-uppercase--117ec720ea rui-number-input__u-letter-spacing-0-025em--8baf13a3e9 rui-number-input__u-color-rgb-100-116-139-1--30426eb75c rui-number-input__u-color-rgb-212-212-216-1--5b8efd1d78 rui-text-wrap">
              {suffix}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="rui-number-input__helper rui-number-input__u-font-size-0-75rem--359090c2d5 rui-number-input__u-color-rgb-100-116-139-1--30426eb75c rui-number-input__u-color-rgb-161-161-170-1--6462b86910 rui-text-wrap">
            {description}
          </p>
        ) : null}
        {error ? (
          <p className="rui-number-input__helper rui-number-input__u-font-size-0-75rem--359090c2d5 rui-number-input__u-font-weight-500--2689f39580 rui-number-input__u-color-rgb-244-63-94-1--fa51279820 rui-number-input__u-color-rgb-251-113-133-1--897de47303 rui-text-wrap">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);



