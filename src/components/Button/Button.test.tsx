import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from ".";

describe("Button", () => {
  it("invokes onClick when pressed", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("prevents clicks when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button", { name: "Disabled" });

    expect(button).toBeDisabled();
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards className and other props to the button element", () => {
    render(
      <Button className="custom-button" data-testid="button">
        Styled
      </Button>
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("rui-button");
    expect(button).toHaveClass("custom-button");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveRole("button");
  });

  it("respects custom background and text utilities without overriding them", () => {
    render(
      <Button className="rui-button__u-background-color-rgb-239-68-68-1--7aa79040cd rui-button__u-color-rgb-255-255-255-1--72a4c7cdee" data-testid="button">
        Danger
      </Button>
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("rui-button__u-background-color-rgb-239-68-68-1--7aa79040cd", { exact: false });
    expect(button).toHaveClass("rui-button__u-color-rgb-255-255-255-1--72a4c7cdee", { exact: false });
  });
});

