import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:4323',
    launchOptions: process.env.CHAT_BROWSER_PATH ? { executablePath: process.env.CHAT_BROWSER_PATH } : {},
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4323',
    url: 'http://127.0.0.1:4323', reuseExistingServer: false, timeout: 60000,
    env: { PUBLIC_SUPPORT_REQUESTS_ENABLED: 'true', PUBLIC_SUPPORT_TURNSTILE_SITE_KEY: '1x00000000000000000000AA' },
  },
});
