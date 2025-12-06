import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "../Dialog";

describe("Dialog", () => {
  it("renders in a portal and closes via the close button", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={handleClose} title="Session timeout">
        <p>Session expiring soon.</p>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog", { name: "Session timeout" });
    expect(dialog).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close dialog/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
