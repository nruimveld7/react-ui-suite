import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert } from ".";

describe("Alert", () => {
  it("renders the title and description with role alert", () => {
    render(
      <Alert
        title="Heads up"
        description="System maintenance this weekend"
        className="custom-alert"
        data-testid="alert"
      />
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Heads up");
    expect(alert).toHaveTextContent("System maintenance this weekend");
    expect(alert).toHaveClass("custom-alert");
  });

  it("invokes onDismiss when the dismiss button is clicked", async () => {
    const handleDismiss = vi.fn();
    const user = userEvent.setup();
    render(<Alert title="Heads up" onDismiss={handleDismiss} />);

    await user.click(screen.getByRole("button", { name: /dismiss alert/i }));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("applies variant specific styles and omits dismiss button when not provided", () => {
    render(<Alert title="Success" variant="success" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-emerald-50", { exact: false });
    expect(screen.queryByRole("button", { name: /dismiss alert/i })).toBeNull();
  });
});


