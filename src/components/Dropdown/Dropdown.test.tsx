import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dropdown } from ".";

describe("Dropdown", () => {
  it("renders combobox input and triggers chevron click handler", async () => {
    const user = userEvent.setup();
    const handleChevron = vi.fn();
    const inputRef = vi.fn();

    const { rerender } = render(
      <Dropdown
        isOpen={false}
        displayValue="Alpha"
        query="Alpha"
        placeholder="Select"
        inputRef={inputRef}
        onChevronClick={handleChevron}
      />
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveValue("Alpha");
    expect(combobox).toHaveAttribute("aria-expanded", "false");

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(handleChevron).toHaveBeenCalledTimes(1);

    rerender(
      <Dropdown
        isOpen
        displayValue="Selected"
        query="Searching"
        placeholder="Select"
        inputRef={inputRef}
        onChevronClick={handleChevron}
      />
    );

    expect(combobox).toHaveValue("Searching");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
  });

  it("renders leading and inline content and can hide the chevron", () => {
    render(
      <Dropdown
        isOpen
        displayValue="Selected"
        query="Query"
        inputRef={vi.fn()}
        leadingContent={<span data-testid="leading">Lead</span>}
        inlineContent={<span data-testid="inline">Inline</span>}
        showChevron={false}
      />
    );

    expect(screen.getByTestId("leading")).toBeInTheDocument();
    expect(screen.getByTestId("inline")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /open/i })).toBeNull();
  });

  it("applies aria attributes and readOnly state", () => {
    const inputRef = vi.fn();
    const { rerender } = render(
      <Dropdown
        isOpen={false}
        displayValue="Value"
        query="Query"
        inputRef={inputRef}
        ariaControls="listbox-id"
        ariaActiveDescendant="listbox-id-option-1"
      />
    );

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-controls", "listbox-id");
    expect(input).toHaveAttribute("aria-activedescendant", "listbox-id-option-1");
    expect(input).toHaveAttribute("readonly", "");

    rerender(
      <Dropdown
        isOpen
        displayValue="Value"
        query="Query"
        inputRef={inputRef}
        ariaControls="listbox-id"
        ariaActiveDescendant="listbox-id-option-1"
      />
    );

    expect(input).not.toHaveAttribute("readonly");
  });

  it("disables the input and chevron when requested", () => {
    render(
      <Dropdown
        isOpen={false}
        disabled
        displayValue="Disabled"
        query="Disabled"
        inputRef={vi.fn()}
        onChevronClick={vi.fn()}
      />
    );

    const input = screen.getByRole("combobox");
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: /open/i })).toBeDisabled();
  });
});


