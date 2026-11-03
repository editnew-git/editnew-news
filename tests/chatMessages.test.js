import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMessageRenderer, readChatStream, visibleAnswer } from '../src/lib/chatMessages.js';

const guide = { title: 'How to Reset Your Password on runsam.com', url: 'https://support.editnew.ca/news/reset-password/' };
const render = createMessageRenderer([guide]);

test('bare URLs, named links, and code-wrapped email become usable links', () => {
  const result = render(`1. Visit https://runsam.com.\n2. Choose **Forgot Password**.\n\nGuide: ${guide.url}\n\n[Read this guide](${guide.url}#reset)\n\nEmail \`info@editnew.ca\`.`);
  assert.match(result.html, /<ol>/);
  assert.match(result.html, /<strong>Forgot Password<\/strong>/);
  assert.match(result.html, /href="https:\/\/runsam.com"[^>]*>runsam.com<\/a>\./);
  assert.match(result.html, /href="mailto:info@editnew.ca">Editnew support/);
  assert.match(result.html, />Reset Your Password on runsam.com<\/a>/);
  assert.match(result.html, />Read this guide<\/a>/);
  assert.deepEqual(result.guides, [guide]);
});

test('cards only represent real published guide destinations', () => {
  const result = render(`${guide.url}?from=chat\n\nhttps://support.editnew.ca/news/made-up/\n\nhttps://support.editnew.ca.evil.test/news/reset-password/`);
  assert.deepEqual(result.guides, [guide]);
  assert.match(result.html, /reset-password\/\?from=chat/);
  assert.match(result.html, /support.editnew.ca.evil.test/);
});

test('unsafe markup and protocols never produce executable elements', () => {
  const result = render('<img src=x onerror=alert(1)>\n\n[bad](javascript:alert%281%29)\n\n[bad](data:text/html,hello)\n\n[bad](https://user:password@example.com)\n\n![tracker](https://example.com/pixel.png)');
  assert.doesNotMatch(result.html, /<img|<script|href="(?:javascript|data):|href="https:\/\/user:/);
});

test('code inside a named link does not create nested links', () => {
  assert.equal((render('[`https://runsam.com`](https://runsam.com)').html.match(/<a /g) || []).length, 1);
});

test('hidden thought blocks remain hidden across partial streaming tokens', () => {
  assert.equal(visibleAnswer('<think>private reasoning'), '');
  assert.equal(visibleAnswer('<think>private reasoning</think>Answer'), 'Answer');
  assert.equal(visibleAnswer('Answer\n<thi'), 'Answer');
});

const stream = chunks => new Response(new ReadableStream({
  start(controller) { for (const chunk of chunks) controller.enqueue(chunk); controller.close(); },
}));

test('SSE handles split CRLF boundaries and multibyte text without dropping the final event', async () => {
  const bytes = new TextEncoder().encode(': keepalive\r\n\r\ndata: {"type":"textResponseChunk","textResponse":"Hi 👋"}\r\n\r\ndata: {"textResponse":" done","close":true}\r\n\r\n');
  const events = [];
  await readChatStream(stream([...bytes].map(byte => Uint8Array.of(byte))), event => events.push(event));
  assert.equal(events.map(event => event.textResponse).join(''), 'Hi 👋 done');
  assert.equal(events.length, 2);
});

test('SSE recognizes DONE and an EOF final event without a trailing newline', async () => {
  for (const ending of ['data: [DONE]', 'data: {"close":true}']) {
    const bytes = new TextEncoder().encode(`data: {"textResponse":"Hi"}\n\n${ending}`);
    const events = [];
    await readChatStream(stream([bytes]), event => events.push(event));
    assert.equal(events[0].textResponse, 'Hi');
  }
});

test('an interrupted or malformed stream fails instead of presenting a complete reply', async () => {
  await assert.rejects(readChatStream(stream([new TextEncoder().encode('data: {"textResponse":"Partial"}\n\n')]), () => {}), /interrupted/);
  await assert.rejects(readChatStream(stream([new TextEncoder().encode('data: invalid\n\n')]), () => {}), SyntaxError);
});
