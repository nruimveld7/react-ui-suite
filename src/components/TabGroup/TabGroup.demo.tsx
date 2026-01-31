import * as React from "react";
import { Radio, TabGroup, NumberInput, ResizableContainer } from "react-ui-suite";
import type { TabGroupProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./TabGroup.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const DEFAULT_TABS = 3;
const MIN_TABS = 2;
const MAX_TABS = 20;

const MIN_TAB_SIZE = 25;
const MAX_TAB_SIZE = 500;
const DEFAULT_TAB_SIZE = 120;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeTabs(count: number, variant: "horizontal" | "vertical") {
  return Array.from({ length: count }, (_, i) => ({
    label: (
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        Tab {i + 1}
      </span>
    ),
    content: (
      <div className="rui-tab-group-demo__panel">
        <div className="rui-tab-group-demo__panel-header">
          <div>
            <strong>{variant === "horizontal" ? "Runway" : "Lane"} {i + 1}</strong>
            <p className="rui-tab-group-demo__panel-subtitle">
              {variant === "horizontal" ? "Route" : "Signal"} {i + 1}: {(i + 1) * 12}% complete
            </p>
          </div>
          <span className="rui-tab-group-demo__panel-badge">
            {variant === "horizontal" ? "Route" : "Rank"} {i + 1}
          </span>
        </div>
        <div className="rui-tab-group-demo__panel-body">
          <div className="rui-tab-group-demo__panel-block">
            <p className="rui-tab-group-demo__panel-label">
              {variant === "horizontal" ? "Velocity" : "Momentum"}
            </p>
            <p className="rui-tab-group-demo__panel-value">
              {variant === "horizontal" ? 68 - i * 6 : 70 - i * 7}%
            </p>
          </div>
          <div className="rui-tab-group-demo__panel-block">
            <p className="rui-tab-group-demo__panel-label">
              {variant === "horizontal" ? "Coverage" : "Focus"}
            </p>
            <p className="rui-tab-group-demo__panel-value">
              {variant === "horizontal" ? 82 - i * 4 : 95 - i * 5}%
            </p>
          </div>
          <div className="rui-tab-group-demo__panel-block">
            <p className="rui-tab-group-demo__panel-label">
              {variant === "horizontal" ? "Beacons" : "Queue"}
            </p>
            <p className="rui-tab-group-demo__panel-value">
              {variant === "horizontal" ? 11 + i * 2 : 3 + i}
            </p>
          </div>
        </div>
        <p className="rui-tab-group-demo__panel-note">
          {variant === "horizontal"
            ? `Route ${i + 1} maps performance to the top edge.`
            : `This lane is tuned for tab ${i + 1}. Adjust the controls to rebalance the layout.`}
        </p>
      </div>
    ),
  }));
}

type AlignLabels = {
  start: string;
  center: string;
  end: string;
}

type PositionOptions = {
  value: NonNullable<TabGroupProps["position"]>;
  label: string;
}

type RotationOptions = {
  value: NonNullable<TabGroupProps["rotation"]>;
  label: string;
}

type TabControlsConfig = {
  legendLocation: string;
  positionOptions: PositionOptions[];
  legendFill: string;
  fillLabels: { full: string; partial: string };
  legendRotation: string;
  rotationOptions: RotationOptions[];
  sizeLabel: string;
  legendAlign: string;
  alignLabels: AlignLabels;
  radioNamePrefix: string;
}

type TabSettings = {
  position: NonNullable<TabGroupProps["position"]>;
  fill: NonNullable<TabGroupProps["fill"]>;
  rotation: NonNullable<TabGroupProps["rotation"]>;
  align: NonNullable<TabGroupProps["align"]>;
  size: number;
  tabCount: number;
}

type TabControlsProps = {
  value: TabSettings;
  onChange: (next: TabSettings) => void;
  config: TabControlsConfig;
};

function TabControls({ value, onChange, config }: TabControlsProps) {
  const uid = React.useId();
  const group = `${config.radioNamePrefix}-${uid}`;
  const { position, fill, rotation, align, size, tabCount } = value;
  const set = (patch: Partial<TabSettings>) => onChange({ ...value, ...patch });
  return (
  <div className="rui-tab-group-demo__controls">
         <fieldset className="rui-tab-group-demo__group">
          <legend>Tabs</legend>
          <NumberInput
            value={tabCount}
            min={MIN_TABS}
            max={MAX_TABS}
            step={1}
            scale={0.5}
            onChange={(next) =>
              set({ tabCount: clamp(Number(next) || MIN_TABS, MIN_TABS, MAX_TABS) })
            }
          />
        </fieldset>

        <fieldset className="rui-tab-group-demo__group">
          <legend>{config.legendLocation}</legend>
          {config.positionOptions.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                name={`${group}-position`}
                checked={position === opt.value}
                onChange={() => set({ position: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </fieldset>

        <fieldset className="rui-tab-group-demo__group">
          <legend>{config.legendRotation}</legend>
          {config.rotationOptions.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                name={`${group}-rotation`}
                checked={rotation === opt.value}
                onChange={() => set({rotation: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </fieldset>

        <fieldset className="rui-tab-group-demo__group">
          <legend>{config.legendFill}</legend>
          <label>
            <input
              type="radio"
              name={`${group}-fill`}
              checked={fill === "full"}
              onChange={() => set({ fill: "full" })}
            />
            {config.fillLabels.full}
          </label>
          <label>
            <input
              type="radio"
              name={`${group}-fill`}
              checked={fill === "partial"}
              onChange={() => set({ fill: "partial" })}
            />
            {config.fillLabels.partial}
          </label>
        </fieldset>

        {fill === "partial" ? (
          <fieldset className="rui-tab-group-demo__group">
            <legend>{config.sizeLabel}</legend>
            <NumberInput
              value={size}
              min={MIN_TAB_SIZE}
              max={MAX_TAB_SIZE}
              step={5}
              scale={0.5}
              onChange={(next) =>
                set({ size: clamp(Number(next) || MIN_TAB_SIZE, MIN_TAB_SIZE, MAX_TAB_SIZE) })
              }
            />
          </fieldset>
        ) : null}

        {fill === "partial" ? (
          <fieldset className="rui-tab-group-demo__group">
            <legend>{config.legendAlign}</legend>
            <label>
              <input
                type="radio"
                name={`${config.radioNamePrefix}-align`}
                checked={align === "start"}
                onChange={() => set({ align: "start" })}
              />
              {config.alignLabels.start}
            </label>
            <label>
              <input
                type="radio"
                name={`${config.radioNamePrefix}-align`}
                checked={align === "center"}
                onChange={() => set({ align: "center" })}
              />
              {config.alignLabels.center}
            </label>
            <label>
              <input
                type="radio"
                name={`${config.radioNamePrefix}-align`}
                checked={align === "end"}
                onChange={() => set({ align: "end" })}
              />
              {config.alignLabels.end}
            </label>
          </fieldset>
        ) : null}
      </div>
      );
}

const horizontalControlsConfig: TabControlsConfig = {
  legendLocation: "Location",
  positionOptions: [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
  ],
  legendFill: "Width",
  fillLabels: { full: "Full", partial: "Partial" },
  legendRotation: "Rotation",
  rotationOptions: [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
  ],
  sizeLabel: "Tab width",
  legendAlign: "Align",
  alignLabels: { start: "Left", center: "Center", end: "Right" },
  radioNamePrefix: "horizontal",
}

const verticalControlsConfig: TabControlsConfig = {
  legendLocation: "Location",
  positionOptions: [
    { value: "left", label: "Left"},
    { value: "right", label: "Right" },
  ],
  legendFill: "Height",
  fillLabels: { full: "Full", partial: "Partial" },
  legendRotation: "Rotation",
  rotationOptions: [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
  ],
  sizeLabel: "Tab height",
  legendAlign: "Align",
  alignLabels: { start: "Top", center: "Center", end: "Bottom" },
  radioNamePrefix: "vertical",
}

function HorizontalControlsDemo() {
  const [settings, setSettings] = React.useState<TabSettings>( {
    tabCount: DEFAULT_TABS,
    position: "top",
    fill: "full",
    rotation: "horizontal",
    align: "center",
    size: DEFAULT_TAB_SIZE,
  });
  const tabs = React.useMemo(
    () => makeTabs(settings.tabCount, "horizontal"),
    [settings.tabCount]
  );
  return (
    <div className="rui-tab-group-demo__stack">
      <TabControls value={settings} onChange={setSettings} config={horizontalControlsConfig} />
      <div className="rui-tab-group-demo__resizable-wrap">
        <ResizableContainer
          axis="x"
          minWidth={320}
          defaultWidth={520}
          className="rui-tab-group-demo__resizable rui-tab-group-demo__resizable--horizontal"
        >
          <TabGroup
            position={settings.position}
            fill={settings.fill}
            rotation={settings.rotation}
            align={settings.align}
            size={settings.size}
            tabs={tabs}
          />
        </ResizableContainer>
      </div>
    </div>
  );
}

function VerticalControlsDemo() {
  const [settings, setSettings] = React.useState<TabSettings>( {
    tabCount: DEFAULT_TABS,
    position: "left",
    fill: "full",
    rotation: "vertical",
    align: "center",
    size: DEFAULT_TAB_SIZE,
  });
  const tabs = React.useMemo(
    () => makeTabs(settings.tabCount, "vertical"),
    [settings.tabCount]
  );
  return (
    <div className="rui-tab-group-demo__stack">
      <TabControls value={settings} onChange={setSettings} config={verticalControlsConfig} />
      <ResizableContainer
        axis="y"
        minHeight={200}
        defaultHeight={280}
        className="rui-tab-group-demo__resizable"
      >
        <TabGroup
          position={settings.position}
          fill={settings.fill}
          rotation={settings.rotation}
          align={settings.align}
          size={settings.size}
          tabs={tabs}
        />
      </ResizableContainer>
    </div>
  );
}

function TabGroupPreview() {
  return (
    <div className="rui-tab-group-demo__u-style--3e7ce58d64">
      <DemoExample title="Horizontal tabs">
        <p className="rui-tab-group-demo__note">
          Resize horizontally to test left/right scroll buttons.
        </p>
        <HorizontalControlsDemo />
      </DemoExample>
      <DemoExample title="Vertical tabs">
        <p className="rui-tab-group-demo__note">
          Resize vertically to test tab heights and scroll buttons.
        </p>
        <VerticalControlsDemo />
      </DemoExample>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "tab-group",
  name: "Tab Group",
  description: "Accessible tabbed panels that can lay out horizontally or vertically.",
  tags: ["navigation", "layout"],
  Preview: TabGroupPreview,
  sourcePath: "src/components/TabGroup/TabGroup.tsx",
};

export default entry;
export { TabGroup };
export type { TabGroupProps };
