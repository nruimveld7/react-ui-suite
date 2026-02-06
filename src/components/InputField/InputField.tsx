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
    disabled && "rui-input-field__shell--disabled",
    error && "rui-input-field__shell--error"
  );

  const inputClasses = clsx(
    "rui-input-field__input",
    className
  );

  const leadingElm = leadingIcon ? (
    <span className="rui-input-field__leading" aria-hidden="true">
      {leadingIcon}
    </span>
  ) : null;

  const trailingElm = trailingLabel ? (
    <span className="rui-input-field__trailing rui-text-wrap">
      {trailingLabel}
    </span>
  ) : null;

  return (
    <div className="rui-input-field rui-root">
      {label ? (
        <label
          htmlFor={inputId}
          className="rui-input-field__label rui-text-wrap"
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
        <p id={descriptionId} className="rui-input-field__description rui-text-wrap">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="rui-input-field__error rui-text-wrap">
          {error}
        </p>
      ) : null}
    </div>
  );
});

