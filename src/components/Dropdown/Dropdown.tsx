import * as React from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "../Combobox/icons";

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
    const focusClasses = !isOpen
      ? "focus-within:border-slate-400 focus-within:shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:focus-within:border-slate-500"
      : "";

    const buttonClasses =
      "inline-flex h-9 w-10 items-center justify-center rounded-xl bg-transparent text-sm text-slate-600 transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-200";
    const inputClasses = twMerge(
      "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500",
      inputClassName,
      inputProps?.className
    );
    const mergedPlaceholder = placeholder ?? inputProps?.placeholder;
    const mergedAriaLabel = ariaLabel ?? inputProps?.["aria-label"];

    return (
      <div ref={ref} className={twMerge("relative w-full", className)}>
        <div
          onKeyDownCapture={onKeyDownCapture}
          onMouseDown={onShellMouseDown}
          onFocusCapture={onShellFocusCapture}
          onBlurCapture={onShellBlurCapture}
          className={twMerge(
            "flex h-11 items-center gap-1 rounded-2xl border border-slate-300 bg-white pl-3 pr-1 text-slate-900 shadow-sm transition dark:border-zinc-700/60 dark:bg-zinc-900/70 dark:text-zinc-100",
            focusClasses,
            isOpen && twMerge("rounded-b-none border-b-0 dark:border-b-0", highlightClass),
            disabled && "opacity-60",
            shellClassName
          )}
        >
          {leadingContent ? <div className="flex items-center">{leadingContent}</div> : null}
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
        {inlineContent ? <div className="flex items-center gap-2">{inlineContent}</div> : null}
        {showChevron ? (
          <button
            ref={chevronRef}
            type="button"
            aria-label={isOpen ? "Close" : "Open"}
            onClick={onChevronClick}
            className={buttonClasses}
            disabled={!!disabled}
          >
            <ChevronDown className={twMerge("size-4 transition-transform", isOpen && "rotate-180")} />
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}
);

Dropdown.displayName = "Dropdown";
