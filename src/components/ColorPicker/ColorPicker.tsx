import * as React from "react";
import { twMerge } from "tailwind-merge";

type ColorFormat = "hex" | "rgb" | "hsl";

export type ColorPickerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  swatches?: string[];
};

const defaultSwatches = ["#0ea5e9", "#22c55e", "#f97316", "#f43f5e", "#6366f1", "#facc15"];

const formatOrder: ColorFormat[] = ["hex", "rgb", "hsl"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(input: string | undefined | null): string | null {
  if (!input) return null;
  let hex = input.trim().replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return `#${hex.toUpperCase()}`;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const value = normalized.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const parts = [r, g, b]
    .map((component) => clamp(Math.round(component), 0, 255))
    .map((component) => component.toString(16).padStart(2, "0"));
  return `#${parts.join("").toUpperCase()}`;
}

function hexToHsl(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s / 100, 0, 1);
  const light = clamp(l / 100, 0, 1);

  if (sat === 0) {
    const gray = Math.round(light * 255);
    return rgbToHex(gray, gray, gray);
  }

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;

  function hueToRgb(t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  const r = hueToRgb(hue / 360 + 1 / 3);
  const g = hueToRgb(hue / 360);
  const b = hueToRgb(hue / 360 - 1 / 3);

  return rgbToHex(r * 255, g * 255, b * 255);
}

type ChannelValues = string[];

const channelLabels: Record<ColorFormat, string[]> = {
  hex: ["HEX"],
  rgb: ["R", "G", "B"],
  hsl: ["H", "S", "L"],
};

type HsvTuple = { h: number; s: number; v: number };

function hexToHsv(hex: string): HsvTuple | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function hsvToHex(h: number, s: number, v: number) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s / 100, 0, 1);
  const val = clamp(v / 100, 0, 1);
  const c = val * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = val - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hue < 60) {
    rPrime = c;
    gPrime = x;
  } else if (hue < 120) {
    rPrime = x;
    gPrime = c;
  } else if (hue < 180) {
    gPrime = c;
    bPrime = x;
  } else if (hue < 240) {
    gPrime = x;
    bPrime = c;
  } else if (hue < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  const r = Math.round((rPrime + m) * 255);
  const g = Math.round((gPrime + m) * 255);
  const b = Math.round((bPrime + m) * 255);

  return rgbToHex(r, g, b);
}

function getChannelValues(hex: string, format: ColorFormat): ChannelValues {
  const normalized = normalizeHex(hex) ?? "#000000";
  switch (format) {
    case "rgb": {
      const rgb = hexToRgb(normalized);
      if (!rgb) return ["0", "0", "0"];
      return [rgb.r, rgb.g, rgb.b].map((value) => String(value));
    }
    case "hsl": {
      const hsl = hexToHsl(normalized);
      if (!hsl) return ["0", "0", "0"];
      return [hsl.h, hsl.s, hsl.l].map((value) => String(value));
    }
    default: {
      const value = normalized.replace("#", "");
      return [value.toUpperCase()];
    }
  }
}

function channelsToHex(values: Readonly<ChannelValues>, format: ColorFormat): string | null {
  if (values.some((value) => value.trim() === "")) return null;
  switch (format) {
    case "hex": {
      const hex = values[0]?.trim().replace(/^#/, "") ?? "";
      if (!/^[0-9a-fA-F]{3}$/.test(hex) && !/^[0-9a-fA-F]{6}$/.test(hex)) return null;
      return normalizeHex(`#${hex}`);
    }
    case "rgb": {
      const numbers = values.map((value) => Number(value.trim()));
      if (numbers.some((num) => Number.isNaN(num))) return null;
      return rgbToHex(numbers[0], numbers[1], numbers[2]);
    }
    case "hsl": {
      const numbers = values.map((value) => Number(value.trim()));
      if (numbers.some((num) => Number.isNaN(num))) return null;
      return hslToHex(numbers[0], numbers[1], numbers[2]);
    }
    default:
      return null;
  }
}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  function ColorPicker(
    {
      label,
      value,
      defaultValue = "#0ea5e9",
      onChange,
      swatches = defaultSwatches,
      id,
      className,
      ...rest
    },
    forwardedRef
  ) {
    const normalizedDefault = React.useMemo(
      () => normalizeHex(defaultValue) ?? "#0EA5E9",
      [defaultValue]
    );
    const normalizedSwatches = React.useMemo(
      () => swatches.map((color) => normalizeHex(color)).filter(Boolean) as string[],
      [swatches]
    );
    const isControlled = typeof value === "string";
    const [internalValue, setInternalValue] = React.useState(normalizedDefault);
    const [format, setFormat] = React.useState<ColorFormat>("hex");
    const resolvedValue = React.useMemo(() => {
      if (isControlled) {
        return normalizeHex(value) ?? normalizedDefault;
      }
      return normalizeHex(internalValue) ?? normalizedDefault;
    }, [isControlled, value, internalValue, normalizedDefault]);
    const [channelValues, setChannelValues] = React.useState<ChannelValues>(() =>
      getChannelValues(resolvedValue, format)
    );
    const [swatchList, setSwatchList] = React.useState<string[]>(normalizedSwatches);
    const resolvedHsl = React.useMemo(
      () => hexToHsl(resolvedValue) ?? { h: 199, s: 100, l: 50 },
      [resolvedValue]
    );
    const resolvedHsv = React.useMemo(
      () => hexToHsv(resolvedValue) ?? { h: 199, s: 100, v: 100 },
      [resolvedValue]
    );
    const [hue, setHue] = React.useState(resolvedHsv.h);
    const [saturation, setSaturation] = React.useState(resolvedHsv.s);
    const [valueLevel, setValueLevel] = React.useState(resolvedHsv.v);

    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
    const triggerRef: React.MutableRefObject<HTMLButtonElement | null> = React.useRef(null);
    const panelRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
    const gradientRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
    const hueRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
    const gradientDragCleanupRef: React.MutableRefObject<(() => void) | null> = React.useRef(null);
    const hueDragCleanupRef: React.MutableRefObject<(() => void) | null> = React.useRef(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef && typeof forwardedRef === "object")
          (forwardedRef as any).current = node;
      },
      [forwardedRef]
    );

    const shouldLockHue = (s: number, v: number) => s <= 1 || v <= 1;

    React.useEffect(() => {
      setHue((prev) => (shouldLockHue(resolvedHsv.s, resolvedHsv.v) ? prev : resolvedHsv.h));
      setSaturation(resolvedHsv.s);
      setValueLevel(resolvedHsv.v);
    }, [resolvedHsv.h, resolvedHsv.s, resolvedHsv.v]);

    React.useEffect(() => {
      setSwatchList(normalizedSwatches);
    }, [normalizedSwatches]);

    const applyColor = React.useCallback(
      (next: string) => {
        const normalized = normalizeHex(next);
        if (!normalized) return;
        if (!isControlled) {
          setInternalValue(normalized);
        }
        onChange?.(normalized);
      },
      [isControlled, onChange]
    );

    const handleSwatchClick = (color: string) => {
      const normalized = normalizeHex(color);
      if (!normalized) return;
      const hsv = hexToHsv(normalized);
      if (hsv) {
        setHue((prev) => (shouldLockHue(hsv.s, hsv.v) ? prev : hsv.h));
        setSaturation(hsv.s);
        setValueLevel(hsv.v);
      }
      applyColor(normalized);
    };

    const handleAddSwatch = React.useCallback(() => {
      const normalized = normalizeHex(resolvedValue);
      if (!normalized) return;
      setSwatchList((prev) => {
        if (prev.includes(normalized)) return prev;
        return [...prev, normalized];
      });
    }, [resolvedValue]);

    const handleRemoveSwatch = React.useCallback((color: string) => {
      setSwatchList((prev) => prev.filter((value) => value.toLowerCase() !== color.toLowerCase()));
    }, []);

    React.useEffect(() => {
      setChannelValues(getChannelValues(resolvedValue, format));
    }, [resolvedValue, format]);

    const handleChannelChange = React.useCallback(
      (index: number, nextValue: string) => {
        setChannelValues((prev) => {
          const updated = [...prev];
          if (format === "hex") {
            updated[index] = nextValue.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
          } else {
            updated[index] = nextValue;
          }
          const parsed = channelsToHex(updated, format);
          if (parsed) {
            applyColor(parsed);
          }
          return updated;
        });
      },
      [applyColor, format]
    );

    const resetChannels = React.useCallback(() => {
      setChannelValues(getChannelValues(resolvedValue, format));
    }, [resolvedValue, format]);

    const closePanel = React.useCallback(() => {
      setIsOpen(false);
    }, []);

    React.useEffect(() => {
      if (!isOpen) return;
      const handlePointer = (event: PointerEvent) => {
        const target = event.target as Node;
        if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) {
          return;
        }
        closePanel();
      };
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closePanel();
          triggerRef.current?.focus();
        }
      };

      window.addEventListener("pointerdown", handlePointer);
      window.addEventListener("keydown", handleKeydown);
      return () => {
        window.removeEventListener("pointerdown", handlePointer);
        window.removeEventListener("keydown", handleKeydown);
      };
    }, [closePanel, isOpen]);

    const updateGradientColor = React.useCallback(
      (clientX: number, clientY: number) => {
        const rect = gradientRef.current?.getBoundingClientRect();
        if (!rect) return;
        const xRatio = clamp((clientX - rect.left) / rect.width, 0, 1);
        const yRatio = clamp((clientY - rect.top) / rect.height, 0, 1);
        const nextS = Math.round(xRatio * 100);
        const nextV = Math.round((1 - yRatio) * 100);
        setSaturation(nextS);
        setValueLevel(nextV);
        applyColor(hsvToHex(hue, nextS, nextV));
      },
      [applyColor, hue]
    );

    const handleGradientPointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        gradientDragCleanupRef.current?.();
        updateGradientColor(event.clientX, event.clientY);
        const handleMove = (moveEvent: PointerEvent) => {
          moveEvent.preventDefault();
          updateGradientColor(moveEvent.clientX, moveEvent.clientY);
        };
        const stop = () => {
          window.removeEventListener("pointermove", handleMove);
          window.removeEventListener("pointerup", stop);
          window.removeEventListener("pointercancel", stop);
          gradientDragCleanupRef.current = null;
        };
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);
        gradientDragCleanupRef.current = stop;
      },
      [updateGradientColor]
    );

    const updateHueFromPointer = React.useCallback(
      (clientX: number) => {
        const rect = hueRef.current?.getBoundingClientRect();
        if (!rect) return;
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        const nextHue = Math.round(ratio * 360);
        setHue(nextHue);
        applyColor(hsvToHex(nextHue, saturation, valueLevel));
      },
      [applyColor, saturation, valueLevel]
    );

    const handleHuePointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        hueDragCleanupRef.current?.();
        updateHueFromPointer(event.clientX);
        const handleMove = (moveEvent: PointerEvent) => {
          moveEvent.preventDefault();
          updateHueFromPointer(moveEvent.clientX);
        };
        const stop = () => {
          window.removeEventListener("pointermove", handleMove);
          window.removeEventListener("pointerup", stop);
          window.removeEventListener("pointercancel", stop);
          hueDragCleanupRef.current = null;
        };
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);
        hueDragCleanupRef.current = stop;
      },
      [updateHueFromPointer]
    );

    React.useEffect(() => {
      return () => {
        gradientDragCleanupRef.current?.();
        hueDragCleanupRef.current?.();
      };
    }, []);

    const activeLabels = channelLabels[format];

    return (
      <div className="relative inline-flex flex-col items-center gap-2">
        {label ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-zinc-500">
            {label}
          </p>
        ) : null}
        <button
          type="button"
          ref={triggerRef}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={label ? `Adjust ${label}` : "Choose color"}
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <span
            className="absolute inset-1 rounded-full border border-white/30 shadow-inner dark:border-zinc-900/60"
            style={{ background: resolvedValue }}
            aria-hidden="true"
          />
          <span
            className="relative text-xl drop-shadow-[0_1px_1px_rgba(15,23,42,0.55)]"
            style={{ transform: "translateX(0.5px) translateY(-1.5px)" }}
            aria-hidden="true"
          >
            🎨
          </span>
        </button>
        {isOpen ? (
          <div
            ref={panelRef}
            role="dialog"
            aria-label={label ? `${label} color picker` : "Color picker dialog"}
            className="absolute left-1/2 top-full z-20 mt-3 w-[340px] max-w-[90vw] -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-sm dark:border-zinc-700/60 dark:bg-zinc-900/95"
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <div
                  ref={gradientRef}
                  onPointerDown={handleGradientPointerDown}
                  className="relative h-40 w-full cursor-crosshair overflow-hidden rounded-xl shadow-[inset_0_1px_2px_rgba(15,23,42,.25)] ring-1 ring-black/5 dark:ring-white/10"
                  style={{
                    backgroundColor: `hsl(${hue}, 100%, 50%)`,
                    backgroundImage:
                      "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))",
                  }}
                  aria-label="Color area"
                >
                  <span
                    className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_2px_rgba(15,23,42,.4)]"
                    style={{
                      left: `${saturation}%`,
                      top: `${100 - valueLevel}%`,
                      background: resolvedValue,
                    }}
                  />
                </div>
                <div
                  ref={hueRef}
                  onPointerDown={handleHuePointerDown}
                  className="relative h-3 w-full cursor-pointer rounded-full border border-white/40 shadow-inner dark:border-zinc-800/60"
                  style={{
                    background: "linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                  }}
                  aria-label="Hue slider"
                >
                  <span
                    className="pointer-events-none absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-900/40 bg-white shadow"
                    style={{ left: `${(hue / 360) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {swatchList.map((color) => (
                  <div key={color} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleSwatchClick(color)}
                      className={twMerge(
                        "h-7 w-7 rounded-full border border-white/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-zinc-900/70",
                        color.toLowerCase() === resolvedValue.toLowerCase() &&
                          "ring-2 ring-offset-2 ring-slate-500 dark:ring-offset-slate-900"
                      )}
                      style={{ background: color }}
                      aria-label={`Select ${color}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSwatch(color)}
                      className="absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition group-hover:flex group-focus-within:flex dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700"
                      aria-label={`Remove ${color} swatch`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSwatch}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500"
                >
                  + Add swatch
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                    Channels
                  </p>
                  <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white/80 text-[11px] font-semibold uppercase text-slate-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300">
                    {formatOrder.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormat(option)}
                        aria-pressed={format === option}
                        className={twMerge(
                          "px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60",
                          format === option
                            ? "bg-white text-slate-900 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)] dark:bg-white/15 dark:text-white"
                            : "text-slate-500 dark:text-zinc-400"
                        )}
                      >
                        {option.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {format === "hex" ? (
                    <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 font-mono text-sm text-slate-900 focus-within:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100">
                      <span className="text-base font-semibold text-slate-400 dark:text-zinc-500">
                        #
                      </span>
                      <input
                        type="text"
                        value={channelValues[0] ?? ""}
                        onChange={(event) => handleChannelChange(0, event.target.value)}
                        onBlur={resetChannels}
                        inputMode="text"
                        maxLength={6}
                        className="h-6 min-w-0 flex-1 border-none bg-transparent p-0 text-left text-sm uppercase tracking-[0.2em] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-zinc-50"
                      />
                    </label>
                  ) : (
                    channelValues.map((value, index) => (
                      <label
                        key={activeLabels[index]}
                        className="flex min-w-[90px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 font-mono text-sm text-slate-900 focus-within:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                          {activeLabels[index]}
                        </span>
                        <input
                          type="text"
                          value={value}
                          onChange={(event) => handleChannelChange(index, event.target.value)}
                          onBlur={resetChannels}
                          inputMode="numeric"
                          className="h-6 min-w-0 flex-1 border-none bg-transparent p-0 text-right text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-zinc-50"
                        />
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <input
          {...rest}
          ref={mergedRef}
          id={inputId}
          type="hidden"
          className={className}
          value={resolvedValue}
          readOnly
        />
      </div>
    );
  }
);
