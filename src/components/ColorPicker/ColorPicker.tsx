import * as React from "react";
import { assignRef } from "../../utils/ref";
import clsx from "clsx";
import "./ColorPicker.css";

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
    const resolvedHsv = React.useMemo(
      () => hexToHsv(resolvedValue) ?? { h: 199, s: 100, v: 100 },
      [resolvedValue]
    );
    const [hue, setHue] = React.useState(resolvedHsv.h);
    const [saturation, setSaturation] = React.useState(resolvedHsv.s);
    const [valueLevel, setValueLevel] = React.useState(resolvedHsv.v);
    const lastColorUpdateSource = React.useRef<
      null | "gradient" | "hue" | "swatch" | "channel" | "external"
    >(null);

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
        assignRef(forwardedRef, node);
      },
      [forwardedRef]
    );

    const shouldLockHue = (s: number, v: number) => s <= 1 || v <= 1;

    React.useEffect(() => {
      if (lastColorUpdateSource.current !== "gradient") {
        setHue((prev) => (shouldLockHue(resolvedHsv.s, resolvedHsv.v) ? prev : resolvedHsv.h));
      }
      setSaturation(resolvedHsv.s);
      setValueLevel(resolvedHsv.v);
      lastColorUpdateSource.current = null;
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
        lastColorUpdateSource.current = "swatch";
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
            lastColorUpdateSource.current = "channel";
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
        lastColorUpdateSource.current = "gradient";
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
        lastColorUpdateSource.current = "hue";
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
      <div className="rui-root rui-color-picker">
        {label ? (
          <p className="rui-color-picker__label rui-text-wrap">{label}</p>
        ) : null}
        <button
          type="button"
          ref={triggerRef}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={label ? `Adjust ${label}` : "Choose color"}
          className="rui-color-picker__trigger"
        >
          <span
            className="rui-color-picker__trigger-fill"
            style={{ background: resolvedValue }}
            aria-hidden="true"
          />
          <span
            className="rui-color-picker__trigger-icon"
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
            className="rui-color-picker__panel"
          >
            <div className="rui-color-picker__panel-body">
              <div className="rui-color-picker__gradient-section">
                <div
                  ref={gradientRef}
                  onPointerDown={handleGradientPointerDown}
                  className="rui-color-picker__gradient"
                  style={{
                    backgroundColor: `hsl(${hue}, 100%, 50%)`,
                    backgroundImage:
                      "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))",
                  }}
                  aria-label="Color area"
                >
                  <span
                    className="rui-color-picker__gradient-thumb"
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
                  className="rui-color-picker__hue"
                  style={{
                    background: "linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                  }}
                  aria-label="Hue slider"
                >
                  <span
                    className="rui-color-picker__hue-thumb"
                    style={{ left: `${(hue / 360) * 100}%` }}
                  />
                </div>
              </div>
              <div className="rui-color-picker__swatch-row">
                {swatchList.map((color) => {
                  const isActive =
                    color.toLowerCase() === resolvedValue.toLowerCase();

                  return (
                    <div key={color} className="rui-color-picker__swatch">
                      <button
                        type="button"
                        onClick={() => handleSwatchClick(color)}
                        className={clsx(
                          "rui-color-picker__swatch-button",
                          isActive && "rui-color-picker__swatch-button--active"
                        )}
                        style={{ background: color }}
                        aria-label={`Select ${color}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSwatch(color)}
                        className="rui-color-picker__swatch-remove"
                        aria-label={`Remove ${color} swatch`}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={handleAddSwatch}
                  className="rui-color-picker__add-swatch"
                  aria-label="+ Add swatch"
                >
                  +
                </button>
              </div>
              <div className="rui-color-picker__channels">
                <div className="rui-color-picker__channels-header">
                  <span>Channels</span>
                  <div className="rui-color-picker__format-toggle">
                    {formatOrder.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormat(option)}
                        aria-pressed={format === option}
                        className={clsx(
                          "rui-color-picker__format-button",
                          format === option && "is-active"
                        )}
                      >
                        {option.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rui-color-picker__channel-grid">
                  {format === "hex" ? (
                    <label className="rui-color-picker__channel-field rui-color-picker__channel-field--hex">
                      <span className="rui-color-picker__channel-prefix">#</span>
                      <input
                        type="text"
                        value={channelValues[0] ?? ""}
                        onChange={(event) =>
                          handleChannelChange(0, event.target.value)
                        }
                        onBlur={resetChannels}
                        inputMode="text"
                        maxLength={6}
                        className="rui-color-picker__channel-input rui-color-picker__channel-input--hex"
                      />
                    </label>
                  ) : (
                    channelValues.map((value, index) => (
                      <label
                        key={activeLabels[index]}
                        className="rui-color-picker__channel-field"
                      >
                        <span className="rui-color-picker__channel-prefix">
                          {activeLabels[index]}
                        </span>
                        <input
                          type="text"
                          value={value}
                          onChange={(event) =>
                            handleChannelChange(index, event.target.value)
                          }
                          onBlur={resetChannels}
                          inputMode="numeric"
                          className="rui-color-picker__channel-input"
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


