import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// Tests run against the real static export in out/, served under the same
// base path GitHub Pages uses. Run `pnpm build` first.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}/catburglarx/`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node scripts/serve.mjs",
    url: `http://localhost:${PORT}/catburglarx/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT) },
  },
});
