import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StackedList } from ".";

describe("StackedList", () => {
  it("renders items with optional icon, meta, and action content", () => {
    render(
      <StackedList
        items={[
          { id: "1", title: "Item A", description: "First", meta: "Today", action: <button>Act</button> },
          { id: "2", title: "Item B" },
        ]}
        dense
      />
    );

    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("supports dense spacing and optional icons", () => {
    render(
      <StackedList
        dense
        items={[
          { id: "1", title: "Item A", icon: <span data-testid="icon">*</span> },
        ]}
      />
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("rui-stacked-list__u-padding-top-0-75rem--1b2d54a3fd", { exact: false });
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
