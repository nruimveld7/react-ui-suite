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
      <div className="rui-number-input rui-root" style={rootStyle}>
        {label ? (
          <p className="rui-number-input__label rui-text-wrap">
            {label}
          </p>
        ) : null}
        <div
          className={clsx(
            "rui-number-input__shell",
            disabled && "rui-number-input__shell--disabled",
            error && "rui-number-input__shell--error"
          )}
        >
          <div className="rui-number-input__stepper">
            <Button
              type="button"
              aria-label="Increase"
              onClick={() => update(resolved + step)}
              className="rui-number-input__step-button"
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
              className="rui-number-input__step-button"
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
              "rui-number-input__input",
              className
            )}
          />
          {suffix ? (
            <span className="rui-number-input__suffix rui-text-wrap">
              {suffix}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="rui-number-input__helper rui-number-input__helper--description rui-text-wrap">
            {description}
          </p>
        ) : null}
        {error ? (
          <p className="rui-number-input__helper rui-number-input__helper--error rui-text-wrap">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);



