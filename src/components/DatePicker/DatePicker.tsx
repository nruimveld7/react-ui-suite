import * as React from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import { Popover } from "../Popover/Popover";
import { Calendar, Clock } from "../Combobox/icons";
import { useOutsideClick } from "../Combobox/hooks";
import { Select, type SelectOption } from "../Select/Select";
import Button from "../Button/Button";
import { assignRef } from "../../utils/ref";
import clsx from "clsx";
import "./DatePicker.css";

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
  use24HourClock?: boolean; // only used when type === "time"
  dateMode?: "local" | "utc"; // only used when type === "date"
};

type ViewMode = "day" | "month" | "year";
type DateMode = "local" | "utc";

function formatLocalDateString(year: number, month: number, day: number) {
  const y = String(year).padStart(4, "0");
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDateFromParts(mode: DateMode, year: number, month: number, day: number) {
  return mode === "utc" ? new Date(Date.UTC(year, month, day)) : new Date(year, month, day);
}

function parseDateString(value: string | undefined, mode: DateMode) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const year = Number(y);
  const month = Number(m) - 1;
  const day = Number(d);
  const date = toDateFromParts(mode, year, month, day);
  if (Number.isNaN(date.getTime())) return null;
  return { date, year, month, day };
}

function getMonthDays(year: number, month: number, mode: DateMode) {
  const first = toDateFromParts(mode, year, month, 1);
  const start = mode === "utc" ? first.getUTCDay() : first.getDay();
  const endOfMonth = toDateFromParts(mode, year, month + 1, 0);
  const days = mode === "utc" ? endOfMonth.getUTCDate() : endOfMonth.getDate();
  const grid: Array<{ day: number | null; date?: string }> = [];
  for (let i = 0; i < start; i += 1) grid.push({ day: null });
  for (let d = 1; d <= days; d += 1) {
    grid.push({ day: d, date: formatLocalDateString(year, month, d) });
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
    dateMode = "local",
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

  const formatTimeLabel = React.useCallback(
    (time: string) => {
      if (use24HourClock) return time;
      const [hStr, m] = time.split(":");
      let hNum = Number(hStr);
      const suffix = hNum >= 12 ? "PM" : "AM";
      hNum = hNum % 12 || 12;
      return `${String(hNum).padStart(2, "0")}:${m} ${suffix}`;
    },
    [use24HourClock]
  );

  const initial = (() => {
    if (!isDate) {
      return (
        normalizeTimeString(value) ??
        normalizeTimeString(defaultValue) ??
        (() => {
          const now = new Date();
          const minutes = now.getMinutes();
          const rounded = Math.round(minutes / clampInterval) * clampInterval;
          const h = rounded >= 60 ? now.getHours() + 1 : now.getHours();
          const m = rounded % 60;
          const safeH = (h + 24) % 24;
          return `${String(safeH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        })()
      );
    }
    const normalized = parseDateString(value ?? defaultValue, dateMode);
    if (normalized) return formatLocalDateString(normalized.year, normalized.month, normalized.day);
    const today = new Date();
    const year = dateMode === "utc" ? today.getUTCFullYear() : today.getFullYear();
    const month = dateMode === "utc" ? today.getUTCMonth() : today.getMonth();
    const day = dateMode === "utc" ? today.getUTCDate() : today.getDate();
    return formatLocalDateString(year, month, day);
  })();
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(initial);
  const [month, setMonth] = React.useState(() => {
    const parsed = parseDateString(initial, dateMode)?.date;
    if (parsed) {
      return {
        year: dateMode === "utc" ? parsed.getUTCFullYear() : parsed.getFullYear(),
        month: dateMode === "utc" ? parsed.getUTCMonth() : parsed.getMonth(),
      };
    }
    const now = new Date();
    return {
      year: dateMode === "utc" ? now.getUTCFullYear() : now.getFullYear(),
      month: dateMode === "utc" ? now.getUTCMonth() : now.getMonth(),
    };
  });
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const dropdownRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const toggleRef: React.MutableRefObject<HTMLButtonElement | null> = React.useRef(null);
  const inputInnerRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const popoverRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const suppressToggleRef = React.useRef(false);
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = React.useRef(null);
  const [useShortLabel, setUseShortLabel] = React.useState(false);
  const id = React.useId();
  const popoverId = `${id}-popover`;

  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputInnerRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );

  const outsideClickRefs = React.useMemo(
    () => [
      dropdownRef as unknown as React.RefObject<HTMLElement | null>,
      popoverRef as unknown as React.RefObject<HTMLElement | null>,
    ],
    []
  );
  useOutsideClick(outsideClickRefs, () => setOpen(false));

  const commit = (next: string) => {
    setCurrent(next);
    onChange?.(next);
    setOpen(false);
    setViewMode("day");
  };

  const parsedDate = React.useMemo(() => {
    const parsed = parseDateString(current, dateMode);
    return parsed?.date ?? null;
  }, [current, dateMode]);

  const longDisplayLabel = React.useMemo(() => {
    if (!parsedDate) return current;
    return parsedDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: dateMode === "utc" ? "UTC" : undefined,
    });
  }, [parsedDate, current, dateMode]);

  const shortDisplayLabel = React.useMemo(() => {
    if (!parsedDate) return current;
    return parsedDate.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      timeZone: dateMode === "utc" ? "UTC" : undefined,
    });
  }, [parsedDate, current, dateMode]);

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
  }, [clampInterval, formatTimeLabel]);

  const highlightBorder = "rui-date-picker__highlightBorder";

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
        : toDateFromParts(dateMode, month.year, month.month, 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
            timeZone: dateMode === "utc" ? "UTC" : undefined,
          });

  function openPicker() {
    if (disabled) return;
    const base = parsedDate ?? new Date();
    setMonth({
      year: dateMode === "utc" ? base.getUTCFullYear() : base.getFullYear(),
      month: dateMode === "utc" ? base.getUTCMonth() : base.getMonth(),
    });
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
      inputStyles.font ||
      `${inputStyles.fontWeight} ${inputStyles.fontSize} ${inputStyles.fontFamily}`;
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
          <span className="rui-date-picker__leading-icon">
            <Clock className="rui-date-picker__leading-icon-mark" />
          </span>
        }
      />
    );
  }

  return (
    <div className="rui-date-picker rui-root">
      {label ? (
        <p className="rui-date-picker__label rui-text-wrap">
          {label}
        </p>
      ) : null}

      <div className="rui-date-picker__field">
        <Dropdown
          ref={dropdownRef}
          isOpen={open}
          disabled={disabled}
          placeholder=""
          displayValue={displayLabel}
          query={displayLabel}
          className="rui-date-picker__dropdown"
          inputClassName={clsx("rui-date-picker__input", className)}
          shellClassName={clsx(
            error &&
              "rui-date-picker__shell--error"
          )}
          leadingContent={
            <span className="rui-date-picker__leading-icon">
              <Calendar className="rui-date-picker__leading-icon-mark" />
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
            <Popover
              anchorRef={dropdownRef}
              rootRef={popoverRef}
              className={clsx("rui-date-picker__popover", highlightBorder)}
            >
              {() => (
                <div className="rui-date-picker__panel" id={popoverId}>
                  <div className="rui-date-picker__header">
                    <Button
                      type="button"
                      onClick={goPrev}
                      className="rui-date-picker__nav-button"
                    >
                      <span style={{ transform: "translateY(-1.5px)" }}>{"<"}</span>
                    </Button>
                    {viewMode === "year" ? (
                      <span className="rui-date-picker__header-title rui-text-wrap">
                        {headerLabel}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setViewMode((prev) => (prev === "day" ? "month" : "year"))}
                        className="rui-date-picker__header-title rui-text-wrap rui-date-picker__header-title-button"
                      >
                        {headerLabel}
                      </button>
                    )}
                    <Button
                      type="button"
                      onClick={goNext}
                      className="rui-date-picker__nav-button"
                    >
                      <span style={{ transform: "translateY(-1.5px)" }}>{">"}</span>
                    </Button>
                  </div>

                  {viewMode === "day" ? (
                    <>
                      <div className="rui-date-picker__weekday-row">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                      <div className="rui-date-picker__day-grid">
                        {getMonthDays(month.year, month.month, dateMode).map((cell, idx) => {
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
                              className={clsx(
                                "rui-date-picker__day",
                                isSelected && "is-selected",
                                !cell.date && "is-empty"
                              )}
                            >
                              {cell.day ?? ""}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : viewMode === "month" ? (
                    <div className="rui-date-picker__month-grid">
                      {monthNames.map((name, idx) => {
                        const isSelected =
                          parsedDate?.getFullYear() === month.year &&
                          parsedDate?.getMonth() === idx;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setMonth((prev) => ({ ...prev, month: idx }));
                              setViewMode("day");
                            }}
                            className={clsx(
                              "rui-date-picker__tile",
                              isSelected && "is-selected"
                            )}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rui-date-picker__year-grid">
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
                            className={clsx(
                              "rui-date-picker__tile",
                              isSelected && "is-selected"
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

      {description ? (
        <p className="rui-date-picker__description rui-text-wrap">{description}</p>
      ) : null}
      {error ? (
        <p className="rui-date-picker__error rui-text-wrap">{error}</p>
      ) : null}
    </div>
  );
});


