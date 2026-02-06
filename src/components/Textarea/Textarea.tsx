import * as React from "react";
import clsx from "clsx";
import "./Textarea.css";
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  description?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
  resizeDirection?: "vertical" | "horizontal" | "both" | "none";
};

type ThumbState = { visible: boolean; size: number; offset: number };

const MIN_THUMB = 24;
const TRACK_THICKNESS = 6;
const TRACK_TOP = 8;
const TRACK_BOTTOM = 22; // leave room for counter + handle row
const TRACK_REDUCTION = 20; // static reduction to shorten the track
const TRACK_REDUCTION_HALF = TRACK_REDUCTION / 2; // center the shortened track

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    description,
    error,
    className,
    id,
    disabled,
    maxLength,
    showCount = true,
    resizeDirection = "vertical",
    ...rest
  },
  ref
) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const descriptionId = React.useId();
  const errorId = React.useId();
  const textareaRef: React.MutableRefObject<HTMLTextAreaElement | null> = React.useRef(null);
  const shellRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const resizeListenersRef = React.useRef<{
    move?: (event: PointerEvent) => void;
    up?: (event: PointerEvent) => void;
  }>({});
  const [thumb, setThumb] = React.useState<ThumbState>({
    visible: false,
    size: MIN_THUMB,
    offset: 0,
  });

  const hintIds = [description ? descriptionId : null, error ? errorId : null].filter(Boolean);
  const resolvedAriaDescribedBy = hintIds.length ? hintIds.join(" ") : undefined;

  const [value, setValue] = React.useState(rest.defaultValue?.toString() ?? "");
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  const [width, setWidth] = React.useState<number | undefined>(undefined);

  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  React.useEffect(() => {
    if (typeof rest.value === "string") {
      setValue(rest.value);
    }
  }, [rest.value]);

  React.useLayoutEffect(() => {
    if (textareaRef.current && height === undefined) {
      setHeight(textareaRef.current.offsetHeight);
    }
  }, [height]);

  React.useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      const target = textareaRef.current;
      if (!target) return;
      const scrollRange = target.scrollHeight - target.clientHeight;
      const hostHeight = shellRef.current?.clientHeight ?? target.clientHeight;
      const trackLength = Math.max(0, hostHeight - TRACK_TOP - TRACK_BOTTOM - TRACK_REDUCTION);

      if (scrollRange <= 0 || trackLength <= 0) {
        setThumb((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const ratio = target.clientHeight / target.scrollHeight;
      const size = Math.max(trackLength * ratio, MIN_THUMB);
      const maxOffset = Math.max(0, trackLength - size);
      const offset =
        maxOffset > 0 ? Math.min(maxOffset, (target.scrollTop / scrollRange) * maxOffset) : 0;
      setThumb({ visible: true, size, offset });
    };

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    el.addEventListener("scroll", handleScroll, { passive: true });
    update();

    return () => {
      ro?.disconnect();
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [height]);

  React.useEffect(() => {
    return () => {
      if (resizeListenersRef.current.move) {
        window.removeEventListener("pointermove", resizeListenersRef.current.move);
      }
      if (resizeListenersRef.current.up) {
        window.removeEventListener("pointerup", resizeListenersRef.current.up);
        window.removeEventListener("pointercancel", resizeListenersRef.current.up);
      }
    };
  }, []);

  const handleResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    if (!textareaRef.current) return;

    const allowY = resizeDirection === "vertical" || resizeDirection === "both";
    const allowX = resizeDirection === "horizontal" || resizeDirection === "both";

    const startY = event.clientY;
    const startX = event.clientX;
    const startHeight = textareaRef.current.offsetHeight;
    const startWidth = shellRef.current?.offsetWidth ?? textareaRef.current.offsetWidth;
    const minHeight = 120;
    const minWidth = 240;
    const parentWidth = shellRef.current?.parentElement?.clientWidth ?? startWidth;

    const onMove = (moveEvent: PointerEvent) => {
      if (allowY) {
        const nextHeight = Math.max(minHeight, startHeight + (moveEvent.clientY - startY));
        setHeight(nextHeight);
      }
      if (allowX) {
        const proposed = startWidth + (moveEvent.clientX - startX);
        const nextWidth = Math.min(parentWidth, Math.max(minWidth, proposed));
        setWidth(nextWidth);
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      resizeListenersRef.current = {};
    };

    resizeListenersRef.current = { move: onMove, up: onUp };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const handleThumbDrag = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>, startScrollOverride?: number) => {
      const el = textareaRef.current;
      if (!el) return;
      event.preventDefault();

      const startY = event.clientY;
      const startScroll = startScrollOverride ?? el.scrollTop;

      const handleMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientY - startY;
        const scrollRange = el.scrollHeight - el.clientHeight;
        const hostHeight = shellRef.current?.clientHeight ?? el.clientHeight;
        const trackLength = Math.max(0, hostHeight - TRACK_TOP - TRACK_BOTTOM - TRACK_REDUCTION);
        if (scrollRange <= 0 || trackLength <= thumb.size) return;

        const ratio = scrollRange / (trackLength - thumb.size);
        const next = startScroll + delta * ratio;
        el.scrollTop = Math.min(scrollRange, Math.max(0, next));
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
    [thumb.size]
  );

  const rootClasses = clsx("rui-textarea", "rui-root", disabled && "rui-textarea--disabled");
  const shellClasses = clsx(
    "rui-textarea__shell",
    disabled && "rui-textarea__shell--disabled",
    error && "rui-textarea__shell--error"
  );

  const textareaClasses = clsx(
    "rui-textarea__control",
    `rui-textarea__control--resize-${resizeDirection}`,
    className
  );

  const count = value.length;
  const limit = maxLength ?? undefined;
  const { style, ...restProps } = rest;
  const textareaStyle = {
    ...style,
    ...(height !== undefined ? { height } : null),
  };
  const allowX = resizeDirection === "horizontal" || resizeDirection === "both";
  const shellStyle = width !== undefined && allowX ? { width } : undefined;

  return (
    <div className={rootClasses}>
      {label ? (
        <label
          htmlFor={textareaId}
          className="rui-textarea__label rui-text-wrap"
        >
          {label}
        </label>
      ) : null}

      <div className={shellClasses} ref={shellRef} style={shellStyle}>
        <textarea
          {...restProps}
          ref={setRefs}
          id={textareaId}
          className={textareaClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={resolvedAriaDescribedBy}
          disabled={disabled}
          maxLength={maxLength}
          style={textareaStyle}
          onChange={(e) => {
            setValue(e.target.value);
            rest.onChange?.(e);
          }}
        />
        {thumb.visible ? (
          <div
            className="rui-textarea__scrollbar"
            style={{
              right: 4,
              top: TRACK_TOP + TRACK_REDUCTION_HALF,
              bottom: TRACK_BOTTOM + TRACK_REDUCTION_HALF,
              width: TRACK_THICKNESS,
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const el = textareaRef.current;
              if (!el) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const clickOffset = event.clientY - rect.top;
              const trackLength = rect.height;
              const scrollRange = el.scrollHeight - el.clientHeight;
              if (scrollRange <= 0 || trackLength <= 0) return;
              const effective = Math.max(1, trackLength - thumb.size);
              const ratio =
                Math.max(0, Math.min(effective, clickOffset - thumb.size / 2)) / effective;
              const target = ratio * scrollRange;
              el.scrollTop = target;
              handleThumbDrag(event as unknown as React.PointerEvent<HTMLDivElement>, target);
            }}
          >
            <div className="rui-textarea__scrollbar-track">
              <div
                className="rui-textarea__scrollbar-thumb"
                style={{ height: `${thumb.size}px`, top: `${thumb.offset}px` }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  handleThumbDrag(event);
                }}
              />
            </div>
          </div>
        ) : null}
        {resizeDirection !== "none" ? (
          <div className="rui-textarea__footer">
            {showCount && limit ? (
              <div className="rui-textarea__footer-count">
                {count}/{limit}
              </div>
            ) : null}
            <button
              type="button"
              aria-label="Resize textarea"
              onPointerDown={handleResizeStart}
              className="rui-textarea__resize-handle"
              style={{
                border: "none",
                boxShadow: "none",
                appearance: "none",
                background: "transparent",
              }}
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="rui-textarea__resize-handle-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M7 15 L15 7 M11 15 L15 11 M3 15 L15 3" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {description ? (
        <p id={descriptionId} className="rui-textarea__description rui-text-wrap">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="rui-textarea__error rui-text-wrap">
          {error}
        </p>
      ) : null}
    </div>
  );
});

