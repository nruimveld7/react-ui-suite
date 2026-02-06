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
        "rui-stacked-list rui-root rui-surface",
        className
      )}
    >
      <ul role="list" className="rui-stacked-list__list">
        {items.map((item) => (
          <li
            key={item.id}
            className={clsx("rui-stacked-list__item", dense && "rui-stacked-list__item--dense")}
          >
            {item.icon ? (
              <div
                className="rui-stacked-list__icon"
                aria-hidden="true"
              >
                {item.icon}
              </div>
            ) : null}
            <div className="rui-stacked-list__content">
              <p className="rui-stacked-list__title rui-text-wrap">
                {item.title}
              </p>
              {item.description ? (
                <p className="rui-stacked-list__description rui-text-wrap">
                  {item.description}
                </p>
              ) : null}
            </div>
            <div className="rui-stacked-list__meta">
              {item.meta ? (
                <span className="rui-stacked-list__meta-text rui-text-wrap">
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


