import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker } from "../ColorPicker";

describe("ColorPicker", () => {
  it("renders hidden input with normalized value and accessible trigger", () => {
    const { container } = render(<ColorPicker label="Brand color" defaultValue="#123abc" />);

    const trigger = screen.getByRole("button", { name: /adjust brand color/i });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue("#123ABC");
  });

  it("emits onChange when selecting a swatch", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <ColorPicker
        label="Accent"
        defaultValue="#111111"
        swatches={["#654321"]}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /adjust accent/i }));
    await user.click(screen.getByRole("button", { name: "Select #654321" }));

    expect(handleChange).toHaveBeenCalledWith("#654321");
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue("#654321");
  });
});
