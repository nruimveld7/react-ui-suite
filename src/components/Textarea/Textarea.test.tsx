import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from ".";

describe("Textarea", () => {
  it("wires labels, descriptions, and error text with counters", () => {
    render(
      <Textarea
        label="Message"
        description="Tell us more"
        error="Required"
        maxLength={50}
        showCount
        defaultValue=""
      />
    );

    const textarea = screen.getByLabelText("Message");
    expect(textarea).toHaveAttribute("aria-describedby");
    expect(screen.getByText("Tell us more")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByText("0/50")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(screen.getByText("5/50")).toBeInTheDocument();
  });

  it("allows dragging the resize handle to adjust height and width", async () => {
    render(<Textarea label="Notes" resizeDirection="both" />);
    const textarea = screen.getByLabelText("Notes") as HTMLTextAreaElement;
    const shell = textarea.parentElement as HTMLDivElement;
    const root = shell.parentElement as HTMLDivElement;

    Object.defineProperty(textarea, "offsetHeight", { configurable: true, get: () => 120 });
    Object.defineProperty(shell, "offsetWidth", { configurable: true, get: () => 300 });
    Object.defineProperty(root, "clientWidth", { configurable: true, get: () => 400 });

    const handle = screen.getByRole("button", { name: /resize textarea/i });
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, pointerType: "mouse", pointerId: 1, button: 0 });
    await Promise.resolve();
    fireEvent.pointerMove(window, { clientX: 40, clientY: 30, pointerType: "mouse", pointerId: 1, buttons: 1 });
    fireEvent.pointerUp(window, { pointerType: "mouse", pointerId: 1, button: 0 });

    expect(textarea.style.height).toBe("150px");
    expect(shell.style.width).toBe("340px");
  });

});
