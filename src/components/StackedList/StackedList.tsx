import * as React from "react";
import { twMerge } from "tailwind-merge";

export type StackedListItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
};

export type StackedListProps = React.HTMLAttributes<HTMLDivElement> & {
  items: StackedListItem[];
  dense?: boolean;
};

export function StackedList({ items, dense, className, ...rest }: StackedListProps) {
  return (
    <div
      {...rest}
      className={twMerge(
        "rounded-3xl border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none",
        className
      )}
    >
      <ul role="list" className="divide-y divide-slate-100 dark:divide-zinc-800">
        {items.map((item) => (
          <li
            key={item.id}
            className={twMerge("flex items-start gap-4 px-5 py-4", dense && "py-3")}
          >
            {item.icon ? (
              <div
                className="mt-0.5 rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-zinc-900/50 dark:text-zinc-200"
                aria-hidden="true"
              >
                {item.icon}
              </div>
            ) : null}
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                {item.title}
              </p>
              {item.description ? (
                <p className="text-sm text-slate-500 dark:text-zinc-400">{item.description}</p>
              ) : null}
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              {item.meta ? (
                <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-zinc-500">
                  {item.meta}
                </span>
              ) : null}
              {item.action}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
