import path from "node:path"
import { defineConfig, devices } from "@playwright/test"

const CI = !!process.env.CI
const UI_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000"
export const API_URL = process.env.API_URL ?? "http://localhost:4000"
const API_DIR = path.resolve(process.env.E2E_API_DIR ?? "../pennypal-api")
// Set E2E_START_SERVERS=false to run against servers you started yourself (or a deployed environment).
const startServers = process.env.E2E_START_SERVERS !== "false"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: CI ? [["github"], ["html", { open: "never" }], ["list"]] : [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: UI_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",
  },
  // PennyPal is mobile-first: phone projects run every spec tagged @mobile.
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "pixel", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
    { name: "iphone", use: { ...devices["iPhone 14"], browserName: "chromium" }, grep: /@mobile/ },
  ],
  webServer: startServers
    ? [
        {
          name: "api",
          command: "npx tsx src/index.ts",
          cwd: API_DIR,
          url: `${API_URL}/health`,
          reuseExistingServer: !CI,
          timeout: 60_000,
          env: { PORT: new URL(API_URL).port || "4000", CORS_ORIGIN: UI_URL, MONTHLY_JOB: "off" },
        },
        {
          name: "ui",
          // A production build avoids flaky first-hit compiles of `next dev`. Override with E2E_UI_COMMAND.
          command: process.env.E2E_UI_COMMAND ?? "npm run build && npm run start",
          url: UI_URL,
          reuseExistingServer: !CI,
          timeout: 240_000,
          env: { API_URL },
        },
      ]
    : undefined,
})
