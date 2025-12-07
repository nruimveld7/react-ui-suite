import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from ".";

describe("Slider", () => {
  it("formats values, renders custom tracks, and emits onChange", () => {
    const handleChange = vi.fn();
    const renderTrack = vi.fn(({ children }) => <div data-testid="track">{children}</div>);

    render(
      <Slider
        label="Volume"
        defaultValue={10}
        formatValue={(value) => `${value}dB`}
        renderTrack={renderTrack}
        onChange={handleChange}
      />
    );

    expect(screen.getByText("10dB")).toBeInTheDocument();
    expect(screen.getByTestId("track")).toBeInTheDocument();
    expect(renderTrack).toHaveBeenCalled();

    const slider = screen.getByRole("slider", { name: "Volume" });
    fireEvent.change(slider, { target: { value: "20" } });
    expect(handleChange).toHaveBeenCalledWith(20);
  });

  it("exposes orientation metadata on the slider input", () => {
    render(<Slider label="Temperature" orientation="vertical" reversed value={25} onChange={() => {}} />);
    const slider = screen.getByRole("slider", { name: "Temperature" });
    expect(slider).toHaveAttribute("aria-orientation", "vertical");
    expect(slider).toHaveAttribute("aria-valuetext", "25");
  });

  it("invokes custom thumb renderers with the latest value", () => {
    const renderThumb = vi.fn(() => null);
    const { rerender } = render(
      <Slider label="Speed" value={10} onChange={() => {}} renderThumb={renderThumb} />
    );

    expect(renderThumb).toHaveBeenCalled();
    const initialCall = renderThumb.mock.calls.at(-1)?.[0];
    expect(initialCall?.value).toBe(10);
    expect(initialCall?.orientation).toBe("horizontal");

    rerender(<Slider label="Speed" value={50} onChange={() => {}} renderThumb={renderThumb} />);
    const latestCall = renderThumb.mock.calls.at(-1)?.[0];
    expect(latestCall?.value).toBe(50);
  });
});
