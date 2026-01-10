import * as React from "react";
import clsx from "clsx";
import "./InputField.css";
export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingLabel?: string;
};

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, description, error, leadingIcon, trailingLabel, className, id, disabled, ...rest },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = React.useId();
  const errorId = React.useId();

  const hintIds = [description ? descriptionId : null, error ? errorId : null].filter(Boolean);

  const resolvedAriaDescribedBy = hintIds.length ? hintIds.join(" ") : undefined;

  const containerClasses = clsx(
    "rui-input-field__u-display-flex--60fbb77139 rui-input-field__u-align-items-center--3960ffc248 rui-input-field__u-gap-0-75rem--1004c0c395 rui-input-field__u-border-radius-1rem--68f2db624d rui-input-field__u-border-width-1px--ca6bcd4b6f rui-input-field__u-border-color-rgb-203-213-225-1--85684b007e rui-input-field__u-background-color-rgb-255-255-255--b0b66d884b rui-input-field__u-padding-left-0-75rem--0e17f2bd90 rui-input-field__u-padding-top-0-5rem--03b4dd7f17 rui-input-field__u-transition-property-color-backgr--56bf8ae82a rui-input-field__u-border-color-rgb-148-163-184-1--0b0890deff rui-input-field__u-box-shadow-0-0-0000-0-0-0000-0-0--e431ff085e rui-input-field__u-border-color-rgb-63-63-70-1--4e12bcf58d rui-input-field__u-background-color-rgb-24-24-27-0---5cd2915a74 rui-input-field__u-border-color-rgb-100-116-139-1--7e4150ed84",
    disabled && "rui-input-field__u-opacity-0-6--f2868c227f",
    error &&
      "rui-input-field__u-border-color-rgb-253-164-175-1--3b7f978155 rui-input-field__u-border-color-rgb-251-113-133-1--6fe003501e rui-input-field__u-box-shadow-0-0-0000-0-0-0000-0-0--633a78b9cd rui-input-field__u-border-color-rgb-244-63-94-0-6--99963c86d9"
  );

  const inputClasses = clsx(
    "rui-input-field__u-flex-1-1-0--36e579c0b4 rui-input-field__u-border-style-none--4a5f0ea046 rui-input-field__u-background-color-transparent--7f19cdf4c5 rui-input-field__u-font-size-0-875rem--fc7473ca09 rui-input-field__u-color-rgb-15-23-42-1--f5f136c41d rui-input-field__u-color-rgb-148-163-184-1--02904d54b5 rui-input-field__u-outline-2px-solid-transparent--55d048ebfb rui-input-field__u-cursor-not-allowed--5f533b3a7d rui-input-field__u-color-rgb-244-244-245-1--3ddc1cab99 rui-input-field__u-color-rgb-113-113-122-1--8a97e48efc",
    className
  );

  const leadingElm = leadingIcon ? (
    <span className="rui-input-field__u-color-rgb-148-163-184-1--8d44cef396 rui-input-field__u-color-rgb-113-113-122-1--28db7d8770" aria-hidden="true">
      {leadingIcon}
    </span>
  ) : null;

  const trailingElm = trailingLabel ? (
    <span className="rui-input-field__u-font-size-0-75rem--359090c2d5 rui-input-field__u-font-weight-600--e83a7042bc rui-input-field__u-text-transform-uppercase--117ec720ea rui-input-field__u-letter-spacing-0-025em--8baf13a3e9 rui-input-field__u-color-rgb-148-163-184-1--8d44cef396 rui-input-field__u-color-rgb-113-113-122-1--28db7d8770">
      {trailingLabel}
    </span>
  ) : null;

  return (
    <div className="rui-input-field__u-style--5a2508227c">
      {label ? (
        <label
          htmlFor={inputId}
          className="rui-input-field__u-font-size-0-75rem--359090c2d5 rui-input-field__u-font-weight-600--e83a7042bc rui-input-field__u-text-transform-uppercase--117ec720ea rui-input-field__u-letter-spacing-0-2em--2da1a7016e rui-input-field__u-color-rgb-100-116-139-1--30426eb75c rui-input-field__u-color-rgb-161-161-170-1--6462b86910"
        >
          {label}
        </label>
      ) : null}

      <div className={clsx("rui-input-field__shell", containerClasses)}>
        {leadingElm}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={resolvedAriaDescribedBy}
          disabled={disabled}
        />
        {trailingElm}
      </div>

      {description ? (
        <p id={descriptionId} className="rui-input-field__u-font-size-0-75rem--359090c2d5 rui-input-field__u-color-rgb-100-116-139-1--30426eb75c rui-input-field__u-color-rgb-161-161-170-1--6462b86910">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="rui-input-field__u-font-size-0-75rem--359090c2d5 rui-input-field__u-font-weight-500--2689f39580 rui-input-field__u-color-rgb-244-63-94-1--fa51279820 rui-input-field__u-color-rgb-251-113-133-1--897de47303">
          {error}
        </p>
      ) : null}
    </div>
  );
});
