export function classifyChatError(status, payload = {}, retryAfter = null, now = Date.now()) {
  const detail = typeof payload === 'string' ? payload
    : [payload?.error, payload?.errorMsg, payload?.message].filter(value => typeof value === 'string').join(' ');
  const failure = (message, kind, retryable = true, retryAfterSeconds = 0) =>
    Object.assign(new Error(message), { kind, retryable, retryAfterSeconds });

  // AnythingLLM returns HTTP 429 for both rolling quotas. Inspect its body
  // before treating 429 as a short-lived proxy rate/concurrency limit.
  if (/your quota for this chat has been reached/i.test(detail)) {
    return failure('This browser session has reached its reply limit for the last 24 hours. Replies become available as earlier messages pass 24 hours. You can email support below.', 'session_quota', false);
  }
  if (/the quota for this chat has been reached/i.test(detail)) {
    return failure('Sam AI has reached the site-wide reply limit for the last 24 hours. Please email support or return later.', 'daily_quota', false);
  }
  if (status === 429) {
    const seconds = retryAfter === null ? NaN : /^\d+(?:\.\d+)?$/.test(retryAfter)
      ? Number(retryAfter) : (Date.parse(retryAfter) - now) / 1000;
    const delay = Number.isFinite(seconds) ? Math.max(1, Math.min(86400, Math.ceil(seconds))) : 10;
    const concurrent = /concurrent|in.?flight/i.test(detail);
    return failure(`${concurrent ? 'Sam AI is answering other requests.' : 'Messages are arriving too quickly.'} Please wait ${delay} ${delay === 1 ? 'second' : 'seconds'}, then retry.`, concurrent ? 'concurrency' : 'rate', true, delay);
  }
  if (status === 401 || status === 403 || status === 503) {
    return failure('The chat is unavailable right now. Please email support or try again later.', 'unavailable');
  }
  return failure('Sam AI could not finish this reply. Please try again.', 'reply');
}

export async function chatResponseError(response) {
  const text = await response.text();
  let payload = text;
  try { payload = JSON.parse(text); } catch { /* Proxy limits return plain text. */ }
  return classifyChatError(response.status, payload, response.headers.get('retry-after'));
}
