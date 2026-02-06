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
        "rui-radio rui-root",
        color && `rui-radio--color-${color}`,
        disabled && "rui-radio--disabled",
        className
      )}
    >
      <span className="rui-radio__content">
        <span className="rui-radio__indicator">
          <input
            {...rest}
            ref={forwardedRef}
            id={radioId}
            type="radio"
            className="rui-radio__input"
            checked={resolvedChecked}
            onChange={handleChange}
            aria-describedby={description ? descriptionId : rest["aria-describedby"]}
            disabled={disabled}
          />
          <span
            className="rui-radio__control"
            aria-hidden="true"
          >
            </span>
        </span>

        <span className="rui-radio__meta">
          <span className="rui-radio__label rui-text-wrap">{label}</span>
          {description ? (
            <span id={descriptionId} className="rui-radio__description rui-text-wrap">
              {description}
            </span>
          ) : null}
        </span>
      </span>

      {extra ? (
        <span className="rui-radio__extra rui-text-wrap">
          {extra}
        </span>
      ) : null}
    </label>
  );
});













