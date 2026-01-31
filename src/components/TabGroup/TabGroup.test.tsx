import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TabGroup } from ".";

const baseTabs = [
  { label: "Overview", content: <p>Overview panel</p> },
  { label: "Reports", content: <p>Reports panel</p> },
  { label: "Billing", content: <p>Billing panel</p> },
];

describe("TabGroup", () => {
  it("renders the first tab by default and switches panels on click", async () => {
    const user = userEvent.setup();
    render(<TabGroup tabs={baseTabs} />);

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");

    await user.click(screen.getByRole("tab", { name: "Reports" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Reports panel");
  });

  it("supports controlled usage and vertical layouts", async () => {
    const user = userEvent.setup();

    function ControlledExample() {
      const [active, setActive] = React.useState(0);
      return (
        <TabGroup
          position="left"
          rotation="vertical"
          active={active}
          onActiveChange={setActive}
          tabs={[
            { label: "Reports", content: <p>Reports overview</p> },
            { label: "Billing", content: <p>Billing history</p> },
          ]}
        />
      );
    }

    render(<ControlledExample />);

    await user.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing history");
  });

  it("skips disabled tabs on click", async () => {
    const user = userEvent.setup();
    render(
      <TabGroup
        tabs={[
          { label: "General", content: <p>General content</p> },
          { label: "Team", content: <p>Team content</p>, disabled: true },
          { label: "Reports", content: <p>Reports content</p> },
        ]}
      />
    );

    await user.click(screen.getByRole("tab", { name: "Team" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("General content");

    await user.click(screen.getByRole("tab", { name: "Reports" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Reports content");
  });
});
