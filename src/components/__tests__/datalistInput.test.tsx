import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { DatalistInput } from "../DatalistInput";

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
});
