import * as React from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import { Popover } from "../Popover/Popover";
import { useControlledState, useOutsideClick } from "./hooks";
import { Listbox } from "./Listbox";
import type { ComboboxOption, ComboboxProps } from "./types";
import { assignRef } from "../../utils/ref";
import clsx from "clsx";
import "./Combobox.css";

// Generic-preserving forwardRef wrapper
function InnerCombobox<T>(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = "Select.",
    disabled,
    className,
    listClassName,
    inputClassName,
    emptyState,
    renderOption,
    filter,
    openOnFocus = true,
    ariaLabel,
  }: ComboboxProps<T>,
  forwardedRef: React.ForwardedRef<HTMLInputElement>
) {
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const chevronRef: React.MutableRefObject<HTMLButtonElement | null> = React.useRef(null);
  const popoverRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const outsideClickRefs = React.useMemo(
    () => [
      containerRef as unknown as React.RefObject<HTMLElement | null>,
      popoverRef as unknown as React.RefObject<HTMLElement | null>,
    ],
    [containerRef, popoverRef]
  );
  const mergedInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    assignRef(forwardedRef, node);
  };

  const [open, setOpen] = React.useState(false);
  const closeOnOutsideClick = React.useCallback(() => setOpen(false), []);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const suppressNextOpenRef = React.useRef(false);
  const closeAfterSelectRef = React.useRef(false);
  const prevOpenRef = React.useRef(open);

  const [selected, setSelected] = useControlledState<ComboboxOption<T> | null>(
    valueProp,
    defaultValue ?? null
  );
  const isEffectivelyOpen = open && !suppressNextOpenRef.current;

  // a11y ids
  const id = React.useId();
  const listboxId = `${id}-listbox`;

  const normalizedFilter = React.useMemo(() => {
    if (filter) return filter;
    return (opt: ComboboxOption, q: string) =>
      opt.label.toLowerCase().includes(q.trim().toLowerCase());
  }, [filter]);

  const visibleOptions = React.useMemo(() => {
    const base = options ?? [];
    return query ? base.filter((o) => normalizedFilter(o, query)) : base;
  }, [options, query, normalizedFilter]);

  const selectedOptionIndex = React.useMemo(() => {
    if (!selected) return -1;
    const indexFromOptions = (options ?? []).findIndex((option) => option.id === selected.id);
    if (indexFromOptions !== -1) return indexFromOptions;
    return visibleOptions.findIndex((option) => option.id === selected.id);
  }, [options, visibleOptions, selected]);

  const firstEnabledOptionIndex = React.useMemo(() => {
    if (!options) return -1;
    return options.findIndex((option) => !option.disabled);
  }, [options]);

  const lastEnabledOptionIndex = React.useMemo(() => {
    if (!options) return -1;
    for (let i = options.length - 1; i >= 0; i -= 1) {
      if (!options[i].disabled) {
        return i;
      }
    }
    return -1;
  }, [options]);

  const cycleEnabledOptionIndex = React.useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (!options || options.length === 0) return -1;
      let next = startIndex;
      for (let i = 0; i < options.length; i += 1) {
        next = (next + direction + options.length) % options.length;
        if (!options[next].disabled) return next;
      }
      return -1;
    },
    [options]
  );

  const selectedIndex = React.useMemo(() => {
    if (!selected) return -1;
    return visibleOptions.findIndex((option) => option.id === selected.id);
  }, [visibleOptions, selected]);

  const firstEnabledIndex = React.useMemo(() => {
    return visibleOptions.findIndex((option) => !option.disabled);
  }, [visibleOptions]);

  const lastEnabledIndex = React.useMemo(() => {
    for (let i = visibleOptions.length - 1; i >= 0; i -= 1) {
      if (!visibleOptions[i].disabled) {
        return i;
      }
    }
    return -1;
  }, [visibleOptions]);

  const cycleEnabledIndex = React.useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (visibleOptions.length === 0) return -1;
      let next = startIndex;
      for (let i = 0; i < visibleOptions.length; i += 1) {
        next = (next + direction + visibleOptions.length) % visibleOptions.length;
        if (!visibleOptions[next].disabled) return next;
      }
      return -1;
    },
    [visibleOptions]
  );

  // keep activeIndex in range
  React.useEffect(() => {
    if (visibleOptions.length === 0) {
      setActiveIndex(-1);
      return;
    }
    if (activeIndex >= visibleOptions.length) setActiveIndex(visibleOptions.length - 1);
  }, [visibleOptions, activeIndex]);

  React.useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    if (open && !wasOpen) {
      const initialIndex = selectedIndex !== -1 ? selectedIndex : firstEnabledIndex;
      setActiveIndex(initialIndex);
    }
    if (!open && wasOpen) {
      setActiveIndex(-1);
    }
  }, [open, selectedIndex, firstEnabledIndex]);

  React.useLayoutEffect(() => {
    // If something tries to reopen immediately after we intentionally cycled while closed, re-close.
    if (open && suppressNextOpenRef.current) {
      suppressNextOpenRef.current = false;
      setOpen(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (!closeAfterSelectRef.current) return;
    if (open) {
      setOpen(false);
      return;
    }
    closeAfterSelectRef.current = false;
  }, [open]);

  // Accept HTMLElement | null refs (matches hook signature)
  useOutsideClick(outsideClickRefs, closeOnOutsideClick);

  function commitSelection(opt: ComboboxOption<T> | null, opts: { refocus?: boolean } = {}) {
    const { refocus = true } = opts;
    closeAfterSelectRef.current = true;
    setSelected(opt);
    onChange?.(opt);
    if (opt) setQuery("");
    setOpen(false);
    if (refocus) {
      suppressNextOpenRef.current = true;
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const isArrowDown = e.key === "ArrowDown" || e.code === "ArrowDown" || e.key === "Down";
    const isArrowUp = e.key === "ArrowUp" || e.code === "ArrowUp" || e.key === "Up";

    if (isArrowDown || isArrowUp) {
      e.preventDefault();
      const direction = isArrowDown ? 1 : -1;

      if (!open) {
        suppressNextOpenRef.current = true; // avoid accidental reopen if focus moves
        const source = options ?? [];
        if (source.length === 0) return;

        if (selectedOptionIndex === -1) {
          const fallbackIndex = direction === 1 ? firstEnabledOptionIndex : lastEnabledOptionIndex;
          if (fallbackIndex !== -1) {
            commitSelection(source[fallbackIndex], { refocus: false });
          }
        } else {
          const nextIndex = cycleEnabledOptionIndex(selectedOptionIndex, direction);
          if (nextIndex !== -1 && nextIndex !== selectedOptionIndex) {
            commitSelection(source[nextIndex], { refocus: false });
          }
        }
        return;
      }

      const baseIndex =
        activeIndex === -1 ? (direction === 1 ? firstEnabledIndex : lastEnabledIndex) : activeIndex;
      if (baseIndex === -1) return;

      const next = cycleEnabledIndex(baseIndex, direction);
      if (next !== -1) {
        setActiveIndex(next);
      }
      return;
    }

    if (!open && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      suppressNextOpenRef.current = false;
      setOpen(true);
      return;
    }

    if (!open) return;

    switch (e.key) {
      case "Home": {
        if (firstEnabledIndex !== -1) {
          e.preventDefault();
          setActiveIndex(firstEnabledIndex);
        }
        break;
      }
      case "End": {
        if (lastEnabledIndex !== -1) {
          e.preventDefault();
          setActiveIndex(lastEnabledIndex);
        }
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (activeIndex >= 0 && !visibleOptions[activeIndex].disabled) {
          commitSelection(visibleOptions[activeIndex]);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        setOpen(false);
        break;
      }
    }
  }

  const selectedLabel = selected?.label ?? "";
  const selectedId = selected?.id ?? null;

  const highlightBorder = "rui-combobox__highlightBorder";

  const listboxHighlight = isEffectivelyOpen ? highlightBorder : "";

  function openList() {
    if (disabled) return;
    suppressNextOpenRef.current = false;
    setOpen(true);
    setQuery("");
    const initialIndex = selectedIndex !== -1 ? selectedIndex : firstEnabledIndex;
    setActiveIndex(initialIndex);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <Dropdown
      ref={containerRef}
      isOpen={isEffectivelyOpen}
      disabled={disabled}
      placeholder={placeholder}
      displayValue={selectedLabel}
      query={query}
      className={className}
      inputClassName={inputClassName}
      highlightClass={highlightBorder}
      ariaControls={listboxId}
      ariaActiveDescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
      ariaLabel={ariaLabel}
      inputRef={mergedInputRef}
      chevronRef={chevronRef}
      onKeyDownCapture={onKeyDown}
      onShellMouseDown={(e) => {
        if (disabled) return;
        if (!isEffectivelyOpen) {
          e.preventDefault();
          openList();
        }
      }}
      onInputMouseDown={(e) => {
        if (!open && !disabled) {
          e.preventDefault();
          openList();
        }
      }}
      onInputFocus={() => {
        if (suppressNextOpenRef.current) {
          suppressNextOpenRef.current = false;
          return;
        }
        if (openOnFocus && !disabled) {
          setOpen(true);
          setQuery("");
          const initialIndex = selectedIndex !== -1 ? selectedIndex : firstEnabledIndex;
          setActiveIndex(initialIndex);
        }
      }}
      onInputChange={(e) => {
        setQuery(e.target.value);
        if (!open) {
          suppressNextOpenRef.current = false;
          setOpen(true);
        }
      }}
      onChevronClick={() => {
        if (disabled) return;
        if (!isEffectivelyOpen) {
          openList();
          return;
        }
        requestAnimationFrame(() => inputRef.current?.focus());
      }}
    >
      {isEffectivelyOpen && (
        <Popover
          anchorRef={containerRef}
          rootRef={popoverRef}
          className={clsx(listboxHighlight, listClassName)}
        >
          {({ scrollRef }) => (
            <Listbox
              id={listboxId}
              options={visibleOptions}
              activeIndex={activeIndex}
              selectedId={selectedId}
              onHoverIndex={setActiveIndex}
              onSelectIndex={(i) => commitSelection(visibleOptions[i])}
              listRef={scrollRef}
              emptyState={emptyState}
              renderOption={renderOption}
            />
          )}
        </Popover>
      )}
    </Dropdown>
  );
}

export const Combobox = React.forwardRef(InnerCombobox) as <T>(
  props: ComboboxProps<T> & React.RefAttributes<HTMLInputElement>
) => React.ReactElement | null;




