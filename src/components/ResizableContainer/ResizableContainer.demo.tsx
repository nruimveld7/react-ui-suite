import * as React from "react";
import { Badge, Button, Progress, ResizableContainer, TabGroup, Toggle } from "react-ui-suite";
import type { ResizableContainerProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./ResizableContainer.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const VERTICAL_TABS = [
  { label: "Overview", content: "Overview content with metrics and quick actions." },
  { label: "Timeline", content: "Timeline updates and progress snapshots." },
  { label: "Notes", content: "Notes panel to keep decisions visible." },
  { label: "Files", content: "Files attached to this project." },
  { label: "Access", content: "Access and permissions." },
];

function TabGroupBidirectionalDemo() {
  return (
    <DemoExample
      title="Bidirectional TabGroup resize"
      className="rui-resizable-demo__card"
    >
      <ResizableContainer
        axis="both"
        minWidth={280}
        minHeight={200}
        defaultWidth={420}
        defaultHeight={280}
        className="rui-resizable-demo__panel rui-resizable-demo__panel--vertical"
      >
        <TabGroup
          position="left"
          fill="partial"
          align="start"
          size={56}
          tabs={VERTICAL_TABS.map((tab) => ({
            label: tab.label,
            content: (
              <div className="rui-resizable-demo__panel-content">
                <strong>{tab.label}</strong>
                <p>{tab.content}</p>
              </div>
            ),
          }))}
        />
      </ResizableContainer>
    </DemoExample>
  );
}

function SignalPanelDemo() {
  const [autoSync, setAutoSync] = React.useState(true);
  return (
    <DemoExample
      title="Signal board"
      className="rui-resizable-demo__card"
    >
      <ResizableContainer
        axis="y"
        minHeight={220}
        defaultHeight={320}
        className="rui-resizable-demo__panel rui-resizable-demo__panel--horizontal"
      >
        <div className="rui-resizable-demo__signal">
          <div className="rui-resizable-demo__signal-header">
            <div>
              <p className="rui-resizable-demo__signal-title">Signal board</p>
              <p className="rui-resizable-demo__signal-subtitle">Live operational readout.</p>
            </div>
            <div className="rui-resizable-demo__signal-badges">
              <Badge variant="info">Live</Badge>
              <Badge variant="neutral">Primary</Badge>
            </div>
          </div>

          <div className="rui-resizable-demo__signal-stats">
            <div>
              <p className="rui-resizable-demo__stat-label">Requests</p>
              <p className="rui-resizable-demo__stat-value">1.2M</p>
            </div>
            <div>
              <p className="rui-resizable-demo__stat-label">Latency</p>
              <p className="rui-resizable-demo__stat-value">241ms</p>
            </div>
            <div>
              <p className="rui-resizable-demo__stat-label">Errors</p>
              <p className="rui-resizable-demo__stat-value">0.8%</p>
            </div>
          </div>

          <div className="rui-resizable-demo__signal-progress">
            <Progress label="Indexing backlog" value={72} />
            <Progress label="Deploy readiness" value={88} />
          </div>

          <div className="rui-resizable-demo__signal-actions">
            <label className="rui-resizable-demo__signal-toggle">
              <Toggle checked={autoSync} onChange={setAutoSync} aria-label="Auto sync" />
              Auto sync
            </label>
            <Button>Open console</Button>
          </div>
        </div>
      </ResizableContainer>
    </DemoExample>
  );
}

function ResizableContainerPreview() {
  return (
    <div className="rui-resizable-demo">
      <TabGroupBidirectionalDemo />
      <SignalPanelDemo />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "resizable-container",
  name: "Resizable Container",
  description: "Resizable panel container with custom handle and keyboard support.",
  tags: ["layout", "container"],
  Preview: ResizableContainerPreview,
  sourcePath: "src/components/ResizableContainer/ResizableContainer.tsx",
};

export default entry;
export { ResizableContainer };
export type { ResizableContainerProps };
