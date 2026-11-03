import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyChatError, chatResponseError } from '../src/lib/chatErrors.js';

test('session quota is identified from the real AnythingLLM response', () => {
  const error = classifyChatError(429, { error: 'Your quota for this chat has been reached. Try again later or contact the site owner.' });
  assert.equal(error.kind, 'session_quota');
  assert.equal(error.retryable, false);
  assert.match(error.message, /browser session.*24 hours/);
  assert.doesNotMatch(error.message, /moment|seconds|busy/);
});

test('the generic error field does not hide a site-wide quota in errorMsg', () => {
  const error = classifyChatError(429, { error: 'Rate limit exceeded', errorMsg: 'The quota for this chat has been reached. Try again later or contact the site owner.' });
  assert.equal(error.kind, 'daily_quota');
  assert.equal(error.retryable, false);
  assert.match(error.message, /site-wide/);
});

test('plain proxy rate and concurrency errors support a timed manual retry', async () => {
  const rate = await chatResponseError(new Response('Too Many Requests\n', { status: 429, headers: { 'Retry-After': '6' } }));
  assert.equal(rate.kind, 'rate');
  assert.equal(rate.retryAfterSeconds, 6);
  assert.equal(rate.retryable, true);
  assert.equal(classifyChatError(429, 'Too many concurrent requests').kind, 'concurrency');
  assert.equal(classifyChatError(429, {}).retryAfterSeconds, 10);
});

test('Retry-After dates and malformed values are handled predictably', () => {
  const now = Date.parse('2026-11-03T16:00:00Z');
  assert.equal(classifyChatError(429, '', 'Tue, 03 Nov 2026 16:00:15 GMT', now).retryAfterSeconds, 15);
  assert.equal(classifyChatError(429, '', 'invalid').retryAfterSeconds, 10);
});

test('streamed quota errors receive the same explanation', () => {
  const error = classifyChatError(200, { type: 'abort', error: true, errorMsg: 'Your quota for this chat has been reached.' });
  assert.equal(error.kind, 'session_quota');
  assert.equal(error.retryable, false);
});
