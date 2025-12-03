import * as React from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import Button from "../Button/Button";

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

export function Dialog({ open, onClose, title, description, children, footer, modal = true, draggable = true }: DialogProps) {
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
      className={twMerge(
        "w-[min(640px,92vw)] rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl ring-1 ring-white/80 dark:border-zinc-700/60 dark:bg-zinc-900/95 dark:ring-zinc-800/80",
        modal ? "" : "pointer-events-auto",
        draggable && "cursor-grab active:cursor-grabbing"
      )}
      style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
      onPointerDown={onDragPointerDown}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-400">
            Dialog
          </p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{description}</p>
          ) : null}
        </div>
        <Button
          onClick={onClose}
          aria-label="Close dialog"
          className="size-8 !px-0 !py-0 text-sm font-semibold"
        >
          X
        </Button>
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-zinc-300">{children}</div>

      {footer ? <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div> : null}
    </div>
  );

      return createPortal(
        modal ? (
          <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === overlayRef.current) onClose();
            }}
          >
            {dialogCard}
      </div>
    ) : (
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex justify-end">{dialogCard}</div>
    ),
    document.body
  );
}
