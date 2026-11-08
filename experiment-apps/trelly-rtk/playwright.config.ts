import { existsSync } from "node:fs"

import { defineConfig } from "@playwright/test"

// E2E_LOGIN / E2E_PASSWORD for the live smoke test
if (existsSync(".env.e2e.local")) process.loadEnvFile(".env.e2e.local")

const PORT = 3100

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // the system Google Chrome: no need to download Playwright's own browsers
    channel: "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    // UI tests against the in-memory fake API (no API Hub quota used)
    { name: "app", testIgnore: /live\.spec\.ts/ },
    // Smoke test against the real API: E2E_LIVE=1 pnpm test:e2e --project=live
    { name: "live", testMatch: /live\.spec\.ts/ },
  ],
  webServer: {
    command: `pnpm exec vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
})
