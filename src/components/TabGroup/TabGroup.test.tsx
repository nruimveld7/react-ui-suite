import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TabGroup } from ".";

const baseTabs = [
  { id: "overview", label: "Overview", content: <p>Overview panel</p> },
  { id: "reports", label: "Reports", content: <p>Reports panel</p> },
  { id: "billing", label: "Billing", content: <p>Billing panel</p> },
];

describe("TabGroup", () => {
  it("renders the first tab by default and switches panels on click", async () => {
    const user = userEvent.setup();
    render(<TabGroup aria-label="Project tabs" tabs={baseTabs} />);

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");

    await user.click(screen.getByRole("tab", { name: "Reports" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Reports panel");
  });

  it("supports controlled usage and vertical orientation", async () => {
    const user = userEvent.setup();

    function ControlledExample() {
      const [active, setActive] = React.useState("reports");
      return (
        <TabGroup
          aria-label="Billing tabs"
          orientation="vertical"
          value={active}
          onChange={setActive}
          tabs={[
            { id: "reports", label: "Reports", content: <p>Reports overview</p> },
            { id: "billing", label: "Billing", content: <p>Billing history</p> },
          ]}
        />
      );
    }

    render(<ControlledExample />);

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");

    await user.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing history");
  });

  it("supports arrow key navigation and skips disabled tabs", async () => {
    const user = userEvent.setup();
    render(
      <TabGroup
        aria-label="Navigation"
        tabs={[
          { id: "general", label: "General", content: <p>General content</p> },
          { id: "team", label: "Team", content: <p>Team content</p>, disabled: true },
          { id: "reports", label: "Reports", content: <p>Reports content</p> },
        ]}
      />
    );

    const generalTab = screen.getByRole("tab", { name: "General" });
    generalTab.focus();

    await user.keyboard("{ArrowRight}");

    const reportsTab = screen.getByRole("tab", { name: "Reports" });
    expect(reportsTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Reports content");
  });
});
