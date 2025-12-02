import type React from "react";

export type ComboboxOption<T = unknown> = {
  id: string;        // unique, stable id
  label: string;     // text shown to the user
  value?: T;         // your domain payload (e.g., FQBN)
  disabled?: boolean;
};

export type ComboboxRenderState = {
  active: boolean;
  selected: boolean;
};

export type ComboboxProps<T = unknown> = {
  options: ComboboxOption<T>[];
  value?: ComboboxOption<T> | null;         // controlled value
  defaultValue?: ComboboxOption<T> | null;  // uncontrolled initial value
  onChange?: (option: ComboboxOption<T> | null) => void;

  placeholder?: string;
  disabled?: boolean;

  className?: string;       // container
  listClassName?: string;   // popup list container
  inputClassName?: string;  // text input

  emptyState?: React.ReactNode; // when no results
  renderOption?: (opt: ComboboxOption<T>, state: ComboboxRenderState) => React.ReactNode;
  filter?: (opt: ComboboxOption<T>, query: string) => boolean; // custom filter; default label.includes

  openOnFocus?: boolean; // default true
  ariaLabel?: string;    // if no visible <label>
};
