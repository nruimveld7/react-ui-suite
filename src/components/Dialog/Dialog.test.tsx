import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from ".";

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

  it("invokes onClose when Escape is pressed", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={handleClose} title="Keyboard close">
        <p>Closable</p>
      </Dialog>
    );

    await user.keyboard("{Escape}");
    expect(handleClose).toHaveBeenCalled();
  });

  it("closes when clicking outside in non-modal mode", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open modal={false} onClose={handleClose} title="Non modal">
        <p>Content</p>
      </Dialog>
    );

    await user.click(document.body);
    expect(handleClose).toHaveBeenCalled();
  });

  it("closes when clicking the modal overlay", () => {
    const handleClose = vi.fn();
    render(
      <Dialog open onClose={handleClose} title="Modal overlay">
        <p>Content</p>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog", { name: "Modal overlay" });
    const overlay = dialog.parentElement as HTMLElement;
    fireEvent.mouseDown(overlay);
    expect(handleClose).toHaveBeenCalled();
  });
});


