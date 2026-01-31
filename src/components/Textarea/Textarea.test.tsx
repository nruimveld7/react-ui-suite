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

  it("allows dragging the resize handle to adjust height and width", () => {
    render(<Textarea label="Notes" resizeDirection="both" />);
    const textarea = screen.getByLabelText("Notes") as HTMLTextAreaElement;
    const shell = textarea.parentElement as HTMLDivElement;

    Object.defineProperty(textarea, "offsetHeight", { configurable: true, value: 120 });
    Object.defineProperty(shell, "offsetWidth", { configurable: true, value: 300 });
    Object.defineProperty(shell.parentElement, "clientWidth", { configurable: true, value: 400 });

    const handle = screen.getByRole("button", { name: /resize textarea/i });
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(window, { clientX: 40, clientY: 30 });
    fireEvent.mouseUp(window);

    expect(textarea.style.height).toBe("150px");
    expect(shell.style.width).toBe("340px");
  });

});
