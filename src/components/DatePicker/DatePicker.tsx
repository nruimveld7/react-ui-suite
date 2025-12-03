import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Dropdown } from "../Dropdown/Dropdown";
import { Popover } from "../Popover/Popover";
import { Calendar, Clock } from "../Combobox/icons";
import { useOutsideClick } from "../Combobox/hooks";
import { Select, type SelectOption } from "../Select/Select";
import Button from "../Button/Button";

export type DatePickerProps = {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  type?: "date" | "time";
  timeIntervalMinutes?: number; // only used when type === "time"
  use24HourClock?: boolean;     // only used when type === "time"
};

type ViewMode = "day" | "month" | "year";

function formatLocalDateString(year: number, month: number, day: number) {
  const y = String(year).padStart(4, "0");
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseLocalDateString(value?: string) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const year = Number(y);
  const month = Number(m) - 1;
  const day = Number(d);
  const date = new Date(year, month, day);
  if (Number.isNaN(date.getTime())) return null;
  return { date, year, month, day };
}

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const grid: Array<{ day: number | null; date?: string }> = [];
  for (let i = 0; i < start; i += 1) grid.push({ day: null });
  for (let d = 1; d <= days; d += 1) {
    const date = new Date(year, month, d);
    grid.push({ day: d, date: date.toISOString().slice(0, 10) });
  }
  return grid;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label,
    description,
    error,
    className,
    disabled,
    value,
    defaultValue,
    onChange,
    type = "date",
    timeIntervalMinutes = 30,
    use24HourClock = true,
  },
  ref
) {
  const isDate = type === "date";
  const clampInterval = Math.max(1, Math.min(60, Math.floor(timeIntervalMinutes)));

  const normalizeTimeString = (input?: string) => {
    if (!input) return null;
    const match = /(\d{1,2}):(\d{2})/.exec(input);
    if (!match) return null;
    const h = Math.min(23, Math.max(0, Number(match[1])));
    const m = Math.min(59, Math.max(0, Number(match[2])));
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const formatTimeLabel = (time: string) => {
    if (use24HourClock) return time;
    const [hStr, m] = time.split(":");
    let hNum = Number(hStr);
    const suffix = hNum >= 12 ? "PM" : "AM";
    hNum = hNum % 12 || 12;
    return `${String(hNum).padStart(2, "0")}:${m} ${suffix}`;
  };

  const initial = (() => {
    if (!isDate) {
      return normalizeTimeString(value) ?? normalizeTimeString(defaultValue) ?? (() => {
        const now = new Date();
        const minutes = now.getMinutes();
        const rounded = Math.round(minutes / clampInterval) * clampInterval;
        const h = rounded >= 60 ? now.getHours() + 1 : now.getHours();
        const m = rounded % 60;
        const safeH = (h + 24) % 24;
        return `${String(safeH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      })();
    }
    const normalized = parseLocalDateString(value ?? defaultValue)?.date;
    if (normalized) return formatLocalDateString(normalized.getFullYear(), normalized.getMonth(), normalized.getDate());
    const today = new Date();
    return formatLocalDateString(today.getFullYear(), today.getMonth(), today.getDate());
  })();
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(initial);
  const [month, setMonth] = React.useState(() => {
    const base = parseLocalDateString(initial)?.date ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const dropdownRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const toggleRef: React.MutableRefObject<HTMLButtonElement | null> = React.useRef(null);
  const inputInnerRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const suppressToggleRef = React.useRef(false);
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = React.useRef(null);
  const [useShortLabel, setUseShortLabel] = React.useState(false);
  const id = React.useId();
  const popoverId = `${id}-popover`;

  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputInnerRef.current = node;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [ref]
  );

  useOutsideClick([dropdownRef as unknown as React.RefObject<HTMLElement | null>], () => setOpen(false));

  const commit = (next: string) => {
    setCurrent(next);
    onChange?.(next);
    setOpen(false);
    setViewMode("day");
  };

  const parsedDate = React.useMemo(() => {
    const parsed = parseLocalDateString(current);
    return parsed?.date ?? null;
  }, [current]);

  const longDisplayLabel = React.useMemo(() => {
    if (!parsedDate) return current;
    return parsedDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [parsedDate, current]);

  const shortDisplayLabel = React.useMemo(() => {
    if (!parsedDate) return current;
    return parsedDate.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  }, [parsedDate, current]);

  const displayLabel = useShortLabel ? shortDisplayLabel : longDisplayLabel;

  const timeOptions: SelectOption[] = React.useMemo(() => {
    const opts: SelectOption[] = [];
    for (let h = 0; h < 24; h += 1) {
      for (let m = 0; m < 60; m += clampInterval) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        const valueStr = `${hh}:${mm}`;
        opts.push({ value: valueStr, label: formatTimeLabel(valueStr) });
      }
    }
    return opts;
  }, [clampInterval, use24HourClock]);

  if (!isDate) {
    return (
      <Select
        label={label}
        description={description}
        error={error}
        options={timeOptions}
        value={current}
        onChange={(val) => commit(val ?? current)}
        placeholder="Select time"
        disabled={disabled}
        className={className}
        leadingContent={
          <span className="pointer-events-none rounded-xl bg-slate-100 px-2 py-1 shadow-inner dark:bg-zinc-800/70">
            <Clock className="h-4 w-4 text-slate-500 dark:text-zinc-300" />
          </span>
        }
      />
    );
  }

  const highlightBorder =
    "border-slate-400 shadow-[0_0_0_1px_rgba(148,163,184,0.45)] dark:border-slate-500";

  const monthNames = React.useMemo(
    () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    []
  );

  const decadeStart = Math.floor(month.year / 10) * 10;

  const goPrev = () => {
    if (viewMode === "day") {
      setMonth((prev) => ({
        year: prev.month === 0 ? prev.year - 1 : prev.year,
        month: prev.month === 0 ? 11 : prev.month - 1,
      }));
    } else if (viewMode === "month") {
      setMonth((prev) => ({ ...prev, year: prev.year - 1 }));
    } else {
      setMonth((prev) => ({ ...prev, year: prev.year - 10 }));
    }
  };

  const goNext = () => {
    if (viewMode === "day") {
      setMonth((prev) => ({
        year: prev.month === 11 ? prev.year + 1 : prev.year,
        month: prev.month === 11 ? 0 : prev.month + 1,
      }));
    } else if (viewMode === "month") {
      setMonth((prev) => ({ ...prev, year: prev.year + 1 }));
    } else {
      setMonth((prev) => ({ ...prev, year: prev.year + 10 }));
    }
  };

  const rangeStart = decadeStart - 1;
  const rangeEnd = decadeStart + 10;
  const headerLabel =
    viewMode === "year"
      ? `${rangeStart} - ${rangeEnd}`
      : viewMode === "month"
        ? `${month.year}`
        : new Date(month.year, month.month).toLocaleString("default", { month: "long", year: "numeric" });

  function openPicker() {
    if (disabled) return;
    const base = parsedDate ?? new Date();
    setMonth({ year: base.getFullYear(), month: base.getMonth() });
    setViewMode("day");
    setOpen(true);
  }

  const evaluateLabelFit = React.useCallback(() => {
    if (!parsedDate) {
      setUseShortLabel(false);
      return;
    }

    const inputEl = inputInnerRef.current;
    if (!inputEl) return;

    const inputStyles = getComputedStyle(inputEl);
    const padding =
      parseFloat(inputStyles.paddingLeft || "0") + parseFloat(inputStyles.paddingRight || "0");
    const available = inputEl.clientWidth - padding;
    if (available <= 0) return;

    const font =
      inputStyles.font || `${inputStyles.fontWeight} ${inputStyles.fontSize} ${inputStyles.fontFamily}`;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = font;

    const fullWidth = ctx.measureText(longDisplayLabel).width;
    const fitsLong = fullWidth <= available;
    setUseShortLabel(!fitsLong);
  }, [parsedDate, longDisplayLabel]);

  React.useLayoutEffect(() => {
    evaluateLabelFit();
    const ro = new ResizeObserver(() => evaluateLabelFit());
    if (dropdownRef.current) ro.observe(dropdownRef.current);
    return () => ro.disconnect();
  }, [evaluateLabelFit]);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => evaluateLabelFit());
    return () => cancelAnimationFrame(id);
  }, [displayLabel, evaluateLabelFit]);

  return (
    <div className="space-y-1.5">
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
          {label}
        </p>
      ) : null}

      <div className="relative">
        <Dropdown
          ref={dropdownRef}
          isOpen={open}
          disabled={disabled}
          placeholder=""
          displayValue={displayLabel}
          query={displayLabel}
          className="w-full"
          inputClassName={twMerge(
            "min-w-0 font-semibold",
            className
          )}
          shellClassName={twMerge(
            error &&
              "border-rose-300 focus-within:border-rose-400 focus-within:shadow-[0_0_0_1px_rgba(248,113,113,0.35)] dark:border-rose-500/60"
          )}
          leadingContent={
            <span className="pointer-events-none rounded-xl bg-slate-100 px-2 py-1 shadow-inner dark:bg-zinc-800/70">
              <Calendar className="h-4 w-4 text-slate-500 dark:text-zinc-300" />
            </span>
          }
          highlightClass={highlightBorder}
          ariaControls={popoverId}
          ariaLabel={label}
          inputRef={setInputRef}
          chevronRef={toggleRef}
          onKeyDownCapture={() => {}}
          onShellMouseDown={(e) => {
            if (disabled) return;
            if (toggleRef.current?.contains(e.target as Node)) return;
            if (!open) {
              e.preventDefault();
              suppressToggleRef.current = true;
              openPicker();
              requestAnimationFrame(() => toggleRef.current?.focus());
            }
          }}
          onInputMouseDown={(e) => {
            if (!open && !disabled) {
              e.preventDefault();
              suppressToggleRef.current = true;
              openPicker();
              requestAnimationFrame(() => toggleRef.current?.focus());
            }
          }}
          onInputFocus={() => {
            if (suppressToggleRef.current) {
              suppressToggleRef.current = false;
              return;
            }
            openPicker();
          }}
          onInputChange={() => {
            // readonly display; no typing
          }}
          onChevronClick={() => {
            if (disabled) return;
            if (suppressToggleRef.current) {
              suppressToggleRef.current = false;
              setOpen((o) => !o);
              return;
            }
            setOpen((o) => !o);
          }}
        >
          {open && (
            <Popover className={twMerge("p-3", highlightBorder)}>
              {() => (
                <div className="space-y-3" id={popoverId}>
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-zinc-300">
                    <Button
                      type="button"
                      onClick={goPrev}
                      className="h-8 w-8 min-w-0 rounded-xl border border-slate-200 bg-white p-0 text-sm font-semibold text-slate-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      <span style={{ transform: "translateY(-1.5px)" }}>{"<"}</span>
                    </Button>
                    {viewMode === "year" ? (
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">{headerLabel}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setViewMode((prev) => (prev === "day" ? "month" : "year"))}
                        className="font-semibold text-slate-900 transition hover:underline dark:text-zinc-100"
                      >
                        {headerLabel}
                      </button>
                    )}
                    <Button
                      type="button"
                      onClick={goNext}
                      className="h-8 w-8 min-w-0 rounded-xl border border-slate-200 bg-white p-0 text-sm font-semibold text-slate-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      <span style={{ transform: "translateY(-1.5px)" }}>{">"}</span>
                    </Button>
                  </div>

                  {viewMode === "day" ? (
                    <>
                      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getMonthDays(month.year, month.month).map((cell, idx) => {
                          const isSelected = cell.date === current;
                          return (
                            <button
                              key={`${cell.date ?? "empty"}-${idx}`}
                              type="button"
                              disabled={!cell.date}
                              onClick={() => {
                                if (!cell.date) return;
                                commit(cell.date);
                              }}
                              className={twMerge(
                                "h-9 rounded-xl text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 dark:text-zinc-200 dark:hover:bg-zinc-800",
                                isSelected &&
                                  "bg-slate-200 text-slate-900 ring-1 ring-slate-400/70 shadow-sm dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-zinc-100 dark:ring-zinc-500/70",
                                !cell.date && "opacity-30"
                              )}
                            >
                              {cell.day ?? ""}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : viewMode === "month" ? (
                    <div className="grid grid-cols-3 gap-2">
                      {monthNames.map((name, idx) => {
                        const isSelected =
                          parsedDate?.getFullYear() === month.year && parsedDate?.getMonth() === idx;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setMonth((prev) => ({ ...prev, month: idx }));
                              setViewMode("day");
                            }}
                            className={twMerge(
                              "h-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                              isSelected && "border-slate-400 bg-slate-100 dark:border-slate-500 dark:bg-zinc-800"
                            )}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 12 }, (_, i) => rangeStart + i).map((yr) => {
                        const isSelected = parsedDate?.getFullYear() === yr;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              setMonth((prev) => ({ ...prev, year: yr }));
                              setViewMode("month");
                            }}
                            className={twMerge(
                              "h-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                              isSelected && "border-slate-400 bg-slate-100 dark:border-slate-500 dark:bg-zinc-800"
                            )}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Popover>
          )}
        </Dropdown>
      </div>

      {description ? <p className="text-xs text-slate-500 dark:text-zinc-400">{description}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-500 dark:text-rose-400">{error}</p> : null}
    </div>
  );
});
