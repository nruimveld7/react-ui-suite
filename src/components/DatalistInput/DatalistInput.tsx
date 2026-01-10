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
      <div className="rui-datalist-input__u-style--5a2508227c">
        {label ? (
          <label
            htmlFor={inputId}
            className="rui-datalist-input__u-font-size-0-75rem--359090c2d5 rui-datalist-input__u-font-weight-600--e83a7042bc rui-datalist-input__u-text-transform-uppercase--117ec720ea rui-datalist-input__u-letter-spacing-0-2em--2da1a7016e rui-datalist-input__u-color-rgb-100-116-139-1--30426eb75c rui-datalist-input__u-color-rgb-161-161-170-1--6462b86910"
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
            <span className="rui-datalist-input__u-font-size-11px--d058ca6de6 rui-datalist-input__u-font-weight-600--e83a7042bc rui-datalist-input__u-text-transform-uppercase--117ec720ea rui-datalist-input__u-letter-spacing-0-2em--2da1a7016e rui-datalist-input__u-color-rgb-148-163-184-1--8d44cef396 rui-datalist-input__u-color-rgb-113-113-122-1--28db7d8770">
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
                  className="combobox-scrollbar rui-datalist-input__list"
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
                        <span className="rui-datalist-input__option-text">{opt}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Popover>
          ) : null}
        </Dropdown>
        {description ? (
          <p id={descriptionId} className="rui-datalist-input__u-font-size-0-75rem--359090c2d5 rui-datalist-input__u-color-rgb-100-116-139-1--30426eb75c rui-datalist-input__u-color-rgb-161-161-170-1--6462b86910">
            {description}
          </p>
        ) : null}
      </div>
    );
  }
);
