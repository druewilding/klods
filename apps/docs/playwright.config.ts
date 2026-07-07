import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: true,
  workers: 4,
  snapshotDir: "tests/visual/snapshots",
  snapshotPathTemplate: "{snapshotDir}/{arg}{ext}",
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
