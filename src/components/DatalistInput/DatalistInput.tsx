import * as React from "react";
import { useOutsideClick } from "../Combobox/hooks";
import { Dropdown } from "../Dropdown/Dropdown";
import { Popover } from "../Popover/Popover";
import { assignRef } from "../../utils/ref";
import clsx from "clsx";
import "./DatalistInput.css";

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
        assignRef(ref, node);
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

    const emitChange = (val: string) => {
      setQuery(val);
      rest.onChange?.({
        target: { value: val },
      } as React.ChangeEvent<HTMLInputElement>);
    };

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
      <div className="rui-datalist-input rui-root">
        {label ? (
          <label
            htmlFor={inputId}
            className="rui-datalist-input__label rui-text-wrap"
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
            <span className="rui-datalist-input__inline-key">
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
            <Popover anchorRef={dropdownRef}>
              {({ scrollRef }) => (
                <ul
                  ref={(node) => setListRef(node, scrollRef)}
                  id={listboxId}
                  role="listbox"
                  className="rui-datalist-input__list"
                >
                  {filtered.map((opt, index) => (
                    <li
                      key={opt}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      className="rui-datalist-input__option"
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => handleSelect(opt)}
                        className={clsx(
                          "rui-datalist-input__option-button",
                          index === activeIndex && "is-active"
                        )}
                      >
                        <span className="rui-datalist-input__option-key">
                          cmd
                        </span>
                        <span className="rui-datalist-input__option-text rui-text-truncate">{opt}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Popover>
          ) : null}
        </Dropdown>
        {description ? (
          <p id={descriptionId} className="rui-datalist-input__description rui-text-wrap">
            {description}
          </p>
        ) : null}
      </div>
    );
  }
);


