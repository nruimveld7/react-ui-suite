import * as React from "react";
import { twMerge } from "tailwind-merge";

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
  { label, description, error, className, id, disabled, maxLength, showCount = true, resizeDirection = "vertical", ...rest },
  ref
) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const descriptionId = React.useId();
  const errorId = React.useId();
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const shellRef = React.useRef<HTMLDivElement | null>(null);
  const resizeListenersRef = React.useRef<{
    move?: (event: MouseEvent) => void;
    up?: (event: MouseEvent) => void;
  }>({});
  const [thumb, setThumb] = React.useState<ThumbState>({ visible: false, size: MIN_THUMB, offset: 0 });

  const hintIds = [
    description ? descriptionId : null,
    error ? errorId : null
  ].filter(Boolean);
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
      const offset = maxOffset > 0 ? Math.min(maxOffset, (target.scrollTop / scrollRange) * maxOffset) : 0;
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

  const shellClasses = twMerge(
    "relative rounded-2xl border border-slate-300 bg-white/80 px-3 py-2 shadow-sm transition focus-within:border-slate-400 focus-within:shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:focus-within:border-slate-500",
    disabled && "opacity-60",
    error && "border-rose-300 focus-within:border-rose-400 focus-within:shadow-[0_0_0_1px_rgba(248,113,113,0.35)] dark:border-rose-500/60"
  );

  const textareaClasses = twMerge(
    "textarea-scrollbar min-h-[120px] w-full resize-none border-none bg-transparent pb-4 pr-5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500",
    className
  );

  const count = value.length;
  const limit = maxLength ?? undefined;
  const { style, ...restProps } = rest;
  const textareaStyle = {
    ...style,
    ...(height !== undefined ? { height } : null),
    ...(width !== undefined ? { width } : null),
    maxWidth: "100%"
  };
  const shellStyle = width !== undefined ? { width, maxWidth: "100%" } : { maxWidth: "100%" };

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400"
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
            className="pointer-events-auto absolute z-20 rounded-full bg-white/60 shadow-inner backdrop-blur-sm transition-colors dark:bg-zinc-800/70"
            style={{
              right: 4,
              top: TRACK_TOP + TRACK_REDUCTION_HALF,
              bottom: TRACK_BOTTOM + TRACK_REDUCTION_HALF,
              width: TRACK_THICKNESS
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
              const ratio = Math.max(0, Math.min(effective, clickOffset - thumb.size / 2)) / effective;
              const target = ratio * scrollRange;
              el.scrollTop = target;
              handleThumbDrag(event as unknown as React.PointerEvent<HTMLDivElement>, target);
            }}
          >
            <div className="relative h-full w-full rounded-full bg-slate-900/5 shadow-inner dark:bg-white/10">
              <div
                className="absolute left-1/2 w-full -translate-x-1/2 rounded-full bg-slate-400/80 shadow-sm transition-colors dark:bg-zinc-500/70"
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
          <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-zinc-500">
            {showCount && limit ? <div className="pointer-events-auto">{count}/{limit}</div> : null}
            <button
              type="button"
              aria-label="Resize textarea"
              onMouseDown={handleResizeStart}
              className="pointer-events-auto inline-flex h-[14px] w-[14px] items-center justify-center rounded-[3px] bg-transparent text-slate-400 outline-none transition hover:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-1 focus-visible:ring-offset-white active:cursor-grab dark:bg-transparent dark:text-zinc-400 dark:hover:text-zinc-200 dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-zinc-900"
              style={{ border: "none", boxShadow: "none", appearance: "none", background: "transparent" }}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 text-slate-400 dark:text-zinc-400">
                <path d="M2 10.5 10.5 2M4.5 10.5 10.5 4.5M7 10.5 10.5 7" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {description ? (
        <p id={descriptionId} className="text-xs text-slate-500 dark:text-zinc-400">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});
