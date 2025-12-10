import type { ReactElement } from "react";

export type ComponentRegistryEntry = {
  slug: string;
  name: string;
  description: string;
  tags?: string[];
  Preview: () => ReactElement;
  sourcePath: string;
};
