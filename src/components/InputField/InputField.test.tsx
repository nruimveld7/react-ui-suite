import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputField } from ".";

describe("InputField", () => {
  it("wires up labels, descriptions, and error messaging", () => {
    render(
      <InputField
        label="Email"
        description="We'll never spam you"
        error="Invalid address"
        placeholder="user@example.com"
      />
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy?.split(" ").length).toBe(2);
    expect(screen.getByText("We'll never spam you")).toBeInTheDocument();
    expect(screen.getByText("Invalid address")).toBeInTheDocument();
  });

  it("renders optional leading and trailing content", () => {
    render(
      <InputField
        label="Amount"
        leadingIcon={<span data-testid="icon">$</span>}
        trailingLabel="USD"
      />
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("disables the input and applies error styling", () => {
    render(<InputField label="Username" error="Required" disabled />);
    const input = screen.getByLabelText("Username");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
