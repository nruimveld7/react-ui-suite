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
    <div className={clsx("rui-progress-meter__u-style--5a2508227c", className)}>
      {label ? (
        <div className="rui-progress-meter__u-display-flex--60fbb77139 rui-progress-meter__u-align-items-center--3960ffc248 rui-progress-meter__u-justify-content-space-between--8ef2268efb rui-progress-meter__u-gap-0-75rem--1004c0c395">
          <p className="rui-progress-meter__label rui-progress-meter__u-font-size-0-75rem--359090c2d5 rui-progress-meter__u-font-weight-600--e83a7042bc rui-progress-meter__u-text-transform-uppercase--117ec720ea rui-progress-meter__u-letter-spacing-0-24em--a99336e23f rui-progress-meter__u-rui-text-opacity-1--30426eb75c rui-progress-meter__u-rui-text-opacity-1--6462b86910">
            {label}
          </p>
          {showValue ? (
            <span className="rui-progress-meter__u-font-size-0-75rem--359090c2d5 rui-progress-meter__u-font-weight-600--e83a7042bc rui-progress-meter__u-rui-text-opacity-1--2d6fbf48fa rui-progress-meter__u-rui-text-opacity-1--5b8efd1d78">
              {percent}%
            </span>
          ) : null}
        </div>
      ) : null}
      {description ? (
        <p className="rui-progress-meter__u-font-size-11px--d058ca6de6 rui-progress-meter__u-rui-text-opacity-1--30426eb75c rui-progress-meter__u-rui-text-opacity-1--6462b86910">{description}</p>
      ) : null}
      <div className="rui-progress-meter__u-position-relative--d89972fe17 rui-progress-meter__u-height-0-75rem--6a60c09e6a rui-progress-meter__u-width-100--6da6a3c3f7 rui-progress-meter__u-overflow-hidden--2cd02d11d1 rui-progress-meter__u-border-radius-9999px--ac204c1088 rui-progress-meter__u-border-width-1px--ca6bcd4b6f rui-progress-meter__u-rui-border-opacity-1--52f4da2ca5 rui-progress-meter__u-rui-bg-opacity-1--5e10cdb8f1 rui-progress-meter__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-progress-meter__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-progress-meter__u-rui-ring-color-rgb-241-245-249-0--a123ea4b12 rui-progress-meter__u-rui-border-opacity-1--4e12bcf58d rui-progress-meter__u-background-color-rgb-24-24-27-0---67553a7cb3 rui-progress-meter__u-rui-ring-color-rgb-39-39-42-0-7--8ad0820d1f">
        <progress
          value={clamped}
          max={max}
          className="rui-progress-meter__u-position-absolute--da4dbfbc4f rui-progress-meter__u-inset-0px--7b7df0449b rui-progress-meter__u-height-100--668b21aa54 rui-progress-meter__u-width-100--6da6a3c3f7 rui-progress-meter__u-webkit-appearance-none--eeea43674c"
          aria-label={label}
        />
        <div
          className="rui-progress-meter__u-position-absolute--da4dbfbc4f rui-progress-meter__u-top-0px--5f89f14a26 rui-progress-meter__u-left-0px--c78facc7a0 rui-progress-meter__u-border-radius-9999px--ac204c1088 rui-progress-meter__u-background-image-linear-gradient--6ae7db2cff rui-progress-meter__u-rui-gradient-from-0f172a-var-rui--7996bb55e3 rui-progress-meter__u-rui-gradient-to-rgb-51-65-85-0-v--90d849e870 rui-progress-meter__u-rui-gradient-to-0f172a-var-rui-g--68fc6aae70 rui-progress-meter__u-rui-shadow-0-0-0-1px-rgba-15-23---0550bc23a6 rui-progress-meter__u-transition-property-width--9824fc78f5"
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
    <div className={clsx("rui-progress-meter__u-style--5a2508227c", className)}>
      {label ? (
        <div className="rui-progress-meter__u-display-flex--60fbb77139 rui-progress-meter__u-align-items-center--3960ffc248 rui-progress-meter__u-justify-content-space-between--8ef2268efb rui-progress-meter__u-gap-0-75rem--1004c0c395">
          <p className="rui-progress-meter__label rui-progress-meter__u-font-size-0-75rem--359090c2d5 rui-progress-meter__u-font-weight-600--e83a7042bc rui-progress-meter__u-text-transform-uppercase--117ec720ea rui-progress-meter__u-letter-spacing-0-24em--a99336e23f rui-progress-meter__u-rui-text-opacity-1--30426eb75c rui-progress-meter__u-rui-text-opacity-1--6462b86910">
            {label}
          </p>
          <span className="rui-progress-meter__u-font-size-0-75rem--359090c2d5 rui-progress-meter__u-font-weight-600--e83a7042bc rui-progress-meter__u-rui-text-opacity-1--2d6fbf48fa rui-progress-meter__u-rui-text-opacity-1--5b8efd1d78">{clamped}</span>
        </div>
      ) : null}
      {description ? (
        <p className="rui-progress-meter__u-font-size-11px--d058ca6de6 rui-progress-meter__u-rui-text-opacity-1--30426eb75c rui-progress-meter__u-rui-text-opacity-1--6462b86910">{description}</p>
      ) : null}
      <div className="rui-progress-meter__u-position-relative--d89972fe17 rui-progress-meter__u-height-0-75rem--6a60c09e6a rui-progress-meter__u-width-100--6da6a3c3f7 rui-progress-meter__u-overflow-hidden--2cd02d11d1 rui-progress-meter__u-border-radius-9999px--ac204c1088 rui-progress-meter__u-border-width-1px--ca6bcd4b6f rui-progress-meter__u-rui-border-opacity-1--52f4da2ca5 rui-progress-meter__u-rui-bg-opacity-1--5e10cdb8f1 rui-progress-meter__u-rui-shadow-inset-0-2px-4px-0-rgb--eca5782b24 rui-progress-meter__u-rui-ring-offset-shadow-var-rui-r--3daca9af08 rui-progress-meter__u-rui-ring-color-rgb-241-245-249-0--a123ea4b12 rui-progress-meter__u-rui-border-opacity-1--4e12bcf58d rui-progress-meter__u-background-color-rgb-24-24-27-0---67553a7cb3 rui-progress-meter__u-rui-ring-color-rgb-39-39-42-0-7--8ad0820d1f">
        <meter
          value={clamped}
          min={min}
          max={max}
          className="rui-progress-meter__u-position-absolute--da4dbfbc4f rui-progress-meter__u-inset-0px--7b7df0449b rui-progress-meter__u-height-100--668b21aa54 rui-progress-meter__u-width-100--6da6a3c3f7 rui-progress-meter__u-webkit-appearance-none--eeea43674c"
          aria-label={label}
        />
        <div
          className="rui-progress-meter__u-position-absolute--da4dbfbc4f rui-progress-meter__u-top-0px--5f89f14a26 rui-progress-meter__u-left-0px--c78facc7a0 rui-progress-meter__u-border-radius-9999px--ac204c1088 rui-progress-meter__u-rui-shadow-0-0-0-1px-rgba-15-23---0550bc23a6 rui-progress-meter__u-transition-property-width--9824fc78f5"
          style={{ width: `${percent}%`, background: activeColor }}
        />
      </div>
    </div>
  );
}
