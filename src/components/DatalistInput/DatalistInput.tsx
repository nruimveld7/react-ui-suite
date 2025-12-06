import * as React from "react";
import { twMerge } from "tailwind-merge";
import { useOutsideClick } from "../Combobox/hooks";
import { Dropdown } from "../Dropdown/Dropdown";
import { Popover } from "../Popover/Popover";

export type DatalistInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  options: string[];
};

export const DatalistInput = React.forwardRef<HTMLInputElement, DatalistInputProps>(
  function DatalistInput({ label, description, options, className, id, disabled, ...rest }, ref) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const descriptionId = React.useId();
    const dropdownRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
    const listboxRef: React.MutableRefObject<HTMLUListElement | null> = React.useRef(null);
    const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref && typeof ref === "object") (ref as any).current = node;
      },
      [ref]
    );
    const [query, setQuery] = React.useState(rest.defaultValue?.toString() ?? "");
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const listboxId = `${inputId}-listbox`;
    const activeDescendant = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;
    const controlledValue = rest.value?.toString();
    const displayValue = controlledValue ?? query;

    useOutsideClick([dropdownRef], () => setOpen(false));

    const filtered = React.useMemo(() => {
      if (!displayValue.trim()) return options;
      return options.filter((opt) => opt.toLowerCase().includes(displayValue.toLowerCase()));
    }, [options, displayValue]);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setQuery(controlledValue);
      }
    }, [controlledValue]);

    const emitChange = React.useCallback(
      (val: string) => {
        setQuery(val);
        rest.onChange?.({
          target: { value: val },
        } as React.ChangeEvent<HTMLInputElement>);
      },
      [rest]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        setOpen(true);
        setActiveIndex(0);
      }
      if (!open) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(filtered.length - 1, prev + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(0, prev - 1));
          break;
        case "Enter":
          if (activeIndex >= 0 && filtered[activeIndex]) {
            emitChange(filtered[activeIndex]);
            setOpen(false);
          }
          break;
        case "Escape":
          setOpen(false);
          break;
      }
    };

    const handleSelect = (val: string) => {
      emitChange(val);
      setOpen(false);
      inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setOpen(true);
      setActiveIndex(0);
      rest.onChange?.(e);
    };

    const setListRef = (
      node: HTMLUListElement | null,
      scrollRef: React.MutableRefObject<HTMLUListElement | null>
    ) => {
      scrollRef.current = node;
      listboxRef.current = node;
    };

    return (
      <div className="space-y-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400"
          >
            {label}
          </label>
        ) : null}
        <Dropdown
          ref={dropdownRef}
          isOpen={open}
          disabled={disabled}
          placeholder={rest.placeholder}
          displayValue={displayValue}
          query={displayValue}
          inputRef={mergedRef}
          showChevron={false}
          inlineContent={
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
              CMD
            </span>
          }
          onKeyDownCapture={handleKeyDown}
          onShellMouseDown={() => setOpen(true)}
          onInputFocus={() => setOpen(true)}
          onInputMouseDown={() => setOpen(true)}
          onInputChange={handleInputChange}
          ariaControls={listboxId}
          ariaActiveDescendant={activeDescendant}
          ariaLabel={rest["aria-label"]}
          inputClassName={className}
          inputProps={{
            ...rest,
            id: inputId,
            "aria-describedby": description ? descriptionId : rest["aria-describedby"],
          }}
        >
          {open && filtered.length ? (
            <Popover>
              {({ scrollRef }) => (
                <ul
                  ref={(node) => setListRef(node, scrollRef)}
                  id={listboxId}
                  role="listbox"
                  className="combobox-scrollbar max-h-56 overflow-auto py-1 text-sm text-slate-800 dark:text-zinc-100"
                >
                  {filtered.map((opt, index) => (
                    <li
                      key={opt}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => handleSelect(opt)}
                        className={twMerge(
                          "flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 dark:hover:bg-zinc-800/60",
                          index === activeIndex && "bg-slate-50 dark:bg-zinc-800/60"
                        )}
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                          cmd
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Popover>
          ) : null}
        </Dropdown>
        {description ? (
          <p id={descriptionId} className="text-xs text-slate-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
    );
  }
);
