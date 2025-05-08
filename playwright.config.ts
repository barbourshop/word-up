import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    // Desktop
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    // Tablet Landscape
    {
      name: 'chromium-tablet-landscape',
      use: { ...devices['iPad (gen 7) landscape'] },
    },
    {
      name: 'firefox-tablet-landscape',
      use: { ...devices['iPad (gen 7) landscape'] },
    },
    {
      name: 'webkit-tablet-landscape',
      use: { ...devices['iPad (gen 7) landscape'] },
    },
    // Tablet Portrait
    {
      name: 'chromium-tablet-portrait',
      use: { ...devices['iPad (gen 7)'] },
    },
    {
      name: 'firefox-tablet-portrait',
      use: { ...devices['iPad (gen 7)'] },
    },
    {
      name: 'webkit-tablet-portrait',
      use: { ...devices['iPad (gen 7)'] },
    },
    // Mobile Portrait
    {
      name: 'chromium-mobile-portrait',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'firefox-mobile-portrait',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'webkit-mobile-portrait',
      use: { ...devices['iPhone 12'] },
    },
    // Mobile Landscape
    {
      name: 'chromium-mobile-landscape',
      use: { ...devices['iPhone 12 landscape'] },
    },
    {
      name: 'firefox-mobile-landscape',
      use: { ...devices['iPhone 12 landscape'] },
    },
    {
      name: 'webkit-mobile-landscape',
      use: { ...devices['iPhone 12 landscape'] },
    },
  ],
}); 