import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Disclosure } from ".";

describe("Disclosure", () => {
  it("toggles the open state when summary is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Disclosure title="More info">
        <p>Hidden text</p>
      </Disclosure>
    );

    const summary = screen.getByText("More info").closest("summary");
    const details = summary?.closest("details");
    expect(details?.open).toBe(false);

    await user.click(summary as HTMLElement);
    expect(details?.open).toBe(true);
  });

  it("applies subtle styling when requested", () => {
    const { container } = render(
      <Disclosure title="Always open" subtle>
        <p>Visible</p>
      </Disclosure>
    );

    const details = container.querySelector("details");
    expect(details).toHaveClass("rui-disclosure__u-border-color-transparent--521fa0c7c4", { exact: false });
  });

});


