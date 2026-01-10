import * as React from "react";
import clsx from "clsx";
import "./Popover.css";
type ThumbState = {
  visible: boolean;
  size: number;
  offset: number;
};

const MIN_THUMB_SIZE = 28;
const TRACK_PADDING = 6;

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
  children: (props: {
    scrollRef: React.MutableRefObject<HTMLUListElement | null>;
  }) => React.ReactNode;
};

export function Popover({ className, children }: PopoverProps) {
  const scrollRef: React.MutableRefObject<HTMLUListElement | null> = React.useRef(null);

  return (
    <div
      className={clsx(
        "rui-popover",
        className
      )}
    >
      <div className="rui-popover__inner">
        {children({ scrollRef })}
        <Scrollbar scrollRef={scrollRef} />
      </div>
    </div>
  );
}
