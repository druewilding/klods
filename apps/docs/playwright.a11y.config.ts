import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/a11y",
  fullyParallel: true,
  reporter: [["html", { open: "never", outputFolder: "playwright-report-a11y" }]],
  timeout: 600_000,
  workers: 4,
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173/klods/",
    reuseExistingServer: !process.env.CI,
  },
});
