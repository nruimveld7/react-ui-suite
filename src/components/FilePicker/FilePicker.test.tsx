import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilePicker } from ".";

describe("FilePicker", () => {
  it("renders label, description, and error text", () => {
    render(
      <FilePicker
        label="Attachments"
        description="Upload supporting files"
        error="At least one file is required"
      />
    );

    expect(screen.getByLabelText("Attachments")).toBeInTheDocument();
    expect(screen.getByText("Upload supporting files")).toBeInTheDocument();
    expect(screen.getByText("At least one file is required")).toBeInTheDocument();
  });

  it("opens the native file input when the dropzone is clicked", async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
    render(<FilePicker label="Attachments" />);

    await user.click(screen.getByRole("button", { name: "Attachments file picker" }));
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("filters files by accept for picker changes", () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Images" accept="image/*" multiple onFilesChange={handleFilesChange} />);

    const image = new File(["img"], "cover.png", { type: "image/png" });
    const text = new File(["text"], "notes.txt", { type: "text/plain" });
    const input = screen.getByLabelText("Images") as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [image, text],
      },
    });

    expect(handleFilesChange).toHaveBeenCalledWith([image]);
    expect(screen.getByText("cover.png")).toBeInTheDocument();
    expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();
    expect(
      screen.getByText("1 file was ignored due to selection restrictions.")
    ).toBeInTheDocument();
  });

  it("accepts dropped files when unrestricted", () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Files" multiple onFilesChange={handleFilesChange} />);

    const pdf = new File(["pdf"], "doc.pdf", { type: "application/pdf" });
    const dropzone = screen.getByRole("button", { name: "Files file picker" });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [pdf],
      },
    });

    expect(handleFilesChange).toHaveBeenCalledWith([pdf]);
    expect(screen.getByText("doc.pdf")).toBeInTheDocument();
  });

  it("replaces the selected file when choosing a different file again", () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Resume" onFilesChange={handleFilesChange} />);

    const first = new File(["v1"], "resume-v1.pdf", { type: "application/pdf" });
    const second = new File(["v2"], "resume-v2.pdf", { type: "application/pdf" });
    const input = screen.getByLabelText("Resume") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [first] } });
    expect(screen.getByText("resume-v1.pdf")).toBeInTheDocument();

    fireEvent.change(input, { target: { files: [second] } });
    expect(handleFilesChange).toHaveBeenLastCalledWith([second]);
    expect(screen.queryByText("resume-v1.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("resume-v2.pdf")).toBeInTheDocument();
  });

  it("limits selected files using maxFiles", () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Assets" multiple maxFiles={2} onFilesChange={handleFilesChange} />);

    const first = new File(["1"], "one.txt", { type: "text/plain" });
    const second = new File(["2"], "two.txt", { type: "text/plain" });
    const third = new File(["3"], "three.txt", { type: "text/plain" });
    const input = screen.getByLabelText("Assets") as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [first, second, third],
      },
    });

    expect(handleFilesChange).toHaveBeenCalledWith([first, second]);
    expect(screen.getByText("one.txt")).toBeInTheDocument();
    expect(screen.getByText("two.txt")).toBeInTheDocument();
    expect(screen.queryByText("three.txt")).not.toBeInTheDocument();
    expect(screen.getByText("Maximum files: 2")).toBeInTheDocument();
    expect(screen.getByText("1 file was ignored due to selection restrictions.")).toBeInTheDocument();
  });
});
