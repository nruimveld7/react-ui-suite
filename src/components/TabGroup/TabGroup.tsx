import * as React from "react";
import clsx from "clsx";
import "./TabGroup.css";
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

  const containerClasses = clsx(
    "rui-tab-group__u-display-flex--60fbb77139 rui-tab-group__u-flex-direction-column--8dddea0773 rui-tab-group__u-gap-1rem--0c3bc98565 rui-tab-group__u-border-radius-1-5rem--ea189a088a rui-tab-group__u-border-width-1px--ca6bcd4b6f rui-tab-group__u-rui-border-opacity-1--52f4da2ca5 rui-tab-group__u-background-color-rgb-255-255-255--845918557e rui-tab-group__u-padding-1rem--8e63407b5c rui-tab-group__u-rui-shadow-0-20px-25px-5px-rgb-0--a739868a85 rui-tab-group__u-rui-shadow-color-rgb-226-232-240--766950d8cd rui-tab-group__u-rui-border-opacity-1--139f099dfa rui-tab-group__u-background-color-rgb-24-24-27-0---5cd2915a74 rui-tab-group__u-rui-shadow-0-0-0000--2ac3c2fc68",
    vertical && "rui-tab-group__u-flex-direction-row--4102dddfda",
    className
  );

  const tabListContainerClasses = clsx(
    "rui-tab-group__u-border-radius-1rem--68f2db624d rui-tab-group__u-border-width-1px--ca6bcd4b6f rui-tab-group__u-rui-border-opacity-1--52f4da2ca5 rui-tab-group__u-background-color-rgb-255-255-255--b0b66d884b rui-tab-group__u-padding-0-5rem--7660b45090 rui-tab-group__u-rui-border-opacity-1--139f099dfa rui-tab-group__u-background-color-rgb-9-9-11-0-5--1dc8f87e5f",
    vertical ? "rui-tab-group__u-width-18rem--8be8f98900" : ""
  );

  const tabListClasses = clsx("rui-tab-group__u-display-flex--60fbb77139", vertical ? "rui-tab-group__u-flex-direction-column--8dddea0773" : "rui-tab-group__u-flex-direction-row--a6e88615d7");
  const panelWrapperClasses = clsx("rui-tab-group__u-flex-1-1-0--36e579c0b4", vertical ? "rui-tab-group__u-flex-1-1-0--9ee45fc97f" : "rui-tab-group__u-width-100--6da6a3c3f7");
  const panelBaseClasses = "rui-tab-group__panel";

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
            const buttonClasses = clsx(
              "rui-tab-group__u-display-flex--60fbb77139 rui-tab-group__u-flex-direction-column--8dddea0773 rui-tab-group__u-gap-0-25rem--44ee8ba0a4 rui-tab-group__u-border-radius-0-75rem--a217b4eaa9 rui-tab-group__u-padding-left-1rem--f0faeb26d6 rui-tab-group__u-padding-top-0-5rem--03b4dd7f17 rui-tab-group__u-font-size-0-875rem--fc7473ca09 rui-tab-group__u-font-weight-600--e83a7042bc rui-tab-group__u-rui-text-opacity-1--30426eb75c rui-tab-group__u-transition-property-color-backgr--56bf8ae82a rui-tab-group__u-rui-text-opacity-1--82ef9d210c rui-tab-group__u-outline-2px-solid-transparent--f10f771f87 rui-tab-group__u-rui-ring-offset-shadow-var-rui-r--793c80e97f rui-tab-group__u-rui-ring-opacity-1--1e73de7dbd rui-tab-group__u-rui-ring-offset-width-2px--0c4687c16c rui-tab-group__u-rui-ring-offset-color-fff--cccba99ae0 rui-tab-group__u-rui-text-opacity-1--6462b86910 rui-tab-group__u-rui-text-opacity-1--b08882541b rui-tab-group__u-rui-ring-offset-color-18181b--900e4559ba",
              vertical ? "rui-tab-group__u-width-100--6da6a3c3f7 rui-tab-group__u-align-items-flex-start--60541e1e26 rui-tab-group__u-text-align-left--2eba0d65d0" : "rui-tab-group__u-flex-1-1-0--36e579c0b4 rui-tab-group__u-align-items-center--3960ffc248 rui-tab-group__u-text-align-center--ca6bf63030",
              tabIsActive &&
                "rui-tab-group__u-rui-bg-opacity-1--5e10cdb8f1 rui-tab-group__u-rui-text-opacity-1--f5f136c41d rui-tab-group__u-rui-shadow-0-1px-3px-0-rgb-0-0-0--ed9d3d832a rui-tab-group__u-rui-shadow-color-rgb-226-232-240--a2af19db46 rui-tab-group__u-rui-bg-opacity-1--6319578a41 rui-tab-group__u-rui-text-opacity-1--f28dd6eba7",
              tab.disabled && "rui-tab-group__u-cursor-not-allowed--29b733e4c1 rui-tab-group__u-opacity-0-4--2a2db4667b"
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
                  <span className="rui-tab-group__u-font-size-0-75rem--359090c2d5 rui-tab-group__u-font-weight-400--8ecebc9f80 rui-tab-group__u-rui-text-opacity-1--30426eb75c rui-tab-group__u-rui-text-opacity-1--6462b86910">
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
                className={clsx(panelBaseClasses, !tabIsActive && "rui-tab-group__u-display-none--99d72c7fc3")}
              >
                {tab.content}
              </div>
            );
          })
        ) : (
          <div className={panelBaseClasses}>
            <p className="rui-tab-group__u-font-size-0-875rem--fc7473ca09 rui-tab-group__u-rui-text-opacity-1--30426eb75c rui-tab-group__u-rui-text-opacity-1--6462b86910">No tabs to display.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default TabGroup;
