import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  tsconfig: "../tsconfig.json",
  external: ["react", "react-dom"],
  loader: {
    ".css": "copy",
  },
});
