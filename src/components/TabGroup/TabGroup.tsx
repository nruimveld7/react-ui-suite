import React from "react";
import "./TabGroup.css";

export const TabGroupAlign = ["start", "center", "end"] as const;
export const TabGroupPosition = ["top", "right", "bottom", "left"] as const;
export const TabGroupFill = ["full", "partial"] as const;
export const TabGroupRotation = ["horizontal", "vertical"] as const;

export type TabGroupAlign = (typeof TabGroupAlign)[number];
export type TabGroupPosition = (typeof TabGroupPosition)[number];
export type TabGroupFill = (typeof TabGroupFill)[number];
export type TabGroupRotation = (typeof TabGroupRotation)[number];

export type TabGroupTab = {
    label: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

export type TabGroupProps = {
    align?: TabGroupAlign;
    position?: TabGroupPosition;
    fill?: TabGroupFill;
    rotation?: TabGroupRotation;
    size?: number;
    tabs: TabGroupTab[];

    active?: number;
    defaultActive?: number;
    onActiveChange?: (index: number) => void;
};

export default function TabGroup({
    align = "start",
    position = "top",
    fill = "full",
    rotation = "horizontal",
    size = 50,
    tabs,
    active,
    defaultActive = 0,
    onActiveChange,
}: TabGroupProps) {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const tabStripRef = React.useRef<HTMLDivElement | null>(null);
    const measureRef = React.useRef<HTMLDivElement | null>(null);
    const idBase = React.useId();
    const [effectiveFill, setEffectiveFill] = React.useState<TabGroupFill>(fill);
    const [availableMain, setAvailableMain] = React.useState(0);
    const [cssMinMain, setCssMinMain] = React.useState(32);
    const [contentMinMain, setContentMinMain] = React.useState(0);
    const count = tabs.length;
    const isVertical = position === "left" || position === "right";
    const minMain = Math.max(cssMinMain, contentMinMain);
    const partialMainSize = Math.max(Number.isFinite(size) ? size : 0, minMain);
    const clampIndex = React.useCallback(
        (i: number) => {
            if (count <= 0) {
                return 0;
            }
            if (!Number.isFinite(i)) {
                return 0;
            }
            return Math.max(0, Math.min(count - 1, Math.trunc(i)));
        },
        [count]
    );
    const isControlled = active !== undefined;
    const [activeInternal, setActiveInternal] = React.useState<number>(() => clampIndex(defaultActive));
    React.useEffect(() => {
        if(!isControlled) {
            setActiveInternal((i) => clampIndex(i));
        }
    }, [clampIndex, isControlled]);
    const currentActive = clampIndex(isControlled ? active! : activeInternal);
    const setActive = React.useCallback(
        (next: number) => {
            const i = clampIndex(next);
            if(!isControlled) {
                setActiveInternal(i);
            }
            onActiveChange?.(i);
        },
        [clampIndex, isControlled, onActiveChange]
    );

    const tabsFirst = position === "top" || position === "left";
    const updateEffectiveFill = React.useCallback(() => {
        const root = rootRef.current;
        if (!root) {
            setEffectiveFill(fill);
            return;
        }

        const rect = root.getBoundingClientRect();
        const computed = getComputedStyle(root);
        const radius = parseFloat(computed.getPropertyValue("--rui-tab-panel-radius")) || 0;
        const border = parseFloat(computed.getPropertyValue("--rui-tab-border")) || 0;
        const minMainValue = parseFloat(computed.getPropertyValue("--rui-tab-min-main")) || 32;
        const effectiveMinMain = Math.max(minMainValue, contentMinMain);
        const wiggle = border * 2 + 1;
        const available = position === "top" || position === "bottom" ? rect.width : rect.height;
        const requiredPerTab = Math.max(size ?? 0, effectiveMinMain);
        const required = requiredPerTab * tabs.length;
        const slots = effectiveMinMain > 0 ? Math.floor(available / effectiveMinMain) : tabs.length;
        const hasOverflowControls = slots < tabs.length;
        const shouldFill = (available - (2 * radius) - wiggle) <= required;
        setEffectiveFill(shouldFill || hasOverflowControls ? "full" : "partial");
    }, [contentMinMain, fill, position, size, tabs.length]);

    React.useLayoutEffect(() => {
        if (fill === "full") {
            setEffectiveFill("full");
            return;
        }

        updateEffectiveFill();
        const node = rootRef.current;
        if (!node || typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver(() => updateEffectiveFill());
        observer.observe(node);
        return () => observer.disconnect();
    }, [fill, updateEffectiveFill]);

    React.useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const computed = getComputedStyle(root);
        const cssMin = parseFloat(computed.getPropertyValue("--rui-tab-min-main"));
        setCssMinMain(Number.isFinite(cssMin) && cssMin > 0 ? cssMin : 32);
    }, [position]);

    React.useLayoutEffect(() => {
        const node = measureRef.current;
        if (!node) return;

        const measure = () => {
            const sampleTab = node.querySelector<HTMLElement>(".rui-tab-group__tab");
            const labels = Array.from(node.querySelectorAll<HTMLElement>(".rui-tab-group__label"));
            if (!sampleTab || labels.length === 0) {
                setContentMinMain(0);
                return;
            }

            const tabStyle = getComputedStyle(sampleTab);
            const paddingMain = isVertical
                ? (parseFloat(tabStyle.paddingTop) || 0) + (parseFloat(tabStyle.paddingBottom) || 0)
                : (parseFloat(tabStyle.paddingLeft) || 0) + (parseFloat(tabStyle.paddingRight) || 0);
            const borderMain = isVertical
                ? (parseFloat(tabStyle.borderTopWidth) || 0) + (parseFloat(tabStyle.borderBottomWidth) || 0)
                : (parseFloat(tabStyle.borderLeftWidth) || 0) + (parseFloat(tabStyle.borderRightWidth) || 0);

            let largestLabelMain = 0;
            for (const label of labels) {
                const rect = label.getBoundingClientRect();
                const labelMain = isVertical ? rect.height : rect.width;
                if (labelMain > largestLabelMain) {
                    largestLabelMain = labelMain;
                }
            }

            const next = Math.ceil(largestLabelMain + paddingMain + borderMain);
            setContentMinMain((prev) => (prev === next ? prev : next));
        };

        measure();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(() => measure());
        observer.observe(node);
        return () => observer.disconnect();
    }, [isVertical, position, rotation, tabs]);

    React.useLayoutEffect(() => {
        const node = tabStripRef.current;
        if (!node) return;

        const measure = () => {
            const rect = node.getBoundingClientRect();
            setAvailableMain(isVertical ? rect.height : rect.width);
        };

        measure();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(() => measure());
        observer.observe(node);
        return () => observer.disconnect();
    }, [isVertical]);

    const slots = availableMain > 0 && minMain > 0 ? Math.floor(availableMain / minMain) : count;
    const overflow = slots < count;
    const layoutSlots = overflow ? Math.max(3, slots) : Math.max(1, slots);
    const windowSize = overflow ? Math.max(1, layoutSlots - 2) : count;
    const maxStart = Math.max(0, count - windowSize);
    const [startIndex, setStartIndex] = React.useState(0);

    React.useEffect(() => {
        if (!overflow) {
            setStartIndex(0);
            return;
        }
        setStartIndex((prev) => Math.min(Math.max(0, prev), maxStart));
    }, [overflow, maxStart]);

    React.useEffect(() => {
        if (!overflow) return;
        setStartIndex((prev) => {
            if (currentActive < prev) return currentActive;
            const end = prev + windowSize;
            if (currentActive >= end) return currentActive - windowSize + 1;
            return prev;
        });
    }, [currentActive, overflow, windowSize]);

    const visibleTabs = overflow ? tabs.slice(startIndex, startIndex + windowSize) : tabs;
    const slotSize = overflow && layoutSlots > 0 ? availableMain / layoutSlots : 0;
    const overflowMainStyle =
        overflow && slotSize > 0 ? (isVertical ? { height: slotSize } : { width: slotSize }) : undefined;
    const mainStyle =
        overflow
            ? overflowMainStyle
            : effectiveFill === "partial"
                ? (isVertical ? { height: partialMainSize } : { width: partialMainSize })
                : undefined;

    const scrollLabels = isVertical
        ? { back: "Scroll tabs up", forward: "Scroll tabs down" }
        : { back: "Scroll tabs left", forward: "Scroll tabs right" };
    const scrollMainStyle = overflowMainStyle;

    const panelId = `${idBase}-panel`;
    const getTabId = React.useCallback(
        (index: number) => `${idBase}-tab-${index}`,
        [idBase]
    );

    const focusTabAt = React.useCallback((index: number) => {
        const node = rootRef.current?.querySelector<HTMLElement>(`[data-tab-index="${index}"]`);
        node?.focus();
    }, []);

    const moveActiveBy = React.useCallback(
        (direction: 1 | -1) => {
            if (count === 0) return;
            for (let i = 0; i < count; i += 1) {
                const next = (currentActive + direction * (i + 1) + count) % count;
                if (!tabs[next]?.disabled) {
                    setActive(next);
                    requestAnimationFrame(() => focusTabAt(next));
                    return;
                }
            }
        },
        [count, currentActive, focusTabAt, setActive, tabs]
    );

    const moveToEdge = React.useCallback(
        (edge: "start" | "end") => {
            if (count === 0) return;
            const range = edge === "start" ? [0, count, 1] : [count - 1, -1, -1];
            for (let i = range[0]; i !== range[1]; i += range[2]) {
                if (!tabs[i]?.disabled) {
                    setActive(i);
                    requestAnimationFrame(() => focusTabAt(i));
                    return;
                }
            }
        },
        [count, focusTabAt, setActive, tabs]
    );

    const handleTabListKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            const key = event.key;
            const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
            const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
            if (key === prevKey) {
                event.preventDefault();
                moveActiveBy(-1);
                return;
            }
            if (key === nextKey) {
                event.preventDefault();
                moveActiveBy(1);
                return;
            }
            if (key === "Home") {
                event.preventDefault();
                moveToEdge("start");
            } else if (key === "End") {
                event.preventDefault();
                moveToEdge("end");
            }
        },
        [isVertical, moveActiveBy, moveToEdge]
    );

    const tabList = (
        <div className="rui-tab-group__tabstrip" ref={tabStripRef}>
            {overflow && (
                <button
                    type="button"
                    className="rui-tab-group__scroll is-back"
                    aria-label={scrollLabels.back}
                    disabled={startIndex === 0}
                    onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
                    style={scrollMainStyle}
                >
                    <span aria-hidden="true" className="rui-tab-group__scrollIcon">
                        {isVertical ? "\u25B2" : "\u25C0"}
                    </span>
                </button>
            )}
            <div
                className="rui-tab-group__tablist"
                role="tablist"
                aria-orientation={isVertical ? "vertical" : "horizontal"}
                onKeyDown={handleTabListKeyDown}
            >
                {visibleTabs.map((tab, localIndex) => {
                    const index = overflow ? startIndex + localIndex : localIndex;
                    return (
                        <button
                            key={index}
                            type="button"
                            role="tab"
                            className={`rui-tab-group__tab ${index === currentActive ? "is-active" : ""}`}
                            style={mainStyle}
                            disabled={tab.disabled}
                            aria-selected={index === currentActive}
                            aria-controls={panelId}
                            id={getTabId(index)}
                            data-tab-index={index}
                            tabIndex={index === currentActive ? 0 : -1}
                            onClick={() => !tab.disabled && setActive(index)}
                        >
                            <span className="rui-tab-group__label">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            {overflow && (
                <button
                    type="button"
                    className="rui-tab-group__scroll is-forward"
                    aria-label={scrollLabels.forward}
                    disabled={startIndex === maxStart}
                    onClick={() => setStartIndex((i) => Math.min(maxStart, i + 1))}
                    style={scrollMainStyle}
                >
                    <span aria-hidden="true" className="rui-tab-group__scrollIcon">
                        {isVertical ? "\u25BC" : "\u25B6"}
                    </span>
                </button>
            )}
        </div>
    );

    const panel = (
        <div
            className="rui-tab-group__panel"
            role="tabpanel"
            id={panelId}
            aria-labelledby={getTabId(currentActive)}
            tabIndex={0}
        >
            {tabs[currentActive]?.content ?? null}
        </div>
    );

    return (
        <div
            ref={rootRef}
            className="rui-tab-group"
            data-align={align}
            data-position={position}
            data-fill={effectiveFill}
            data-requested-fill={fill}
            data-rotation={rotation}
            data-overflow={overflow ? "true" : "false"}
        >
            <div ref={measureRef} className="rui-tab-group__measure" aria-hidden="true">
                {tabs.map((tab, index) => (
                    <button key={index} type="button" className="rui-tab-group__tab">
                        <span className="rui-tab-group__label">{tab.label}</span>
                    </button>
                ))}
            </div>
            {tabsFirst ? (
            <>
                {tabList}
                {panel}
            </>
            ) : (
            <>
                {panel}
                {tabList}
            </>
            )}
        </div>
    );
}
