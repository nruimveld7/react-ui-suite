import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from ".";

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

  it("merges className on the label and forwards extra props to the input", () => {
    const { container } = render(
      <Checkbox
        label="Notifications"
        className="custom-label"
        data-testid="checkbox-input"
        description="Stay updated"
      />
    );

    const label = container.querySelector("label");
    expect(label).toHaveClass("custom-label");
    expect(screen.getByTestId("checkbox-input")).toHaveAttribute("type", "checkbox");
    expect(screen.getByText("Stay updated")).toBeInTheDocument();
  });

  it("supports controlled usage and indeterminate styling", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Checkbox label="Controlled" checked={false} onChange={handleChange} indeterminate data-testid="cb" />
    );

    const checkbox = screen.getByTestId("cb");
    expect(checkbox).not.toBeChecked();
    expect(checkbox.indeterminate).toBe(true);

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("applies disabled styles and prevents interaction", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(<Checkbox label="Disabled" disabled onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "Disabled" });
    const label = container.querySelector("label");
    expect(label).toHaveClass("opacity-60", { exact: false });

    await user.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });
});


