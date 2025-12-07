import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from ".";
import type { ComboboxOption } from ".";

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

  it("supports custom filters and commits selection via keyboard", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Combobox
        options={options}
        ariaLabel="Framework"
        filter={(opt, query) => opt.label.toLowerCase().startsWith(query.toLowerCase())}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("combobox", { name: "Framework" });
    await user.click(input);
    await user.type(input, "b");
    const visibleOptions = await screen.findAllByRole("option");
    expect(visibleOptions).toHaveLength(1);
    expect(visibleOptions[0]).toHaveTextContent("Beta");

    await user.keyboard("{ArrowDown}{Enter}");
    expect(handleChange).toHaveBeenLastCalledWith(expect.objectContaining({ id: "beta" }));
  });

  it("handles home/end navigation when open and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} ariaLabel="Framework" />);

    const input = screen.getByRole("combobox", { name: "Framework" });
    await user.click(input);
    const optionEls = await screen.findAllByRole("option");
    const lastId = optionEls.at(-1)?.id;
    const firstId = optionEls.at(0)?.id;

    await user.keyboard("{End}");
    expect(input.getAttribute("aria-activedescendant")).toBe(lastId);

    await user.keyboard("{Home}");
    expect(input.getAttribute("aria-activedescendant")).toBe(firstId);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("option", { name: "Alpha" })).not.toBeInTheDocument();
  });

  it("respects openOnFocus and closes when clicking outside", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} ariaLabel="Framework" openOnFocus={false} />);

    const input = screen.getByRole("combobox", { name: "Framework" });
    input.focus();
    expect(screen.queryByRole("option", { name: "Alpha" })).toBeNull();

    await user.type(input, "a");
    expect(await screen.findByRole("option", { name: "Alpha" })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() =>
      expect(screen.queryByRole("option", { name: "Alpha" })).not.toBeInTheDocument()
    );
  });

  it("ignores disabled options and renders the empty state", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        options={[{ id: "disabled", label: "Disabled", disabled: true }, ...options]}
        ariaLabel="Status"
        emptyState="Nothing to show"
      />
    );

    const input = screen.getByRole("combobox", { name: "Status" });
    await user.click(input);
    const disabledOption = await screen.findByRole("option", { name: "Disabled" });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");

    await user.click(disabledOption);
    expect(input).toHaveValue("");

    await user.type(input, "zzz");
    expect(await screen.findByText("Nothing to show")).toBeInTheDocument();
  });
});


