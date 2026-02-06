import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Approved snapshot baselines: add slugs here as you approve them.
// Workflow: add slug -> run
// `npm run test:visual:update:light -- --grep "<slug>"`
// then run `npm run test:visual:update:dark -- --grep "<slug>"` -> commit the new snapshots.
const APPROVED_SLUGS = new Set<string>([
  "alert",
  "badge",
  "button",
  "card",
  "checkbox",
  "color-picker",
  "combobox",
  "datalist-input",
  "date-picker",
  "dialog",
  "disclosure",
  "input-field",
  "number-input",
  "output-chip",
  "progress-meter",
  "radio",
  "resizable-container",
  "select",
  "slider",
  "stacked-list",
  "tab-group",
  "table",
  "textarea",
  "toggle",
]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsRoot = path.resolve(__dirname, "..", "..", "src", "components");

function collectDemoFiles(dir: string, entries: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectDemoFiles(fullPath, entries);
    } else if (entry.isFile() && entry.name.endsWith(".demo.tsx")) {
      entries.push(fullPath);
    }
  }
  return entries;
}

function getDemoSlugs() {
  const files = collectDemoFiles(componentsRoot);
  return files
    .map((file) => {
      const content = fs.readFileSync(file, "utf8");
      const match = content.match(/slug:\s*["']([^"']+)["']/);
      return match?.[1] ?? null;
    })
    .filter((slug): slug is string => Boolean(slug))
    .sort((a, b) => a.localeCompare(b));
}

const demoSlugs = getDemoSlugs();

test.describe("Demo gallery snapshots", () => {
  for (const slug of demoSlugs) {
    test(slug, async ({ page }, testInfo) => {
      if (!APPROVED_SLUGS.has(slug)) {
        test.skip(true, "Snapshot baseline not approved yet.");
      }
      const theme = testInfo.project.name === "dark" ? "dark" : "light";

      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("component-gallery-theme", selectedTheme);
        const style = document.createElement("style");
        style.setAttribute("data-demo-disable-animations", "true");
        style.textContent = `*,
*::before,
*::after {
  animation: none !important;
  transition: none !important;
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
}`;
        (document.head || document.documentElement).appendChild(style);
      }, theme);

      await page.goto(`/?component=${encodeURIComponent(slug)}`, { waitUntil: "networkidle" });
      await page.locator(".demo-detailCard").waitFor({ state: "visible" });
      await page.evaluate(async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      });
      await page.addStyleTag({
        content: `
.demo-app { min-height: auto !important; }
.demo-shell { height: auto !important; min-height: auto !important; }
.demo-main { height: auto !important; min-height: auto !important; overflow: visible !important; }
`,
      });

      if (slug === "number-input" || slug === "textarea") {
        const detailWrap = page.locator(".demo-detailWrap");
        await expect(detailWrap).toHaveScreenshot("page.png");
      } else {
        const detailCard = page.locator(".demo-detailCard");
        await expect(detailCard).toHaveScreenshot("page.png");
      }

      const examples = page.locator(".demo-previewPanel .rui-demo-example");
      if (slug === "color-picker") {
        await expect(examples.nth(0)).toHaveScreenshot("example-1.png");
        const pairedGrid = page.locator(
          ".demo-previewPanel .color-picker-demo-layout"
        );
        await expect(pairedGrid).toHaveScreenshot("example-2.png");
      } else if (slug === "dialog") {
        const launchDigest = page.getByRole("button", { name: "Launch digest modal" });
        await launchDigest.click();
        const digestDialog = page.getByRole("dialog", { name: "Send weekly digest?" });
        await expect(digestDialog).toBeVisible();
        await expect(digestDialog).toHaveScreenshot("example-1.png");

        await page.keyboard.press("Escape");
        await expect(digestDialog).toBeHidden();

        const launchAssistant = page.getByRole("button", { name: "Launch assistant" });
        await launchAssistant.click();
        const assistantDialog = page.getByRole("dialog", { name: "Persistent helper" });
        await expect(assistantDialog).toBeVisible();
        await expect(assistantDialog).toHaveScreenshot("example-2.png");
      } else {
        const count = await examples.count();
        for (let i = 0; i < count; i += 1) {
          const example = examples.nth(i);
          await expect(example).toHaveScreenshot(`example-${i + 1}.png`);
        }
      }
    });
  }
});
