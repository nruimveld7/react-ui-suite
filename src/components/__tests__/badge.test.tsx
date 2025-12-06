import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders the provided children", () => {
    render(<Badge>Ship It</Badge>);
    expect(screen.getByText("Ship It")).toBeInTheDocument();
  });

  it("applies the requested variant styles", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success")).toHaveClass("bg-emerald-50", { exact: false });
  });
});
