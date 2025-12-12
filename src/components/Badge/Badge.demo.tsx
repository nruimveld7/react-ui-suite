import { useMemo } from "react";
import { Badge } from "react-ui-suite";
import type { BadgeProps, BadgeVariant } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Badge.demo.css";

const statusCopy: Record<BadgeVariant, { label: string; description: string }> = {
  neutral: { label: "Draft", description: "Neutral defaults for unqualified states." },
  info: { label: "Scheduled", description: "Used for upcoming or informational items." },
  success: { label: "Active", description: "Signals success or availability." },
  warning: { label: "Pending", description: "Warns when something needs attention." },
  danger: { label: "Failed", description: "Marks destructive or blocked states." },
};

function BadgeLegend() {
  const entries = useMemo(() => Object.entries(statusCopy), []);

  return (
    <div className="badge-demo-panel">
      <div className="badge-demo-legend">
        {entries.map(([variant, meta]) => (
          <div key={variant} className="badge-demo-row">
            <div>
              <p className="badge-demo-row__title">{meta.label}</p>
              <p className="badge-demo-row__description">{meta.description}</p>
            </div>
            <Badge variant={variant as BadgeVariant}>{meta.label}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgeUsageShowcase() {
  return (
    <div className="badge-demo-panel">
      <div className="badge-demo-panel__header">
        <p className="badge-demo-panel__title">Quick patterns</p>
        <span className="badge-demo-panel__pill">Inline</span>
      </div>
      <div className="badge-demo-chip-line">
        <Badge variant="info" icon="ℹ️">
          Reminder
        </Badge>
        <Badge variant="success">Published</Badge>
        <Badge variant="neutral" className="badge-demo-chip-line__muted">
          24 new
        </Badge>
      </div>
      <p className="badge-demo-note">
        Mix and match icons, counters, and neutral pills for subtle status cues.
      </p>
    </div>
  );
}

function BadgePreview() {
  return (
    <div className="badge-demo-grid">
      <BadgeLegend />
      <BadgeUsageShowcase />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "badge",
  name: "Badge",
  description: "Rounded status pill with Tailwind variants for success, warning, info, and more.",
  tags: ["display", "status"],
  Preview: BadgePreview,
  sourcePath: "src/components/Badge/Badge.tsx",
};

export default entry;
export { Badge };
export type { BadgeProps, BadgeVariant };
