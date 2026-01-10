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
    expect(chip).toHaveClass("rui-output-chip__u-background-color-rgb-16-185-129---1d40adc8f0");
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("defaults to the neutral tone", () => {
    const { container } = render(<OutputChip>Value</OutputChip>);
    const chip = container.querySelector("output");
    expect(chip).toHaveClass("rui-output-chip__u-background-color-rgb-15-23-42-1--15821c2ff2");
  });
});

