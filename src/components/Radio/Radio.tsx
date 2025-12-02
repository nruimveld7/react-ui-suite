import * as React from "react";
import { twMerge } from "tailwind-merge";

export type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "checked" | "defaultChecked"
> & {
  label: string;
  description?: string;
  extra?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    description,
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
      className={twMerge(
        "flex items-center justify-between gap-3 rounded-2xl border border-transparent px-3 py-2 text-left transition hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-zinc-900/60 dark:focus-within:bg-zinc-900/60",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <span className="flex flex-1 items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center">
          <input
            {...rest}
            ref={forwardedRef}
            id={radioId}
            type="radio"
            className="peer sr-only"
            checked={resolvedChecked}
            onChange={handleChange}
            aria-describedby={description ? descriptionId : rest["aria-describedby"]}
            disabled={disabled}
          />
          <span
            className={twMerge(
              "grid size-5 place-items-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition duration-150 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate-400 dark:border-zinc-600 dark:bg-zinc-950/70 dark:text-zinc-200",
              resolvedChecked &&
                "border-slate-400 bg-slate-100 shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:border-zinc-500 dark:bg-zinc-700/70"
            )}
            aria-hidden="true"
          >
            <span
              className={twMerge(
                "block h-2.5 w-2.5 rounded-full bg-slate-900 opacity-0 transition duration-200 dark:bg-zinc-100",
                resolvedChecked && "opacity-100"
              )}
            />
          </span>
        </span>

        <span className="flex flex-1 flex-col">
          <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{label}</span>
          {description ? (
            <span id={descriptionId} className="text-xs text-slate-500 dark:text-zinc-400">
              {description}
            </span>
          ) : null}
        </span>
      </span>

      {extra ? (
        <span className="self-center rounded-xl border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200">
          {extra}
        </span>
      ) : null}
    </label>
  );
});
