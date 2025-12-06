import { useEffect, useState } from "react";
import type React from "react";

export function useControlledState<T>(controlled: T | undefined, defaultValue: T | undefined) {
  const [internal, setInternal] = useState<T | undefined>(defaultValue);
  const isControlled = controlled !== undefined;
  return [isControlled ? controlled : internal, isControlled ? () => {} : setInternal] as const;
}

/**
 * Click outside any of the provided element refs.
 * Accepts HTMLElement | null to avoid generic variance issues with specific element types.
 */
export function useOutsideClick(
  refs: Array<React.RefObject<HTMLElement | null>>,
  handler: () => void
) {
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current && r.current.contains(target));
      if (!inside) handler();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [refs, handler]);
}
