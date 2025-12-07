import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from ".";

describe("Badge", () => {
  it("renders the provided children", () => {
    render(<Badge>Ship It</Badge>);
    const badge = screen.getByText("Ship It");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-slate-100", { exact: false });
  });

  it("applies the requested variant styles", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success")).toHaveClass("bg-emerald-50", { exact: false });
  });

  it("merges className and renders optional icon", () => {
    render(
      <Badge icon={<span data-testid="icon">*</span>} className="custom-badge">
        With Icon
      </Badge>
    );

    const badge = screen.getByText("With Icon");
    expect(badge).toHaveClass("custom-badge");
    const icon = screen.getByTestId("icon");
    expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
  });
});


