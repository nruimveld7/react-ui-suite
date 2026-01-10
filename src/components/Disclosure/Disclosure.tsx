import * as React from "react";
import clsx from "clsx";
import "./Disclosure.css";

export type DisclosureProps = React.DetailsHTMLAttributes<HTMLDetailsElement> & {
  title: React.ReactNode;
  subtle?: boolean;
  defaultOpen?: boolean;
};

export const Disclosure = React.forwardRef<HTMLDetailsElement, DisclosureProps>(function Disclosure(
  { title, children, className, subtle, ...rest },
  ref
) {
  const summaryId = React.useId();

  return (
    <details
      {...rest}
      ref={ref}
      className={clsx(
        "rui-disclosure",
        subtle && "rui-disclosure--subtle",
        "rui-disclosure__u-display-flex--64292b1c2b rui-disclosure__u-border-radius-1rem--68f2db624d rui-disclosure__u-border-width-1px--ca6bcd4b6f rui-disclosure__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-disclosure__u-background-color-rgb-255-255-255--6c21de570d rui-disclosure__u-padding-0-75rem--eb6e8b881a rui-disclosure__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-disclosure__u-transition-property-color-backgr--56bf8ae82a rui-disclosure__u-border-color-rgb-63-63-70-0-6--2e65f80c00 rui-disclosure__u-background-color-rgb-24-24-27-0---5cd2915a74",
        subtle &&
          "rui-disclosure__u-border-color-transparent--521fa0c7c4 rui-disclosure__u-background-color-rgb-255-255-255--d2fa6cb50a rui-disclosure__u-box-shadow-0-0-0000-0-0-0000-0-0--ad47d17e60 rui-disclosure__u-background-color-rgb-24-24-27-0---aef378d8de",
        className
      )}
    >
      <summary
        id={summaryId}
        className="rui-disclosure__summary rui-disclosure__u-display-flex--60fbb77139 rui-disclosure__u-cursor-pointer--3451683673 rui-disclosure__u-list-style-type-none--b20d79b23d rui-disclosure__u-align-items-center--3960ffc248 rui-disclosure__u-justify-content-space-between--8ef2268efb rui-disclosure__u-gap-0-75rem--1004c0c395 rui-disclosure__u-text-align-left--2eba0d65d0 rui-disclosure__u-outline-2px-solid-transparent--f10f771f87 rui-disclosure__u-box-shadow-0-0-0-0px-fff-0-0-0-c--793c80e97f rui-disclosure__u-style--53929537d6"
      >
        <span className="rui-disclosure__u-display-flex--60fbb77139 rui-disclosure__u-flex-1-1-0--36e579c0b4 rui-disclosure__u-align-items-center--3960ffc248 rui-disclosure__u-gap-0-5rem--77a2a20e90">
          <span className="rui-disclosure__title rui-disclosure__u-border-radius-0-5rem--5f22e64f22 rui-disclosure__u-background-color-rgb-241-245-249--34d54ab9e5 rui-disclosure__u-padding-left-0-5rem--d5eab218aa rui-disclosure__u-padding-top-0-25rem--660d2effb8 rui-disclosure__u-font-size-11px--d058ca6de6 rui-disclosure__u-font-weight-600--e83a7042bc rui-disclosure__u-text-transform-uppercase--117ec720ea rui-disclosure__u-letter-spacing-0-2em--2da1a7016e rui-disclosure__u-color-rgb-100-116-139-1--30426eb75c rui-disclosure__u-box-shadow-0-0-0000-0-0-0000-ins--eca5782b24 rui-disclosure__u-background-color-rgb-39-39-42-0---b37a7836e7 rui-disclosure__u-color-rgb-212-212-216-1--5b8efd1d78">
            {title}
          </span>
        </span>
        <span
          className="rui-disclosure__caret rui-disclosure__u-color-rgb-148-163-184-1--8d44cef396 rui-disclosure__u-transition-property-transform--eadef23823 rui-disclosure__u-transition-duration-200ms--625a4c3fbe rui-disclosure__u-transform-translate-0-0-rotate-1--29aa8254b9 rui-disclosure__u-color-rgb-113-113-122-1--28db7d8770"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>

      <div className="rui-disclosure__content rui-disclosure__u-margin-top-0-75rem--eccd13ef4f rui-disclosure__u-style--6f7e013d64 rui-disclosure__u-font-size-0-875rem--fc7473ca09 rui-disclosure__u-color-rgb-71-85-105-1--2d6fbf48fa rui-disclosure__u-color-rgb-212-212-216-1--5b8efd1d78">
        {children}
      </div>
    </details>
  );
});

