import * as React from "react";
import { assignRef } from "../../utils/ref";
import clsx from "clsx";
import "./Slider.css";

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
  const [internalValue, setInternalValue] = React.useState<number>(() =>
    snapToStep(initialValue, min, max, step)
  );
  const [focused, setFocused] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [trackMetrics, setTrackMetrics] = React.useState({
    length: 0,
    mainOffset: 0,
    crossOffset: 0,
    thickness: 0,
  });
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const interactionRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const trackContainerRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const trackRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef]
  );

  React.useEffect(() => {
    setInternalValue((prev) => snapToStep(prev, min, max, step));
  }, [min, max, step]);

  const resolvedValue = snapToStep(
    isControlled ? (typeof value === "number" ? value : min) : internalValue,
    min,
    max,
    step
  );
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
      const mainOffset = isVert
        ? trackRect.top - containerRect.top
        : trackRect.left - containerRect.left;
      const crossOffset = isVert
        ? trackRect.left - containerRect.left
        : trackRect.top - containerRect.top;
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
      className={clsx(
        "rui-slider__u-position-relative--d89972fe17 rui-slider__u-overflow-hidden--2cd02d11d1 rui-slider__u-border-radius-9999px--ac204c1088 rui-slider__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-slider__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-slider__u-rui-ring-color-rgb-226-232-240-0--dff1289ca3 rui-slider__u-rui-ring-color-rgb-255-255-255-0--e440174b6b",
        "rui-slider__u-background-size-100-100--7685a877d7",
        isVertical ? "rui-slider__u-margin-left-auto--0e12dc7de9 rui-slider__u-height-100--668b21aa54 rui-slider__u-width-0-75rem--9cea05671a" : "rui-slider__u-height-0-75rem--6a60c09e6a rui-slider__u-width-100--6da6a3c3f7",
        disabled && "rui-slider__u-opacity-0-6--f2868c227f",
        trackClassName
      )}
      style={{ backgroundImage: trackGradient }}
      aria-hidden="true"
    >
      <div
        className={clsx(
          "rui-slider__u-position-absolute--da4dbfbc4f rui-slider__u-border-radius-9999px--ac204c1088 rui-slider__u-rui-shadow-0-0-0-1px-rgba-59-130--25563fe3cd",
          dragging ? "rui-slider__u-transition-property-none--8c53a2a0df" : "rui-slider__u-transition-property-width-height--3810b15da8 rui-slider__u-transition-duration-150ms--233c0494b4 rui-slider__u-transition-timing-function-cubic--d905a812b4",
          isVertical ? "rui-slider__u-left-0px--c78facc7a0 rui-slider__u-right-0px--d8cdcad240" : "rui-slider__u-top-0px--5f89f14a26"
        )}
        style={{
          ...progressStyle,
          backgroundImage: fillGradient,
          backgroundSize: gradientSize,
          backgroundPosition: gradientPosition,
        }}
      />
      <div className="rui-slider__u-pointer-events-none--a4326536b8 rui-slider__u-position-absolute--da4dbfbc4f rui-slider__u-inset-0px--7b7df0449b rui-slider__u-border-radius-9999px--ac204c1088 rui-slider__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-slider__u-rui-ring-color-rgb-0-0-0-0-05--1e4905f70e rui-slider__u-rui-ring-color-rgb-255-255-255-0--e440174b6b" />
    </div>
  );

  const defaultThumb = (
    <span
      className={clsx(
        "rui-slider__u-position-absolute--da4dbfbc4f rui-slider__u-top-50--d694ba66e3 rui-slider__u-rui-translate-y-50--36b381be4d rui-slider__u-rui-translate-x-50--efaa070148 rui-slider__u-border-radius-9999px--ac204c1088 rui-slider__u-border-width-1px--ca6bcd4b6f rui-slider__u-rui-border-opacity-1--2fe59630ad rui-slider__u-rui-bg-opacity-1--5e10cdb8f1 rui-slider__u-rui-shadow-0-4px-6px-1px-rgb-0-0--febc34e471 rui-slider__u-rui-shadow-color-rgb-15-23-42-0---6fa334fea1 rui-slider__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-slider__u-rui-ring-opacity-1--b63063b264 rui-slider__u-transition-property-transform--eadef23823 rui-slider__u-transition-duration-150ms--233c0494b4 rui-slider__u-border-color-rgb-63-63-70-0-6--2e65f80c00 rui-slider__u-rui-bg-opacity-1--74e56634bd rui-slider__u-rui-shadow-color-rgb-0-0-0-0-3--5bbe38eab8 rui-slider__u-rui-ring-opacity-1--3c493ef2d8",
        focused && "rui-slider__u-rui-scale-x-1-04--3ae293a6fd rui-slider__u-rui-ring-opacity-1--ac04a0392c rui-slider__u-rui-ring-opacity-1--8adf4f0314",
        disabled && "rui-slider__u-opacity-0-6--f2868c227f rui-slider__u-rui-shadow-0-0-0000--ad47d17e60 rui-slider__u-rui-shadow-0-0-0000--2ac3c2fc68",
        thumbClassName
      )}
      style={{ ...thumbStyle, width: thumbDiameter, height: thumbDiameter }}
      aria-hidden="true"
    >
      <span className="rui-slider__u-position-relative--d89972fe17 rui-slider__u-display-block--0214b4b355 rui-slider__u-height-100--668b21aa54 rui-slider__u-width-100--6da6a3c3f7">
        <span className="rui-slider__u-position-absolute--da4dbfbc4f rui-slider__u-inset-5px--e4b9817df1 rui-slider__u-border-radius-9999px--ac204c1088 rui-slider__u-background-image-linear-gradient--39b2e00348 rui-slider__u-rui-gradient-from-f8fafc-var-rui--0fa43e0e0f rui-slider__u-rui-gradient-to-e2e8f0-var-rui-g--a1c9255bc2 rui-slider__u-rui-gradient-from-475569-var-rui--e98841ae66 rui-slider__u-rui-gradient-to-334155-var-rui-g--99758921bf" />
        <span className="rui-slider__u-position-absolute--da4dbfbc4f rui-slider__u-inset-0px--7b7df0449b rui-slider__u-border-radius-9999px--ac204c1088 rui-slider__u-background-color-rgb-2-6-23-0-05--2e89c63c5d rui-slider__u-rui-backdrop-blur-blur-1px--d88c782b6b rui-slider__u-background-color-rgb-255-255-255--72e7ae8285" />
      </span>
    </span>
  );

  return (
    <div className={clsx("rui-slider__u-width-100--6da6a3c3f7 rui-slider__u-style--6f7e013d64", isVertical && "rui-slider__u-max-width-120px--d3f6ecda5b", className)}>
      {label ? (
        <div className="rui-slider__u-display-flex--60fbb77139 rui-slider__u-align-items-center--3960ffc248 rui-slider__u-justify-content-space-between--8ef2268efb rui-slider__u-gap-0-75rem--1004c0c395">
          <label
            htmlFor={inputId}
            className="rui-slider__u-font-size-11px--d058ca6de6 rui-slider__u-font-weight-600--e83a7042bc rui-slider__u-text-transform-uppercase--117ec720ea rui-slider__u-letter-spacing-0-25em--854c830ad6 rui-slider__u-rui-text-opacity-1--30426eb75c rui-slider__u-rui-text-opacity-1--6462b86910"
          >
            {label}
          </label>
          <span className="rui-slider__u-border-radius-9999px--ac204c1088 rui-slider__u-background-color-rgb-255-255-255--6c21de570d rui-slider__u-padding-left-0-5rem--d5eab218aa rui-slider__u-padding-top-0-125rem--465609a240 rui-slider__u-font-size-0-75rem--359090c2d5 rui-slider__u-font-weight-600--e83a7042bc rui-slider__u-rui-text-opacity-1--bcbca7a5be rui-slider__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-slider__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-slider__u-rui-ring-opacity-1--b63063b264 rui-slider__u-background-color-rgb-24-24-27-0---67553a7cb3 rui-slider__u-rui-text-opacity-1--270353156a rui-slider__u-rui-ring-opacity-1--3c493ef2d8">
            {formattedValue}
          </span>
        </div>
      ) : null}

      <div
        ref={trackContainerRef}
        className={clsx(
          "rui-slider__u-position-relative--d89972fe17 rui-slider__u-width-100--6da6a3c3f7 rui-slider__u-padding-top-0-5rem--f46b61a9b3 rui-slider__u-padding-bottom-0-75rem--7fcf9124b5",
          isVertical && "rui-slider__u-display-flex--60fbb77139 rui-slider__u-height-12rem--3c8ea328c0 rui-slider__u-align-items-center--3960ffc248 rui-slider__u-justify-content-center--86843cf1e2 rui-slider__u-padding-left-1rem--f0faeb26d6 rui-slider__u-padding-bottom-1rem--9fcd8a1382 rui-slider__u-padding-top-1rem--173fa8f067"
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
          className="rui-slider__u-position-absolute--da4dbfbc4f rui-slider__u-inset-0px--7b7df0449b rui-slider__u-height-2-5rem--426b8b7518 rui-slider__u-width-100--6da6a3c3f7 rui-slider__u-webkit-appearance-none--eeea43674c rui-slider__u-opacity-0--7065497e1c rui-slider__u-pointer-events-none--a4326536b8"
        />
        <div
          ref={interactionRef}
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          className={clsx(
            "rui-slider__u-position-absolute--da4dbfbc4f rui-slider__u-inset-0px--7b7df0449b rui-slider__u-cursor-pointer--3451683673 rui-slider__u-background-color-transparent--7f19cdf4c5",
            isVertical ? "rui-slider__u-left-50--e632769ad7 rui-slider__u-width-2rem--2bbcfc3b51 rui-slider__u-rui-translate-x-50--efaa070148" : "rui-slider__u-top-50--d694ba66e3 rui-slider__u-height-2rem--ed8a5df7b2 rui-slider__u-rui-translate-y-50--36b381be4d"
          )}
        />
      </div>
    </div>
  );
});
