import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Popover } from ".";

describe("Popover", () => {
  it("renders children via render props and attaches scrollRef", () => {
    const renderProp = vi.fn(({ scrollRef }: { scrollRef: { current: HTMLUListElement | null } }) => (
      <ul ref={scrollRef} data-testid="list">
        <li>Item</li>
      </ul>
    ));

    render(<Popover>{renderProp}</Popover>);

    expect(renderProp).toHaveBeenCalled();
    expect(screen.getByTestId("list")).toBeInTheDocument();
    expect(screen.getByTestId("list").closest(".rui-popover")).toHaveAttribute(
      "data-scrollbar-visible",
      "false"
    );
  });
});
