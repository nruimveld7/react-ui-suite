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
    return root.dataset.theme === "dark" || root.classList.contains("dark");
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const update = () => {
      setIsDark(root.dataset.theme === "dark" || root.classList.contains("dark"));
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme", "class"] });
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
    <div className="rui-color-picker-demo__u-style--b43b4c086d rui-color-picker-demo__u-padding-1-25rem--c07e54fd14">
      <div className="rui-color-picker-demo__u-display-grid--f3c543ad5f rui-color-picker-demo__u-gap-1-25rem--b39e60c339 rui-color-picker-demo__u-grid-template-columns-repeat-2-m--e4d6f343b9">
        <section
          className="rui-color-picker-demo__u-style--3e7ce58d64 rui-color-picker-demo__u-border-radius-1rem--68f2db624d rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f rui-color-picker-demo__u-border-color-rgb-226-232-240-0-7--3dffc0683b rui-color-picker-demo__u-background-color-rgb-255-255-255--6c21de570d rui-color-picker-demo__u-padding-1-25rem--c07e54fd14 rui-color-picker-demo__u-text-align-center--ca6bf63030 rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-color-picker-demo__u-border-color-rgb-51-65-85-0-8--aeee5a4541 rui-color-picker-demo__u-background-color-rgb-15-23-42-0---96db0407f2"
          style={surfaceStyle}
        >
          <p className="rui-color-picker-demo__u-font-size-11px--d058ca6de6 rui-color-picker-demo__u-font-weight-600--e83a7042bc rui-color-picker-demo__u-text-transform-uppercase--117ec720ea rui-color-picker-demo__u-letter-spacing-0-3em--bf7342eeb7 rui-color-picker-demo__u-color-rgb-148-163-184-1--8d44cef396 rui-color-picker-demo__u-color-rgb-100-116-139-1--15b16954d1">
            Accent
          </p>
          <div className="rui-color-picker-demo__u-display-flex--60fbb77139 rui-color-picker-demo__u-justify-content-center--86843cf1e2">
            <ColorPicker value={accent} onChange={setAccent} swatches={accentSwatches} />
          </div>
          <p className="rui-color-picker-demo__u-font-size-0-75rem--359090c2d5 rui-color-picker-demo__u-color-rgb-100-116-139-1--30426eb75c rui-color-picker-demo__u-color-rgb-148-163-184-1--cc0274aad9">
            Used for links, buttons, and key highlights.
          </p>
        </section>
        <section
          className="rui-color-picker-demo__u-style--3e7ce58d64 rui-color-picker-demo__u-border-radius-1rem--68f2db624d rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f rui-color-picker-demo__u-border-color-rgb-226-232-240-0-7--3dffc0683b rui-color-picker-demo__u-background-color-rgb-255-255-255--6c21de570d rui-color-picker-demo__u-padding-1-25rem--c07e54fd14 rui-color-picker-demo__u-text-align-center--ca6bf63030 rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-color-picker-demo__u-border-color-rgb-51-65-85-0-8--aeee5a4541 rui-color-picker-demo__u-background-color-rgb-15-23-42-0---96db0407f2"
          style={surfaceStyle}
        >
          <p className="rui-color-picker-demo__u-font-size-11px--d058ca6de6 rui-color-picker-demo__u-font-weight-600--e83a7042bc rui-color-picker-demo__u-text-transform-uppercase--117ec720ea rui-color-picker-demo__u-letter-spacing-0-3em--bf7342eeb7 rui-color-picker-demo__u-color-rgb-148-163-184-1--8d44cef396 rui-color-picker-demo__u-color-rgb-100-116-139-1--15b16954d1">
            Background
          </p>
          <div className="rui-color-picker-demo__u-display-flex--60fbb77139 rui-color-picker-demo__u-justify-content-center--86843cf1e2">
            <ColorPicker
              value={background}
              onChange={setBackground}
              swatches={backgroundSwatches}
            />
          </div>
          <p className="rui-color-picker-demo__u-font-size-0-75rem--359090c2d5 rui-color-picker-demo__u-color-rgb-100-116-139-1--30426eb75c rui-color-picker-demo__u-color-rgb-148-163-184-1--cc0274aad9">
            Surfaces for cards, panels, and navigation.
          </p>
        </section>
      </div>

      <div
        className="rui-color-picker-demo__u-style--6ed543e2fb rui-color-picker-demo__u-border-radius-1rem--68f2db624d rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f rui-color-picker-demo__u-border-color-rgb-226-232-240-0-6--31108c28b7 rui-color-picker-demo__u-padding-1-25rem--c07e54fd14 rui-color-picker-demo__u-font-size-0-75rem--359090c2d5 rui-color-picker-demo__u-font-weight-600--e83a7042bc rui-color-picker-demo__u-text-transform-uppercase--117ec720ea rui-color-picker-demo__u-letter-spacing-0-3em--bf7342eeb7 rui-color-picker-demo__u-border-color-rgb-51-65-85-1--30fb741464"
        style={{ background: background }}
      >
        <p className="rui-color-picker-demo__u-color-rgb-100-116-139-1--30426eb75c rui-color-picker-demo__u-color-rgb-203-213-225-1--ca11017ff7">Preview</p>
        <div className="rui-color-picker-demo__u-style--6ed543e2fb">
          <p className="rui-color-picker-demo__u-font-size-1rem--4ee734926f rui-color-picker-demo__u-font-weight-600--e83a7042bc" style={{ color: accent }}>
            Weekly roundup
          </p>
          <p className="rui-color-picker-demo__u-font-size-0-875rem--fc7473ca09 rui-color-picker-demo__u-color-rgb-226-232-240-0-8--800ce348b4" style={{ color: `${accent}CC` }}>
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
    <div className="rui-color-picker-demo__u-style--3e7ce58d64">
      <div className="rui-color-picker-demo__u-display-grid--f3c543ad5f rui-color-picker-demo__u-gap-1rem--0c3bc98565 rui-color-picker-demo__u-grid-template-columns-repeat-4-m--d59f314ff6">
        <div className="rui-color-picker-demo__u-text-align-center--ca6bf63030">
          <ColorPicker
            label="Sky"
            value={sky}
            onChange={setSky}
            swatches={accentSwatches.slice(3)}
          />
        </div>
        <div className="rui-color-picker-demo__u-text-align-center--ca6bf63030">
          <ColorPicker
            label="Sun"
            value={sun}
            onChange={setSun}
            swatches={accentSwatches.slice(5)}
          />
        </div>
        <div className="rui-color-picker-demo__u-text-align-center--ca6bf63030">
          <ColorPicker label="Glow" value={glow} onChange={setGlow} swatches={accentSwatches} />
        </div>
        <div className="rui-color-picker-demo__u-text-align-center--ca6bf63030">
          <ColorPicker
            label="Text"
            value={textColor}
            onChange={setTextColor}
            swatches={backgroundSwatches}
          />
        </div>
      </div>
      <DemoExample className="rui-color-picker-demo__u-position-relative--d89972fe17 rui-color-picker-demo__u-overflow-hidden--2cd02d11d1 rui-color-picker-demo__u-border-radius-1-5rem--ea189a088a rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f rui-color-picker-demo__u-border-color-rgb-226-232-240-0-7--3dffc0683b rui-color-picker-demo__u-background-color-rgb-2-6-23-1--1034d22595 rui-color-picker-demo__u-padding-1-5rem--0478c89a15 rui-color-picker-demo__u-color-rgb-255-255-255-1--72a4c7cdee rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--06bbb43166 rui-color-picker-demo__u-border-color-rgb-30-41-59-1--2072c87505">
        <div
          className="rui-color-picker-demo__u-position-absolute--da4dbfbc4f rui-color-picker-demo__u-inset-0px--7b7df0449b rui-color-picker-demo__u-opacity-0-9--4f5874c554"
          style={{
            background: `linear-gradient(180deg, ${sky}, #020617 80%)`,
          }}
        />
        <div
          className="rui-color-picker-demo__u-position-absolute--da4dbfbc4f rui-color-picker-demo__u-right-2-5rem--8e97812345 rui-color-picker-demo__u-top-1rem--451eecb702 rui-color-picker-demo__u-height-10rem--aadad6871a rui-color-picker-demo__u-width-10rem--84789e8a20 rui-color-picker-demo__u-border-radius-9999px--ac204c1088 rui-color-picker-demo__u-filter-blur-70px--1b6408824a rui-color-picker-demo__u-opacity-0-8--714816efc6"
          style={{ background: glow }}
        />
        <div
          className="rui-color-picker-demo__u-position-absolute--da4dbfbc4f rui-color-picker-demo__u-top-1-5rem--e9d6ffe0c5 rui-color-picker-demo__u-right-0-5rem--7b2d63937d rui-color-picker-demo__u-height-6rem--9678c61eaa rui-color-picker-demo__u-width-6rem--69da7e4ff9 rui-color-picker-demo__u-border-radius-9999px--ac204c1088 rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-0--f71aeef3bb"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${sun} 0%, ${sun} 55%, ${glow} 100%)`,
            filter: "blur(2px)",
          }}
        />
        <div className="rui-color-picker-demo__u-position-relative--d89972fe17 rui-color-picker-demo__u-style--3e7ce58d64">
          <p className="rui-color-picker-demo__u-font-size-0-75rem--359090c2d5 rui-color-picker-demo__u-text-transform-uppercase--117ec720ea rui-color-picker-demo__u-letter-spacing-0-4em--e6fe14fcf7" style={{ color: `${textColor}B3` }}>
            Sunset sessions
          </p>
          <p className="rui-color-picker-demo__u-font-size-1-875rem--751fb0d102 rui-color-picker-demo__u-font-weight-700--69450ef148" style={{ color: textColor }}>
            Design Meet-up
          </p>
          <p className="rui-color-picker-demo__u-max-width-24rem--2472e9b81a rui-color-picker-demo__u-font-size-0-875rem--fc7473ca09" style={{ color: `${textColor}CC` }}>
            Tune your palette and watch the scene respond with gradients, glows, and lighting.
          </p>
          <Button
            style={{
              background: sun,
              color: textColor,
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.35)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
            className="rui-color-picker-demo__u-border-width-0px--119b2aa0b8 rui-color-picker-demo__u-font-size-0-875rem--fc7473ca09 rui-color-picker-demo__u-font-weight-600--e83a7042bc rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--06bbb43166"
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
      title="Quick select"
      className="rui-color-picker-demo__u-display-flex--60fbb77139 rui-color-picker-demo__u-align-items-center--3960ffc248 rui-color-picker-demo__u-justify-content-center--86843cf1e2 rui-color-picker-demo__u-border-radius-1-5rem--ea189a088a rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f rui-color-picker-demo__u-border-color-rgb-226-232-240-0-7--3dffc0683b rui-color-picker-demo__u-background-color-rgb-255-255-255--845918557e rui-color-picker-demo__u-padding-1-5rem--0478c89a15 rui-color-picker-demo__u-text-align-center--ca6bf63030 rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-color-picker-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-color-picker-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
      style={surfaceStyle}
    >
      <div>
        <div className="rui-color-picker-demo__u-display-flex--60fbb77139 rui-color-picker-demo__u-justify-content-center--86843cf1e2">
          <ColorPicker aria-label="Accent color" />
        </div>
        <p className="rui-color-picker-demo__u-margin-top-0-75rem--eccd13ef4f rui-color-picker-demo__u-font-size-0-75rem--359090c2d5 rui-color-picker-demo__u-color-rgb-100-116-139-1--30426eb75c rui-color-picker-demo__u-color-rgb-148-163-184-1--cc0274aad9">
          Small footprint picker for inline usage.
        </p>
      </div>
    </DemoExample>
  );
}

function ColorPickerPreview() {
  const surfaceStyle = useDemoSurfaceStyle();
  return (
    <div className="rui-color-picker-demo__u-style--b43b4c086d">
      <DemoExample
        title="Theme colors"
        className="rui-color-picker-demo__u-border-radius-1-5rem--ea189a088a rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f rui-color-picker-demo__u-border-color-rgb-226-232-240-0-7--3dffc0683b rui-color-picker-demo__u-background-color-rgb-255-255-255--6c21de570d rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-color-picker-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-color-picker-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
        style={surfaceStyle}
      >
        <ThemeEditor />
      </DemoExample>
      <div className="rui-color-picker-demo__u-display-grid--f3c543ad5f rui-color-picker-demo__u-gap-1rem--0c3bc98565 rui-color-picker-demo__u-grid-template-columns-2fr-1fr--8074f1c106">
        <DemoExample
          title="Design meet-up"
          className="rui-color-picker-demo__u-border-radius-1-5rem--ea189a088a rui-color-picker-demo__u-border-width-1px--ca6bcd4b6f rui-color-picker-demo__u-border-color-rgb-226-232-240-0-7--3dffc0683b rui-color-picker-demo__u-background-color-rgb-255-255-255--6c21de570d rui-color-picker-demo__u-padding-1rem--8e63407b5c rui-color-picker-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-color-picker-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-color-picker-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
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
