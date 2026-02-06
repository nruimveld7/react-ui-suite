import * as React from "react";
import clsx from "clsx";
import "./ResizableContainer.css";

export type ResizableContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  axis?: "both" | "x" | "y";
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  width?: number;
  height?: number;
  step?: number;
  onSizeChange?: (size: { width: number; height: number }) => void;
};

type ResizeState = {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  pointerId: number | null;
  maxWidthLimit?: number;
  maxHeightLimit?: number;
};

const DEFAULT_MIN_WIDTH = 240;
const DEFAULT_MIN_HEIGHT = 120;
const DEFAULT_STEP = 8;
const MIN_THUMB = 24;
const TRACK_PADDING = 6;
const TRACK_THICKNESS = 6;
const TRACK_INSET = 8;
const V_TRACK_INSET = 10;

type ThumbState = { visible: boolean; size: number; offset: number };

function useScrollbarMetrics(
  ref: React.RefObject<HTMLDivElement | null>,
  axis: "vertical" | "horizontal",
  extraSpace: number
) {
  const [state, setState] = React.useState<ThumbState>({
    visible: false,
    size: MIN_THUMB,
    offset: 0,
  });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      const target = ref.current;
      if (!target) return;
      const scrollRange =
        axis === "vertical"
          ? target.scrollHeight - target.clientHeight
          : target.scrollWidth - target.clientWidth;
      const trackLength =
        axis === "vertical"
          ? Math.max(0, target.clientHeight + extraSpace - TRACK_PADDING * 2 - V_TRACK_INSET * 2)
          : Math.max(0, target.clientWidth + extraSpace - 2 * (TRACK_PADDING + TRACK_INSET));

      if (scrollRange <= 0 || trackLength <= 0) {
        setState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const ratio =
        axis === "vertical"
          ? target.clientHeight / target.scrollHeight
          : target.clientWidth / target.scrollWidth;
      const thumbSize = Math.max(trackLength * ratio, MIN_THUMB);
      const maxOffset = Math.max(0, trackLength - thumbSize);
      const currentOffset =
        maxOffset > 0
          ? ((axis === "vertical" ? target.scrollTop : target.scrollLeft) / scrollRange) * maxOffset
          : 0;

      setState({ visible: true, size: thumbSize, offset: currentOffset });
    };

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    resizeObserver?.observe(el);
    el.addEventListener("scroll", handleScroll, { passive: true });
    update();

    return () => {
      resizeObserver?.disconnect();
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, axis, extraSpace]);

  return state;
}

function useThumbDrag(
  ref: React.RefObject<HTMLDivElement | null>,
  axis: "vertical" | "horizontal",
  thumbState: ThumbState,
  extraSpace: number
) {
  const startDrag = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>, startScrollOverride?: number) => {
      const el = ref.current;
      if (!el) return;
      event.preventDefault();

      const startPos = axis === "vertical" ? event.clientY : event.clientX;
      const startScroll =
        startScrollOverride ?? (axis === "vertical" ? el.scrollTop : el.scrollLeft);
      const thumbSize = thumbState.size;

      const handleMove = (moveEvent: PointerEvent) => {
        const delta = (axis === "vertical" ? moveEvent.clientY : moveEvent.clientX) - startPos;
        const scrollRange =
          axis === "vertical" ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
        const trackLength =
          axis === "vertical"
            ? el.clientHeight + extraSpace - TRACK_PADDING * 2 - V_TRACK_INSET * 2
            : el.clientWidth + extraSpace - 2 * (TRACK_PADDING + TRACK_INSET);
        if (scrollRange <= 0 || trackLength <= thumbSize) return;

        const ratio = scrollRange / (trackLength - thumbSize);
        const next = startScroll + delta * ratio;
        if (axis === "vertical") el.scrollTop = Math.min(scrollRange, Math.max(0, next));
        else el.scrollLeft = Math.min(scrollRange, Math.max(0, next));
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
      };

      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [axis, ref, thumbState.size, extraSpace]
  );

  const onThumbPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      startDrag(event);
    },
    [startDrag]
  );

  return { onThumbPointerDown, startDrag };
}

export const ResizableContainer = React.forwardRef<HTMLDivElement, ResizableContainerProps>(
  function ResizableContainer(
    {
      axis = "both",
      minWidth = DEFAULT_MIN_WIDTH,
      minHeight = DEFAULT_MIN_HEIGHT,
      maxWidth,
      maxHeight,
      defaultWidth,
      defaultHeight,
      width,
      height,
      step = DEFAULT_STEP,
      className,
      style,
      children,
      onSizeChange,
      ...rest
    },
    ref
  ) {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [internalWidth, setInternalWidth] = React.useState<number | undefined>(defaultWidth);
  const [internalHeight, setInternalHeight] = React.useState<number | undefined>(defaultHeight);
  const [isResizing, setIsResizing] = React.useState(false);
  const [padRight, setPadRight] = React.useState(0);
  const [padBottom, setPadBottom] = React.useState(0);
    const resizeStateRef = React.useRef<ResizeState>({
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      pointerId: null,
    });

    const widthControlled = typeof width === "number";
    const heightControlled = typeof height === "number";
    const allowX = axis === "both" || axis === "x";
    const allowY = axis === "both" || axis === "y";

    const maxWidthLimit = maxWidth;
    const maxHeightLimit = maxHeight;

    const vThumb = useScrollbarMetrics(contentRef, "vertical", padBottom);
    const hThumb = useScrollbarMetrics(contentRef, "horizontal", padRight);

    React.useEffect(() => {
      setPadRight(vThumb.visible ? TRACK_PADDING + 10 : 0);
    }, [vThumb.visible]);

    React.useEffect(() => {
      setPadBottom(hThumb.visible ? TRACK_PADDING + 10 : 0);
    }, [hThumb.visible]);

    const { onThumbPointerDown: handleVThumbDown, startDrag: startVDrag } = useThumbDrag(
      contentRef,
      "vertical",
      vThumb,
      padBottom
    );
    const { onThumbPointerDown: handleHThumbDown, startDrag: startHDrag } = useThumbDrag(
      contentRef,
      "horizontal",
      hThumb,
      padRight
    );

    const handleTrackPointerDown = React.useCallback(
      (
        axis: "vertical" | "horizontal",
        thumb: ThumbState,
        startDrag: (e: React.PointerEvent<HTMLDivElement>, startScroll?: number) => void,
        event: React.PointerEvent<HTMLDivElement>
      ) => {
        const el = contentRef.current;
        if (!el) return;
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const clickOffset =
          axis === "vertical" ? event.clientY - rect.top : event.clientX - rect.left;
        const trackLength = axis === "vertical" ? rect.height : rect.width;
        const scrollRange =
          axis === "vertical" ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
        if (scrollRange <= 0 || trackLength <= 0) return;
        const effective = Math.max(1, trackLength - thumb.size);
        const ratio = Math.max(0, Math.min(effective, clickOffset - thumb.size / 2)) / effective;
        const target = ratio * scrollRange;
        if (axis === "vertical") el.scrollTop = target;
        else el.scrollLeft = target;
        startDrag(event, axis === "vertical" ? el.scrollTop : el.scrollLeft);
      },
      []
    );

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const clamp = React.useCallback((value: number, min?: number, max?: number) => {
      return Math.max(min ?? -Infinity, Math.min(max ?? Infinity, value));
    }, []);

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      const node = rootRef.current;
      if (!node) return;
      const startWidth = node.offsetWidth;
      const startHeight = node.offsetHeight;

      resizeStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startWidth,
        startHeight,
        pointerId: event.pointerId,
        maxWidthLimit,
        maxHeightLimit,
      };

      setIsResizing(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const applySize = React.useCallback(
      (nextWidth: number, nextHeight: number) => {
        if (allowX && !widthControlled) {
          setInternalWidth(nextWidth);
        }
        if (allowY && !heightControlled) {
          setInternalHeight(nextHeight);
        }
        onSizeChange?.({ width: nextWidth, height: nextHeight });
      },
      [allowX, allowY, heightControlled, onSizeChange, widthControlled]
    );

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isResizing) return;
      const { startX, startY, startWidth, startHeight } = resizeStateRef.current;
      const maxWidthLimit = resizeStateRef.current.maxWidthLimit;
      const maxHeightLimit = resizeStateRef.current.maxHeightLimit;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      const nextWidth = allowX
        ? clamp(startWidth + deltaX, minWidth, maxWidthLimit)
        : widthControlled
          ? width ?? startWidth
          : internalWidth ?? startWidth;
      const nextHeight = allowY
        ? clamp(startHeight + deltaY, minHeight, maxHeightLimit)
        : heightControlled
          ? height ?? startHeight
          : internalHeight ?? startHeight;

      applySize(nextWidth, nextHeight);
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isResizing) return;
      setIsResizing(false);
      if (resizeStateRef.current.pointerId !== null) {
        event.currentTarget.releasePointerCapture?.(resizeStateRef.current.pointerId);
      }
      resizeStateRef.current.pointerId = null;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      let deltaX = 0;
      let deltaY = 0;

      switch (event.key) {
        case "ArrowLeft":
          if (allowX) deltaX = -step;
          break;
        case "ArrowRight":
          if (allowX) deltaX = step;
          break;
        case "ArrowUp":
          if (allowY) deltaY = -step;
          break;
        case "ArrowDown":
          if (allowY) deltaY = step;
          break;
        default:
          return;
      }

      if (deltaX === 0 && deltaY === 0) {
        return;
      }

      event.preventDefault();
      const node = rootRef.current;
      const measuredWidth = node?.offsetWidth ?? 0;
      const measuredHeight = node?.offsetHeight ?? 0;
      const limitWidth = maxWidthLimit;
      const limitHeight = maxHeightLimit;
      const baseWidth = widthControlled ? width ?? measuredWidth : internalWidth ?? measuredWidth;
      const baseHeight = heightControlled ? height ?? measuredHeight : internalHeight ?? measuredHeight;
      const nextWidth = allowX ? clamp(baseWidth + deltaX, minWidth, limitWidth) : baseWidth;
      const nextHeight = allowY ? clamp(baseHeight + deltaY, minHeight, limitHeight) : baseHeight;

      applySize(nextWidth, nextHeight);
    };

    const resolvedWidth = widthControlled ? width : internalWidth;
    const resolvedHeight = heightControlled ? height : internalHeight;
    const sizeStyle: React.CSSProperties = {
      ...(resolvedWidth !== undefined ? { width: resolvedWidth } : null),
      ...(resolvedHeight !== undefined ? { height: resolvedHeight } : null),
      ...(minWidth !== undefined ? { minWidth } : null),
      ...(minHeight !== undefined ? { minHeight } : null),
      ...(maxWidthLimit !== undefined ? { maxWidth: maxWidthLimit } : null),
      ...(maxHeightLimit !== undefined ? { maxHeight: maxHeightLimit } : null),
    };

    const vSlot = padRight || TRACK_PADDING;
    const hSlot = padBottom || TRACK_PADDING;
    const vOffset = Math.max(TRACK_PADDING, (vSlot - TRACK_THICKNESS) / 2);
    const hOffset = Math.max(TRACK_PADDING, (hSlot - TRACK_THICKNESS) / 2);
    const hBottom = Math.max(TRACK_PADDING / 2, (hSlot - TRACK_THICKNESS) / 2);

    return (
      <div
        {...rest}
        ref={setRefs}
        className={clsx("rui-resizable", "rui-root", className)}
        style={{ ...style, ...sizeStyle }}
        data-axis={axis}
        data-resizing={isResizing ? "true" : undefined}
        data-scrollbar-x={hThumb.visible ? "true" : undefined}
        data-scrollbar-y={vThumb.visible ? "true" : undefined}
      >
        <div
          ref={contentRef}
          className="rui-resizable__content"
          style={{
            paddingRight: `calc(var(--rui-resize-content-padding) + ${padRight}px)`,
            paddingBottom: `calc(var(--rui-resize-content-padding) + ${padBottom}px)`,
          }}
        >
          {children}
        </div>
        {vThumb.visible ? (
          <div
            className="rui-resizable__scrollbar rui-resizable__scrollbar--vertical"
            style={{
              right: vOffset,
              top: TRACK_PADDING + V_TRACK_INSET,
              bottom: TRACK_PADDING + V_TRACK_INSET,
              width: TRACK_THICKNESS,
            }}
            onPointerDown={(e) => handleTrackPointerDown("vertical", vThumb, startVDrag, e)}
          >
            <div className="rui-resizable__scrollbar-track">
              <div
                className="rui-resizable__scrollbar-thumb"
                style={{ height: `${vThumb.size}px`, top: `${vThumb.offset}px` }}
                onPointerDown={handleVThumbDown}
              />
            </div>
          </div>
        ) : null}
        {hThumb.visible ? (
          <div
            className="rui-resizable__scrollbar rui-resizable__scrollbar--horizontal"
            style={{
              left: hOffset + TRACK_INSET,
              right: hOffset + TRACK_INSET,
              bottom: hBottom,
              height: TRACK_THICKNESS,
            }}
            onPointerDown={(e) => handleTrackPointerDown("horizontal", hThumb, startHDrag, e)}
          >
            <div className="rui-resizable__scrollbar-track">
              <div
                className="rui-resizable__scrollbar-thumb"
                style={{ width: `${hThumb.size}px`, left: `${hThumb.offset}px` }}
                onPointerDown={handleHThumbDown}
              />
            </div>
          </div>
        ) : null}
        <button
          type="button"
          className="rui-resizable__handle"
          aria-label="Resize"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="rui-resizable__handle-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M7 15 L15 7 M11 15 L15 11 M3 15 L15 3" />
          </svg>
        </button>
      </div>
    );
  }
);
