import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Meter, Progress } from ".";

describe("Progress & Meter", () => {
  it("clamps progress values and shows percentage labels", () => {
    render(<Progress label="Upload" value={150} max={100} />);

    expect(screen.getByText("100%")).toBeInTheDocument();
    const progress = screen.getByLabelText("Upload");
    expect(progress).toHaveAttribute("value", "100");
  });

  it("renders meter with thresholds and current value display", () => {
    render(
      <Meter
        label="Score"
        value={75}
        min={0}
        max={100}
        thresholds={[
          { value: 25, color: "red" },
          { value: 50, color: "orange" },
          { value: 75, color: "green" },
        ]}
      />
    );

    expect(screen.getByText("75")).toBeInTheDocument();
    const meter = screen.getByLabelText("Score");
    expect(meter).toHaveAttribute("value", "75");
  });

  it("hides the numeric label when showValue is false and renders descriptions", () => {
    render(<Progress label="Upload" value={50} showValue={false} description="Halfway" />);
    expect(screen.queryByText("50%")).toBeNull();
    expect(screen.getByText("Halfway")).toBeInTheDocument();
  });

  it("clamps meter values and applies the matching threshold color", () => {
    const { container } = render(
      <Meter
        label="Score"
        value={5}
        min={10}
        max={100}
        thresholds={[
          { value: 0, color: "red" },
          { value: 10, color: "green" },
        ]}
      />
    );

    const meter = screen.getByLabelText("Score");
    expect(meter).toHaveAttribute("value", "10");
    const fill = container.querySelector("div[style*='background']") as HTMLDivElement;
    expect(fill.style.background).toContain("green");
  });
});
