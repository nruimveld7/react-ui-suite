import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from ".";

describe("DatePicker", () => {
  it("opens the calendar and commits a selected day", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePicker label="Due date" defaultValue="2024-01-15" onChange={handleChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("button", { name: /January 2024/i });

    const day = await screen.findByRole("button", { name: "20" });
    await user.click(day);

    expect(handleChange).toHaveBeenCalledWith("2024-01-20");
  });

  it("renders the time picker variant with formatted labels", () => {
    render(<DatePicker label="Meeting time" type="time" value="13:30" use24HourClock={false} />);
    const input = screen.getByRole("combobox", { name: "Meeting time" });
    expect(input).toHaveValue("01:30 PM");
  });

  it("supports switching to month view and selecting a new month", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Due date" defaultValue="2024-01-15" />);

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const headerButton = screen.getByRole("button", { name: /January 2024/i });
    await user.click(headerButton);

    const marchButton = await screen.findByRole("button", { name: /^Mar$/i });
    await user.click(marchButton);

    expect(screen.getByRole("button", { name: /March 2024/i })).toBeInTheDocument();
  });

  it("navigates the year view and shows helper text", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        label="Due date"
        defaultValue="2024-01-15"
        description="Choose carefully"
        error="Required"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const headerButton = screen.getByRole("button", { name: /January 2024/i });
    await user.click(headerButton); // month view
    await user.click(screen.getByRole("button", { name: /2024/i })); // switch to year view

    await user.click(screen.getByRole("button", { name: ">" }));
    expect(screen.getByText(/2029 - 2040/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2030" }));
    expect(screen.getByRole("button", { name: /Mar/i })).toBeInTheDocument();

    expect(screen.getByText("Choose carefully")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("prevents opening when disabled and honors time intervals", async () => {
    const user = userEvent.setup();
    const handleTimeChange = vi.fn();
    render(
      <>
        <DatePicker label="Disabled" defaultValue="2024-02-01" disabled />
        <DatePicker
          label="Meeting"
          type="time"
          timeIntervalMinutes={15}
          defaultValue="00:00"
          use24HourClock
          onChange={handleTimeChange}
        />
      </>
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Open" })[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const timeInput = screen.getByRole("combobox", { name: "Meeting" });
    fireEvent.pointerDown(timeInput);
    await screen.findAllByRole("option");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(handleTimeChange).toHaveBeenCalledWith("00:15");
    expect(timeInput).toHaveValue("00:15");
  });

  it("uses UTC formatting when dateMode is utc", () => {
    const spy = vi.spyOn(Date.prototype, "toLocaleDateString");
    render(<DatePicker label="UTC date" value="2024-01-20" dateMode="utc" />);
    expect(spy).toHaveBeenCalled();
    const calledWithUtc = spy.mock.calls.some(([, options]) => options?.timeZone === "UTC");
    expect(calledWithUtc).toBe(true);
    spy.mockRestore();
  });

  it("keeps the popover open when clicking inside the portal", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Due date" defaultValue="2024-01-15" />);

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("button", { name: /January 2024/i })).toBeInTheDocument();

    const popover = document.querySelector(".rui-popover");
    expect(popover).toBeTruthy();
    fireEvent.pointerDown(popover as HTMLElement);

    expect(screen.getByRole("button", { name: /January 2024/i })).toBeInTheDocument();
  });
});


