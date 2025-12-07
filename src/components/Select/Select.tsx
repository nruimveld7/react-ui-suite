import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Dropdown } from "../Dropdown/Dropdown";
import { Popover } from "../Popover/Popover";
import { Check } from "../Combobox/icons";
import { useControlledState, useOutsideClick } from "../Combobox/hooks";

export type SelectOption = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

export type SelectProps = {
  label?: string;
  description?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  leadingContent?: React.ReactNode;
  inlineContent?: React.ReactNode;
};

export function Select({
  label,
  description,
  error,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  className,
  disabled,
  leadingContent,
  inlineContent,
}: SelectProps) {
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const chevronRef: React.MutableRefObject<HTMLButtonElement | null> = React.useRef(null);
  const popoverListRef: React.MutableRefObject<React.RefObject<HTMLUListElement> | null> =
    React.useRef(null);
  const suppressToggleRef = React.useRef(false);
  const id = React.useId();
  const listboxId = `${id}-listbox`;

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [selected, setSelected] = useControlledState<string | null>(value, defaultValue ?? null);

  useOutsideClick([containerRef as unknown as React.RefObject<HTMLElement | null>], () =>
    setOpen(false)
  );

  const selectedOption = options.find((opt) => opt.value === selected) ?? null;
  const selectedIndex = React.useMemo(
    () => options.findIndex((opt) => opt.value === selected),
    [options, selected]
  );
  const firstEnabled = React.useMemo(() => options.findIndex((o) => !o.disabled), [options]);
  const lastEnabled = React.useMemo(() => {
    for (let i = options.length - 1; i >= 0; i -= 1) {
      if (!options[i].disabled) return i;
    }
    return -1;
  }, [options]);

  const cycleEnabled = React.useCallback(
    (start: number, dir: 1 | -1) => {
      if (!options.length) return -1;
      let next = start;
      for (let i = 0; i < options.length; i += 1) {
        next = (next + dir + options.length) % options.length;
        if (!options[next].disabled) return next;
      }
      return -1;
    },
    [options]
  );

  const commitSelection = (index: number) => {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    setSelected(opt.value);
    onChange?.(opt.value);
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(selectedIndex !== -1 ? selectedIndex : firstEnabled);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isArrowDown = e.key === "ArrowDown" || e.code === "ArrowDown" || e.key === "Down";
    const isArrowUp = e.key === "ArrowUp" || e.code === "ArrowUp" || e.key === "Up";

    if (!open && (isArrowDown || isArrowUp)) {
      e.preventDefault();
      const direction: 1 | -1 = isArrowDown ? 1 : -1;
      const source = options;
      if (!source.length) return;
      const startIndex =
        selectedIndex === -1 ? (direction === 1 ? firstEnabled : lastEnabled) : selectedIndex;
      const nextIndex = startIndex === -1 ? -1 : cycleEnabled(startIndex, direction);
      if (nextIndex !== -1 && nextIndex !== selectedIndex) {
        commitSelection(nextIndex);
      }
      return;
    }

    if (!open && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openList();
      return;
    }

    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => {
          const start = prev === -1 ? firstEnabled : prev;
          return cycleEnabled(start, 1);
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => {
          const start = prev === -1 ? lastEnabled : prev;
          return cycleEnabled(start, -1);
        });
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(firstEnabled);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(lastEnabled);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0) commitSelection(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const refObj = popoverListRef.current;
    const el = refObj?.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const displayValue = selectedOption?.label ?? "";
  const highlightBorder = "border-slate-400 dark:border-slate-500";
  const listboxHighlight = open ? highlightBorder : "";

  return (
    <div className="space-y-1.5">
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
          {label}
        </p>
      ) : null}

      <Dropdown
        ref={containerRef}
        isOpen={open}
        disabled={disabled}
        placeholder={placeholder}
        displayValue={displayValue}
        query={displayValue}
        className={twMerge(
          "w-full",
          error &&
            "border-rose-300 focus-within:border-rose-400 focus-within:shadow-[0_0_0_1px_rgba(248,113,113,0.35)] dark:border-rose-500/60",
          className
        )}
        inputClassName="font-semibold"
        highlightClass={highlightBorder}
        ariaControls={listboxId}
        ariaLabel={label}
        inputRef={inputRef}
        chevronRef={chevronRef}
        leadingContent={leadingContent}
        inlineContent={inlineContent}
        onKeyDownCapture={handleKeyDown}
        onShellMouseDown={(e) => {
          if (disabled) return;
          if (chevronRef.current?.contains(e.target as Node)) return;
          if (!open) {
            e.preventDefault();
            openList();
            suppressToggleRef.current = true;
          }
        }}
        onInputMouseDown={(e) => {
          if (!open && !disabled) {
            e.preventDefault();
            openList();
          }
        }}
        onInputFocus={() => {
          if (suppressToggleRef.current) {
            suppressToggleRef.current = false;
          }
        }}
        onInputChange={() => {
          // No filtering for Select; keep displayed value static
        }}
        onChevronClick={() => {
          if (disabled) return;
          if (suppressToggleRef.current) {
            suppressToggleRef.current = false;
            setOpen((o) => !o);
            return;
          }
          setOpen((o) => !o);
        }}
      >
        {open && (
          <Popover className={listboxHighlight}>
            {({ scrollRef }) => {
              popoverListRef.current = scrollRef;
              return (
                <ul
                  ref={scrollRef}
                  id={listboxId}
                  role="listbox"
                  className="combobox-scrollbar max-h-64 overflow-auto px-1 pr-4"
                >
                  {options.map((opt, index) => {
                    const isSelected = selected === opt.value;
                    const isActive = activeIndex === index;
                    return (
                      <li key={opt.value} className="list-none" data-index={index}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          disabled={opt.disabled}
                          onMouseEnter={() => !opt.disabled && setActiveIndex(index)}
                          onClick={() => commitSelection(index)}
                          className={twMerge(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                            isActive
                              ? "bg-slate-100 text-slate-900 dark:bg-zinc-800/70 dark:text-zinc-100"
                              : "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800/70",
                            isSelected && "font-semibold",
                            opt.disabled && "cursor-not-allowed opacity-50"
                          )}
                        >
                          <span className="flex-1 text-left">
                            <span className="block text-slate-900 dark:text-zinc-100">
                              {opt.label}
                            </span>
                            {opt.description ? (
                              <span className="block text-xs text-slate-500 dark:text-zinc-400">
                                {opt.description}
                              </span>
                            ) : null}
                          </span>
                          {isSelected ? (
                            <Check className="ml-auto h-3 w-3 text-slate-600 dark:text-zinc-300" />
                          ) : (
                            <span className="ml-auto inline-flex h-3 w-3" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              );
            }}
          </Popover>
        )}
      </Dropdown>

      {description ? (
        <p className="text-xs text-slate-500 dark:text-zinc-400">{description}</p>
      ) : null}

      {error ? (
        <p className="text-xs font-medium text-rose-500 dark:text-rose-400">{error}</p>
      ) : null}
    </div>
  );
}
