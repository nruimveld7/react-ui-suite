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
  const titleId = React.useId();
  const descriptionId = React.useId();
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
        return;
      }
      if (event.key === "Tab" && modal) {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex >= 0);
        if (focusable.length === 0) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (active === first || active === dialog) {
            event.preventDefault();
            last.focus();
          }
          return;
        }
        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, modal]);

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
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      tabIndex={-1}
      className={clsx(
        "rui-dialog__card",
        modal ? "" : "rui-dialog__card--floating",
        draggable && "rui-dialog__card--draggable"
      )}
      style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
      onPointerDown={onDragPointerDown}
    >
      <div className="rui-dialog__header">
        <div>
          <h2 id={titleId} className="rui-dialog__title">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="rui-dialog__description">
              {description}
            </p>
          ) : null}
        </div>
        <Button
          onClick={onClose}
          aria-label="Close dialog"
          className="rui-dialog__close-button"
        >
          ×
        </Button>
      </div>

      <div className="rui-dialog__content">{children}</div>

      {footer ? <div className="rui-dialog__footer">{footer}</div> : null}
    </div>
  );

  return createPortal(
    modal ? (
      <div
        ref={overlayRef}
        className="rui-overlay-root rui-dialog__overlay"
        onPointerDown={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        {dialogCard}
      </div>
    ) : (
      <div className="rui-overlay-root rui-dialog__dock">
        {dialogCard}
      </div>
    ),
    document.body
  );
}

