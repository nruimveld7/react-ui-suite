import { useEffect, useMemo, useState } from "react";
import { Combobox, Toggle } from "@react-ui-suite/core";
import type { ComboboxOption } from "@react-ui-suite/core";
import type { ComponentRegistryEntry } from "@demo-components/component-registry";
import { useComponentRegistry } from "./lib/useComponentRegistry";

const THEME_STORAGE_KEY = "component-gallery-theme";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const registry = useComponentRegistry();
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const comboboxOptions = useMemo<ComboboxOption<string>[]>(
    () =>
      registry.map((entry) => ({
        id: entry.slug,
        label: entry.name,
        value: entry.slug
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
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const handleThemeToggle = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
  };

  const activeEntry =
    registry.find((entry) => entry.slug === activeSlug) ?? registry[0] ?? null;

  if (!registry.length) {
    return (
      <main className="flex h-screen items-center justify-center bg-zinc-900 text-zinc-100">
        <div className="text-center">
          <p className="text-lg font-semibold">No component demos found.</p>
          <p className="text-sm text-zinc-400">
            Add an index.tsx file to each component folder to register it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-zinc-900 dark:text-zinc-100">
      <div className="flex flex-col lg:grid lg:h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-r border-slate-200 bg-white/90 p-4 text-slate-900 shadow-sm lg:border-b-0 dark:border-zinc-800 dark:bg-demo-panel/60 dark:text-zinc-100">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Components
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-lg shadow-inner dark:border-zinc-800 dark:bg-zinc-900/70">
            <span role="img" aria-hidden="true" className="text-slate-700 dark:text-zinc-400">
              ☀️
            </span>
            <Toggle
              aria-label="Toggle dark mode"
              checked={theme === "dark"}
              onChange={handleThemeToggle}
            />
            <span role="img" aria-hidden="true" className="text-slate-700 dark:text-zinc-200">
              🌙
            </span>
          </div>

          <div className="mt-4 lg:max-h-[calc(100vh-140px)]">
            <Combobox
              ariaLabel="Component demos"
              options={comboboxOptions}
              value={selectedComboboxOption}
              onChange={(option) => setActiveSlug(option?.value ?? null)}
              placeholder="Select a component"
              className="w-full"
            />
            {activeEntry && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-inner shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:shadow-none">
                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  {activeEntry.name}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-3 dark:text-zinc-400">
                  {activeEntry.description}
                </p>
                <p className="mt-3 text-[0.65rem] uppercase tracking-wide text-slate-400 dark:text-zinc-500 truncate">
                  {activeEntry.sourcePath}
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className="bg-slate-50 p-6 dark:bg-zinc-950/40 lg:h-full lg:min-h-0 lg:overflow-auto">
          {activeEntry ? (
            <ComponentDetail entry={activeEntry} />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 dark:text-zinc-400">
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
    <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6">
      <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-zinc-800 dark:bg-demo-panel dark:shadow-zinc-900/30">
        <div className="pr-28">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{entry.name}</h1>
          <p className="mt-1 text-slate-600 dark:text-zinc-400">{entry.description}</p>
        </div>
        <div className="absolute right-6 top-6 text-sm text-slate-500 dark:text-zinc-400 whitespace-nowrap">
          <span className="font-semibold text-slate-800 dark:text-zinc-200">Source:</span>{" "}
          {entry.sourcePath}
        </div>

        {entry.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-wide text-slate-500 dark:border-zinc-700 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <entry.Preview />
        </div>
      </div>
    </div>
  );
}

