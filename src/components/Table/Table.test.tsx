import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeAll } from "vitest";
import { Table } from ".";

beforeAll(() => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // @ts-expect-error - provide minimal ResizeObserver for JSDOM
  global.ResizeObserver = ResizeObserver;
});

describe("Table", () => {
  it("renders columns, caption, and custom cell renderers", () => {
    const data = [{ id: 1, name: "Alpha", count: 2 }];

    render(
      <Table
        caption="Example"
        columns={[
          { key: "name", header: "Name" },
          {
            key: "count",
            header: "Count",
            render: (value: number) => <span data-testid="count">{value}x</span>,
            align: "right",
          },
        ]}
        data={data}
      />
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByTestId("count")).toHaveTextContent("2x");
  });

  it("shows custom scrollbars for overflow content", async () => {
    const rows = Array.from({ length: 25 }, (_, i) => ({ id: i, name: `Row ${i}`, count: i }));
    const { container } = render(
      <Table
        columns={[
          { key: "name", header: "Name" },
          { key: "count", header: "Count", align: "right" },
        ]}
        data={rows}
      />
    );

    const scrollArea = container.querySelector(".table-scrollbar") as HTMLDivElement;
    Object.defineProperty(scrollArea, "scrollHeight", { configurable: true, value: 600 });
    Object.defineProperty(scrollArea, "clientHeight", { configurable: true, value: 200 });
    Object.defineProperty(scrollArea, "scrollWidth", { configurable: true, value: 400 });
    Object.defineProperty(scrollArea, "clientWidth", { configurable: true, value: 200 });
    Object.defineProperty(scrollArea, "scrollTop", { configurable: true, value: 0, writable: true });
    Object.defineProperty(scrollArea, "scrollLeft", {
      configurable: true,
      value: 0,
      writable: true,
    });

    scrollArea.dispatchEvent(new Event("scroll"));
    await waitFor(() => {
      const wrapper = scrollArea.parentElement as HTMLDivElement;
      expect(wrapper.style.paddingRight).not.toBe("");
      expect(wrapper.style.paddingBottom).not.toBe("");
    });

    await waitFor(() => {
      expect(container.querySelector(".table-scrollbar-thumb--vertical")).toBeTruthy();
      expect(container.querySelector(".table-scrollbar-thumb--horizontal")).toBeTruthy();
    });
  });
});
