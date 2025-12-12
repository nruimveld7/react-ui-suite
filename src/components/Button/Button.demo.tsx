import { useState } from "react";
import { Button } from "react-ui-suite";
import type { ButtonProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Button.demo.css";

function ButtonShowcase() {
  const [count, setCount] = useState(0);

  return (
    <div className="button-demo-showcase">
      <Button onClick={() => setCount((value) => value + 1)}>Primary</Button>
      <Button className="bg-demo-accent text-demo-white focus-ring">Accent</Button>
      <Button className="bg-demo-ghost text-demo-ghost">Ghost</Button>
      <Button disabled className="opacity-demo-70">Disabled</Button>
      <span className="button-demo-counter">Clicks: {count}</span>
    </div>
  );
}

function ButtonUsageExamples() {
  return (
    <div className="button-demo-grid">
      <div className="button-demo-card">
        <p className="button-demo-card__label">Forms</p>
        <Button type="submit" className="bg-demo-emerald text-demo-white">
          Save changes
        </Button>
        <p className="button-demo-card__note">Use the type prop to hook into forms.</p>
      </div>
      <div className="button-demo-card">
        <p className="button-demo-card__label">Destructive</p>
        <Button className="bg-demo-rose text-demo-white focus-ring">Delete</Button>
        <p className="button-demo-card__note">Override the base look with custom classes.</p>
      </div>
      <div className="button-demo-card">
        <p className="button-demo-card__label">Icons</p>
        <Button>
          <span role="img" aria-hidden="true">
            ?
          </span>
          Magic
        </Button>
        <p className="button-demo-card__note">
          Buttons accept arbitrary children including icons.
        </p>
      </div>
    </div>
  );
}

function ButtonPreview() {
  return (
    <div className="button-demo-preview">
      <div className="button-demo-panel">
        <ButtonShowcase />
      </div>
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
