import * as React from "react";
import { twMerge } from "tailwind-merge";

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

  const buttonClasses = twMerge(
    "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-slate-300 bg-slate-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100",
    "dark:border-zinc-700/70 dark:bg-zinc-900/70 dark:focus-visible:ring-offset-slate-950",
    resolvedChecked &&
      "border-slate-400 bg-slate-500/40 shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:border-zinc-500 dark:bg-zinc-500",
    disabled && "cursor-not-allowed opacity-60",
    className
  );

  const thumbClasses = twMerge(
    "pointer-events-none absolute left-1 top-[3px] size-5 rounded-full bg-white text-zinc-900 shadow-lg shadow-black/30 transition-transform duration-200",
    resolvedChecked ? "translate-x-[19px]" : "translate-x-0"
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
