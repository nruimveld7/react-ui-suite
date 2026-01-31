import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "demo/tests",
  snapshotDir: "demo/tests/__screenshots__",
  snapshotPathTemplate: "{snapshotDir}/{projectName}/{testName}/{arg}{ext}",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "UTC",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build --workspace demo && npm run preview --workspace demo -- --port 4173 --strictPort",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "light",
      use: { colorScheme: "light" },
    },
    {
      name: "dark",
      use: { colorScheme: "dark" },
    },
  ],
});
