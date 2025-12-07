import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { DatalistInput } from ".";

describe("DatalistInput", () => {
  it("filters options and emits onChange when an item is chosen", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatalistInput
        label="Command palette"
        options={["Reload Window", "Rebuild Project"]}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("combobox", { name: "Command palette" });
    await user.click(input);
    await user.type(input, "Reb");

    const optionButton = await screen.findByRole("button", { name: /Rebuild Project/i });
    await user.click(optionButton);

    expect(handleChange).toHaveBeenCalled();
    const values = handleChange.mock.calls.map(
      ([event]) => (event as ChangeEvent<HTMLInputElement>).target.value
    );
    expect(values).toContain("Rebuild Project");
    expect(input).toHaveValue("Rebuild Project");
  });

  it("mirrors controlled values and keeps aria-describedby hints", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <DatalistInput
        label="Command palette"
        description="System command"
        value="Reload Window"
        options={["Reload Window", "Rebuild Project"]}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("combobox", { name: "Command palette" });
    expect(input).toHaveValue("Reload Window");
    expect(input).toHaveAttribute("aria-describedby");

    await user.type(input, "Foo");
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("Reload Window");
  });

  it("supports keyboard navigation in the options list", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <DatalistInput
        options={["Reload Window", "Rebuild Project"]}
        onChange={handleChange}
        label="Command palette"
      />
    );

    const input = screen.getByRole("combobox", { name: "Command palette" });
    await user.click(input);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(handleChange).toHaveBeenCalled();
    const event = handleChange.mock.calls.at(-1)?.[0] as ChangeEvent<HTMLInputElement>;
    expect(event.target.value).toBe("Reload Window");
  });

  it("closes the list on Escape or outside clicks", async () => {
    const user = userEvent.setup();
    render(<DatalistInput label="Commands" options={["Reload Window"]} />);
    const input = screen.getByRole("combobox", { name: "Commands" });

    await user.click(input);
    expect(await screen.findByRole("button", { name: /reload window/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("button", { name: /reload window/i })).toBeNull();

    await user.click(input);
    fireEvent.mouseDown(document.body);
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /reload window/i })).toBeNull()
    );
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<DatalistInput label="Commands" options={["Reload Window"]} disabled />);

    const input = screen.getByRole("combobox", { name: "Commands" });
    await user.click(input);
    expect(screen.queryByRole("button", { name: /reload window/i })).toBeNull();
  });
});


