import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "../DatePicker";

describe("DatePicker", () => {
  it("opens the calendar and commits a selected day", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePicker label="Due date" defaultValue="2024-01-15" onChange={handleChange} />);

    const input = screen.getByRole("combobox", { name: "Due date" });
    await user.click(input);

    const day = await screen.findByRole("button", { name: "20" });
    await user.click(day);

    expect(handleChange).toHaveBeenCalledWith("2024-01-20");
  });
});
