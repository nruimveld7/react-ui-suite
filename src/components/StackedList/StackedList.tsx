import * as React from "react";
import clsx from "clsx";
import "./StackedList.css";
export type StackedListItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
};

export type StackedListProps = React.HTMLAttributes<HTMLDivElement> & {
  items: StackedListItem[];
  dense?: boolean;
};

export function StackedList({ items, dense, className, ...rest }: StackedListProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "rui-stacked-list__u-border-radius-1-5rem--ea189a088a rui-stacked-list__u-border-width-1px--ca6bcd4b6f rui-stacked-list__u-rui-border-opacity-1--52f4da2ca5 rui-stacked-list__u-background-color-rgb-255-255-255--845918557e rui-stacked-list__u-rui-shadow-0-20px-25px-5px-rgb-0--a739868a85 rui-stacked-list__u-rui-shadow-color-rgb-226-232-240--766950d8cd rui-stacked-list__u-rui-border-opacity-1--139f099dfa rui-stacked-list__u-background-color-rgb-24-24-27-0---67553a7cb3 rui-stacked-list__u-rui-shadow-0-0-0000--2ac3c2fc68",
        className
      )}
    >
      <ul role="list" className="rui-stacked-list__padding-0 rui-stacked-list__margin-0 rui-stacked-list__u-style--fa6acbf81d rui-stacked-list__u-style--dd26ed438a rui-stacked-list__u-rui-divide-opacity-1--bce5b0aaa7">
        {items.map((item) => (
          <li
            key={item.id}
            className={clsx("rui-stacked-list__u-display-flex--60fbb77139 rui-stacked-list__u-align-items-flex-start--60541e1e26 rui-stacked-list__u-gap-1rem--0c3bc98565 rui-stacked-list__u-padding-left-1-25rem--d139dd09e3 rui-stacked-list__u-padding-top-1rem--cb11fec3bb", dense && "rui-stacked-list__u-padding-top-0-75rem--1b2d54a3fd")}
          >
            {item.icon ? (
              <div
                className="rui-stacked-list__u-margin-top-0-125rem--15e1b1f444 rui-stacked-list__u-border-radius-1rem--68f2db624d rui-stacked-list__u-rui-bg-opacity-1--34d54ab9e5 rui-stacked-list__u-padding-0-5rem--7660b45090 rui-stacked-list__u-rui-text-opacity-1--2d6fbf48fa rui-stacked-list__u-background-color-rgb-24-24-27-0---d4ff65a462 rui-stacked-list__u-rui-text-opacity-1--270353156a"
                aria-hidden="true"
              >
                {item.icon}
              </div>
            ) : null}
            <div className="rui-stacked-list__u-flex-1-1-0--36e579c0b4">
              <p className="rui-stacked-list__margin-0 rui-stacked-list__u-font-size-0-875rem--fc7473ca09 rui-stacked-list__u-font-weight-600--e83a7042bc rui-stacked-list__u-rui-text-opacity-1--f5f136c41d rui-stacked-list__u-rui-text-opacity-1--3ddc1cab99">
                {item.title}
              </p>
              {item.description ? (
                <p className="rui-stacked-list__margin-0 rui-stacked-list__u-font-size-0-875rem--fc7473ca09 rui-stacked-list__u-rui-text-opacity-1--30426eb75c rui-stacked-list__u-rui-text-opacity-1--6462b86910">{item.description}</p>
              ) : null}
            </div>
            <div className="rui-stacked-list__u-display-flex--60fbb77139 rui-stacked-list__u-flex-direction-column--8dddea0773 rui-stacked-list__u-align-items-flex-end--6f27f4f79e rui-stacked-list__u-gap-0-25rem--44ee8ba0a4 rui-stacked-list__u-text-align-right--308fc069e4">
              {item.meta ? (
                <span className="rui-stacked-list__u-font-size-0-75rem--359090c2d5 rui-stacked-list__u-text-transform-uppercase--117ec720ea rui-stacked-list__u-letter-spacing-0-025em--8baf13a3e9 rui-stacked-list__u-rui-text-opacity-1--8d44cef396 rui-stacked-list__u-rui-text-opacity-1--28db7d8770">
                  {item.meta}
                </span>
              ) : null}
              {item.action}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
