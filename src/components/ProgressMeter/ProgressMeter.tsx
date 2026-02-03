import * as React from "react";
import clsx from "clsx";
import "./ProgressMeter.css";
type CommonProps = {
  label?: string;
  description?: string;
  className?: string;
};

export type ProgressProps = CommonProps & {
  value: number;
  max?: number;
  showValue?: boolean;
};

export function Progress({
  label,
  description,
  value,
  max = 100,
  showValue = true,
  className,
}: ProgressProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const percent = max === 0 ? 0 : Math.round((clamped / max) * 100);

  return (
    <div className={clsx("rui-progress-meter rui-root", className)}>
      {label ? (
        <div className="rui-progress-meter__header">
          <p className="rui-progress-meter__label rui-text-wrap">
            {label}
          </p>
          {showValue ? (
            <span className="rui-progress-meter__value">
              {percent}%
            </span>
          ) : null}
        </div>
      ) : null}
      {description ? (
        <p className="rui-progress-meter__description rui-text-wrap">{description}</p>
      ) : null}
      <div className="rui-progress-meter__track">
        <progress
          value={clamped}
          max={max}
          className="rui-progress-meter__native"
          aria-label={label}
        />
        <div
          className="rui-progress-meter__fill rui-progress-meter__fill--gradient"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export type MeterProps = CommonProps & {
  value: number;
  min?: number;
  max?: number;
  thresholds?: { value: number; color: string }[];
};

export function Meter({
  label,
  description,
  value,
  min = 0,
  max = 100,
  thresholds,
  className,
}: MeterProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100;
  const activeColor = thresholds
    ? thresholds.reduce(
        (acc, t) => (clamped >= t.value ? t.color : acc),
        thresholds[0]?.color ?? "linear-gradient(90deg, #22c55e, #0ea5e9)"
      )
    : "linear-gradient(90deg, #22c55e, #0ea5e9)";

  return (
    <div className={clsx("rui-progress-meter rui-root", className)}>
      {label ? (
        <div className="rui-progress-meter__header">
          <p className="rui-progress-meter__label rui-text-wrap">
            {label}
          </p>
          <span className="rui-progress-meter__value">{clamped}</span>
        </div>
      ) : null}
      {description ? (
        <p className="rui-progress-meter__description rui-text-wrap">{description}</p>
      ) : null}
      <div className="rui-progress-meter__track">
        <meter
          value={clamped}
          min={min}
          max={max}
          className="rui-progress-meter__native"
          aria-label={label}
        />
        <div
          className="rui-progress-meter__fill"
          style={{ width: `${percent}%`, background: activeColor }}
        />
      </div>
    </div>
  );
}

