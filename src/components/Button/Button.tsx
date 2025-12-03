import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode; // label or JSX inside the button
};

export default function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  style,
  ...rest
}: ButtonProps) {
  const hasCustomBackground = typeof className === "string" && /bg-/.test(className);
  const hasCustomText = typeof className === "string" && /text-/.test(className);

  const backgroundClasses = hasCustomBackground
    ? ""
    : "bg-white hover:bg-slate-100 dark:bg-zinc-900/70 dark:hover:bg-zinc-800";

  const textClasses = hasCustomText ? "" : "text-slate-900 dark:text-zinc-100";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...rest}
      className={twMerge(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold shadow-sm transition",
        backgroundClasses,
        textClasses,
        "hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "dark:border-zinc-700/60 dark:hover:border-zinc-500 dark:shadow-slate-950/20",
        className
      )}
    >
      {children}
    </button>
  );
}
