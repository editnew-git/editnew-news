import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requestDetails, conversationExcerpt, requestFailure } from '../src/lib/supportRequest.js';

const values = { name: ' Jane ', email: 'Jane@Example.com ', company: ' Example store ', problem: ' Offline ', conversation_excerpt: 'Private conversation' };

test('request data excludes conversation by default and never carries unknown authority fields', () => {
  const result = requestDetails({ ...values, actor_id: 'USTAFF', priority: 'Urgent' });
  assert.equal(result.name, 'Jane');
  assert.equal(result.email, 'jane@example.com');
  assert.equal(result.conversation_excerpt, '');
  assert.equal(result.actor_id, undefined);
  assert.equal(result.priority, undefined);
  assert.equal(requestDetails(values, true).conversation_excerpt, 'Private conversation');
});

test('blank required fields and oversized values are rejected before submission', () => {
  assert.throws(() => requestDetails({ ...values, company: '   ' }), /required/);
  assert.throws(() => requestDetails({ ...values, problem: 'x'.repeat(4001) }), /shorten/);
});

test('review excerpt distinguishes advice from attempted steps and excludes other roles', () => {
  const excerpt = conversationExcerpt([
    { role: 'system', content: 'Internal instructions' },
    { role: 'user', content: 'My screen is offline' },
    { role: 'assistant', content: 'Restart the device' },
  ]);
  assert.match(excerpt, /Customer: My screen is offline/);
  assert.match(excerpt, /Sam AI suggestion \(not necessarily attempted\): Restart the device/);
  assert.doesNotMatch(excerpt, /Internal instructions/);
  assert.ok(conversationExcerpt(Array.from({ length: 20 }, () => ({ role: 'user', content: 'x'.repeat(1000) }))).length <= 4000);
});

test('uncertain responses preserve retry identity while known challenge failures reset verification', () => {
  assert.equal(requestFailure(503).uncertain, true);
  assert.equal(requestFailure(403).resetChallenge, true);
  assert.equal(requestFailure(409).conflict, true);
  assert.equal(requestFailure(429, '120').retryAfterSeconds, 120);
  assert.equal(requestFailure(429).retryAfterSeconds, 60);
  assert.equal(requestFailure(413).resetChallenge, true);
});
