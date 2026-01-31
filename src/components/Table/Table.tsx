import * as React from "react";
import clsx from "clsx";
import "./Table.css";
export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  alignX?: "left" | "right" | "center";
  alignY?: "top" | "middle" | "bottom";
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

export function Table<T extends Record<string, unknown>>({
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

  const vSlot = padRight || TRACK_PADDING;
  const hSlot = padBottom || TRACK_PADDING;
  const vOffset = Math.max(TRACK_PADDING, (vSlot - TRACK_THICKNESS) / 2);
  const hOffset = Math.max(TRACK_PADDING, (hSlot - TRACK_THICKNESS) / 2);
  const hBottom = Math.max(TRACK_PADDING / 2, (hSlot - TRACK_THICKNESS) / 2);

  return (
    <div
      className={clsx(
        "rui-table__outer-border rui-root rui-surface rui-table__u-overflow-hidden--2cd02d11d1 rui-table__u-border-radius-1-5rem--ea189a088a rui-table__u-border-width-1px--ca6bcd4b6f rui-table__u-rui-border-opacity-1--52f4da2ca5 rui-table__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table__u-rui-border-opacity-1--139f099dfa",
        className
      )}
      style={style}
    >
      <div
        className="rui-table__u-position-relative--d89972fe17 rui-table__u-overflow-hidden--2cd02d11d1 rui-table__u-background-color-rgb-255-255-255--6c21de570d rui-table__u-background-color-rgb-9-9-11-0-8--a1463e42bf"
        style={{ paddingRight: padRight, paddingBottom: padBottom }}
      >
        <div
          ref={scrollRef}
          className="table-scrollbar rui-table__u-overflow-auto--73fc3fb18c"
          style={{ ...scrollAreaStyle }}
        >
          <table className="rui-table__u-width-100--6da6a3c3f7 rui-table__u-border-collapse-collapse--4583f90cd9 rui-table__u-font-size-0-875rem--fc7473ca09 rui-table__u-rui-text-opacity-1--bcbca7a5be rui-table__u-rui-text-opacity-1--270353156a">
            {caption ? (
              <caption className="rui-table__u-rui-bg-opacity-1--f97e9d36d1 rui-table__u-padding-left-1rem--f0faeb26d6 rui-table__u-padding-top-0-5rem--03b4dd7f17 rui-table__u-text-align-left--2eba0d65d0 rui-table__u-font-size-0-75rem--359090c2d5 rui-table__u-font-weight-600--e83a7042bc rui-table__u-text-transform-uppercase--117ec720ea rui-table__u-letter-spacing-0-25em--854c830ad6 rui-table__u-rui-text-opacity-1--30426eb75c rui-table__u-background-color-rgb-24-24-27-0---5cd2915a74 rui-table__u-rui-text-opacity-1--6462b86910 rui-text-wrap">
                {caption}
              </caption>
            ) : null}
            <thead className="rui-table__u-background-color-rgb-255-255-255--6c21de570d rui-table__u-font-size-0-75rem--359090c2d5 rui-table__u-text-transform-uppercase--117ec720ea rui-table__u-letter-spacing-0-16em--9dbf48b2ab rui-table__u-rui-text-opacity-1--30426eb75c rui-table__u-background-color-rgb-24-24-27-0---67553a7cb3 rui-table__u-rui-text-opacity-1--6462b86910">
              <tr>
  {columns.map((col) => {
    const alignX = col.alignX ?? col.align;
    return (
      <th
        key={String(col.key)}
        scope="col"
        className={clsx(
          "rui-table__u-padding-left-1rem--f0faeb26d6 rui-table__u-padding-top-0-75rem--1b2d54a3fd rui-table__u-text-align-left--2eba0d65d0 rui-table__u-font-weight-600--e83a7042bc",
          alignX === "right" && "rui-table__u-text-align-right--308fc069e4",
          alignX === "center" && "rui-table__u-text-align-center--ca6bf63030"
        )}
      >
        {col.header}
      </th>
    );
  })}
</tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={clsx(
                    "rui-table__u-border-top-width-1px--b950dda299 rui-table__u-rui-border-opacity-1--e488850b52 rui-table__u-transition-property-color-backgr--56bf8ae82a rui-table__u-rui-border-opacity-1--139f099dfa",
                    rowIndex % 2 === 0
                      ? "rui-table__u-background-color-rgb-241-245-249--c5501378e0 rui-table__u-rui-bg-opacity-1--706569e6a5 rui-table__u-background-color-rgb-9-9-11-0-7--18f22f07a8 rui-table__u-rui-bg-opacity-1--1a5d9aa0b0"
                      : "rui-table__u-background-color-rgb-255-255-255--845918557e rui-table__u-rui-bg-opacity-1--706569e6a5 rui-table__u-background-color-rgb-24-24-27-0---5cb47d6e2f rui-table__u-rui-bg-opacity-1--1a5d9aa0b0"
                  )}
                >
                  {columns.map((col) => {
  const alignX = col.alignX ?? col.align;
  const alignY = col.alignY ?? "middle";
  return (
    <td
      key={String(col.key)}
      className={clsx(
        "rui-table__u-padding-left-1rem--f0faeb26d6 rui-table__u-padding-top-0-75rem--1b2d54a3fd rui-table__u-vertical-align-middle--8d3c01126f",
        alignX === "right" && "rui-table__u-text-align-right--308fc069e4",
        alignX === "center" && "rui-table__u-text-align-center--ca6bf63030",
        alignY === "top" && "rui-table__u-vertical-align-top--4a97b595d1",
        alignY === "bottom" && "rui-table__u-vertical-align-bottom--f6b31759c6"
      )}
    >
      {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
    </td>
  );
})}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vThumb.visible ? (
          <div
            className="rui-table__u-position-absolute--da4dbfbc4f rui-table__u-z-index-20--145745bf52 rui-table__u-pointer-events-auto--7d5d4c29be rui-table__u-border-radius-9999px--ac204c1088 rui-table__u-background-color-rgb-255-255-255--845918557e rui-table__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-table__u-background-color-rgb-24-24-27-0---5cd2915a74"
            style={{
              right: vOffset,
              top: TRACK_PADDING + V_TRACK_INSET,
              bottom: TRACK_PADDING + V_TRACK_INSET,
              width: TRACK_THICKNESS,
            }}
            onPointerDown={(e) => handleTrackPointerDown("vertical", vThumb, startVDrag, e)}
          >
            <div className="rui-table__u-position-relative--d89972fe17 rui-table__u-height-100--668b21aa54 rui-table__u-width-100--6da6a3c3f7 rui-table__u-border-radius-9999px--ac204c1088 rui-table__u-background-color-rgb-15-23-42-0---b1e59fba64 rui-table__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-table__u-background-color-rgb-255-255-255--93a1f57e1e">
              <div
                className={clsx(
                  "table-scrollbar-thumb table-scrollbar-thumb--vertical",
                  "rui-table__u-position-absolute--da4dbfbc4f rui-table__u-left-50--e632769ad7 rui-table__u-width-100--6da6a3c3f7 rui-table__u-rui-translate-x-50--efaa070148 rui-table__u-border-radius-9999px--ac204c1088 rui-table__u-background-color-rgb-148-163-184--91c0d51da3 rui-table__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table__u-transition-property-color-backgr--ceb69a6b0e rui-table__u-background-color-rgb-113-113-122--fe8680199c"
                )}
                style={{ height: `${vThumb.size}px`, top: `${vThumb.offset}px` }}
                onPointerDown={handleVThumbDown}
              />
            </div>
          </div>
        ) : null}
        {hThumb.visible ? (
          <div
            className="rui-table__u-position-absolute--da4dbfbc4f rui-table__u-z-index-20--145745bf52 rui-table__u-pointer-events-auto--7d5d4c29be rui-table__u-border-radius-9999px--ac204c1088 rui-table__u-background-color-rgb-255-255-255--845918557e rui-table__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-table__u-background-color-rgb-24-24-27-0---5cd2915a74"
            style={{
              left: hOffset + TRACK_INSET,
              right: hOffset + TRACK_INSET,
              bottom: hBottom,
              height: TRACK_THICKNESS,
            }}
            onPointerDown={(e) => handleTrackPointerDown("horizontal", hThumb, startHDrag, e)}
          >
            <div className="rui-table__u-position-relative--d89972fe17 rui-table__u-height-100--668b21aa54 rui-table__u-width-100--6da6a3c3f7 rui-table__u-border-radius-9999px--ac204c1088 rui-table__u-background-color-rgb-15-23-42-0---b1e59fba64 rui-table__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-table__u-background-color-rgb-255-255-255--93a1f57e1e">
              <div
                className={clsx(
                  "table-scrollbar-thumb table-scrollbar-thumb--horizontal",
                  "rui-table__u-position-absolute--da4dbfbc4f rui-table__u-top-50--d694ba66e3 rui-table__u-height-100--668b21aa54 rui-table__u-rui-translate-y-50--36b381be4d rui-table__u-border-radius-9999px--ac204c1088 rui-table__u-background-color-rgb-148-163-184--91c0d51da3 rui-table__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table__u-transition-property-color-backgr--ceb69a6b0e rui-table__u-background-color-rgb-113-113-122--fe8680199c"
                )}
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




