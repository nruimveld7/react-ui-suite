import * as React from "react";
import { twMerge } from "tailwind-merge";

export type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  eyebrow?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  muted?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { eyebrow, title, actions, children, footer, muted, className, ...rest },
  ref
) {
  const hasHeader = eyebrow || actions;

  return (
    <div
      {...rest}
      ref={ref}
      className={twMerge(
        "flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 dark:border-zinc-700/60 dark:bg-zinc-900/70 dark:shadow-none",
        muted && "bg-slate-50/70 dark:bg-zinc-900/40",
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-4">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-400">
              {eyebrow}
            </p>
          ) : (
            <span />
          )}
          {actions ? <div className="text-sm text-slate-500 dark:text-zinc-400">{actions}</div> : null}
        </div>
      )}
      {title ? (
        <h3
          className={twMerge(
            "text-lg font-semibold text-slate-900 dark:text-zinc-100",
            hasHeader ? "mt-3" : "mt-0"
          )}
        >
          {title}
        </h3>
      ) : null}
      {children ? <div className="mt-3 flex-1 text-sm text-slate-600 dark:text-zinc-300">{children}</div> : null}
      {footer ? <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">{footer}</div> : null}
    </div>
  );
});
