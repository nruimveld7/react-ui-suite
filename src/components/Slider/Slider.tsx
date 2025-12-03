import * as React from "react";
import { twMerge } from "tailwind-merge";

type SliderRenderProps = {
  value: number;
  min: number;
  max: number;
  percentage: number;
  disabled?: boolean;
  focused: boolean;
  orientation: "horizontal" | "vertical";
  reversed: boolean;
  position: number;
  trackLength: number;
  thumbSize: number;
  trackOffset: number;
  trackCrossOffset: number;
  trackThickness: number;
};

export type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> & {
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  formatValue?: (value: number) => string;
  renderTrack?: (props: SliderRenderProps & { children: React.ReactNode }) => React.ReactNode;
  renderThumb?: (props: SliderRenderProps) => React.ReactNode;
  trackClassName?: string;
  thumbClassName?: string;
  orientation?: "horizontal" | "vertical";
  reversed?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /**
   * Approximate thumb size along the track axis (used for bounds and progress).
   * For custom thumbs wider than tall (e.g., pills with labels), set this to the thumb's total width (horizontal) or height (vertical).
   */
  thumbSize?: number;
  /**
   * Allow the thumb center to travel slightly beyond the track ends. Useful for wide custom thumbs that should visually meet the track edges.
   */
  edgeOverlap?: number;
  /**
   * How the fill gradient should behave.
   * - "stretch" (default): gradient is scaled to the filled portion.
   * - "mask": gradient spans the full track and is revealed up to the thumb.
   */
  fillMode?: "stretch" | "mask";
};

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function percentFromValue(value: number, min: number, max: number) {
  if (max === min) return 0;
  return clampValue(((value - min) / (max - min)) * 100, 0, 100);
}

function snapToStep(value: number, min: number, max: number, step: number) {
  const safeStep = step > 0 ? step : 1;
  const limited = clampValue(value, min, max);
  const stepped = Math.round((limited - min) / safeStep) * safeStep + min;
  return clampValue(Number(stepped.toFixed(6)), min, max);
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    label,
    value,
    defaultValue,
    onChange,
  formatValue = (val) => `${val}`,
  renderTrack,
  renderThumb,
  trackClassName,
  thumbClassName,
  className,
  min = 0,
  max = 100,
  step = 1,
  thumbSize = 24,
  edgeOverlap = 0,
  fillMode = "stretch",
  disabled,
  orientation = "horizontal",
  reversed = false,
  id,
  ...rest
},
  forwardedRef
) {
  const isControlled = typeof value === "number";
  const initialValue = typeof defaultValue === "number" ? defaultValue : min;
  const [internalValue, setInternalValue] = React.useState<number>(() => snapToStep(initialValue, min, max, step));
  const [focused, setFocused] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [trackMetrics, setTrackMetrics] = React.useState({
    length: 0,
    mainOffset: 0,
    crossOffset: 0,
    thickness: 0,
  });
  const inputId = id ?? React.useId();

  const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const interactionRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const trackContainerRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const trackRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef && typeof forwardedRef === "object") (forwardedRef as any).current = node;
    },
    [forwardedRef]
  );

  React.useEffect(() => {
    setInternalValue((prev) => snapToStep(prev, min, max, step));
  }, [min, max, step]);

  const resolvedValue = snapToStep(isControlled ? (typeof value === "number" ? value : min) : internalValue, min, max, step);
  const percentage = percentFromValue(resolvedValue, min, max);
  const isVertical = orientation === "vertical";

  const thumbDiameter = Math.max(thumbSize, 2);
  const thumbRadius = thumbDiameter / 2;

  React.useLayoutEffect(() => {
    const track = trackRef.current;
    const container = trackContainerRef.current;
    if (!track || !container) return;
    const update = () => {
      const trackRect = track.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const isVert = orientation === "vertical";
      const length = isVert ? trackRect.height : trackRect.width;
      const thickness = isVert ? trackRect.width : trackRect.height;
      const mainOffset = isVert ? trackRect.top - containerRect.top : trackRect.left - containerRect.left;
      const crossOffset = isVert ? trackRect.left - containerRect.left : trackRect.top - containerRect.top;
      setTrackMetrics({ length, mainOffset, crossOffset, thickness });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    observer.observe(container);
    return () => observer.disconnect();
  }, [orientation]);

  const trackLength = trackMetrics.length;
  const trackOffset = trackMetrics.mainOffset;
  const trackCrossOffset = trackMetrics.crossOffset;
  const trackThickness = trackMetrics.thickness;
  const overlap = Math.max(edgeOverlap, 0);
  const minCenter = Math.max(thumbRadius - overlap, 0);
  const maxCenter = Math.max(trackLength - thumbRadius + overlap, minCenter);
  const usableLength = Math.max(maxCenter - minCenter, 0);

  const logicalRatio = clampValue((resolvedValue - min) / (max - min || 1), 0, 1);
  const positionRatio = (() => {
    if (isVertical) {
      return reversed ? logicalRatio : 1 - logicalRatio;
    }
    return reversed ? 1 - logicalRatio : logicalRatio;
  })();

  const positionPx = minCenter + usableLength * positionRatio;

  const gradientSize = React.useMemo(() => {
    if (fillMode === "stretch" || trackLength === 0) return "100% 100%";
    return isVertical ? `100% ${trackLength}px` : `${trackLength}px 100%`;
  }, [fillMode, isVertical, trackLength]);

  const gradientPosition = React.useMemo(() => {
    if (fillMode === "stretch") return undefined;
    if (!isVertical && reversed) return "right center";
    if (isVertical && !reversed) return "center bottom";
    return "left top";
  }, [fillMode, isVertical, reversed]);

  const progressStyle: React.CSSProperties = React.useMemo(() => {
    if (trackLength === 0) return {};
    const half = thumbRadius;

    if (!isVertical && !reversed) {
      const width = Math.min(positionPx + half, trackLength);
      return { left: 0, width, top: 0, bottom: 0 };
    }

    if (!isVertical && reversed) {
      const start = Math.max(positionPx - half, 0);
      const width = Math.max(trackLength - start, 0);
      return { right: 0, width, top: 0, bottom: 0 };
    }

    if (isVertical && reversed) {
      // min at top; fill grows downward from top
      const height = Math.min(positionPx + half, trackLength);
      return { top: 0, height, left: 0, right: 0 };
    }

    // vertical, min at bottom; fill grows upward from bottom
    const start = Math.max(positionPx - half, 0);
    const height = Math.max(Math.min(trackLength - start, trackLength), 0);
    return { bottom: 0, height, left: 0, right: 0 };
  }, [isVertical, reversed, positionPx, trackLength, thumbRadius]);

  const trackGradient = React.useMemo(() => {
    if (!isVertical && !reversed) return "linear-gradient(90deg, #e2e8f0, #fff, #e2e8f0)";
    if (!isVertical && reversed) return "linear-gradient(270deg, #e2e8f0, #fff, #e2e8f0)";
    if (isVertical && reversed) return "linear-gradient(180deg, #e2e8f0, #fff, #e2e8f0)";
    return "linear-gradient(0deg, #e2e8f0, #fff, #e2e8f0)";
  }, [isVertical, reversed]);

  const fillGradient = React.useMemo(() => {
    if (!isVertical && !reversed) return "linear-gradient(90deg, #38bdf8, #6366f1)";
    if (!isVertical && reversed) return "linear-gradient(270deg, #38bdf8, #6366f1)";
    if (isVertical && reversed) return "linear-gradient(180deg, #38bdf8, #6366f1)";
    return "linear-gradient(0deg, #38bdf8, #6366f1)";
  }, [isVertical, reversed]);

  const thumbStyle: React.CSSProperties = React.useMemo(() => {
    if (isVertical) {
      return { top: trackOffset + positionPx, left: trackCrossOffset + trackThickness / 2 };
    }
    return { left: trackOffset + positionPx, top: trackCrossOffset + trackThickness / 2 };
  }, [isVertical, positionPx, trackOffset, trackCrossOffset, trackThickness]);

  const renderProps: SliderRenderProps = React.useMemo(
    () => ({
      value: resolvedValue,
      min,
      max,
      percentage,
      disabled,
      focused,
      orientation,
      reversed,
      position: positionPx,
      trackLength,
      thumbSize: thumbDiameter,
      trackOffset,
      trackCrossOffset,
      trackThickness,
    }),
    [
      resolvedValue,
      min,
      max,
      percentage,
      disabled,
      focused,
      orientation,
      reversed,
      positionPx,
      trackLength,
      thumbDiameter,
      trackOffset,
      trackCrossOffset,
      trackThickness,
    ]
  );

  const commitValue = React.useCallback(
    (next: number) => {
      const snapped = snapToStep(next, min, max, step);
      if (!isControlled) {
        setInternalValue(snapped);
      }
      onChange?.(snapped);
    },
    [isControlled, max, min, onChange, step]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (Number.isNaN(next)) return;
    commitValue(next);
  };

  const formattedValue = formatValue(resolvedValue);

  const setValueFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;

      const overlapComp = Math.max(thumbRadius - overlap, 0);
      const length = isVertical ? rect.height : rect.width;
      const usable = Math.max(length - overlapComp * 2, 1);

      if (length <= 0) return;

      const clampToTrack = (pos: number) => clampValue(pos, overlapComp, length - overlapComp);

      if (isVertical) {
        const position = clampToTrack(clientY - rect.top);
        const positionRatio = (position - overlapComp) / usable;
        const logicalRatio = reversed ? positionRatio : 1 - positionRatio;
        const next = min + logicalRatio * (max - min);
        commitValue(next);
        return;
      }

      const position = clampToTrack(clientX - rect.left);
      const positionRatio = (position - overlapComp) / usable;
      const logicalRatio = reversed ? 1 - positionRatio : positionRatio;
      const next = min + logicalRatio * (max - min);
      commitValue(next);
    },
    [commitValue, isVertical, max, min, overlap, reversed, thumbRadius]
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      interactionRef.current?.setPointerCapture(event.pointerId);
      inputRef.current?.focus({ preventScroll: true });
      setDragging(true);
      setValueFromPointer(event.clientX, event.clientY);

      const move = (moveEvent: PointerEvent) => {
        moveEvent.preventDefault();
        setValueFromPointer(moveEvent.clientX, moveEvent.clientY);
      };
      const stop = (upEvent: PointerEvent) => {
        upEvent.preventDefault();
        interactionRef.current?.releasePointerCapture(event.pointerId);
        setDragging(false);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
      };

      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", stop, { passive: false });
      window.addEventListener("pointercancel", stop, { passive: false });
    },
    [setValueFromPointer]
  );

  const defaultTrack = (
    <div
      ref={trackRef}
      className={twMerge(
        "relative overflow-hidden rounded-full shadow-inner ring-1 ring-slate-200/80 dark:ring-white/10",
        "bg-[length:100%_100%]",
        isVertical ? "mx-auto h-full w-3" : "h-3 w-full",
        disabled && "opacity-60",
        trackClassName
      )}
      style={{ backgroundImage: trackGradient }}
      aria-hidden="true"
    >
      <div
        className={twMerge(
          "absolute rounded-full shadow-[0_0_0_1px_rgba(59,130,246,0.18)]",
          dragging ? "transition-none" : "transition-[width,height] duration-150 ease-out",
          isVertical ? "left-0 right-0" : "inset-y-0"
        )}
        style={{
          ...progressStyle,
          backgroundImage: fillGradient,
          backgroundSize: gradientSize,
          backgroundPosition: gradientPosition,
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/5 dark:ring-white/10" />
    </div>
  );

  const defaultThumb = (
    <span
      className={twMerge(
        "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white bg-white shadow-md shadow-slate-900/20 ring-1 ring-slate-200 transition-transform duration-150 dark:border-zinc-700/60 dark:bg-zinc-800 dark:shadow-black/30 dark:ring-zinc-700",
        focused && "scale-[1.04] ring-slate-300 dark:ring-slate-500",
        disabled && "opacity-60 shadow-none dark:shadow-none",
        thumbClassName
      )}
      style={{ ...thumbStyle, width: thumbDiameter, height: thumbDiameter }}
      aria-hidden="true"
    >
      <span className="relative block h-full w-full">
        <span className="absolute inset-[5px] rounded-full bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-600 dark:to-slate-700" />
        <span className="absolute inset-0 rounded-full bg-slate-950/5 backdrop-blur-[1px] dark:bg-white/5" />
      </span>
    </span>
  );

  return (
    <div className={twMerge("w-full space-y-2", isVertical && "max-w-[120px]", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400"
          >
            {label}
          </label>
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-900/80 dark:text-zinc-200 dark:ring-zinc-700">
            {formattedValue}
          </span>
        </div>
      ) : null}

      <div
        ref={trackContainerRef}
        className={twMerge(
          "relative w-full pt-2 pb-3",
          isVertical && "flex h-48 items-center justify-center px-4 pb-4 pt-4"
        )}
        data-orientation={orientation}
      >
        {renderTrack ? renderTrack({ ...renderProps, children: defaultTrack }) : defaultTrack}
        {renderThumb ? renderThumb(renderProps) : defaultThumb}

        <input
          {...rest}
          ref={mergedRef}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={resolvedValue}
          onChange={handleInputChange}
          onInput={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          aria-valuetext={formattedValue}
          aria-orientation={orientation}
          data-orientation={orientation}
          className="absolute inset-0 h-10 w-full appearance-none opacity-0 pointer-events-none"
        />
        <div
          ref={interactionRef}
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          className={twMerge(
            "absolute inset-0 cursor-pointer bg-transparent",
            isVertical
              ? "left-1/2 w-8 -translate-x-1/2"
              : "top-1/2 h-8 -translate-y-1/2"
          )}
        />
      </div>
    </div>
  );
});
