import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from ".";

describe("Toggle", () => {
  it("toggles in uncontrolled mode and exposes aria state", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Notifications" />);

    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("respects controlled usage and disabled flag", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Toggle aria-label="Power" checked={false} onChange={handleChange} disabled />);

    const toggle = screen.getByRole("switch", { name: "Power" });
    await user.click(toggle);
    expect(handleChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("keeps visual state controlled while still emitting changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Toggle aria-label="Wifi" checked={false} onChange={handleChange} />);

    const toggle = screen.getByRole("switch", { name: "Wifi" });
    await user.click(toggle);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });
});
