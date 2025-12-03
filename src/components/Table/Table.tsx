import * as React from "react";
import { twMerge } from "tailwind-merge";

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  caption?: string;
  className?: string;
  scrollAreaStyle?: React.CSSProperties;
  style?: React.CSSProperties;
};

const MIN_THUMB = 24;
const TRACK_PADDING = 6; // inset overlay tracks from edges
const TRACK_THICKNESS = 6;
const TRACK_INSET = 8; // extra padding to shorten the horizontal track inside the container
const V_TRACK_INSET = 10; // extra inset to shorten the vertical track

type ThumbState = { visible: boolean; size: number; offset: number };

function useScrollbarMetrics(
  ref: React.RefObject<HTMLDivElement>,
  axis: "vertical" | "horizontal",
  extraSpace: number
) {
  const [state, setState] = React.useState<ThumbState>({ visible: false, size: MIN_THUMB, offset: 0 });

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
        axis === "vertical" ? target.clientHeight / target.scrollHeight : target.clientWidth / target.scrollWidth;
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

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
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
  ref: React.RefObject<HTMLDivElement>,
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
      const startScroll = startScrollOverride ?? (axis === "vertical" ? el.scrollTop : el.scrollLeft);
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

export function Table<T extends Record<string, any>>({
  columns,
  data,
  caption,
  className,
  scrollAreaStyle,
  style,
}: TableProps<T>) {
  const scrollRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const [padRight, setPadRight] = React.useState(0);
  const [padBottom, setPadBottom] = React.useState(0);

  const vThumb = useScrollbarMetrics(scrollRef, "vertical", padBottom);
  const hThumb = useScrollbarMetrics(scrollRef, "horizontal", padRight);

  React.useEffect(() => {
    setPadRight(vThumb.visible ? TRACK_PADDING + 10 : 0);
  }, [vThumb.visible]);

  React.useEffect(() => {
    setPadBottom(hThumb.visible ? TRACK_PADDING + 10 : 0);
  }, [hThumb.visible]);

  const { onThumbPointerDown: handleVThumbDown, startDrag: startVDrag } = useThumbDrag(
    scrollRef,
    "vertical",
    vThumb,
    padBottom
  );
  const { onThumbPointerDown: handleHThumbDown, startDrag: startHDrag } = useThumbDrag(
    scrollRef,
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
      const el = scrollRef.current;
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = event.currentTarget.getBoundingClientRect();
      const clickOffset = axis === "vertical" ? event.clientY - rect.top : event.clientX - rect.left;
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

  const vSlot = padRight || TRACK_PADDING;
  const hSlot = padBottom || TRACK_PADDING;
  const vOffset = Math.max(TRACK_PADDING, (vSlot - TRACK_THICKNESS) / 2);
  const hOffset = Math.max(TRACK_PADDING, (hSlot - TRACK_THICKNESS) / 2);
  const hBottom = Math.max(TRACK_PADDING / 2, (hSlot - TRACK_THICKNESS) / 2);

  return (
    <div
      className={twMerge("overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-zinc-800", className)}
      style={style}
    >
      <div
        className="relative overflow-hidden bg-white/90 dark:bg-zinc-950/80"
        style={{ paddingRight: padRight, paddingBottom: padBottom }}
      >
        <div
          ref={scrollRef}
          className="table-scrollbar overflow-auto"
          style={{ ...scrollAreaStyle }}
        >
          <table className="w-full border-collapse text-sm text-slate-700 dark:text-zinc-200">
            {caption ? (
              <caption className="bg-slate-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:bg-zinc-900/70 dark:text-zinc-400">
                {caption}
              </caption>
            ) : null}
            <thead className="bg-white/90 text-xs uppercase tracking-[0.16em] text-slate-500 dark:bg-zinc-900/80 dark:text-zinc-400">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    scope="col"
                    className={twMerge(
                      "px-4 py-3 text-left font-semibold",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={twMerge(
                    "border-t border-slate-100 transition dark:border-zinc-800",
                    rowIndex % 2 === 0
                      ? "bg-slate-100/70 hover:bg-slate-200 dark:bg-zinc-950/70 dark:hover:bg-zinc-800"
                      : "bg-white/80 hover:bg-slate-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-800"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={twMerge(
                        "px-4 py-3 align-middle",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vThumb.visible ? (
          <div
            className="absolute z-20 pointer-events-auto rounded-full bg-white/80 shadow-inner dark:bg-zinc-900/70"
            style={{
              right: vOffset,
              top: TRACK_PADDING + V_TRACK_INSET,
              bottom: TRACK_PADDING + V_TRACK_INSET,
              width: TRACK_THICKNESS,
            }}
            onPointerDown={(e) => handleTrackPointerDown("vertical", vThumb, startVDrag, e)}
          >
            <div className="relative h-full w-full rounded-full bg-slate-900/5 shadow-inner dark:bg-white/10">
              <div
                className="absolute left-1/2 w-full -translate-x-1/2 rounded-full bg-slate-400/80 shadow-sm transition-colors dark:bg-zinc-500/70"
                style={{ height: `${vThumb.size}px`, top: `${vThumb.offset}px` }}
                onPointerDown={handleVThumbDown}
              />
            </div>
          </div>
        ) : null}
        {hThumb.visible ? (
          <div
            className="absolute z-20 pointer-events-auto rounded-full bg-white/80 shadow-inner dark:bg-zinc-900/70"
            style={{ left: hOffset + TRACK_INSET, right: hOffset + TRACK_INSET, bottom: hBottom, height: TRACK_THICKNESS }}
            onPointerDown={(e) => handleTrackPointerDown("horizontal", hThumb, startHDrag, e)}
          >
            <div className="relative h-full w-full rounded-full bg-slate-900/5 shadow-inner dark:bg-white/10">
              <div
                className="absolute top-1/2 h-full -translate-y-1/2 rounded-full bg-slate-400/80 shadow-sm transition-colors dark:bg-zinc-500/70"
                style={{ width: `${hThumb.size}px`, left: `${hThumb.offset}px` }}
                onPointerDown={handleHThumbDown}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
