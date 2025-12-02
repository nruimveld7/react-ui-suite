import { useMemo } from "react";
import type { ComponentRegistryEntry } from "@demo-components/component-registry";

type RegistryModule = {
  default: ComponentRegistryEntry;
};

const moduleGlob = import.meta.glob<RegistryModule>("@demo-components/**/index.tsx", {
  eager: true
});

export function useComponentRegistry(): ComponentRegistryEntry[] {
  return useMemo(() => {
    return Object.values(moduleGlob)
      .map((mod) => mod.default)
      .filter((entry): entry is ComponentRegistryEntry => Boolean(entry))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);
}
