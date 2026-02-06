import { useCallback, useMemo, useState } from "react";
import { Slider } from "react-ui-suite";
import type { SliderProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import clsx from "clsx";
import "./Slider.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function ListeningSession() {
  const [mixLevel, setMixLevel] = useState(38);
  const [ambience, setAmbience] = useState(72);

  return (
    <DemoExample
      title="Listening room"
      className="rui-slider-demo__card rui-slider-demo__card--space-lg"
    >
      <div className="rui-slider-demo__header">
        <div>
          <p className="rui-slider-demo__title">
            Lo-fi mornings
          </p>
        </div>
        <span className="rui-slider-demo__badge">
          Live
        </span>
      </div>

      <Slider
        label="Track mix"
        value={mixLevel}
        onChange={setMixLevel}
        formatValue={(val) => `${val}%`}
        aria-label="Track mix"
      />

      <Slider
        label="Room ambience"
        value={ambience}
        onChange={setAmbience}
        formatValue={(val) => `${val}%`}
        aria-label="Room ambience"
      />
    </DemoExample>
  );
}

function TemperatureControl() {
  const min = 55;
  const max = 85;
  const [temperature, setTemperature] = useState(68);
  const gradientStops = useMemo(() => ["#22c55e", "#a3e635", "#facc15", "#f59e0b", "#ef4444"], []);

  const colorFromStops = useCallback(
    (percent: number) => {
      if (gradientStops.length === 0) return "#ffffff";
      if (gradientStops.length === 1) return gradientStops[0];

      const clamped = Math.min(100, Math.max(0, percent)) / 100;
      const segment = clamped * (gradientStops.length - 1);
      const idx = Math.floor(segment);
      const t = segment - idx;

      const parse = (hex: string) => {
        const h = hex.replace("#", "");
        const value =
          h.length === 3
            ? h
                .split("")
                .map((c) => c + c)
                .join("")
            : h;
        const num = parseInt(value, 16);
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
      };

      const from = parse(gradientStops[idx]);
      const to = parse(gradientStops[Math.min(idx + 1, gradientStops.length - 1)]);

      const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
      return `rgb(${mix(from.r, to.r)}, ${mix(from.g, to.g)}, ${mix(from.b, to.b)})`;
    },
    [gradientStops]
  );

  const renderTrack: SliderProps["renderTrack"] = ({ percentage, children, disabled }) => (
    <div
      className={clsx(
        "rui-slider-demo__climate-track",
        disabled && "rui-slider-demo__climate-track--disabled"
      )}
      aria-hidden="true"
    >
      <div
        className="rui-slider-demo__climate-fill"
        style={{
          backgroundImage: `linear-gradient(90deg, ${gradientStops.join(",")})`,
          clipPath: `inset(0 ${Math.max(0, 100 - percentage)}% 0 0)`,
        }}
      />
      <div className="rui-slider-demo__climate-overlay" />
      <div className="rui-slider-demo__climate-mask">{children}</div>
    </div>
  );

  const renderThumb: SliderProps["renderThumb"] = ({
    orientation,
    value,
    focused,
    disabled,
    percentage,
    trackOffset,
    trackCrossOffset,
    trackThickness,
    trackLength,
    reversed,
    thumbSize,
  }) => {
    const logicalRatio = percentage / 100;
    const positionRatio =
      orientation === "vertical"
        ? reversed
          ? logicalRatio
          : 1 - logicalRatio
        : reversed
          ? 1 - logicalRatio
          : logicalRatio;
    const alongSize = thumbSize ?? 0;
    const usable = Math.max(trackLength - alongSize, 0);
    const main = usable * positionRatio;
    const cross = trackCrossOffset + trackThickness / 2;
    const style =
      orientation === "vertical"
        ? { top: trackOffset + main, left: cross, width: alongSize }
        : { left: trackOffset + main, top: cross, width: alongSize };
    const fillColor = colorFromStops(percentage);

    return (
      <span
        aria-hidden="true"
        style={{ ...style, background: fillColor }}
        className={clsx(
          "rui-slider-demo__climate-thumb",
          focused && "rui-slider-demo__climate-thumb--focused",
          disabled && "rui-slider-demo__climate-thumb--disabled"
        )}
      >
        {`${value}\u00B0F`}
      </span>
    );
  };

  return (
    <DemoExample
      title="Studio climate"
      badge={{ label: "Custom thumb", appearance: "gradient" }}
      className="rui-slider-demo__card rui-slider-demo__card--space-md"
    >
      <div className="rui-slider-demo__header">
        <div>
          <p className="rui-slider-demo__copy">Manage room temperature</p>
        </div>
      </div>
      <Slider
        label="Temperature"
        min={min}
        max={max}
        step={1}
        thumbSize={72}
        edgeOverlap={6}
        fillMode="mask"
        value={temperature}
        onChange={setTemperature}
        renderTrack={renderTrack}
        renderThumb={renderThumb}
        formatValue={(val) => `${val}\u00B0F`}
        aria-label="Temperature"
      />
    </DemoExample>
  );
}

function OrientationPlayground() {
  const [horizontal, setHorizontal] = useState(40);
  const [horizontalReverse, setHorizontalReverse] = useState(65);
  const [vertical, setVertical] = useState(35);
  const [verticalReverse, setVerticalReverse] = useState(80);

  return (
    <div className="rui-slider-demo__playground">
      <DemoExample
        title="Horizontal"
        badge="Default"
        className="rui-slider-demo__card rui-slider-demo__card--space-sm"
      >
        <Slider
          value={horizontal}
          onChange={setHorizontal}
          formatValue={(v) => `${v}%`}
          aria-label="Horizontal slider"
        />
      </DemoExample>

      <DemoExample
        title="Horizontal reversed"
        badge="Reversed"
        className="rui-slider-demo__card rui-slider-demo__card--space-sm"
      >
        <Slider
          reversed
          value={horizontalReverse}
          onChange={setHorizontalReverse}
          formatValue={(v) => `${v}%`}
          aria-label="Horizontal reversed slider"
        />
      </DemoExample>

      <DemoExample
        title="Vertical"
        badge="Vertical"
        className="rui-slider-demo__card rui-slider-demo__card--space-sm"
      >
        <div className="rui-slider-demo__center">
          <Slider
            orientation="vertical"
            value={vertical}
            onChange={setVertical}
            formatValue={(v) => `${v}%`}
            aria-label="Vertical slider"
            className="rui-slider-demo__vertical-slider"
          />
        </div>
      </DemoExample>

      <DemoExample
        title="Vertical reversed"
        badge="Vertical + reversed"
        className="rui-slider-demo__card rui-slider-demo__card--space-sm"
      >
        <div className="rui-slider-demo__center">
          <Slider
            orientation="vertical"
            reversed
            value={verticalReverse}
            onChange={setVerticalReverse}
            formatValue={(v) => `${v}%`}
            aria-label="Vertical reversed slider"
            className="rui-slider-demo__vertical-slider"
          />
        </div>
      </DemoExample>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "slider",
  name: "Slider",
  description: "Custom range slider with programmable track and thumb render props.",
  tags: ["input", "form", "slider"],
  Preview: function SliderPreview() {
    return (
      <div className="rui-slider-demo">
        <ListeningSession />
        <TemperatureControl />
        <OrientationPlayground />
      </div>
    );
  },
  sourcePath: "src/components/Slider/Slider.tsx",
};

export default entry;
export { Slider };
export type { SliderProps };
