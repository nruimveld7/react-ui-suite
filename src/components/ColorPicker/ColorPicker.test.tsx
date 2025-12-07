import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker } from ".";

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

  it("normalizes controlled values and keeps hidden input in sync", () => {
    const { container } = render(<ColorPicker label="Accent" value="#abc" />);
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue("#AABBCC");
  });

  it("allows adding swatches and editing channel values", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ColorPicker
        label="Custom"
        defaultValue="#101010"
        swatches={[]}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /adjust custom/i }));
    expect(screen.queryByRole("button", { name: "Select #101010" })).toBeNull();

    await user.click(screen.getByRole("button", { name: /\+ add swatch/i }));
    expect(screen.getByRole("button", { name: "Select #101010" })).toBeInTheDocument();

    const hexInput = screen.getByRole("textbox", { name: "#" });
    await user.clear(hexInput);
    await user.type(hexInput, "ffffff");
    expect(handleChange).toHaveBeenCalledWith("#FFFFFF");
  });

  it("closes the dialog on outside click and Escape", async () => {
    const user = userEvent.setup();
    render(<ColorPicker label="Brand" />);

    const trigger = screen.getByRole("button", { name: /adjust brand/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /brand color picker/i })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /color picker/i })).not.toBeInTheDocument()
    );

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /color picker/i })).not.toBeInTheDocument();
  });

  it("supports channel editing and removing swatches", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ColorPicker label="Custom" defaultValue="#abc123" swatches={["#ABC123", "#123456"]} />
    );

    await user.click(screen.getByRole("button", { name: /adjust custom/i }));
    await user.click(screen.getByRole("button", { name: "RGB" }));

    const redInput = screen.getByLabelText("R");
    await user.clear(redInput);
    await user.type(redInput, "255");

    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue("#FFC123");

    const removeButton = screen.getByRole("button", { name: /remove #123456 swatch/i });
    await user.click(removeButton);
    expect(screen.queryByRole("button", { name: "Select #123456" })).not.toBeInTheDocument();
  });

  it("switches channel formats and updates HSL values", async () => {
    const user = userEvent.setup();
    const { container } = render(<ColorPicker label="Accent" defaultValue="#101010" />);

    await user.click(screen.getByRole("button", { name: /adjust accent/i }));
    await user.click(screen.getByRole("button", { name: "HSL" }));

    const hueInput = screen.getByLabelText("H");
    const satInput = screen.getByLabelText("S");
    const lightInput = screen.getByLabelText("L");

    await user.clear(hueInput);
    await user.type(hueInput, "0");
    await user.clear(satInput);
    await user.type(satInput, "0");
    await user.clear(lightInput);
    await user.type(lightInput, "100");

    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue("#FFFFFF");
  });
});


