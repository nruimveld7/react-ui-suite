import * as React from "react";
import { ChevronDown } from "../Combobox/icons";
import clsx from "clsx";
import "./Dropdown.css";

export type DropdownProps = {
  isOpen: boolean;
  disabled?: boolean;
  placeholder?: string;
  displayValue: string;
  query: string;
  className?: string;
  inputClassName?: string;
  highlightClass?: string;
  ariaControls?: string;
  ariaActiveDescendant?: string;
  ariaLabel?: string;
  shellClassName?: string;
  leadingContent?: React.ReactNode;
  inlineContent?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.Ref<HTMLInputElement>;
  chevronRef?: React.Ref<HTMLButtonElement>;
  showChevron?: boolean;
  onShellFocusCapture?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onShellBlurCapture?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onKeyDownCapture?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onShellMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onInputFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onInputMouseDown?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChevronClick?: () => void;
  children?: React.ReactNode;
};

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      isOpen,
      disabled,
      placeholder,
      displayValue,
      query,
      className,
      inputClassName,
      highlightClass,
      ariaControls,
      ariaActiveDescendant,
      ariaLabel,
      shellClassName,
      leadingContent,
      inlineContent,
      inputProps,
      inputRef,
      chevronRef,
      showChevron = true,
      onShellFocusCapture,
      onShellBlurCapture,
      onKeyDownCapture,
      onShellMouseDown,
      onInputFocus,
      onInputMouseDown,
      onInputChange,
      onChevronClick,
      children,
    },
    ref
  ) => {
    const focusClasses = !isOpen ? "rui-dropdown__focusWhenClosed" : "";

    const buttonClasses = "rui-dropdown__chevronButton";
    const inputClasses = clsx("rui-dropdown__input", inputClassName, inputProps?.className);
    const mergedPlaceholder = placeholder ?? inputProps?.placeholder;
    const mergedAriaLabel = ariaLabel ?? inputProps?.["aria-label"];

    return (
      <div ref={ref} className={clsx("rui-dropdown", className)}>
        <div
          onKeyDownCapture={onKeyDownCapture}
          onMouseDown={onShellMouseDown}
          onFocusCapture={onShellFocusCapture}
          onBlurCapture={onShellBlurCapture}
          className={clsx(
            "rui-dropdown__shell",
            focusClasses,
            isOpen && clsx("rui-dropdown__shell--open", highlightClass),
            disabled && "rui-dropdown__shell--disabled",
            shellClassName
          )}
        >
          {leadingContent ? <div className="rui-dropdown__leading">{leadingContent}</div> : null}
          <input
            {...inputProps}
            ref={inputRef}
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={ariaControls}
            aria-activedescendant={ariaActiveDescendant}
            aria-label={mergedAriaLabel}
            disabled={!!disabled || inputProps?.disabled}
            readOnly={!isOpen}
            onMouseDown={onInputMouseDown}
            value={isOpen ? query : displayValue}
            onFocus={onInputFocus}
            onChange={onInputChange}
            placeholder={mergedPlaceholder}
            className={inputClasses}
          />
          {inlineContent ? <div className="rui-dropdown__inline">{inlineContent}</div> : null}
          {showChevron ? (
            <button
              ref={chevronRef}
              type="button"
              aria-label={isOpen ? "Close" : "Open"}
              onClick={onChevronClick}
              className={buttonClasses}
              disabled={!!disabled}
            >
              <ChevronDown
                className={clsx("rui-dropdown__chevronIcon", isOpen && "rui-dropdown__chevronIcon--open")}
              />
            </button>
          ) : null}
        </div>
        {children}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
