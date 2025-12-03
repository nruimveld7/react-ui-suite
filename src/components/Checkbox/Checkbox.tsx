import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "../Combobox/icons";

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
    id,
    ...rest
  },
  forwardedRef
) {
  const internalRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef && typeof forwardedRef === "object") (forwardedRef as any).current = node;
    },
    [forwardedRef]
  );

  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const resolvedChecked = isControlled ? !!checked : internalChecked;
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;
  const hasDescription = !!description;

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
      className={twMerge(
        "flex cursor-pointer gap-3 rounded-2xl border border-transparent px-2 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-zinc-900/60",
        "items-center",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center">
        <input
          {...rest}
          ref={mergedRef}
          id={checkboxId}
          type="checkbox"
          className="peer sr-only"
          checked={resolvedChecked}
          onChange={handleChange}
          disabled={disabled}
        />
        <span
          className={twMerge(
            "grid size-5 place-items-center rounded-lg border border-slate-300 bg-white text-[0.65rem] font-semibold text-slate-600 transition drop-shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate-400 dark:border-zinc-600 dark:bg-zinc-950/70 dark:text-zinc-200",
            resolvedChecked && "border-slate-400 bg-slate-100 text-slate-900 shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:border-zinc-500 dark:bg-zinc-500 dark:text-white"
          )}
          aria-hidden="true"
        >
          {resolvedChecked ? (
            <Check className="h-3 w-3" />
          ) : indeterminate ? (
            <span className="h-[2px] w-2 rounded-full bg-current" />
          ) : null}
        </span>
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{label}</span>
        {description ? (
          <span className="text-xs text-slate-500 dark:text-zinc-400">{description}</span>
        ) : null}
      </span>
    </label>
  );
});
