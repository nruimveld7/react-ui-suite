import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "./icons";
import type { ComboboxOption, ComboboxRenderState } from "./types";

export type ListboxProps<T> = {
  id: string; // listbox id for aria-controls
  options: ComboboxOption<T>[]; // visible, filtered options
  activeIndex: number; // highlighted index
  selectedId?: string | null; // current selection id (if any)
  onHoverIndex: (i: number) => void; // set active on hover
  onSelectIndex: (i: number) => void; // commit selection on click
  listRef: React.RefObject<HTMLUListElement>; // scroll container
  emptyState?: React.ReactNode;
  renderOption?: (opt: ComboboxOption<T>, state: ComboboxRenderState) => React.ReactNode;
};

export function Listbox<T>({
  id,
  options,
  activeIndex,
  selectedId,
  onHoverIndex,
  onSelectIndex,
  listRef,
  emptyState,
  renderOption,
}: ListboxProps<T>) {
  // Keep active option scrolled into view
  React.useEffect(() => {
    if (activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listRef]);

  return (
    <ul
      ref={listRef}
      id={id}
      role="listbox"
      className={twMerge("combobox-scrollbar max-h-64 overflow-auto px-1 pr-4")}
    >
      {options.length === 0 && (
        <li aria-disabled className="select-none">
          <div className="px-3 py-2 text-sm text-slate-500 dark:text-zinc-500">
            {emptyState ?? "No results"}
          </div>
        </li>
      )}

      {options.map((opt, i) => {
        const selected = opt.id === selectedId;
        const active = i === activeIndex;
        const optionState: ComboboxRenderState = { active, selected };
        return (
          <li
            key={opt.id}
            id={`${id}-option-${i}`}
            role="option"
            aria-selected={selected}
            aria-disabled={opt.disabled}
            data-index={i}
            className="list-none"
            onMouseEnter={() => !opt.disabled && onHoverIndex(i)}
            onMouseDown={(e) => e.preventDefault()} // keep focus on input
            onClick={() => !opt.disabled && onSelectIndex(i)}
          >
            {renderOption ? (
              renderOption(opt, optionState)
            ) : (
              <div
                className={twMerge(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm",
                  active
                    ? "bg-slate-100 text-slate-900 dark:bg-zinc-800/70 dark:text-zinc-100"
                    : "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800/70",
                  opt.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {selected ? (
                  <Check className="ml-auto h-3 w-3 text-slate-600 dark:text-zinc-300" />
                ) : (
                  <span className="ml-auto inline-flex h-3 w-3" />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
