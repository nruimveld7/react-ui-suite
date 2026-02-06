import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import "./Button.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode; // label or JSX inside the button
};

export default function Button({
  children,
  onClick,
  disabled = false,
  className,
  type = "button",
  style,
  ...rest
}: ButtonProps) {
  const hasCustomBackground = typeof className === "string" && /bg-/.test(className);
  const hasCustomText = typeof className === "string" && /text-/.test(className);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...rest}
      className={clsx(
        "rui-button",
        "rui-root",
        !hasCustomBackground && "rui-button--bg-default",
        !hasCustomText && "rui-button--text-default",
        className
      )}
    >
      {children}
    </button>
  );
}




