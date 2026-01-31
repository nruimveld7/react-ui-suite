import * as React from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import { Popover } from "../Popover/Popover";
import { Check } from "../Combobox/icons";
import { useControlledState, useOutsideClick } from "../Combobox/hooks";
import clsx from "clsx";
import "./Select.css";

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
  const [activeIndexState, setActiveIndexState] = React.useState(-1);
  const activeIndexRef = React.useRef(activeIndexState);
  const setActiveIndex = React.useCallback(
    (value: React.SetStateAction<number>) => {
      setActiveIndexState((prev) => {
        const next = typeof value === "function" ? (value as (current: number) => number)(prev) : value;
        activeIndexRef.current = next;
        return next;
      });
    },
    []
  );
  const activeIndex = activeIndexState;
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
        if (activeIndexRef.current >= 0) commitSelection(activeIndexRef.current);
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
  const highlightBorder = "rui-select__highlightBorder";
  const listboxHighlight = open ? highlightBorder : "";

  return (
    <div className="rui-select__u-style--5a2508227c rui-root">
      {label ? (
        <p className="rui-select__u-font-size-0-75rem--359090c2d5 rui-select__u-font-weight-600--e83a7042bc rui-select__u-text-transform-uppercase--117ec720ea rui-select__u-letter-spacing-0-2em--2da1a7016e rui-select__u-rui-text-opacity-1--30426eb75c rui-select__u-rui-text-opacity-1--6462b86910 rui-text-wrap">
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
        className={clsx(
          "rui-select__u-width-100--6da6a3c3f7",
          error &&
            "rui-select__u-rui-border-opacity-1--3b7f978155 rui-select__u-rui-border-opacity-1--6fe003501e rui-select__u-rui-shadow-0-0-0-1px-rgba-248-11--633a78b9cd rui-select__u-border-color-rgb-244-63-94-0-6--99963c86d9",
          className
        )}
        inputClassName="rui-select__input"
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
          <Popover anchorRef={containerRef} className={listboxHighlight}>
            {({ scrollRef }) => {
              popoverListRef.current = scrollRef;
              return (
                <ul
                  ref={scrollRef}
                  id={listboxId}
                  role="listbox"
                  className="combobox-scrollbar rui-select__list rui-select__u-max-height-16rem--8aee2b07b4 rui-select__u-overflow-auto--73fc3fb18c"
                >
                  {options.map((opt, index) => {
                    const isSelected = selected === opt.value;
                    const isActive = activeIndex === index;
                    return (
                      <li key={opt.value} className="rui-select__option" data-index={index}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          disabled={opt.disabled}
                          onMouseEnter={() => !opt.disabled && setActiveIndex(index)}
                          onClick={() => commitSelection(index)}
                          className={clsx(
                            "rui-select__option-button rui-select__u-display-flex--60fbb77139 rui-select__u-width-100--6da6a3c3f7 rui-select__u-align-items-center--3960ffc248 rui-select__u-gap-0-75rem--1004c0c395 rui-select__u-border-radius-0-75rem--a217b4eaa9 rui-select__u-padding-left-0-75rem--0e17f2bd90 rui-select__u-padding-top-0-5rem--03b4dd7f17 rui-select__u-text-align-left--2eba0d65d0 rui-select__u-font-size-0-875rem--fc7473ca09 rui-select__u-font-weight-500--2689f39580 rui-select__u-transition-property-color-backgr--56bf8ae82a",
                            isActive
                              ? "rui-select__u-rui-bg-opacity-1--34d54ab9e5 rui-select__u-rui-text-opacity-1--f5f136c41d rui-select__u-background-color-rgb-39-39-42-0---b37a7836e7 rui-select__u-rui-text-opacity-1--3ddc1cab99"
                              : "rui-select__u-rui-text-opacity-1--bcbca7a5be rui-select__u-rui-bg-opacity-1--f3653f7e77 rui-select__u-rui-text-opacity-1--270353156a rui-select__u-background-color-rgb-39-39-42-0---2531b09202",
                            isSelected && "rui-select__option-button--selected",
                            opt.disabled && "rui-select__u-cursor-not-allowed--29b733e4c1 rui-select__u-opacity-0-5--0b8c506a05"
                          )}
                        >
                          <span className="rui-select__u-flex-1-1-0--36e579c0b4 rui-select__u-text-align-left--2eba0d65d0">
                            <span className="rui-select__option-label rui-select__u-display-block--0214b4b355 rui-select__u-rui-text-opacity-1--f5f136c41d rui-select__u-rui-text-opacity-1--3ddc1cab99 rui-text-wrap">
                              {opt.label}
                            </span>
                            {opt.description ? (
                              <span className="rui-select__option-description rui-select__u-display-block--0214b4b355 rui-select__u-font-size-0-75rem--359090c2d5 rui-select__u-rui-text-opacity-1--30426eb75c rui-select__u-rui-text-opacity-1--6462b86910 rui-text-wrap">
                                {opt.description}
                              </span>
                            ) : null}
                          </span>
                          {isSelected ? (
                            <Check className="rui-select__option-check rui-select__u-rui-text-opacity-1--2d6fbf48fa rui-select__u-rui-text-opacity-1--5b8efd1d78" />
                          ) : (
                            <span className="rui-select__option-check-placeholder" />
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
        <p className="rui-select__u-font-size-0-75rem--359090c2d5 rui-select__u-rui-text-opacity-1--30426eb75c rui-select__u-rui-text-opacity-1--6462b86910 rui-text-wrap">{description}</p>
      ) : null}

      {error ? (
        <p className="rui-select__u-font-size-0-75rem--359090c2d5 rui-select__u-font-weight-500--2689f39580 rui-select__u-rui-text-opacity-1--fa51279820 rui-select__u-rui-text-opacity-1--897de47303 rui-text-wrap">{error}</p>
      ) : null}
    </div>
  );
}


