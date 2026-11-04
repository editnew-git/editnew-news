import { test, expect } from '@playwright/test';

const chatEndpoint = 'https://ai.support.editnew.ca/api/embed/**';
const turnstileEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const receipt = request => ({ request_id: request.submission_id, reference: `WEB-${request.submission_id}`, status: 'submitted' });

async function setup(page, { history = [], historyFails = false, autoVerify = true } = {}) {
  await page.route(chatEndpoint, route => route.fulfill({ status: historyFails ? 503 : 200, headers: { 'access-control-allow-origin': '*' }, json: { history } }));
  const scripts = [];
  await page.route(turnstileEndpoint, route => {
    scripts.push(route.request().url());
    return route.fulfill({ contentType: 'application/javascript', body: `
      window.challengeRenders = 0;
      window.turnstile = {
        render(container, options) {
          window.challengeRenders++;
          window.challengeOptions = options;
          const token = 'test-token-' + window.challengeRenders;
          ${autoVerify ? 'queueMicrotask(() => options.callback(token));' : ''}
          return String(window.challengeRenders);
        },
        remove() {},
      };
    ` });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ask Sam AI', exact: true }).click();
  return scripts;
}

async function openForm(page) {
  await page.getByRole('button', { name: 'Request support', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Request support', exact: true })).toBeFocused();
}

async function fillRequired(page) {
  await page.getByLabel('Your name *', { exact: true }).fill('Jane Example');
  await page.getByLabel('Email *', { exact: true }).fill('Jane@Example.com');
  await page.getByLabel('Company / location *', { exact: true }).fill('Example Store');
  await page.getByLabel('What is the problem? *', { exact: true }).fill('The front display is offline.');
}

test('form lazily verifies, reviews context, and submits a pending-review receipt', async ({ page }) => {
  const scripts = await setup(page, { history: [{ role: 'user', content: 'The display is blank' }, { role: 'assistant', content: 'Try restarting the player' }] });
  expect(scripts).toHaveLength(0);
  const requests = [];
  await page.route('**/api/support-requests', route => { const data = route.request().postDataJSON(); requests.push(data); return route.fulfill({ status: 202, json: receipt(data) }); });
  await openForm(page);
  await expect(page.getByLabel('What is the problem? *', { exact: true })).toHaveValue('The display is blank');
  await expect(page.getByLabel('Include recent chat messages')).not.toBeChecked();
  await expect(page.getByLabel('Conversation excerpt', { exact: true })).toBeHidden();
  await fillRequired(page);
  await page.getByLabel('Steps you have already tried (optional)').fill('Checked the power cable.');
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-receipt]')).toContainText('Submitted for review');
  await expect(page.locator('[data-request-receipt]')).toContainText('jane@example.com');
  await expect(page.locator('[data-request-receipt]')).not.toContainText('ticket created');
  expect(requests).toHaveLength(1);
  expect(requests[0].conversation_excerpt).toBe('');
  expect(requests[0].steps_attempted).toBe('Checked the power cable.');
  expect(requests[0].turnstile_token).toBe('test-token-1');
  expect(await page.evaluate(() => window.challengeOptions.action)).toBe('support_request');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Request support', exact: true })).toBeFocused();
  expect(scripts).toHaveLength(1);
});

test('sharing recent chat is optional, editable, and labels AI suggestions', async ({ page }) => {
  await setup(page, { history: [{ role: 'user', content: 'The display is blank' }, { role: 'assistant', content: 'Restart the player' }] });
  const requests = [];
  await page.route('**/api/support-requests', route => { const data = route.request().postDataJSON(); requests.push(data); return route.fulfill({ status: 202, json: receipt(data) }); });
  await openForm(page);
  await fillRequired(page);
  await page.getByLabel('Include recent chat messages').check();
  await expect(page.getByLabel('Conversation excerpt', { exact: true })).toHaveValue(/Sam AI suggestion \(not necessarily attempted\)/);
  await page.getByLabel('Conversation excerpt', { exact: true }).fill('Customer: Screen blank. Sam AI suggestion (not necessarily attempted): Restart.');
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-receipt]')).toBeVisible();
  expect(requests[0].conversation_excerpt).toBe('Customer: Screen blank. Sam AI suggestion (not necessarily attempted): Restart.');
});

test('required fields and verification gate sending independently of chat availability', async ({ page }) => {
  await setup(page, { historyFails: true, autoVerify: false });
  const requests = [];
  await page.route('**/api/support-requests', route => { requests.push(route.request().postDataJSON()); return route.fulfill({ status: 202, json: receipt(requests.at(-1)) }); });
  await openForm(page);
  await expect(page.getByRole('button', { name: 'Submit request', exact: true })).toBeDisabled();
  await expect.poll(() => page.evaluate(() => Boolean(window.challengeOptions))).toBe(true);
  await page.evaluate(() => window.challengeOptions.callback('verified'));
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  expect(requests).toHaveLength(0);
  await fillRequired(page);
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-receipt]')).toBeVisible();
  expect(requests).toHaveLength(1);
});

test('uncertain network retries reuse the exact request including its submission ID', async ({ page }) => {
  await setup(page);
  const requests = [];
  await page.route('**/api/support-requests', route => {
    requests.push(route.request().postDataJSON());
    return requests.length === 1 ? route.abort('failed') : route.fulfill({ status: 202, json: receipt(requests.at(-1)) });
  });
  await openForm(page);
  await fillRequired(page);
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-error]')).toContainText('could not confirm receipt');
  await expect(page.getByLabel('Email *', { exact: true })).toHaveValue('Jane@Example.com');
  await page.getByRole('button', { name: 'Retry submission', exact: true }).click();
  await expect(page.locator('[data-request-receipt]')).toBeVisible();
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
});

test('editing after an uncertain result creates a new submission identity', async ({ page }) => {
  await setup(page);
  const requests = [];
  await page.route('**/api/support-requests', route => {
    requests.push(route.request().postDataJSON());
    return requests.length === 1 ? route.abort('failed') : route.fulfill({ status: 202, json: receipt(requests.at(-1)) });
  });
  await openForm(page);
  await fillRequired(page);
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-error]')).toBeVisible();
  await page.getByLabel('What is the problem? *', { exact: true }).fill('A different display needs help.');
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-receipt]')).toBeVisible();
  expect(requests[1].submission_id).not.toBe(requests[0].submission_id);
});

test('failed server verification refreshes the challenge while retaining request identity', async ({ page }) => {
  await setup(page);
  const requests = [];
  await page.route('**/api/support-requests', route => {
    requests.push(route.request().postDataJSON());
    return requests.length === 1 ? route.fulfill({ status: 403, json: { error: 'verification_failed' } }) : route.fulfill({ status: 202, json: receipt(requests.at(-1)) });
  });
  await openForm(page);
  await fillRequired(page);
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-error]')).toContainText('verify again');
  await expect.poll(() => page.evaluate(() => window.challengeRenders)).toBe(2);
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-receipt]')).toBeVisible();
  expect(requests[1].submission_id).toBe(requests[0].submission_id);
  expect(requests[1].turnstile_token).not.toBe(requests[0].turnstile_token);
});

test('rate limits retain details and disable retries for the supplied delay', async ({ page }) => {
  await setup(page);
  await page.route('**/api/support-requests', route => route.fulfill({ status: 429, headers: { 'Retry-After': '60' }, json: { error: 'limited' } }));
  await openForm(page);
  await fillRequired(page);
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.locator('[data-request-error]')).toContainText('Too many support requests');
  await expect(page.locator('[data-request-submit]')).toBeDisabled();
  await expect(page.getByLabel('What is the problem? *', { exact: true })).toHaveValue('The front display is offline.');
  await expect(page.getByRole('link', { name: 'info@editnew.ca', exact: true })).toHaveAttribute('href', 'mailto:info@editnew.ca');
});

test('expired verification refreshes without discarding the reviewed details', async ({ page }) => {
  await setup(page);
  await openForm(page);
  await fillRequired(page);
  await expect(page.getByRole('button', { name: 'Submit request', exact: true })).toBeEnabled();
  await page.evaluate(() => window.challengeOptions['expired-callback']());
  await expect.poll(() => page.evaluate(() => window.challengeRenders)).toBe(2);
  await expect(page.getByRole('button', { name: 'Submit request', exact: true })).toBeEnabled();
  await expect(page.getByLabel('What is the problem? *', { exact: true })).toHaveValue('The front display is offline.');
});

test('verification load failures keep submission disabled and provide an email alternative', async ({ page }) => {
  await setup(page);
  await page.route(turnstileEndpoint, route => route.abort('failed'));
  await openForm(page);
  await expect(page.locator('[data-request-challenge-status]')).toContainText('could not load');
  await expect(page.getByRole('button', { name: 'Submit request', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Retry verification', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'info@editnew.ca', exact: true })).toHaveAttribute('href', 'mailto:info@editnew.ca');
});

test('mobile request fields remain scrollable at short viewport heights', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  await openForm(page);
  await fillRequired(page);
  await page.locator('[data-request-panel]').evaluate(node => { node.scrollTop = 0; });
  await page.screenshot({ path: 'test-results/support-request-mobile.png' });
  await page.setViewportSize({ width: 390, height: 480 });
  await page.getByLabel('Include recent chat messages').check();
  await page.getByRole('button', { name: 'Submit request', exact: true }).scrollIntoViewIfNeeded();
  const box = await page.locator('.chat-panel').boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(481);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
