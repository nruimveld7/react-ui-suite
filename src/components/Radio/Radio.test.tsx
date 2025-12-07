import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Radio } from ".";

describe("Radio", () => {
  it("supports controlled usage and description hints", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Radio label="Basic" description="Details" checked={false} onChange={handleChange} />);

    const radio = screen.getByRole("radio", { name: /Basic/ });
    expect(radio).toHaveAttribute("aria-describedby");

    await user.click(radio);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(radio).not.toBeChecked();
  });

  it("renders the extra badge when provided", () => {
    render(
      <Radio label="Pro" extra="Recommended" defaultChecked>
        {null}
      </Radio>
    );

    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });

  it("prevents interaction when disabled", async () => {
    const user = userEvent.setup();
    render(<Radio label="Disabled" disabled defaultChecked />);
    const radio = screen.getByRole("radio", { name: "Disabled" });

    await user.click(radio);
    expect(radio).toBeChecked();
  });
});
