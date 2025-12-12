import * as React from "react";
import { twMerge } from "tailwind-merge";

export type TabGroupItem = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
};

export type TabGroupOrientation = "horizontal" | "vertical";

export type TabGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  tabs: TabGroupItem[];
  orientation?: TabGroupOrientation;
  value?: string;
  defaultValue?: string;
  onChange?: (tabId: string) => void;
};

const TabGroup = React.forwardRef<HTMLDivElement, TabGroupProps>(function TabGroup(
  { tabs, orientation = "horizontal", value, defaultValue, onChange, className, ...rest },
  ref
) {
  const isControlled = typeof value !== "undefined";
  const fallbackId = tabs[0]?.id ?? "";
  const [internalValue, setInternalValue] = React.useState<string>(() => {
    if (typeof defaultValue === "string") return defaultValue;
    if (fallbackId) return fallbackId;
    return "";
  });
  const resolvedValue = (isControlled ? value : internalValue) || "";
  const vertical = orientation === "vertical";

  React.useEffect(() => {
    if (!tabs.length) {
      if (!isControlled && internalValue) {
        setInternalValue("");
      }
      return;
    }

    const isCurrentStillVisible = tabs.some((tab) => tab.id === resolvedValue);
    if (!isCurrentStillVisible && !isControlled) {
      setInternalValue(tabs[0].id);
    }
  }, [tabs, resolvedValue, isControlled, internalValue]);

  const setActiveValue = (tabId: string) => {
    if (!isControlled) {
      setInternalValue(tabId);
    }
    onChange?.(tabId);
  };

  const baseId = React.useId();
  const activeId = tabs.length ? resolvedValue || tabs[0].id : "";
  const tabRefs = React.useRef(new Map<string, HTMLButtonElement | null>());

  const focusTab = (tabId: string) => {
    const node = tabRefs.current.get(tabId);
    node?.focus();
  };

  const selectTab = (tabId: string) => {
    const tab = tabs.find((item) => item.id === tabId);
    if (!tab || tab.disabled || tab.id === activeId) {
      return;
    }
    setActiveValue(tabId);
  };

  const moveFocus = (startIndex: number, direction: 1 | -1) => {
    if (!tabs.length) return;

    let nextIndex = startIndex;
    for (let i = 0; i < tabs.length; i += 1) {
      nextIndex = (nextIndex + direction + tabs.length) % tabs.length;
      const candidate = tabs[nextIndex];
      if (!candidate.disabled) {
        selectTab(candidate.id);
        focusTab(candidate.id);
        return;
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    const { key } = event;
    if (key === "ArrowRight" || key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(currentIndex, key === "ArrowRight" ? 1 : -1);
    }
    if (vertical && (key === "ArrowDown" || key === "ArrowUp")) {
      event.preventDefault();
      moveFocus(currentIndex, key === "ArrowDown" ? 1 : -1);
    }
  };

  const setTabRef = (tabId: string) => (node: HTMLButtonElement | null) => {
    if (node) {
      tabRefs.current.set(tabId, node);
    } else {
      tabRefs.current.delete(tabId);
    }
  };

  const ariaLabel = rest["aria-label"];
  const ariaLabelledBy = rest["aria-labelledby"];

  const containerClasses = twMerge(
    "flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none",
    vertical && "md:flex-row",
    className
  );

  const tabListContainerClasses = twMerge(
    "rounded-2xl border border-slate-200 bg-white/70 p-2 dark:border-zinc-800 dark:bg-zinc-950/50",
    vertical ? "md:w-72" : ""
  );

  const tabListClasses = twMerge("flex gap-1", vertical ? "flex-col" : "flex-row");
  const panelWrapperClasses = twMerge("flex-1", vertical ? "md:flex-1" : "w-full");
  const panelBaseClasses =
    "rounded-2xl border border-slate-100 bg-white/90 p-4 text-sm text-slate-600 shadow-inner shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200";

  return (
    <div {...rest} ref={ref} className={containerClasses} data-orientation={orientation}>
      <div className={tabListContainerClasses}>
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-orientation={orientation}
          className={tabListClasses}
        >
          {tabs.map((tab, index) => {
            const tabIsActive = tab.id === activeId;
            const buttonId = `${baseId}-tab-${tab.id}`;
            const panelId = `${baseId}-panel-${tab.id}`;
            const buttonClasses = twMerge(
              "flex flex-col gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-900",
              vertical ? "w-full items-start text-left" : "flex-1 items-center text-center",
              tabIsActive &&
                "bg-white text-slate-900 shadow shadow-slate-200/50 dark:bg-zinc-900 dark:text-zinc-50",
              tab.disabled && "cursor-not-allowed opacity-40"
            );

            return (
              <button
                key={tab.id}
                id={buttonId}
                type="button"
                role="tab"
                aria-selected={tabIsActive}
                aria-controls={panelId}
                tabIndex={tabIsActive ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                ref={setTabRef(tab.id)}
                className={buttonClasses}
              >
                <span>{tab.label}</span>
                {tab.description ? (
                  <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">
                    {tab.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className={panelWrapperClasses}>
        {tabs.length ? (
          tabs.map((tab) => {
            const panelId = `${baseId}-panel-${tab.id}`;
            const buttonId = `${baseId}-tab-${tab.id}`;
            const tabIsActive = tab.id === activeId;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                id={panelId}
                aria-labelledby={buttonId}
                hidden={!tabIsActive}
                className={twMerge(panelBaseClasses, !tabIsActive && "hidden")}
              >
                {tab.content}
              </div>
            );
          })
        ) : (
          <div className={panelBaseClasses}>
            <p className="text-sm text-slate-500 dark:text-zinc-400">No tabs to display.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default TabGroup;
