import * as React from "react";
import { Check } from "./icons";
import type { ComboboxOption, ComboboxRenderState } from "./types";
import clsx from "clsx";
import "./Combobox.css";

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
      className={clsx("combobox-scrollbar rui-combobox__listbox")}
    >
      {options.length === 0 && (
        <li aria-disabled className="rui-combobox__empty">
          <div className="rui-combobox__empty-content">
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
            className="rui-combobox__option"
            onMouseEnter={() => !opt.disabled && onHoverIndex(i)}
            onMouseDown={(e) => e.preventDefault()} // keep focus on input
            onClick={() => !opt.disabled && onSelectIndex(i)}
          >
            {renderOption ? (
              renderOption(opt, optionState)
            ) : (
              <div
                className={clsx(
                  "rui-combobox__option-row",
                  active && "rui-combobox__option-row--active",
                  opt.disabled && "rui-combobox__option-row--disabled"
                )}
              >
                <span className="rui-combobox__option-label">{opt.label}</span>
                {selected ? (
                  <Check className="rui-combobox__option-icon" />
                ) : (
                  <span className="rui-combobox__option-icon-placeholder" />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
