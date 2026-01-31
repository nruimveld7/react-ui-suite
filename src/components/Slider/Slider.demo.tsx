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
      className="rui-slider-demo__u-style--3e7ce58d64 rui-slider-demo__u-border-radius-1-5rem--ea189a088a rui-slider-demo__u-border-width-1px--ca6bcd4b6f rui-slider-demo__u-rui-border-opacity-1--52f4da2ca5 rui-slider-demo__u-background-color-rgb-255-255-255--845918557e rui-slider-demo__u-padding-1rem--8e63407b5c rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider-demo__u-rui-border-opacity-1--2072c87505 rui-slider-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1"
    >
      <div className="rui-slider-demo__u-display-flex--60fbb77139 rui-slider-demo__u-align-items-center--3960ffc248 rui-slider-demo__u-justify-content-space-between--8ef2268efb rui-slider-demo__u-gap-0-75rem--1004c0c395">
        <div>
          <p className="rui-slider-demo__margin-bottom-0 rui-slider-demo__u-font-size-1rem--4ee734926f rui-slider-demo__u-font-weight-600--e83a7042bc rui-slider-demo__u-rui-text-opacity-1--f5f136c41d rui-slider-demo__u-rui-text-opacity-1--e1d41ccd69">
            Lo-fi mornings
          </p>
        </div>
        <span className="rui-slider-demo__u-border-radius-9999px--ac204c1088 rui-slider-demo__u-rui-bg-opacity-1--15821c2ff2 rui-slider-demo__u-padding-left-0-75rem--0e17f2bd90 rui-slider-demo__u-padding-top-0-25rem--660d2effb8 rui-slider-demo__u-font-size-0-75rem--359090c2d5 rui-slider-demo__u-font-weight-600--e83a7042bc rui-slider-demo__u-text-transform-uppercase--117ec720ea rui-slider-demo__u-letter-spacing-0-025em--8baf13a3e9 rui-slider-demo__u-rui-text-opacity-1--72a4c7cdee rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider-demo__u-background-color-rgb-255-255-255--a978c46eef rui-slider-demo__u-rui-text-opacity-1--ea4519095b">
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
        "rui-slider-demo__u-position-relative--d89972fe17 rui-slider-demo__u-height-0-75rem--6a60c09e6a rui-slider-demo__u-width-100--6da6a3c3f7 rui-slider-demo__u-overflow-hidden--2cd02d11d1 rui-slider-demo__u-border-radius-9999px--ac204c1088 rui-slider-demo__u-background-image-linear-gradient--6ae7db2cff rui-slider-demo__u-rui-gradient-from-rgb-15-23-42-0--6456cd9021 rui-slider-demo__u-rui-gradient-to-rgb-255-255-255---f643528bfd rui-slider-demo__u-rui-gradient-to-rgb-15-23-42-0-0--eb6a5d914e rui-slider-demo__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-slider-demo__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-slider-demo__u-rui-ring-color-rgb-226-232-240-0--674b1ab7f2 rui-slider-demo__u-rui-gradient-from-rgb-255-255-25--f8ad3f9d23 rui-slider-demo__u-rui-gradient-to-rgb-15-23-42-0-v--df9b95b13f rui-slider-demo__u-rui-gradient-to-rgb-255-255-255---a05d27e483 rui-slider-demo__u-rui-ring-color-rgb-255-255-255-0--e440174b6b",
        disabled && "rui-slider-demo__u-opacity-0-6--f2868c227f"
      )}
      aria-hidden="true"
    >
      <div
        className="rui-slider-demo__u-position-absolute--da4dbfbc4f rui-slider-demo__u-inset-0px--7b7df0449b rui-slider-demo__u-border-radius-9999px--ac204c1088"
        style={{
          backgroundImage: `linear-gradient(90deg, ${gradientStops.join(",")})`,
          clipPath: `inset(0 ${Math.max(0, 100 - percentage)}% 0 0)`,
        }}
      />
      <div className="rui-slider-demo__u-position-absolute--da4dbfbc4f rui-slider-demo__u-inset-0px--7b7df0449b rui-slider-demo__u-background-image-linear-gradient--24a9e3ad53 rui-slider-demo__u-rui-gradient-from-rgb-255-255-25--ee7d5168a9 rui-slider-demo__u-rui-gradient-to-rgb-0-0-0-0-var---fd507f2bc3 rui-slider-demo__u-rui-gradient-to-rgb-15-23-42-0-1--43e4e6423e rui-slider-demo__u-rui-gradient-from-rgb-255-255-25--f8ad3f9d23 rui-slider-demo__u-rui-gradient-to-rgb-0-0-0-0-var---453d42b738 rui-slider-demo__u-rui-gradient-to-rgb-0-0-0-0-4-va--549a97434e" />
      <div className="rui-slider-demo__u-position-absolute--da4dbfbc4f rui-slider-demo__u-inset-0px--7b7df0449b rui-slider-demo__u-mix-blend-mode-soft-light--0c31e56d9a">{children}</div>
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
          "rui-slider-demo__u-position-absolute--da4dbfbc4f rui-slider-demo__u-display-flex--60fbb77139 rui-slider-demo__u-height-2-25rem--e7a768f922 rui-slider-demo__u-rui-translate-y-50--36b381be4d rui-slider-demo__u-align-items-center--3960ffc248 rui-slider-demo__u-justify-content-center--86843cf1e2 rui-slider-demo__u-text-align-center--ca6bf63030 rui-slider-demo__u-border-radius-9999px--ac204c1088 rui-slider-demo__u-border-width-1px--ca6bcd4b6f rui-slider-demo__u-border-color-rgb-255-255-255-0-7--f834d11190 rui-slider-demo__u-padding-left-0-625rem--0b91436deb rui-slider-demo__u-font-size-0-875rem--fc7473ca09 rui-slider-demo__u-font-weight-600--e83a7042bc rui-slider-demo__u-rui-text-opacity-1--72a4c7cdee rui-slider-demo__u-rui-shadow-0-4px-6px-1px-rgb-0-0--febc34e471 rui-slider-demo__u-rui-shadow-color-rgb-15-23-42-0---478d1c8947 rui-slider-demo__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-slider-demo__u-rui-ring-color-rgb-226-232-240-0--dff1289ca3 rui-slider-demo__u-rui-backdrop-blur-blur-4px--1ca6dd1e47",
          focused && "rui-slider-demo__u-rui-scale-x-1-02--1fdf1b1361 rui-slider-demo__u-rui-ring-opacity-1--ac04a0392c rui-slider-demo__u-rui-ring-opacity-1--8adf4f0314",
          disabled && "rui-slider-demo__u-opacity-0-6--f2868c227f rui-slider-demo__u-rui-shadow-0-0-0000--ad47d17e60 rui-slider-demo__u-rui-shadow-0-0-0000--2ac3c2fc68"
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
      className="rui-slider-demo__u-style--6ed543e2fb rui-slider-demo__u-border-radius-1-5rem--ea189a088a rui-slider-demo__u-border-width-1px--ca6bcd4b6f rui-slider-demo__u-rui-border-opacity-1--52f4da2ca5 rui-slider-demo__u-background-color-rgb-255-255-255--6c21de570d rui-slider-demo__u-padding-1rem--8e63407b5c rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider-demo__u-rui-border-opacity-1--2072c87505 rui-slider-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1"
    >
      <div className="rui-slider-demo__u-display-flex--60fbb77139 rui-slider-demo__u-align-items-center--3960ffc248 rui-slider-demo__u-justify-content-space-between--8ef2268efb">
        <div>
          <p className="rui-slider-demo__u-font-size-0-875rem--fc7473ca09 rui-slider-demo__u-rui-text-opacity-1--30426eb75c rui-slider-demo__u-rui-text-opacity-1--cc0274aad9">Manage room temperature</p>
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
    <div className="rui-slider-demo__u-display-grid--f3c543ad5f rui-slider-demo__u-gap-1-5rem--0d304f904c rui-slider-demo__u-grid-template-columns-repeat-2-m--e4d6f343b9">
      <DemoExample
        title="Horizontal"
        badge="Default"
        className="rui-slider-demo__u-style--6f7e013d64 rui-slider-demo__u-border-radius-1-5rem--ea189a088a rui-slider-demo__u-border-width-1px--ca6bcd4b6f rui-slider-demo__u-rui-border-opacity-1--52f4da2ca5 rui-slider-demo__u-background-color-rgb-255-255-255--6c21de570d rui-slider-demo__u-padding-1rem--8e63407b5c rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider-demo__u-rui-border-opacity-1--2072c87505 rui-slider-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1"
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
        className="rui-slider-demo__u-style--6f7e013d64 rui-slider-demo__u-border-radius-1-5rem--ea189a088a rui-slider-demo__u-border-width-1px--ca6bcd4b6f rui-slider-demo__u-rui-border-opacity-1--52f4da2ca5 rui-slider-demo__u-background-color-rgb-255-255-255--6c21de570d rui-slider-demo__u-padding-1rem--8e63407b5c rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider-demo__u-rui-border-opacity-1--2072c87505 rui-slider-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1"
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
        className="rui-slider-demo__u-style--6f7e013d64 rui-slider-demo__u-border-radius-1-5rem--ea189a088a rui-slider-demo__u-border-width-1px--ca6bcd4b6f rui-slider-demo__u-rui-border-opacity-1--52f4da2ca5 rui-slider-demo__u-background-color-rgb-255-255-255--6c21de570d rui-slider-demo__u-padding-1rem--8e63407b5c rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider-demo__u-rui-border-opacity-1--2072c87505 rui-slider-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1"
      >
        <div className="rui-slider-demo__u-display-flex--60fbb77139 rui-slider-demo__u-justify-content-center--86843cf1e2">
          <Slider
            orientation="vertical"
            value={vertical}
            onChange={setVertical}
            formatValue={(v) => `${v}%`}
            aria-label="Vertical slider"
            className="rui-slider-demo__u-width-auto--23e1f628d0"
          />
        </div>
      </DemoExample>

      <DemoExample
        title="Vertical reversed"
        badge="Vertical + reversed"
        className="rui-slider-demo__u-style--6f7e013d64 rui-slider-demo__u-border-radius-1-5rem--ea189a088a rui-slider-demo__u-border-width-1px--ca6bcd4b6f rui-slider-demo__u-rui-border-opacity-1--52f4da2ca5 rui-slider-demo__u-background-color-rgb-255-255-255--6c21de570d rui-slider-demo__u-padding-1rem--8e63407b5c rui-slider-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider-demo__u-rui-border-opacity-1--2072c87505 rui-slider-demo__u-background-color-rgb-15-23-42-0---43aaa5e5c1"
      >
        <div className="rui-slider-demo__u-display-flex--60fbb77139 rui-slider-demo__u-justify-content-center--86843cf1e2">
          <Slider
            orientation="vertical"
            reversed
            value={verticalReverse}
            onChange={setVerticalReverse}
            formatValue={(v) => `${v}%`}
            aria-label="Vertical reversed slider"
            className="rui-slider-demo__u-width-auto--23e1f628d0"
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
      <div className="rui-slider-demo__u-display-grid--f3c543ad5f rui-slider-demo__u-gap-1rem--0c3bc98565">
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
