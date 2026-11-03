import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    launchOptions: process.env.CHAT_BROWSER_PATH ? { executablePath: process.env.CHAT_BROWSER_PATH } : {},
    screenshot: 'only-on-failure',
  },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI },
});
