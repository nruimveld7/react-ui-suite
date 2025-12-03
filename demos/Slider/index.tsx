import { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Slider } from "@react-ui-suite/core";
import type { SliderProps } from "@react-ui-suite/core";
import type { ComponentRegistryEntry } from "../component-registry";

function ListeningSession() {
  const [mixLevel, setMixLevel] = useState(38);
  const [ambience, setAmbience] = useState(72);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            Listening Room
          </p>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Lo-fi mornings</p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-white/90 dark:text-slate-900">
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
    </div>
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
        const value = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
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
      className={twMerge(
        "relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-slate-900/5 via-white to-slate-900/5 shadow-inner ring-1 ring-slate-200/70 dark:from-white/5 dark:via-slate-900 dark:to-white/5 dark:ring-white/10",
        disabled && "opacity-60"
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage: `linear-gradient(90deg, ${gradientStops.join(",")})`,
          clipPath: `inset(0 ${Math.max(0, 100 - percentage)}% 0 0)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-slate-900/10 dark:from-white/5 dark:via-transparent dark:to-black/40" />
      <div className="absolute inset-0 mix-blend-soft-light">{children}</div>
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
        className={twMerge(
          "absolute flex h-9 -translate-y-1/2 items-center justify-center text-center rounded-full border border-white/70 px-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/25 ring-1 ring-slate-200/80 backdrop-blur-sm",
          focused && "scale-[1.02] ring-slate-300 dark:ring-slate-500",
          disabled && "opacity-60 shadow-none dark:shadow-none"
        )}
      >
        {`${value}\u00B0F`}
      </span>
    );
  };

  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Studio Climate
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage room temperature</p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
          Custom thumb
        </span>
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
    </div>
  );
}

function OrientationPlayground() {
  const [horizontal, setHorizontal] = useState(40);
  const [horizontalReverse, setHorizontalReverse] = useState(65);
  const [vertical, setVertical] = useState(35);
  const [verticalReverse, setVerticalReverse] = useState(80);

  const renderBadge = (label: string) => (
    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/80 dark:text-slate-200 dark:ring-slate-700">
      {label}
    </span>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Horizontal</p>
          {renderBadge("Default")}
        </div>
        <Slider
          value={horizontal}
          onChange={setHorizontal}
          formatValue={(v) => `${v}%`}
          aria-label="Horizontal slider"
        />
      </div>

      <div className="space-y-2 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Horizontal reversed</p>
          {renderBadge("Reversed")}
        </div>
        <Slider
          reversed
          value={horizontalReverse}
          onChange={setHorizontalReverse}
          formatValue={(v) => `${v}%`}
          aria-label="Horizontal reversed slider"
        />
      </div>

      <div className="space-y-2 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Vertical</p>
          {renderBadge("Vertical")}
        </div>
        <div className="flex justify-center">
          <Slider
            orientation="vertical"
            value={vertical}
            onChange={setVertical}
            formatValue={(v) => `${v}%`}
            aria-label="Vertical slider"
            className="w-auto"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Vertical reversed</p>
          {renderBadge("Vertical + reversed")}
        </div>
        <div className="flex justify-center">
          <Slider
            orientation="vertical"
            reversed
            value={verticalReverse}
            onChange={setVerticalReverse}
            formatValue={(v) => `${v}%`}
            aria-label="Vertical reversed slider"
            className="w-auto"
          />
        </div>
      </div>
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
      <div className="grid gap-4">
        <ListeningSession />
        <TemperatureControl />
        <OrientationPlayground />
      </div>
    );
  },
  sourcePath: "src/components/Slider/Slider.tsx"
};

export default entry;
export { Slider };
export type { SliderProps };













