import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from ".";

const options = [
  { label: "Low", value: "low" },
  { label: "High", value: "high" },
];

describe("Select", () => {
  it("renders adornments, error text, and emits onChange when option selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select
        label="Priority"
        options={options}
        onChange={handleChange}
        leadingContent={<span data-testid="leading">L</span>}
        inlineContent={<span data-testid="inline">Inline</span>}
        error="Required"
      />
    );

    expect(screen.getByTestId("leading")).toBeInTheDocument();
    expect(screen.getByTestId("inline")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();

    const input = screen.getByRole("combobox", { name: "Priority" });
    fireEvent.pointerDown(input);
    await screen.findAllByRole("option");
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => expect(handleChange).toHaveBeenCalledWith("high"));
    expect(input).toHaveValue("High");
  });

  it("supports keyboard selection while open", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select label="Priority" options={options} defaultValue="low" onChange={handleChange} />);

    const input = screen.getByRole("combobox", { name: "Priority" });
    fireEvent.pointerDown(input);
    await screen.findAllByRole("option");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    await waitFor(() => expect(handleChange).toHaveBeenCalledWith("high"));
    expect(input).toHaveValue("High");
  });

  it("ignores disabled options and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Status"
        options={[{ label: "Disabled", value: "disabled", disabled: true }, ...options]}
      />
    );

    const input = screen.getByRole("combobox", { name: "Status" });
    await user.click(input);

    const disabledOption = await screen.findByRole("option", { name: "Disabled" });
    expect(disabledOption).toBeDisabled();
    await user.click(disabledOption);
    expect(input).toHaveValue("");

    input.focus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("option", { name: "Low" })).toBeNull());
  });
});
