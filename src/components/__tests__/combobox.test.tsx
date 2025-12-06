import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "../Combobox";
import type { ComboboxOption } from "../Combobox/types";

const options: ComboboxOption[] = [
  { id: "alpha", label: "Alpha" },
  { id: "beta", label: "Beta" },
  { id: "gamma", label: "Gamma" },
];

describe("Combobox", () => {
  it("allows selecting an option via the listbox", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox options={options} ariaLabel="Framework" onChange={handleChange} />);

    const input = screen.getByRole("combobox", { name: "Framework" });
    await user.click(input);

    const option = await screen.findByRole("option", { name: "Beta" });
    await user.click(option);

    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ id: "beta" }));
    expect(input).toHaveValue("Beta");
  });

  it("filters options when typing", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} ariaLabel="Framework" />);

    const input = screen.getByRole("combobox", { name: "Framework" });
    await user.type(input, "ga");

    const filteredOption = await screen.findByRole("option", { name: "Gamma" });
    expect(filteredOption).toBeInTheDocument();
  });
});
