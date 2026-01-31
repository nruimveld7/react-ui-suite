import * as React from "react";
import { createPortal } from "react-dom";
import Button from "../Button/Button";
import clsx from "clsx";
import "./Dialog.css";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  modal?: boolean;
  draggable?: boolean;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  modal = true,
  draggable = true,
}: DialogProps) {
  const overlayRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const dialogRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const dragState = React.useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    width: number;
    height: number;
  } | null>(null);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  React.useEffect(() => {
    if (!open || modal) return;
    const handlePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (dialogRef.current && !dialogRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [open, modal, onClose]);

  React.useEffect(() => {
    if (!open) {
      setDragOffset({ x: 0, y: 0 });
    }
  }, [open]);

  React.useEffect(() => {
    return () => {
      dragState.current = null;
    };
  }, []);

  const clampOffset = React.useCallback(
    (x: number, y: number, size: { width: number; height: number }) => {
      if (!modal) return { x, y };
      const maxX = Math.max(0, (window.innerWidth - size.width) / 2);
      const maxY = Math.max(0, (window.innerHeight - size.height) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    [modal]
  );

  const isInteractiveTarget = (node: HTMLElement | null) => {
    if (!node) return false;
    if (node.closest("[data-dialog-draggable-stop]")) return true;
    const tag = node.tagName.toLowerCase();
    const interactive = ["button", "input", "select", "textarea", "option", "a", "label"];
    if (interactive.includes(tag)) return true;
    if (node.getAttribute("role") === "button" || node.getAttribute("role") === "link") return true;
    if (node.isContentEditable) return true;
    return false;
  };

  const onDragPointerDown = (event: React.PointerEvent) => {
    if (!draggable) return;
    if (isInteractiveTarget(event.target as HTMLElement)) return;
    event.preventDefault();
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: dragOffset.x,
      originY: dragOffset.y,
      width: rect.width,
      height: rect.height,
    };

    const handleMove = (e: PointerEvent) => {
      const current = dragState.current;
      if (!current) return;
      const deltaX = e.clientX - current.startX;
      const deltaY = e.clientY - current.startY;
      const next = {
        x: current.originX + deltaX,
        y: current.originY + deltaY,
      };
      const clamped = clampOffset(next.x, next.y, { width: current.width, height: current.height });
      setDragOffset(clamped);
    };

    const handleUp = () => {
      dragState.current = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
  };

  if (!open) return null;

  const dialogCard = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal={modal || undefined}
      tabIndex={-1}
      aria-label={title}
      className={clsx(
        "rui-dialog__u-width-min-640px-92vw--10f32115bb rui-dialog__u-border-radius-1-5rem--ea189a088a rui-dialog__u-border-width-1px--ca6bcd4b6f rui-dialog__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-dialog__u-background-color-rgb-255-255-255--f5ebd4d019 rui-dialog__u-padding-1-5rem--0478c89a15 rui-dialog__u-box-shadow-0-0-0000-0-0-0000-0-2--14e46609fd rui-dialog__u-box-shadow-0-0-0-0px-fff-0-0-0-c--3daca9af08 rui-dialog__u-style--01cab00bd2 rui-dialog__u-border-color-rgb-63-63-70-0-6--2e65f80c00 rui-dialog__u-background-color-rgb-24-24-27-0---3e2ed48bf6 rui-dialog__u-style--c70bec9a20",
        modal ? "" : "rui-dialog__u-pointer-events-auto--7d5d4c29be",
        draggable && "rui-dialog__u-cursor-grab--8d08385288 rui-dialog__u-cursor-grabbing--d9bff91ef7"
      )}
      style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
      onPointerDown={onDragPointerDown}
    >
      <div className="rui-dialog__u-display-flex--60fbb77139 rui-dialog__u-align-items-flex-start--60541e1e26 rui-dialog__u-justify-content-space-between--8ef2268efb rui-dialog__u-gap-0-75rem--1004c0c395">
        <div>
          <p className="rui-dialog__margin-0 rui-dialog__u-font-size-0-75rem--359090c2d5 rui-dialog__u-font-weight-600--e83a7042bc rui-dialog__u-text-transform-uppercase--117ec720ea rui-dialog__u-letter-spacing-0-3em--bf7342eeb7 rui-dialog__u-color-rgb-100-116-139-1--30426eb75c rui-dialog__u-color-rgb-161-161-170-1--6462b86910">
            Dialog
          </p>
          <h2 className="rui-dialog__margin-0 rui-dialog__u-font-size-1-25rem--d5c9b0001e rui-dialog__u-font-weight-600--e83a7042bc rui-dialog__u-color-rgb-15-23-42-1--f5f136c41d rui-dialog__u-color-rgb-244-244-245-1--3ddc1cab99">{title}</h2>
          {description ? (
            <p className="rui-dialog__margin-0 rui-dialog__u-font-size-0-875rem--fc7473ca09 rui-dialog__u-color-rgb-71-85-105-1--2d6fbf48fa rui-dialog__u-color-rgb-161-161-170-1--6462b86910">{description}</p>
          ) : null}
        </div>
        <Button
          onClick={onClose}
          aria-label="Close dialog"
          className="rui-dialog__u-padding-left-0px-important--31c1314b1b rui-dialog__u-padding-top-0px-important--d0dd461082 rui-dialog__u-font-size-x-large--fc7473ca09 rui-dialog__u-font-weight-500--e83a7042bc rui-dialog__close_button"
        >
          ×
        </Button>
      </div>

      <div className="rui-dialog__margin-0 rui-dialog__u-style--6ed543e2fb rui-dialog__u-font-size-0-875rem--fc7473ca09 rui-dialog__u-color-rgb-51-65-85-1--bcbca7a5be rui-dialog__u-color-rgb-212-212-216-1--5b8efd1d78">{children}</div>

      {footer ? <div className="rui-dialog__margin-0 rui-dialog__u-display-flex--60fbb77139 rui-dialog__u-flex-wrap-wrap--1eb5c6df38 rui-dialog__u-justify-content-flex-end--77c08e015d rui-dialog__u-gap-0-5rem--77a2a20e90">{footer}</div> : null}
    </div>
  );

  return createPortal(
    modal ? (
      <div
        ref={overlayRef}
        className="rui-overlay-root rui-dialog__u-position-fixed--7bc555991d rui-dialog__u-inset-0px--7b7df0449b rui-dialog__u-z-index-50--181b286668 rui-dialog__u-display-flex--60fbb77139 rui-dialog__u-align-items-center--3960ffc248 rui-dialog__u-justify-content-center--86843cf1e2 rui-dialog__u-background-color-rgb-9-9-11-0-6--df3b4d71de rui-dialog__u-backdrop-filter-blur-4px--1ca6dd1e47"
        onMouseDown={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        {dialogCard}
      </div>
    ) : (
      <div className="rui-overlay-root rui-dialog__u-pointer-events-none--a4326536b8 rui-dialog__u-position-fixed--7bc555991d rui-dialog__u-bottom-1-5rem--4c049197a3 rui-dialog__u-right-1-5rem--82d7e544e4 rui-dialog__u-z-index-50--181b286668 rui-dialog__u-display-flex--60fbb77139 rui-dialog__u-justify-content-flex-end--77c08e015d">
        {dialogCard}
      </div>
    ),
    document.body
  );
}

