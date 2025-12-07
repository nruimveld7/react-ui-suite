import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from ".";

describe("Card", () => {
  it("renders eyebrow, title, content, and footer", () => {
    render(
      <Card
        eyebrow="Revenue"
        title="Q1 Summary"
        footer="Updated just now"
        actions={<button type="button">Action</button>}
      >
        <p>Body content</p>
      </Card>
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Q1 Summary")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Updated just now")).toBeInTheDocument();
  });

  it("merges className and forwards data attributes", () => {
    render(
      <Card className="custom-card" data-testid="card">
        Details
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("custom-card");
    expect(card).toHaveTextContent("Details");
  });

  it("renders muted state and optional actions content", () => {
    render(
      <Card eyebrow="Info" actions={<span>Action slot</span>} muted data-testid="card">
        Content
      </Card>
    );

    expect(screen.getByText("Action slot")).toBeInTheDocument();
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("bg-slate-50/70", { exact: false });
  });
});


