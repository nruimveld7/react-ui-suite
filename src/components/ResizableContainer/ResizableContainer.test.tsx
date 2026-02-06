import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResizableContainer } from ".";

describe("ResizableContainer", () => {
  it("resizes via pointer drag and emits size changes", async () => {
    const handleSize = vi.fn();
    render(
      <ResizableContainer
        defaultWidth={300}
        defaultHeight={200}
        onSizeChange={handleSize}
      >
        <div>Content</div>
      </ResizableContainer>
    );

    const root = screen.getByText("Content").closest(".rui-resizable") as HTMLDivElement;
    Object.defineProperty(root, "offsetWidth", { configurable: true, get: () => 300 });
    Object.defineProperty(root, "offsetHeight", { configurable: true, get: () => 200 });

    const handle = screen.getByRole("button", { name: /resize/i });
    fireEvent.pointerDown(handle, { clientX: 10, clientY: 10, pointerType: "mouse", pointerId: 1, button: 0 });
    await Promise.resolve();
    fireEvent.pointerMove(handle, { clientX: 50, clientY: 40, pointerType: "mouse", pointerId: 1, buttons: 1 });
    fireEvent.pointerUp(handle, { pointerType: "mouse", pointerId: 1, button: 0 });

    expect(root.style.width).toBe("340px");
    expect(root.style.height).toBe("230px");
    expect(handleSize).toHaveBeenCalledWith({ width: 340, height: 230 });
  });

  it("supports keyboard resize steps", () => {
    const handleSize = vi.fn();
    render(
      <ResizableContainer
        defaultWidth={260}
        defaultHeight={180}
        step={12}
        onSizeChange={handleSize}
      >
        <div>Content</div>
      </ResizableContainer>
    );

    const root = screen.getByText("Content").closest(".rui-resizable") as HTMLDivElement;
    Object.defineProperty(root, "offsetWidth", { configurable: true, get: () => 260 });
    Object.defineProperty(root, "offsetHeight", { configurable: true, get: () => 180 });

    const handle = screen.getByRole("button", { name: /resize/i });
    handle.focus();
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    fireEvent.keyDown(handle, { key: "ArrowDown" });

    expect(root.style.width).toBe("272px");
    expect(root.style.height).toBe("192px");
    expect(handleSize).toHaveBeenLastCalledWith({ width: 272, height: 192 });
  });

  it("respects axis constraints", async () => {
    const handleSize = vi.fn();
    render(
      <ResizableContainer axis="x" defaultWidth={280} defaultHeight={160} onSizeChange={handleSize}>
        <div>Content</div>
      </ResizableContainer>
    );

    const root = screen.getByText("Content").closest(".rui-resizable") as HTMLDivElement;
    Object.defineProperty(root, "offsetWidth", { configurable: true, get: () => 280 });
    Object.defineProperty(root, "offsetHeight", { configurable: true, get: () => 160 });

    const handle = screen.getByRole("button", { name: /resize/i });
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, pointerType: "mouse", pointerId: 1, button: 0 });
    await Promise.resolve();
    fireEvent.pointerMove(handle, { clientX: 40, clientY: 40, pointerType: "mouse", pointerId: 1, buttons: 1 });

    expect(root.style.width).toBe("320px");
    expect(root.style.height).toBe("160px");
    expect(handleSize).toHaveBeenCalledWith({ width: 320, height: 160 });
  });
});
