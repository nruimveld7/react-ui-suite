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
        "rui-root",
        subtle && "rui-disclosure--subtle",
        className
      )}
    >
      <summary
        id={summaryId}
        className="rui-disclosure__summary"
      >
        <span className="rui-disclosure__header">
          <span className="rui-disclosure__title rui-text-wrap">
            {title}
          </span>
        </span>
        <span
          className="rui-disclosure__caret"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>

      <div className="rui-disclosure__content rui-text-wrap">
        {children}
      </div>
    </details>
  );
});


