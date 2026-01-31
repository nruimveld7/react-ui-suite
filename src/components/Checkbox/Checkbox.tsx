import * as React from "react";
import { Check } from "../Combobox/icons";
import { assignRef } from "../../utils/ref";
import clsx from "clsx";
import "./Checkbox.css";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "checked" | "defaultChecked"
> & {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  uncheckedBoxColor?: string;
  checkedBoxColor?: string;
  uncheckedBorderColor?: string;
  checkedBorderColor?: string;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    checked,
    defaultChecked = false,
    onChange,
    disabled,
    className,
    indeterminate,
    uncheckedBoxColor,
    checkedBoxColor,
    uncheckedBorderColor,
    checkedBorderColor,
    id,
    ...rest
  },
  forwardedRef
) {
  const internalRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      internalRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef]
  );

  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const resolvedChecked = isControlled ? !!checked : internalChecked;
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

  React.useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!indeterminate && !resolvedChecked;
    }
  }, [indeterminate, resolvedChecked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  return (
    <label
      htmlFor={checkboxId}
      className={clsx("rui-root", 
        "rui-checkbox",
        disabled && "rui-checkbox--disabled",
        className
      )}
      style={{
        "--rui-checkbox-box-bg": uncheckedBoxColor,
        "--rui-checkbox-box-bg-checked": checkedBoxColor,
        "--rui-checkbox-box-border": uncheckedBorderColor,
        "--rui-checkbox-box-border-checked": checkedBorderColor,
      } as React.CSSProperties}
    >
      <span className="rui-checkbox__control">
        <input
          {...rest}
          ref={mergedRef}
          id={checkboxId}
          type="checkbox"
          className="rui-checkbox__input"
          checked={resolvedChecked}
          onChange={handleChange}
          disabled={disabled}
        />
        <span
          className={clsx("rui-checkbox__box",
            resolvedChecked && "rui-checkbox__box--checked",
            indeterminate && !resolvedChecked && "rui-checkbox__box--indeterminate"
          )}
          aria-hidden="true"
        >
          {resolvedChecked ? (
            <Check className="rui-checkbox__check" />
          ) : indeterminate ? (
            <span className="rui-checkbox__dash" />
          ) : null}
        </span>
      </span>
      <span className="rui-checkbox__text">
        <span className="rui-checkbox__label rui-text-wrap">{label}</span>
        {description ? (
          <span className="rui-checkbox__description rui-text-wrap">{description}</span>
        ) : null}
      </span>
    </label>
  );
});




