import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("filters files by accept for picker changes", async () => {
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

    await waitFor(() =>
      expect(handleFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({
          file: image,
        }),
      ])
    );
    expect(screen.getByText("cover.png")).toBeInTheDocument();
    expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();
    expect(
      screen.getByText("1 file was ignored due to selection restrictions.")
    ).toBeInTheDocument();
  });

  it("accepts dropped files when unrestricted", async () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Files" multiple onFilesChange={handleFilesChange} />);

    const pdf = new File(["pdf"], "doc.pdf", { type: "application/pdf" });
    const dropzone = screen.getByRole("button", { name: "Files file picker" });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [pdf],
      },
    });

    await waitFor(() =>
      expect(handleFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({
          file: pdf,
        }),
      ])
    );
    expect(screen.getByText("doc.pdf")).toBeInTheDocument();
  });

  it("replaces the selected file when choosing a different file again", async () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Resume" onFilesChange={handleFilesChange} />);

    const first = new File(["v1"], "resume-v1.pdf", { type: "application/pdf" });
    const second = new File(["v2"], "resume-v2.pdf", { type: "application/pdf" });
    const input = screen.getByLabelText("Resume") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [first] } });
    await waitFor(() => expect(screen.getByText("resume-v1.pdf")).toBeInTheDocument());

    fireEvent.change(input, { target: { files: [second] } });
    await waitFor(() =>
      expect(handleFilesChange).toHaveBeenLastCalledWith([
        expect.objectContaining({
          file: second,
        }),
      ])
    );
    expect(screen.queryByText("resume-v1.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("resume-v2.pdf")).toBeInTheDocument();
  });

  it("limits selected files using maxFiles", async () => {
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

    await waitFor(() =>
      expect(handleFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({ file: first }),
        expect.objectContaining({ file: second }),
      ])
    );
    expect(screen.getByText("one.txt")).toBeInTheDocument();
    expect(screen.getByText("two.txt")).toBeInTheDocument();
    expect(screen.queryByText("three.txt")).not.toBeInTheDocument();
    expect(screen.getByText("Maximum files: 2")).toBeInTheDocument();
    expect(screen.getByText("1 file was ignored due to selection restrictions.")).toBeInTheDocument();
  });

  it("reads bytes and text when mode is content", async () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Content" mode="content" onFilesChange={handleFilesChange} />);

    const file = new File(["hello"], "note.txt", { type: "text/plain" });
    Object.defineProperty(file, "arrayBuffer", {
      configurable: true,
      value: async () => new TextEncoder().encode("hello").buffer,
    });
    const input = screen.getByLabelText("Content") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(1));
    const [selection] = handleFilesChange.mock.calls[0][0];
    expect(selection.file).toBe(file);
    expect(selection.path).toBeUndefined();
    expect(selection.bytes).toBeInstanceOf(Uint8Array);
    expect(selection.text).toBe("hello");
  });

  it("resolves path when mode is both", async () => {
    const handleFilesChange = vi.fn();
    const resolvePath = vi.fn().mockResolvedValue("/tmp/a.txt");
    render(
      <FilePicker
        label="Both"
        mode="both"
        resolvePath={resolvePath}
        onFilesChange={handleFilesChange}
      />
    );

    const file = new File(["abc"], "a.txt", { type: "text/plain" });
    Object.defineProperty(file, "arrayBuffer", {
      configurable: true,
      value: async () => new TextEncoder().encode("abc").buffer,
    });
    const input = screen.getByLabelText("Both") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(1));
    expect(resolvePath).toHaveBeenCalledWith(file);
    const [selection] = handleFilesChange.mock.calls[0][0];
    expect(selection.file).toBe(file);
    expect(selection.path).toBe("/tmp/a.txt");
    expect(selection.text).toBe("abc");
    expect(selection.bytes).toBeInstanceOf(Uint8Array);
  });

  it("enables directory selection attributes", () => {
    render(<FilePicker label="Folder upload" directory />);

    const input = screen.getByLabelText("Folder upload") as HTMLInputElement;
    expect(input.multiple).toBe(true);
    expect(input.hasAttribute("directory")).toBe(true);
    expect(input.hasAttribute("webkitdirectory")).toBe(true);
  });
});
