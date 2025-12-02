import * as React from "react";
import { twMerge } from "tailwind-merge";

export type DisclosureProps = React.DetailsHTMLAttributes<HTMLDetailsElement> & {
  title: React.ReactNode;
  subtle?: boolean;
  defaultOpen?: boolean;
};

export const Disclosure = React.forwardRef<HTMLDetailsElement, DisclosureProps>(function Disclosure(
  { title, children, className, subtle, ...rest },
  ref
) {
  const summaryId = React.useId();

  return (
    <details
      {...rest}
      ref={ref}
      className={twMerge(
        "group rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm transition dark:border-zinc-700/60 dark:bg-zinc-900/70",
        subtle && "border-transparent bg-white/60 shadow-none dark:bg-zinc-900/40",
        className
      )}
    >
      <summary
        id={summaryId}
        className="flex cursor-pointer list-none items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
      >
        <span className="flex flex-1 items-center gap-2">
          <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-inner dark:bg-zinc-800/70 dark:text-zinc-300">
            {title}
          </span>
        </span>
        <span
          className="text-slate-400 transition-transform duration-200 group-open:rotate-180 dark:text-zinc-500"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>

      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-zinc-300">
        {children}
      </div>
    </details>
  );
});
