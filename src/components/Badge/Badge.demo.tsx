import { useMemo, type CSSProperties } from "react";
import { Badge } from "react-ui-suite";
import type { BadgeProps, BadgeVariant } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Badge.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const statusCopy: Record<BadgeVariant, { label: string; description: string }> = {
  neutral: { label: "Draft", description: "Neutral defaults for unqualified states." },
  info: { label: "Scheduled", description: "Used for upcoming or informational items." },
  success: { label: "Active", description: "Signals success or availability." },
  warning: { label: "Pending", description: "Warns when something needs attention." },
  danger: { label: "Failed", description: "Marks destructive or blocked states." },
};

const legendStyle: CSSProperties = {
  gap: "var(--rui-space-2)",
};

const rowCopyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
};

function BadgeLegend() {
  const entries = useMemo(() => Object.entries(statusCopy), []);

  return (
    <DemoExample title="Statuses">
      <div className="badge-demo-legend" style={legendStyle}>
        {entries.map(([variant, meta]) => (
          <div key={variant} className="badge-demo-row">
            <div style={rowCopyStyle}>
              <p className="badge-demo-row__title" style={{ margin: 0 }}>
                {meta.label}
              </p>
              <p className="badge-demo-row__description" style={{ margin: 0 }}>
                {meta.description}
              </p>
            </div>
            <Badge variant={variant as BadgeVariant}>{meta.label}</Badge>
          </div>
        ))}
      </div>
    </DemoExample>
  );
}

function BadgeUsageShowcase() {
  return (
    <DemoExample title="Quick patterns">
      <div className="badge-demo-panel__header">
        <span className="badge-demo-panel__pill">Inline</span>
      </div>
      <div className="badge-demo-chip-line">
        <Badge variant="info" icon="🔔">
          Reminder
        </Badge>
        <Badge variant="success">Published</Badge>
        <Badge variant="neutral" className="badge-demo-chip-line__muted">
          24 new
        </Badge>
      </div>
      <p className="badge-demo-note" style={{ margin: "var(--rui-space-2) 0 0" }}>
        Mix and match icons, counters, and neutral pills for subtle status cues.
      </p>
    </DemoExample>
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
  description: "Rounded status pill with variants for success, warning, info, and more.",
  tags: ["display", "status"],
  Preview: BadgePreview,
  sourcePath: "src/components/Badge/Badge.tsx",
};

export default entry;
export { Badge };
export type { BadgeProps, BadgeVariant };
