import { test, expect } from '@playwright/test';

const endpoint = 'https://ai.support.editnew.ca/api/embed/86c54a7e-8c04-48f8-b17c-9a4fe247ef24';
const guide = 'https://support.editnew.ca/news/2026-07-16-how-to-reset-or-change-your-password-on-runsam/';
const answer = `Open https://runsam.com.\n\n1. Choose **Forgot Password**.\n2. Enter your email address.\n3. Check your inbox.\n\nGuide: ${guide}\n\nIf you need help, email \`info@editnew.ca\`.`;
const headers = { 'access-control-allow-origin': '*' };
const sse = text => `data: ${JSON.stringify({ type: 'textResponseChunk', textResponse: text, close: false })}\n\ndata: {"close":true}\n\n`;

async function mockAPI(page, options = {}) {
  const requests = [];
  await page.route(`${endpoint}/**`, async route => {
    const request = route.request();
    if (request.method() === 'POST') {
      requests.push(request.postDataJSON());
      if (options.quota) return route.fulfill({ status: 429, headers, json: options.quota });
      if (options.failFirst && requests.length === 1) return route.fulfill({ status: 429,
        headers: { ...headers, 'retry-after': '2', 'access-control-expose-headers': 'Retry-After' }, body: 'Too Many Requests' });
      return route.fulfill({ headers, contentType: 'text/event-stream', body: sse(options.answer || answer) });
    }
    if (request.method() === 'DELETE') {
      options.history = [];
      return route.fulfill({ headers, json: { success: true } });
    }
    return route.fulfill({ headers, json: { history: options.history || [] } });
  });
  return requests;
}

async function open(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ask Sam AI', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reset password', exact: true })).toBeEnabled();
}

test('named links, readable steps, guide cards, followups and email review', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const requests = await mockAPI(page);
  await open(page);
  await page.screenshot({ path: 'test-results/chat-desktop-welcome.png' });
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.locator('[data-status]')).toHaveText('Reply ready.');
  await expect(page.locator('.chat-answer ol li')).toHaveCount(3);
  await expect(page.locator('.chat-answer a[href="https://runsam.com"]')).toHaveText('runsam.com');
  await expect(page.locator(`.chat-answer a[href="${guide}"]`)).toHaveCount(0);
  await expect(page.locator('.chat-guide')).toHaveCount(1);
  await expect(page.locator('.chat-guide')).toHaveAttribute('target', '_blank');
  await expect(page.locator('.chat-answer a[href="mailto:info@editnew.ca"]')).toHaveText('Editnew support');
  await page.screenshot({ path: 'test-results/chat-desktop-answer.png' });
  await page.getByRole('button', { name: 'Explain this step', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Your support question' })).toHaveValue('Please explain step ');
  await page.getByRole('button', { name: 'Email support ↗', exact: true }).click();
  const draft = page.getByRole('textbox', { name: 'Support email draft' });
  await expect(draft).toHaveValue(/How do I reset my RunSam password/);
  await draft.fill('My screen is offline. I already checked the power.');
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveAttribute('href', /body=My%20screen%20is%20offline/);
  await page.keyboard.press('Escape');
  await expect(draft).toBeHidden();
  await page.getByRole('button', { name: 'That worked', exact: true }).click();
  await expect(page.locator('[data-notice]')).toBeVisible();
  expect(requests).toHaveLength(1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Ask Sam AI', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test('a retry preserves the question and session without duplicating the user bubble', async ({ page }) => {
  const requests = await mockAPI(page, { failFirst: true });
  await open(page);
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Messages are arriving too quickly');
  await expect(page.locator('[data-retry]')).toBeDisabled();
  await expect(page.locator('.chat-user-text')).toHaveCount(1);
  await page.getByRole('button', { name: 'Retry reply' }).click();
  await expect(page.locator('[data-status]')).toHaveText('Reply ready.');
  await expect(page.locator('.chat-user-text')).toHaveCount(1);
  await expect(page.locator('.chat-answer')).toHaveCount(1);
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
});

for (const [name, quota, expected] of [
  ['session', { error: 'Your quota for this chat has been reached. Try again later or contact the site owner.' }, 'browser session'],
  ['site-wide', { error: 'Rate limit exceeded', errorMsg: 'The quota for this chat has been reached. Try again later or contact the site owner.' }, 'site-wide'],
]) {
  test(`${name} quota explains the rolling limit without an ineffective retry button`, async ({ page }) => {
    const requests = await mockAPI(page, { quota });
    await open(page);
    await page.getByRole('button', { name: 'Reset password', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText(expected);
    await expect(page.getByRole('alert')).toContainText('24 hours');
    await expect(page.locator('[data-retry]')).toBeHidden();
    await expect(page.locator('.chat-user-text')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Email support ↗', exact: true })).toBeEnabled();
    expect(requests).toHaveLength(1);
  });
}

test('existing widget sessions restore and reset only after confirmation', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('allm_86c54a7e-8c04-48f8-b17c-9a4fe247ef24_session_id', 'existing-session'));
  await mockAPI(page, { history: [{ role: 'user', content: 'My earlier question' }, { role: 'assistant', content: answer }] });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ask Sam AI', exact: true }).click();
  await expect(page.locator('.chat-user-text')).toHaveText('My earlier question');
  await expect(page.locator('.chat-guide')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset chat', exact: true }).click();
  await page.getByRole('button', { name: 'Keep chatting' }).click();
  await expect(page.locator('.chat-user-text')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset chat', exact: true }).click();
  await page.getByRole('button', { name: 'Clear conversation' }).click();
  await expect(page.getByRole('button', { name: 'Reset password', exact: true })).toBeEnabled();
  await expect(page.locator('.chat-user-text')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('allm_86c54a7e-8c04-48f8-b17c-9a4fe247ef24_session_id'))).toBe('existing-session');
});

test('mobile layout, device choices, guide-page access and a shorter viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests = await mockAPI(page);
  await open(page);
  await page.getByRole('button', { name: 'Connect a device', exact: true }).click();
  expect(requests).toHaveLength(0);
  await page.getByRole('button', { name: 'Android hotspot', exact: true }).click();
  await expect(page.locator('[data-status]')).toHaveText('Reply ready.');
  expect(requests[0].message).toContain('Android hotspot');
  await page.screenshot({ path: 'test-results/chat-mobile-answer.png' });
  for (const height of [844, 480]) {
    await page.setViewportSize({ width: 390, height });
    await expect.poll(async () => {
      const box = await page.locator('.chat-panel').boundingBox();
      return box.y >= 0 && box.y + box.height <= height + 1;
    }).toBe(true);
    const input = await page.getByRole('textbox', { name: 'Your support question' }).boundingBox();
    expect(input.y + input.height).toBeLessThan(height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  }
  await page.goto(new URL(guide).pathname);
  await expect(page.getByRole('dialog', { name: 'Sam AI support' })).toBeVisible();
});

test('hostile answer markup cannot execute or introduce unsafe links', async ({ page }) => {
  await mockAPI(page, { answer: '<img src=x onerror="window.chatPwned=true">\n\n[Bad link](javascript:alert%281%29)\n\n' + answer });
  await open(page);
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.locator('[data-status]')).toHaveText('Reply ready.');
  await expect(page.locator('.chat-answer img, .chat-answer script, .chat-answer [onerror], .chat-answer a[href^="javascript:"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.chatPwned)).toBeUndefined();
});

test('streaming respects a reader who scrolls up and offers jump to latest', async ({ page }) => {
  await mockAPI(page);
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      if (String(args[0]).endsWith('/stream-chat')) {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({ start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ textResponse: 'Earlier steps.\n\n'.repeat(35) })}\n\n`));
          window.finishChatStream = () => {
            controller.enqueue(encoder.encode('data: {"textResponse":"Final step.","close":true}\n\n'));
            controller.close();
          };
        } });
        return Promise.resolve(new Response(stream, { headers: { 'content-type': 'text/event-stream' } }));
      }
      return originalFetch(...args);
    };
  });
  await open(page);
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.locator('.chat-answer')).toContainText('Earlier steps.');
  await page.locator('[data-scroll]').evaluate(node => { node.scrollTop = 0; node.dispatchEvent(new Event('scroll')); });
  await expect(page.getByRole('button', { name: 'Jump to latest' })).toBeVisible();
  await page.evaluate(() => window.finishChatStream());
  await expect(page.locator('[data-status]')).toHaveText('Reply ready.');
  expect(await page.locator('[data-scroll]').evaluate(node => node.scrollTop)).toBe(0);
  await page.getByRole('button', { name: 'Jump to latest' }).click();
  await expect(page.getByRole('button', { name: 'Jump to latest' })).toBeHidden();
});
