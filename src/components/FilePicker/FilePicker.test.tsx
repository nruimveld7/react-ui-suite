import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FilePicker } from ".";

describe("FilePicker", () => {
  afterEach(() => {
    delete (
      window as Window & { showDirectoryPicker?: () => Promise<{ name: string; values?: () => AsyncIterable<unknown> }> }
    ).showDirectoryPicker;
  });

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

  it("reads file content in directory mode when mode is content", async () => {
    const handleFilesChange = vi.fn();
    render(<FilePicker label="Folder content" directory mode="content" onFilesChange={handleFilesChange} />);

    const file = new File(["folder-note"], "note.txt", { type: "text/plain" });
    Object.defineProperty(file, "webkitRelativePath", {
      configurable: true,
      value: "docs/note.txt",
    });
    Object.defineProperty(file, "arrayBuffer", {
      configurable: true,
      value: async () => new TextEncoder().encode("folder-note").buffer,
    });

    const input = screen.getByLabelText("Folder content") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(1));
    const [selection] = handleFilesChange.mock.calls[0][0];
    expect(selection.file).toBe(file);
    expect(selection.path).toBe("docs/note.txt");
    expect(selection.text).toBe("folder-note");
    expect(selection.bytes).toBeInstanceOf(Uint8Array);
    expect(screen.getByTitle("docs/note.txt")).toBeInTheDocument();
  });

  it("uses native directory picker for path-only folder mode when available", async () => {
    const handleFilesChange = vi.fn();
    const showDirectoryPicker = vi.fn().mockResolvedValue({
      name: "assets",
      values: async function* () {
        yield {
          kind: "file",
          getFile: async () => new File([new Uint8Array(1024)], "a.bin"),
        };
        yield {
          kind: "file",
          getFile: async () => new File([new Uint8Array(512)], "b.bin"),
        };
      },
    });
    Object.defineProperty(window, "showDirectoryPicker", {
      configurable: true,
      value: showDirectoryPicker,
    });

    render(<FilePicker label="Folder path" directory mode="path" onFilesChange={handleFilesChange} />);

    const input = screen.getByLabelText("Folder path") as HTMLInputElement;
    expect(input.multiple).toBe(false);
    expect(input.hasAttribute("directory")).toBe(false);
    expect(input.hasAttribute("webkitdirectory")).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Folder path file picker" }));

    await waitFor(() => expect(showDirectoryPicker).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(1));
    const [selection] = handleFilesChange.mock.calls[0][0];
    expect(selection.path).toBe("assets");
    expect(selection.file.name).toBe("assets");
    expect(selection.size).toBe(1536);
    expect(screen.getByText("1.5 KB")).toBeInTheDocument();
    expect(screen.getByTitle("assets")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove assets" })).not.toBeInTheDocument();
  });

  it("accumulates folder paths across picks when multiple is enabled", async () => {
    const handleFilesChange = vi.fn();
    const showDirectoryPicker = vi
      .fn()
      .mockResolvedValueOnce({ name: "assets" })
      .mockResolvedValueOnce({ name: "docs" });
    Object.defineProperty(window, "showDirectoryPicker", {
      configurable: true,
      value: showDirectoryPicker,
    });

    render(
      <FilePicker
        label="Folder paths"
        directory
        mode="path"
        multiple
        onFilesChange={handleFilesChange}
      />
    );

    const dropzone = screen.getByRole("button", { name: "Folder paths file picker" });
    fireEvent.click(dropzone);
    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(1));
    fireEvent.click(dropzone);
    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(2));

    const lastSelections = handleFilesChange.mock.calls[1][0];
    expect(lastSelections).toHaveLength(2);
    expect(lastSelections[0].path).toBe("assets");
    expect(lastSelections[1].path).toBe("docs");
  });

  it("removes a selected folder path from the list", async () => {
    const handleFilesChange = vi.fn();
    const showDirectoryPicker = vi
      .fn()
      .mockResolvedValueOnce({ name: "assets" })
      .mockResolvedValueOnce({ name: "docs" });
    Object.defineProperty(window, "showDirectoryPicker", {
      configurable: true,
      value: showDirectoryPicker,
    });

    render(
      <FilePicker
        label="Folder paths removable"
        directory
        mode="path"
        multiple
        onFilesChange={handleFilesChange}
      />
    );

    const dropzone = screen.getByRole("button", { name: "Folder paths removable file picker" });
    fireEvent.click(dropzone);
    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(1));
    fireEvent.click(dropzone);
    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(2));

    expect(screen.getByText("assets")).toBeInTheDocument();
    expect(screen.getByText("docs")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Remove assets" }));

    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(3));
    const lastSelections = handleFilesChange.mock.calls[2][0];
    expect(lastSelections).toHaveLength(1);
    expect(lastSelections[0].path).toBe("docs");
    expect(screen.queryByText("assets")).not.toBeInTheDocument();
    expect(screen.getByText("docs")).toBeInTheDocument();
  });

  it("uses external picker selections and shows full path tooltip", async () => {
    const handleFilesChange = vi.fn();
    const externalPicker = vi.fn().mockResolvedValue([
      {
        file: new File([], "Adafruit_NeoPixel"),
        path: "C:\\Users\\Admin\\Documents\\Arduino\\libraries\\Adafruit_NeoPixel",
      },
    ]);

    render(
      <FilePicker
        label="Library path"
        directory
        mode="path"
        externalPicker={externalPicker}
        onFilesChange={handleFilesChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Library path file picker" }));

    await waitFor(() => expect(externalPicker).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(handleFilesChange).toHaveBeenCalledTimes(1));
    expect(
      screen.getByTitle("C:\\Users\\Admin\\Documents\\Arduino\\libraries\\Adafruit_NeoPixel")
    ).toBeInTheDocument();
  });
});
