import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: true,
  workers: 4,
  reporter: [["html", { open: "never" }]],
  snapshotDir: "tests/visual/snapshots",
  snapshotPathTemplate: "{snapshotDir}/{arg}{ext}",
  // Playwright's default per-pixel threshold (0.2) ignores small color
  // changes, such as one red swapped for another. 0.05 still allows for
  // antialiasing but catches color token changes.
  expect: { toHaveScreenshot: { threshold: 0.05 } },
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1280, height: 720 },
    // Disable animations for stable screenshots
    reducedMotion: "reduce",
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173/klods/",
    reuseExistingServer: !process.env.CI,
  },
});
