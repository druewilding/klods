import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/a11y",
  fullyParallel: true,
  timeout: 120_000,
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
