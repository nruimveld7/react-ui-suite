import * as React from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import "./Popover.css";

type ThumbState = {
  visible: boolean;
  size: number;
  offset: number;
};

type PopoverPosition = {
  top: number;
  left: number;
  width: number;
};

const MIN_THUMB_SIZE = 28;
const TRACK_PADDING = 6;

function getAnchorPosition(anchor: HTMLElement | null): PopoverPosition | null {
  if (!anchor) return null;
  const rect = anchor.getBoundingClientRect();
  return {
    top: rect.bottom - 1,
    left: rect.left,
    width: rect.width,
  };
}

function Scrollbar({ scrollRef }: { scrollRef: React.MutableRefObject<HTMLElement | null> }) {
  const [{ visible, size, offset }, setThumbState] = React.useState<ThumbState>({
    visible: false,
    size: MIN_THUMB_SIZE,
    offset: 0,
  });
  const dragState = React.useRef<{
    startY: number;
    startScrollTop: number;
    thumbSize: number;
  } | null>(null);

  React.useLayoutEffect(() => {
    const target = scrollRef.current;
    if (!target) return;

    let raf = 0;

    const update = () => {
      const el = scrollRef.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const scrollRange = scrollHeight - clientHeight;
      const trackHeight = Math.max(0, clientHeight - TRACK_PADDING * 2);

      if (scrollRange <= 0 || trackHeight <= 0) {
        setThumbState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const ratio = clientHeight / scrollHeight;
      const thumbSize = Math.max(trackHeight * ratio, MIN_THUMB_SIZE);
      const maxOffset = Math.max(0, trackHeight - thumbSize);
      const thumbOffset = maxOffset > 0 ? (scrollTop / scrollRange) * maxOffset : 0;

      setThumbState({ visible: true, size: thumbSize, offset: thumbOffset });
    };

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    update();

    const resizeObserver =
      typeof window !== "undefined" && "ResizeObserver" in window
        ? new ResizeObserver(() => update())
        : null;
    resizeObserver?.observe(target);

    return () => {
      target.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [scrollRef]);

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragState.current;
      if (!drag) return;
      const el = scrollRef.current;
      if (!el) return;
      const trackHeight = Math.max(0, el.clientHeight - TRACK_PADDING * 2);
      const scrollRange = el.scrollHeight - el.clientHeight;
      if (scrollRange <= 0 || trackHeight <= drag.thumbSize) return;

      event.preventDefault();
      const delta = event.clientY - drag.startY;
      const ratio = scrollRange / (trackHeight - drag.thumbSize);
      const nextScroll = drag.startScrollTop + delta * ratio;
      el.scrollTop = Math.min(scrollRange, Math.max(0, nextScroll));
    };

    const handlePointerUp = () => {
      dragState.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [scrollRef]);

  if (!visible) return null;

  const handleThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    dragState.current = {
      startY: event.clientY,
      startScrollTop: el.scrollTop,
      thumbSize: size,
    };
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    const trackRect = event.currentTarget.getBoundingClientRect();
    const clickOffset = event.clientY - trackRect.top - TRACK_PADDING;
    const trackLength = trackRect.height - TRACK_PADDING * 2;
    const scrollRange = el.scrollHeight - el.clientHeight;
    if (scrollRange <= 0 || trackLength <= 0) return;
    const effective = Math.max(1, trackLength - size);
    const ratio = Math.max(0, Math.min(effective, clickOffset - size / 2)) / effective;
    el.scrollTop = ratio * scrollRange;
    dragState.current = {
      startY: event.clientY,
      startScrollTop: el.scrollTop,
      thumbSize: size,
    };
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  return (
    <div
      aria-hidden="true"
      className="rui-popover__scrollbar"
    >
      <div
        className="rui-popover__scrollbar-track"
        onPointerDown={handleTrackPointerDown}
      >
        <div
          className="rui-popover__scrollbar-thumb"
          style={{ height: `${size}px`, top: `${offset}px` }}
          onPointerDown={handleThumbPointerDown}
        />
      </div>
    </div>
  );
}

export type PopoverProps = {
  className?: string;
  anchorRef?: React.RefObject<HTMLElement>;
  rootRef?: React.RefObject<HTMLDivElement>;
  children: (props: {
    scrollRef: React.MutableRefObject<HTMLUListElement | null>;
  }) => React.ReactNode;
};

export function Popover({ className, anchorRef, rootRef, children }: PopoverProps) {
  const scrollRef: React.MutableRefObject<HTMLUListElement | null> = React.useRef(null);
  const [position, setPosition] = React.useState<PopoverPosition | null>(() =>
    getAnchorPosition(anchorRef?.current ?? null)
  );
  const shouldPortal = Boolean(anchorRef) && typeof document !== "undefined";

  React.useLayoutEffect(() => {
    if (!anchorRef?.current) return;
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        setPosition(getAnchorPosition(anchorRef.current));
      });
    };

    update();

    const onScroll = () => update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", onScroll, true);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(anchorRef.current);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", onScroll, true);
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [anchorRef]);

  const popoverStyle = shouldPortal
    ? position
      ? { top: position.top, left: position.left, width: position.width }
      : { visibility: "hidden" }
    : undefined;

  const popover = (
    <div
      ref={rootRef}
      className={clsx(
        "rui-popover",
        "rui-overlay-root",
        shouldPortal && "rui-popover--portal",
        className
      )}
      style={popoverStyle}
    >
      <div className="rui-popover__inner">
        {children({ scrollRef })}
        <Scrollbar scrollRef={scrollRef} />
      </div>
    </div>
  );

  return shouldPortal ? createPortal(popover, document.body) : popover;
}
