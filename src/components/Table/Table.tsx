import * as React from "react";
import clsx from "clsx";
import "./Table.css";
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
        "rui-table",
        className
      )}
      style={style}
    >
      <div
        className="rui-table__container"
        style={{ paddingRight: padRight, paddingBottom: padBottom }}
      >
        <div
          ref={scrollRef}
          className="rui-table__scroll"
          style={{ ...scrollAreaStyle }}
        >
          <table className="rui-table__table">
            {caption ? (
              <caption className="rui-table__caption rui-text-wrap">
                {caption}
              </caption>
            ) : null}
            <thead className="rui-table__head">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    scope="col"
                    className={clsx(
                      "rui-table__header-cell",
                      col.align === "right" && "rui-table__header-cell--align-right",
                      col.align === "center" && "rui-table__header-cell--align-center"
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
                  className={clsx(
                    "rui-table__row",
                    rowIndex % 2 === 0 && "rui-table__row--alt"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={clsx(
                        "rui-table__cell",
                        col.align === "right" && "rui-table__cell--align-right",
                        col.align === "center" && "rui-table__cell--align-center"
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
            className="rui-table__track rui-table__track--vertical"
            style={{
              right: vOffset,
              top: TRACK_PADDING + V_TRACK_INSET,
              bottom: TRACK_PADDING + V_TRACK_INSET,
              width: TRACK_THICKNESS,
            }}
            onPointerDown={(e) => handleTrackPointerDown("vertical", vThumb, startVDrag, e)}
          >
            <div className="rui-table__track-inner">
              <div
                className={clsx(
                  "rui-table__thumb rui-table__thumb--vertical"
                )}
                style={{ height: `${vThumb.size}px`, top: `${vThumb.offset}px` }}
                onPointerDown={handleVThumbDown}
              />
            </div>
          </div>
        ) : null}
        {hThumb.visible ? (
          <div
            className="rui-table__track rui-table__track--horizontal"
            style={{
              left: hOffset + TRACK_INSET,
              right: hOffset + TRACK_INSET,
              bottom: hBottom,
              height: TRACK_THICKNESS,
            }}
            onPointerDown={(e) => handleTrackPointerDown("horizontal", hThumb, startHDrag, e)}
          >
            <div className="rui-table__track-inner">
              <div
                className={clsx(
                  "rui-table__thumb rui-table__thumb--horizontal"
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




