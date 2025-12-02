import * as React from "react";
import { twMerge } from "tailwind-merge";

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
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-[6px] right-[2px] flex w-3 justify-center">
      <div
        className="pointer-events-auto relative h-full w-1 rounded-full bg-slate-900/5 shadow-inner dark:bg-white/10"
        onPointerDown={handleTrackPointerDown}
      >
        <div
          className="pointer-events-auto absolute left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-slate-400/80 shadow-sm transition-colors dark:bg-zinc-200/70"
          style={{ height: `${size}px`, top: `${offset}px` }}
          onPointerDown={handleThumbPointerDown}
        />
      </div>
    </div>
  );
}

export type PopoverProps = {
  className?: string;
  children: (props: { scrollRef: React.MutableRefObject<HTMLUListElement | null> }) => React.ReactNode;
};

export function Popover({ className, children }: PopoverProps) {
  const scrollRef = React.useRef<HTMLUListElement>(null);

  return (
    <div
      className={twMerge(
        "absolute left-0 right-0 top-full z-[999] -mt-px rounded-b-2xl rounded-t-none border border-slate-300 bg-white/95 py-1 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-zinc-600 dark:bg-zinc-900/95 dark:shadow-zinc-900/40",
        className
      )}
    >
      <div className="relative">
        {children({ scrollRef })}
        <Scrollbar scrollRef={scrollRef} />
      </div>
    </div>
  );
}
