import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button";

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
});
