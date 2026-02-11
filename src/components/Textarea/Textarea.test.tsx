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
    const { rerender } = render(
      <div style={{ height: "600px" }}>
        <Textarea label="Notes" resizeDirection="both" />
      </div>
    );
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

    rerender(
      <div style={{ height: "800px" }}>
        <Textarea label="Notes" resizeDirection="both" />
      </div>
    );

    expect((screen.getByLabelText("Notes") as HTMLTextAreaElement).style.height).toBe("150px");
  });

  it("does not lock height inline on initial mount", async () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetHeight"
    );
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get: () => 180,
    });

    try {
      render(<Textarea label="Details" />);
      await Promise.resolve();
      const textarea = screen.getByLabelText("Details") as HTMLTextAreaElement;
      expect(textarea.style.height).toBe("");
    } finally {
      if (originalOffsetHeight) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
      } else {
        delete (HTMLElement.prototype as { offsetHeight?: number }).offsetHeight;
      }
    }
  });

  it("grows with parent height changes in auto layout mode", () => {
    const { rerender } = render(
      <div data-testid="host" style={{ display: "flex", flexDirection: "column", height: "600px" }}>
        <Textarea label="Auto grow" resizeDirection="vertical" />
      </div>
    );

    const textarea = screen.getByLabelText("Auto grow") as HTMLTextAreaElement;
    Object.defineProperty(textarea, "clientHeight", {
      configurable: true,
      get: () => {
        const forced = parseInt(textarea.style.height || "0", 10);
        if (forced > 0) return forced;
        const host = screen.getByTestId("host") as HTMLDivElement;
        return Math.max(0, parseInt(host.style.height || "0", 10) - 24);
      },
    });

    expect(textarea.clientHeight).toBe(576);
    expect(textarea.style.height).toBe("");

    rerender(
      <div data-testid="host" style={{ display: "flex", flexDirection: "column", height: "800px" }}>
        <Textarea label="Auto grow" resizeDirection="vertical" />
      </div>
    );

    expect((screen.getByLabelText("Auto grow") as HTMLTextAreaElement).clientHeight).toBe(776);
    expect((screen.getByLabelText("Auto grow") as HTMLTextAreaElement).style.height).toBe("");
  });

  it("does not force inline height when resizeDirection is none", () => {
    render(<Textarea label="No resize" resizeDirection="none" rows={8} />);
    const textarea = screen.getByLabelText("No resize") as HTMLTextAreaElement;

    expect(textarea).toHaveAttribute("rows", "8");
    expect(textarea.style.height).toBe("");
    expect(screen.queryByRole("button", { name: /resize textarea/i })).not.toBeInTheDocument();
  });

  it("keeps bottom content accessible with and without counter footer", () => {
    const { rerender } = render(
      <Textarea
        label="With footer"
        resizeDirection="vertical"
        maxLength={20}
        showCount
        defaultValue="hello"
      />
    );

    const withCounter = screen.getByLabelText("With footer") as HTMLTextAreaElement;
    expect(screen.getByText("5/20")).toBeInTheDocument();
    expect(withCounter.style.height).toBe("");

    rerender(
      <Textarea
        label="Without counter"
        resizeDirection="vertical"
        maxLength={20}
        showCount={false}
        defaultValue="hello"
      />
    );

    const withoutCounter = screen.getByLabelText("Without counter") as HTMLTextAreaElement;
    expect(screen.queryByText("5/20")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resize textarea/i })).toBeInTheDocument();
    expect(withoutCounter.style.height).toBe("");
  });

});
