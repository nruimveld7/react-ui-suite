import { useState } from "react";
import { Button, ColorPicker } from "@react-ui-suite/core";
import type { ColorPickerProps } from "@react-ui-suite/core";
import type { ComponentRegistryEntry } from "../component-registry";

const accentSwatches = [
  "#0284C7",
  "#0EA5E9",
  "#22D3EE",
  "#A855F7",
  "#D946EF",
  "#F43F5E",
  "#F97316",
  "#FACC15",
  "#10B981",
  "#14B8A6"
];

const backgroundSwatches = [
  "#020617",
  "#0F172A",
  "#1E293B",
  "#334155",
  "#475569",
  "#64748B",
  "#94A3B8",
  "#E2E8F0",
  "#F8FAFC",
  "#FFFFFF"
];

function ThemeEditor() {
  const [accent, setAccent] = useState("#0ea5e9");
  const [background, setBackground] = useState("#0f172a");

  return (
    <div className="space-y-5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
        Theme colors
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5 text-center shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Accent
          </p>
          <div className="flex justify-center">
            <ColorPicker value={accent} onChange={setAccent} swatches={accentSwatches} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Used for links, buttons, and key highlights.
          </p>
        </section>
        <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5 text-center shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Background
          </p>
          <div className="flex justify-center">
            <ColorPicker value={background} onChange={setBackground} swatches={backgroundSwatches} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Surfaces for cards, panels, and navigation.
          </p>
        </section>
      </div>

      <div
        className="space-y-3 rounded-2xl border border-slate-200/60 p-5 text-xs font-semibold uppercase tracking-[0.3em] dark:border-slate-700"
        style={{ background: background }}
      >
        <p className="text-slate-500 dark:text-slate-300">Preview</p>
        <div className="space-y-3">
          <p className="text-base font-semibold" style={{ color: accent }}>
            Weekly roundup
          </p>
          <p className="text-sm text-slate-200/80" style={{ color: `${accent}CC` }}>
            Adjust your theme tokens and instantly preview how your UI components adapt.
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroPosterExample() {
  const [sky, setSky] = useState("#312e81");
  const [sun, setSun] = useState("#f97316");
  const [glow, setGlow] = useState("#22d3ee");
  const [textColor, setTextColor] = useState("#f8fafc");
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="text-center">
          <ColorPicker label="Sky" value={sky} onChange={setSky} swatches={accentSwatches.slice(3)} />
        </div>
        <div className="text-center">
          <ColorPicker label="Sun" value={sun} onChange={setSun} swatches={accentSwatches.slice(5)} />
        </div>
        <div className="text-center">
          <ColorPicker label="Glow" value={glow} onChange={setGlow} swatches={accentSwatches} />
        </div>
        <div className="text-center">
          <ColorPicker label="Text" value={textColor} onChange={setTextColor} swatches={backgroundSwatches} />
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-950 p-6 text-white shadow-lg dark:border-slate-800">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(180deg, ${sky}, #020617 80%)`
          }}
        />
        <div
          className="absolute -right-10 top-4 h-40 w-40 rounded-full blur-[70px] opacity-80"
          style={{ background: glow }}
        />
        <div
          className="absolute top-6 right-2 h-24 w-24 rounded-full shadow-[0_0_35px_rgba(0,0,0,.35)]"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${sun} 0%, ${sun} 55%, ${glow} 100%)`,
            filter: "blur(2px)"
          }}
        />
        <div className="relative space-y-4">
          <p className="text-xs uppercase tracking-[0.4em]" style={{ color: `${textColor}B3` }}>
            Sunset sessions
          </p>
          <p className="text-3xl font-bold" style={{ color: textColor }}>
            Design Meet-up
          </p>
          <p className="max-w-sm text-sm" style={{ color: `${textColor}CC` }}>
            Tune your palette and watch the scene respond with gradients, glows, and lighting.
          </p>
          <Button
            style={{
              background: sun,
              color: textColor,
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.35)",
              border: "1px solid rgba(255,255,255,0.3)"
            }}
            className="border-0 text-sm font-semibold shadow-lg"
          >
            RSVP
          </Button>
        </div>
      </div>
    </div>
  );
}

function MinimalPickerExample() {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Quick select
        </p>
        <div className="mt-3 flex justify-center">
          <ColorPicker aria-label="Accent color" />
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Small footprint picker for inline usage.
        </p>
      </div>
    </div>
  );
}

function ColorPickerPreview() {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <ThemeEditor />
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <HeroPosterExample />
        </div>
        <MinimalPickerExample />
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "color-picker",
  name: "Color Picker",
  description:
    "Custom color input with a bespoke popover, hex/RGB/HSL editing, and managed swatches.",
  tags: ["input", "form", "color"],
  Preview: ColorPickerPreview,
  sourcePath: "src/components/ColorPicker/ColorPicker.tsx"
};

export default entry;
export { ColorPicker };
export type { ColorPickerProps };

