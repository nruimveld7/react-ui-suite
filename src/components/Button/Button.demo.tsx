import { useState } from "react";
import { Button } from "react-ui-suite";
import type { ButtonProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Button.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const demoFocusRingCss = `
  .button-demo-focus-ring--accent:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px #ffffff, 0 0 0 3px rgba(14, 165, 233, 0.75);
  }

  [data-theme="dark"] .button-demo-focus-ring--accent:focus-visible {
    box-shadow: inset 0 0 0 2px rgba(9, 9, 11, 0.85), 0 0 0 3px rgba(56, 189, 248, 0.75);
  }

  .button-demo-focus-ring--danger:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px #ffffff, 0 0 0 3px rgba(244, 63, 94, 0.7);
  }

  [data-theme="dark"] .button-demo-focus-ring--danger:focus-visible {
    box-shadow: inset 0 0 0 2px rgba(9, 9, 11, 0.85), 0 0 0 3px rgba(251, 113, 133, 0.75);
  }
`;

function ButtonShowcase() {
  const [count, setCount] = useState(0);

  return (
    <div className="button-demo-showcase">
      <Button onClick={() => setCount((value) => value + 1)}>Primary</Button>
      <style>{demoFocusRingCss}</style>
      <Button className="bg-demo-accent text-demo-white button-demo-focus-ring--accent">
        Accent
      </Button>
      <Button className="bg-demo-ghost text-demo-ghost">Ghost</Button>
      <Button disabled className="opacity-demo-70">Disabled</Button>
      <span className="button-demo-counter">Clicks: {count}</span>
    </div>
  );
}

function ButtonUsageExamples() {
  return (
    <div className="button-demo-grid">
      <DemoExample title="Forms" style={{ gap: "var(--rui-space-1)" }}>
        <Button type="submit" className="bg-demo-emerald text-demo-white">
          Save changes
        </Button>
        <p className="button-demo-card__note" style={{ margin: "0.125rem 0 0" }}>
          Use the type prop to hook into forms.
        </p>
      </DemoExample>
      <DemoExample title="Destructive" style={{ gap: "var(--rui-space-1)" }}>
        <Button className="bg-demo-rose text-demo-white button-demo-focus-ring--danger">
          Delete
        </Button>
        <p className="button-demo-card__note" style={{ margin: "0.125rem 0 0" }}>
          Override the base look with custom classes.
        </p>
      </DemoExample>
      <DemoExample title="Icons" style={{ gap: "var(--rui-space-1)" }}>
        <Button>
          <span role="img" aria-hidden="true">
            ✨
          </span>
          Magic
        </Button>
        <p className="button-demo-card__note" style={{ margin: "0.125rem 0 0" }}>
          Buttons accept arbitrary children including icons.
        </p>
      </DemoExample>
    </div>
  );
}

function ButtonPreview() {
  return (
    <div className="button-demo-preview">
      <DemoExample title="Showcase">
        <ButtonShowcase />
      </DemoExample>
      <ButtonUsageExamples />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "button",
  name: "Button",
  description: "Button with sensible padding, rounded corners, and easy overrides via className.",
  tags: ["input", "action"],
  Preview: ButtonPreview,
  sourcePath: "src/components/Button/Button.tsx",
};

export default entry;
export { Button };
export type { ButtonProps };
