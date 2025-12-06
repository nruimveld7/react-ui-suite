import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
