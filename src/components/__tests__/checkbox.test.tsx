import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "../Checkbox";

describe("Checkbox", () => {
  it("toggles when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Marketing updates" />);

    const input = screen.getByRole("checkbox", { name: "Marketing updates" });
    expect(input).not.toBeChecked();

    await user.click(input);
    expect(input).toBeChecked();
  });

  it("calls onChange with the next state", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox label="Terms" onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox", { name: "Terms" }));
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
