import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Button, ColorPicker } from "react-ui-suite";
import type { ColorPickerProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./ColorPicker.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

function useDemoIsDark() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    const root = document.documentElement;
    return root.dataset.theme === "dark";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const update = () => {
      setIsDark(root.dataset.theme === "dark");
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function useDemoSurfaceStyle(): CSSProperties {
  const isDark = useDemoIsDark();
  return useMemo(
    () => ({
      backgroundColor: isDark ? "rgba(24, 24, 27, 0.6)" : "#ffffff",
      borderColor: isDark ? "rgba(63, 63, 70, 0.8)" : "#e2e8f0",
      boxShadow: isDark ? "none" : "0 1px 2px rgb(15 23 42 / 0.12)",
    }),
    [isDark]
  );
}

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
  "#14B8A6",
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
  "#FFFFFF",
];

function ThemeEditor() {
  const surfaceStyle = useDemoSurfaceStyle();
  const [accent, setAccent] = useState("#0ea5e9");
  const [background, setBackground] = useState("#0f172a");

  return (
    <div className="color-picker-demo-theme-layout">
      <div className="color-picker-demo-theme-grid">
        <section className="color-picker-demo-swatch">
          <p className="color-picker-demo-swatch-title">
            Accent
          </p>
          <div className="color-picker-demo-swatch-picker">
            <ColorPicker value={accent} onChange={setAccent} swatches={accentSwatches} />
          </div>
          <p className="color-picker-demo-swatch-description">
            Used for links, buttons, and key highlights.
          </p>
        </section>
        <section className="color-picker-demo-swatch">
          <p className="color-picker-demo-swatch-title">
            Background
          </p>
          <div className="color-picker-demo-swatch-picker">
            <ColorPicker
              value={background}
              onChange={setBackground}
              swatches={backgroundSwatches}
            />
          </div>
          <p className="color-picker-demo-swatch-description">
            Surfaces for cards, panels, and navigation.
          </p>
        </section>
      </div>

      <div
        className="color-picker-demo-preview-card"
        style={{ background: background }}
      >
        <p className="color-picker-demo-preview-card__label">Preview</p>
        <div className="color-picker-demo-preview-card__content">
          <p className="color-picker-demo-preview-card__title" style={{ color: accent }}>
            Weekly roundup
          </p>
          <p className="color-picker-demo-preview-card__copy" style={{ color: `${accent}CC` }}>
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
    <div className="color-picker-demo-hero-block">
      <div className="color-picker-demo-controls">
        <div className="color-picker-demo-control">
          <ColorPicker
            label="Sky"
            value={sky}
            onChange={setSky}
            swatches={accentSwatches.slice(3)}
          />
        </div>
        <div className="color-picker-demo-control">
          <ColorPicker
            label="Sun"
            value={sun}
            onChange={setSun}
            swatches={accentSwatches.slice(5)}
          />
        </div>
        <div className="color-picker-demo-control">
          <ColorPicker label="Glow" value={glow} onChange={setGlow} swatches={accentSwatches} />
        </div>
        <div className="color-picker-demo-control">
          <ColorPicker
            label="Text"
            value={textColor}
            onChange={setTextColor}
            swatches={backgroundSwatches}
          />
        </div>
      </div>
      <DemoExample className="color-picker-demo-hero">
        <div
          className="color-picker-demo-hero__gradient"
          style={{
            background: `linear-gradient(180deg, ${sky}, #020617 80%)`,
          }}
        />
        <div
          className="color-picker-demo-hero__glow"
          style={{ background: glow }}
        />
        <div
          className="color-picker-demo-hero__sun"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${sun} 0%, ${sun} 55%, ${glow} 100%)`,
            filter: "blur(2px)",
          }}
        />
        <div className="color-picker-demo-hero__content">
          <p className="color-picker-demo-hero__eyebrow" style={{ color: `${textColor}B3` }}>
            Sunset sessions
          </p>
          <p className="color-picker-demo-hero__title" style={{ color: textColor }}>
            Design Meet-up
          </p>
          <p className="color-picker-demo-hero__copy" style={{ color: `${textColor}CC` }}>
            Tune your palette and watch the scene respond with gradients, glows, and lighting.
          </p>
          <Button
            style={{
              background: sun,
              color: textColor,
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.35)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
            className="color-picker-demo-hero__button"
          >
            RSVP
          </Button>
        </div>
      </DemoExample>
    </div>
  );
}

function MinimalPickerExample() {
  const surfaceStyle = useDemoSurfaceStyle();
  return (
    <DemoExample
      title="Quick Select"
      className="color-picker-demo-quick-select"
      style={surfaceStyle}
    >
      <div className="color-picker-demo-quick-select__content">
        <div className="color-picker-demo-quick-select__picker">
          <ColorPicker aria-label="Accent color" />
        </div>
        <p className="color-picker-demo-quick-select__description">
          Small footprint picker for inline usage.
        </p>
      </div>
    </DemoExample>
  );
}

function ColorPickerPreview() {
  const surfaceStyle = useDemoSurfaceStyle();
  return (
    <div className="color-picker-demo-section-stack">
      <DemoExample
        title="Theme colors"
        className="color-picker-demo-surface-card"
        style={surfaceStyle}
      >
        <ThemeEditor />
      </DemoExample>
      <div className="color-picker-demo-layout">
        <DemoExample
          title="Design meet-up"
          className="color-picker-demo-surface-card color-picker-demo-surface-card--compact"
          style={surfaceStyle}
        >
          <HeroPosterExample />
        </DemoExample>
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
  sourcePath: "src/components/ColorPicker/ColorPicker.tsx",
};

export default entry;
export { ColorPicker };
export type { ColorPickerProps };

