import { useEffect, useMemo, useState } from "react";
import { Combobox, Toggle } from "react-ui-suite";
import type { ComboboxOption } from "react-ui-suite";
import type { ComponentRegistryEntry } from "component-registry";
import { useComponentRegistry } from "./lib/useComponentRegistry";
import "./App.css";
import { DemoPage } from "./components/DemoPage";

const THEME_STORAGE_KEY = "component-gallery-theme";
type Theme = "light" | "dark";

function getInitialSlug(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("component");
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const registry = useComponentRegistry();
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [activeSlug, setActiveSlug] = useState<string | null>(() => getInitialSlug());
  const comboboxOptions = useMemo<ComboboxOption<string>[]>(
    () =>
      registry.map((entry) => ({
        id: entry.slug,
        label: entry.name,
        value: entry.slug,
      })),
    [registry]
  );

  const selectedComboboxOption =
    comboboxOptions.find((option) => option.value === activeSlug) ?? null;

  useEffect(() => {
    if (!registry.length) {
      if (activeSlug !== null) {
        setActiveSlug(null);
      }
      return;
    }
    const isActiveStillVisible = registry.some((entry) => entry.slug === activeSlug);
    if (!isActiveStillVisible) {
      setActiveSlug(registry[0].slug);
    }
  }, [registry, activeSlug]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const handleThemeToggle = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
  };

  const activeEntry = registry.find((entry) => entry.slug === activeSlug) ?? registry[0] ?? null;

  if (!registry.length) {
    return (
      <main className="demo-emptyState">
        <div className="demo-emptyStateInner">
          <p className="demo-emptyTitle">No component demos found.</p>
          <p className="demo-emptyHint">
            Add a *.demo.tsx file (e.g. Button.demo.tsx) next to each component to register it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="demo-app">
      <div className="demo-shell">
        <aside className="demo-sidebar">
          <div>
            <p className="demo-sidebarTitle">Components</p>
          </div>
          <div className="demo-themeToggle">
            <span role="img" aria-hidden="true" className="demo-themeIcon">
              ☀️
            </span>
            <Toggle
              aria-label="Toggle dark mode"
              checked={theme === "dark"}
              onChange={handleThemeToggle}
            />
            <span role="img" aria-hidden="true" className="demo-themeIconStrong">
              🌙
            </span>
          </div>

          <div className="demo-sidebarBody">
            <Combobox
              ariaLabel="Component demos"
              options={comboboxOptions}
              value={selectedComboboxOption}
              onChange={(option) => setActiveSlug(option?.value ?? null)}
              placeholder="Select a component"
              className="demo-combobox"
            />
            {activeEntry && (
              <div className="demo-entryCard">
                <p className="demo-entryName">{activeEntry.name}</p>
                <p className="demo-entryDescription demo-entryDescription--clamped">
                  {activeEntry.description}
                </p>
                <p className="demo-entrySource rui-text-truncate">{activeEntry.sourcePath}</p>
              </div>
            )}
          </div>
        </aside>

        <main className="demo-main">
          {activeEntry ? (
            <ComponentDetail entry={activeEntry} />
          ) : (
            <div className="demo-mainEmpty">
              Select a component to view its preview.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ComponentDetail({ entry }: { entry: ComponentRegistryEntry }) {
  return (
    <DemoPage entry={entry}>
      <entry.Preview />
    </DemoPage>
  );
}
