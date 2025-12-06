import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dropdown } from "../Dropdown";

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
});
