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
    move?: (event: MouseEvent) => void;
    up?: (event: MouseEvent) => void;
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

  React.useLayoutEffect(() => {
    if (!shellRef.current || width !== undefined) return;
    setWidth(shellRef.current.offsetWidth);
  }, [width]);

  React.useEffect(() => {
    return () => {
      if (resizeListenersRef.current.move) {
        window.removeEventListener("mousemove", resizeListenersRef.current.move);
      }
      if (resizeListenersRef.current.up) {
        window.removeEventListener("mouseup", resizeListenersRef.current.up);
      }
    };
  }, []);

  const handleResizeStart = (event: React.MouseEvent<HTMLButtonElement>) => {
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

    const onMove = (moveEvent: MouseEvent) => {
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
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      resizeListenersRef.current = {};
    };

    resizeListenersRef.current = { move: onMove, up: onUp };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
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

  const shellClasses = clsx(
    "rui-textarea__u-position-relative--d89972fe17 rui-textarea__u-border-radius-1rem--68f2db624d rui-textarea__u-border-width-1px--ca6bcd4b6f rui-textarea__u-rui-border-opacity-1--85684b007e rui-textarea__u-background-color-rgb-255-255-255--845918557e rui-textarea__u-padding-left-0-75rem--0e17f2bd90 rui-textarea__u-padding-top-0-5rem--03b4dd7f17 rui-textarea__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-textarea__u-transition-property-color-backgr--56bf8ae82a rui-textarea__u-rui-border-opacity-1--0b0890deff rui-textarea__u-rui-shadow-0-0-0-1px-rgba-148-16--e431ff085e rui-textarea__u-rui-border-opacity-1--4e12bcf58d rui-textarea__u-background-color-rgb-24-24-27-0---5cd2915a74 rui-textarea__u-rui-border-opacity-1--7e4150ed84",
    disabled && "rui-textarea__u-opacity-0-6--f2868c227f",
    error &&
      "rui-textarea__u-rui-border-opacity-1--3b7f978155 rui-textarea__u-rui-border-opacity-1--6fe003501e rui-textarea__u-rui-shadow-0-0-0-1px-rgba-248-11--633a78b9cd rui-textarea__u-border-color-rgb-244-63-94-0-6--99963c86d9"
  );

  const textareaClasses = clsx(
    "textarea-scrollbar rui-textarea__u-min-height-120px--7ee36c2691 rui-textarea__u-width-100--6da6a3c3f7 rui-textarea__u-resize-none--6aef320168 rui-textarea__u-border-style-none--4a5f0ea046 rui-textarea__u-background-color-transparent--7f19cdf4c5 rui-textarea__u-padding-bottom-1rem--9fcd8a1382 rui-textarea__u-padding-right-1-25rem--752a63b747 rui-textarea__u-font-size-0-875rem--fc7473ca09 rui-textarea__u-rui-text-opacity-1--f5f136c41d rui-textarea__u-rui-text-opacity-1--02904d54b5 rui-textarea__u-outline-2px-solid-transparent--55d048ebfb rui-textarea__u-rui-text-opacity-1--3ddc1cab99 rui-textarea__u-rui-text-opacity-1--8a97e48efc",
    className
  );

  const count = value.length;
  const limit = maxLength ?? undefined;
  const { style, ...restProps } = rest;
  const textareaStyle = {
    ...style,
    ...(height !== undefined ? { height } : null),
    ...(width !== undefined ? { width } : null),
    maxWidth: "100%",
  };
  const shellStyle = width !== undefined ? { width, maxWidth: "100%" } : { maxWidth: "100%" };

  return (
    <div className="rui-textarea__u-style--5a2508227c">
      {label ? (
        <label
          htmlFor={textareaId}
          className="rui-textarea__u-font-size-0-75rem--359090c2d5 rui-textarea__u-font-weight-600--e83a7042bc rui-textarea__u-text-transform-uppercase--117ec720ea rui-textarea__u-letter-spacing-0-2em--2da1a7016e rui-textarea__u-rui-text-opacity-1--30426eb75c rui-textarea__u-rui-text-opacity-1--6462b86910"
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
            className="rui-textarea__u-pointer-events-auto--7d5d4c29be rui-textarea__u-position-absolute--da4dbfbc4f rui-textarea__u-z-index-20--145745bf52 rui-textarea__u-border-radius-9999px--ac204c1088 rui-textarea__u-background-color-rgb-255-255-255--d2fa6cb50a rui-textarea__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-textarea__u-rui-backdrop-blur-blur-4px--1ca6dd1e47 rui-textarea__u-transition-property-color-backgr--ceb69a6b0e rui-textarea__u-background-color-rgb-39-39-42-0---b37a7836e7"
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
            <div className="rui-textarea__u-position-relative--d89972fe17 rui-textarea__u-height-100--668b21aa54 rui-textarea__u-width-100--6da6a3c3f7 rui-textarea__u-border-radius-9999px--ac204c1088 rui-textarea__u-background-color-rgb-15-23-42-0---b1e59fba64 rui-textarea__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-textarea__u-background-color-rgb-255-255-255--93a1f57e1e">
              <div
                className="rui-textarea__u-position-absolute--da4dbfbc4f rui-textarea__u-left-50--e632769ad7 rui-textarea__u-width-100--6da6a3c3f7 rui-textarea__u-rui-translate-x-50--efaa070148 rui-textarea__u-border-radius-9999px--ac204c1088 rui-textarea__u-background-color-rgb-148-163-184--91c0d51da3 rui-textarea__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-textarea__u-transition-property-color-backgr--ceb69a6b0e rui-textarea__u-background-color-rgb-113-113-122--fe8680199c"
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
          <div className="rui-textarea__u-pointer-events-none--a4326536b8 rui-textarea__u-position-absolute--da4dbfbc4f rui-textarea__u-bottom-0-5rem--f6babb334d rui-textarea__u-right-0-5rem--7b2d63937d rui-textarea__u-display-flex--60fbb77139 rui-textarea__u-align-items-center--3960ffc248 rui-textarea__u-gap-0-5rem--77a2a20e90 rui-textarea__u-font-size-11px--d058ca6de6 rui-textarea__u-font-weight-600--e83a7042bc rui-textarea__u-text-transform-uppercase--117ec720ea rui-textarea__u-letter-spacing-0-18em--a82f6f96ca rui-textarea__u-rui-text-opacity-1--8d44cef396 rui-textarea__u-rui-text-opacity-1--28db7d8770">
            {showCount && limit ? (
              <div className="rui-textarea__u-pointer-events-auto--7d5d4c29be">
                {count}/{limit}
              </div>
            ) : null}
            <button
              type="button"
              aria-label="Resize textarea"
              onMouseDown={handleResizeStart}
              className="rui-textarea__u-pointer-events-auto--7d5d4c29be rui-textarea__u-display-inline-flex--52083e7da4 rui-textarea__u-height-14px--e16500fc5e rui-textarea__u-width-14px--fcc6b6c329 rui-textarea__u-align-items-center--3960ffc248 rui-textarea__u-justify-content-center--86843cf1e2 rui-textarea__u-border-radius-3px--cdbc510d96 rui-textarea__u-background-color-transparent--7f19cdf4c5 rui-textarea__u-rui-text-opacity-1--8d44cef396 rui-textarea__u-outline-2px-solid-transparent--df37b1fd94 rui-textarea__u-transition-property-color-backgr--56bf8ae82a rui-textarea__u-rui-text-opacity-1--110ae816be rui-textarea__u-rui-ring-offset-shadow-var-rui-r--793c80e97f rui-textarea__u-rui-ring-opacity-1--8fa0a71c86 rui-textarea__u-rui-ring-offset-width-1px--ce4edccf4c rui-textarea__u-rui-ring-offset-color-fff--cccba99ae0 rui-textarea__u-cursor-grab--9ced4fb4ec rui-textarea__u-background-color-transparent--f8dca23f7d rui-textarea__u-rui-text-opacity-1--6462b86910 rui-textarea__u-rui-text-opacity-1--370c6ccaec rui-textarea__u-rui-ring-opacity-1--44329df62f rui-textarea__u-rui-ring-offset-color-18181b--900e4559ba"
              style={{
                border: "none",
                boxShadow: "none",
                appearance: "none",
                background: "transparent",
              }}
            >
              <svg
                viewBox="0 0 12 12"
                aria-hidden="true"
                className="rui-textarea__u-height-0-75rem--6a60c09e6a rui-textarea__u-width-0-75rem--9cea05671a rui-textarea__u-rui-text-opacity-1--8d44cef396 rui-textarea__u-rui-text-opacity-1--6462b86910"
              >
                <path
                  d="M2 10.5 10.5 2M4.5 10.5 10.5 4.5M7 10.5 10.5 7"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {description ? (
        <p id={descriptionId} className="rui-textarea__u-font-size-0-75rem--359090c2d5 rui-textarea__u-rui-text-opacity-1--30426eb75c rui-textarea__u-rui-text-opacity-1--6462b86910">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="rui-textarea__u-font-size-0-75rem--359090c2d5 rui-textarea__u-font-weight-500--2689f39580 rui-textarea__u-rui-text-opacity-1--fa51279820 rui-textarea__u-rui-text-opacity-1--897de47303">
          {error}
        </p>
      ) : null}
    </div>
  );
});
