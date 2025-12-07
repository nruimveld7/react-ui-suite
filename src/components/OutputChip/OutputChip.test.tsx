import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OutputChip } from ".";

describe("OutputChip", () => {
  it("renders tone styles and optional label", () => {
    render(
      <OutputChip tone="success" label="Status">
        Ready
      </OutputChip>
    );

    const chip = screen.getByText("Ready").closest("output");
    expect(chip).toHaveClass("bg-emerald-500", { exact: false });
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("defaults to the neutral tone", () => {
    const { container } = render(<OutputChip>Value</OutputChip>);
    const chip = container.querySelector("output");
    expect(chip).toHaveClass("bg-slate-900", { exact: false });
  });
});

