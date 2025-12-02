import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders the provided children", () => {
    const html = renderToString(<Badge>Ship It</Badge>);
    expect(html).toContain("Ship It");
  });

  it("applies the requested variant styles", () => {
    const html = renderToString(<Badge variant="success">Success</Badge>);
    expect(html).toContain("bg-emerald-50");
  });
});
