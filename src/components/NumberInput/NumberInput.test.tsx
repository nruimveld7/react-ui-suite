import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from ".";

describe("NumberInput", () => {
  it("increments and decrements while honoring step and clamps", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Quantity" defaultValue={1} step={2} min={0} max={4} onChange={handleChange} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(1);

    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue(3);
    expect(handleChange).toHaveBeenLastCalledWith(3);

    await user.click(screen.getByRole("button", { name: "Decrease" }));
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(input).toHaveValue(0);
    expect(handleChange).toHaveBeenLastCalledWith(0);
  });

  it("respects controlled values", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" value={5} onChange={handleChange} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(5);

    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(handleChange).toHaveBeenCalledWith(6);
    expect(input).toHaveValue(5);
  });

  it("renders suffix and helper text and disables controls when requested", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NumberInput
        label="Price"
        suffix="USD"
        description="Per month"
        error="Required"
        disabled
        defaultValue={2}
        onChange={handleChange}
      />
    );

    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("Per month")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();

    const increment = screen.getByRole("button", { name: "Increase" });
    expect(increment).toBeDisabled();
    await user.click(increment);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
