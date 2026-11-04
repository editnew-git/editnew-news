import { visibleAnswer } from './chatMessages.js';

export const requestLimits = Object.freeze({ name: 120, email: 254, company: 200, problem: 4000, phone: 50, product: 120, reported_sign: 80, steps_attempted: 2000, conversation_excerpt: 4000 });
const requiredFields = ['name', 'email', 'company', 'problem'];
const maxBodyBytes = 16 * 1024;

export function requestDetails(values, includeChat = false) {
  const details = {};
  for (const [field, limit] of Object.entries(requestLimits)) {
    const value = String(values[field] || '').trim();
    if (value.length > limit) throw new Error('Please shorten the details to fit the field limits.');
    if (requiredFields.includes(field) && !value) throw new Error('Please complete all required fields.');
    details[field] = field === 'conversation_excerpt' && !includeChat ? '' : value;
  }
  details.email = details.email.toLowerCase();
  return { ...details, website: String(values.website || '') };
}

export function conversationExcerpt(messages) {
  return messages.filter(message => message.content && ['user', 'assistant'].includes(message.role)).slice(-6)
    .map(message => `${message.role === 'user' ? 'Customer' : 'Sam AI suggestion (not necessarily attempted)'}: ${visibleAnswer(message.content).slice(0, 650)}`)
    .join('\n\n').slice(0, requestLimits.conversation_excerpt);
}

export function requestFailure(status, retryAfter = null) {
  const seconds = /^\d+$/.test(retryAfter || '') ? Number(retryAfter)
    : Math.max(0, Math.ceil((Date.parse(retryAfter || '') - Date.now()) / 1000));
  if (status === 429) return { message: 'Too many support requests have been submitted. Please wait before trying again, or email info@editnew.ca.', retryAfterSeconds: Number.isFinite(seconds) ? Math.min(seconds, 86400) : 60 };
  if (status === 403) return { message: 'Verification could not be completed. Please verify again before submitting.', resetChallenge: true };
  if (status === 409) return { message: 'This submission could not be matched to its earlier attempt. Please email info@editnew.ca so we can check it without creating a duplicate.', conflict: true };
  if (status === 400 || status === 413 || status === 422) return { message: 'Please check your contact information and shorten the request if needed, then try again.', resetChallenge: true };
  return { message: 'Support requests are temporarily unavailable. Your details are still here. Retry this submission, or email info@editnew.ca.', uncertain: true };
}

let turnstileScript;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScript) return turnstileScript;
  turnstileScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const finish = error => {
      clearTimeout(timeout);
      if (error || !window.turnstile) { script.remove(); reject(new Error('Verification could not load.')); }
      else resolve(window.turnstile);
    };
    const timeout = setTimeout(() => finish(true), 15000);
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => finish(false);
    script.onerror = () => finish(true);
    document.head.append(script);
  }).catch(error => { turnstileScript = null; throw error; });
  return turnstileScript;
}

export function initializeSupportRequest(root, getMessages) {
  const find = name => root.querySelector(`[data-${name}]`);
  const panel = find('request-panel');
  if (!panel?.dataset.sitekey) return { isOpen: () => false, close() {} };
  const form = find('request-form'), fields = find('request-fields'), button = find('request-submit');
  const errorBox = find('request-error'), receipt = find('request-receipt'), includeChat = find('request-include-chat');
  const challengeStatus = find('request-challenge-status'), retryChallenge = find('retry-challenge');
  const field = name => form.elements.namedItem(name);
  let widget, token = '', attempt, sending = false, complete = false, prefilling = true, conflict = false;
  let retryAt = 0, retryTimer, challengeLoading = false;
  const updateButton = () => {
    const delay = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
    button.disabled = sending || complete || conflict || Boolean(delay) || (!token && !attempt?.uncertain);
    button.textContent = sending ? 'Submitting…' : delay ? `Try again in ${delay}s` : attempt?.uncertain ? 'Retry submission' : 'Submit request';
  };
  const showError = message => { errorBox.textContent = message; errorBox.hidden = false; };
  const clearError = () => { errorBox.textContent = ''; errorBox.hidden = true; };
  const retryDelay = seconds => {
    clearInterval(retryTimer);
    retryAt = Date.now() + seconds * 1000;
    if (seconds > 0) retryTimer = setInterval(() => {
      updateButton();
      if (Date.now() >= retryAt) clearInterval(retryTimer);
    }, 1000);
  };
  const removeChallenge = () => {
    if (widget !== undefined) window.turnstile?.remove(widget);
    widget = undefined;
    token = '';
    updateButton();
  };
  const startChallenge = async () => {
    if (complete || panel.hidden || challengeLoading || widget !== undefined) return;
    challengeLoading = true;
    challengeStatus.textContent = 'Loading verification…';
    retryChallenge.hidden = true;
    try {
      const turnstile = await loadTurnstile();
      if (panel.hidden || complete) return;
      widget = turnstile.render(find('request-challenge'), {
        sitekey: panel.dataset.sitekey, action: 'support_request', theme: 'light', size: 'flexible', 'response-field': false,
        callback: value => { token = value; challengeStatus.textContent = 'Verification complete.'; retryChallenge.hidden = true; updateButton(); },
        'expired-callback': () => {
          token = ''; challengeStatus.textContent = 'Verification expired. Please verify again.'; retryChallenge.hidden = false; updateButton();
          if (!panel.hidden) resetChallenge();
        },
        'error-callback': () => {
          token = ''; challengeStatus.textContent = 'Verification is unavailable. Retry verification or use the email link below.'; retryChallenge.hidden = false; updateButton();
        },
      });
    } catch {
      challengeStatus.textContent = 'Verification could not load. Retry verification or use the email link below.';
      retryChallenge.hidden = false;
    } finally { challengeLoading = false; updateButton(); }
  };
  const resetChallenge = () => { removeChallenge(); startChallenge(); };
  retryChallenge.addEventListener('click', resetChallenge);
  const close = () => {
    panel.hidden = true;
    root.removeAttribute('data-request-open');
    root.querySelector('.chat-reading-area').hidden = false;
    find('form').hidden = false;
    removeChallenge();
    find('support').focus({ preventScroll: true });
  };
  find('close-request').addEventListener('click', close);
  find('support').addEventListener('click', () => {
    if (prefilling && !field('problem').value) {
      field('problem').value = (getMessages().find(message => message.role === 'user')?.content || '').slice(0, requestLimits.problem);
      prefilling = false;
    }
    root.querySelector('.chat-reading-area').hidden = true;
    find('form').hidden = true;
    panel.hidden = false;
    root.setAttribute('data-request-open', '');
    panel.querySelector('h2').focus({ preventScroll: true });
    startChallenge();
  });
  includeChat.addEventListener('change', () => {
    find('request-chat-review').hidden = !includeChat.checked;
    if (includeChat.checked && !field('conversation_excerpt').value) field('conversation_excerpt').value = conversationExcerpt(getMessages());
  });
  form.addEventListener('input', event => {
    if (!event.target.matches('input, textarea')) return;
    event.target.setCustomValidity('');
    attempt = undefined;
    conflict = false;
    updateButton();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || complete || conflict || Date.now() < retryAt) return;
    clearError();
    for (const name of requiredFields) field(name).setCustomValidity(field(name).value.trim() ? '' : 'Please fill out this field.');
    if (!form.reportValidity()) return;
    let details;
    try { details = requestDetails(Object.fromEntries(new FormData(form)), includeChat.checked); }
    catch (error) { showError(error.message); return; }
    const fingerprint = JSON.stringify(details);
    if (!attempt || attempt.fingerprint !== fingerprint) attempt = { fingerprint, submissionId: crypto.randomUUID(), uncertain: false };
    if (!attempt.uncertain) {
      if (!token) { showError('Please complete verification before submitting.'); return; }
      attempt.body = JSON.stringify({ submission_id: attempt.submissionId, ...details, turnstile_token: token });
    }
    if (new TextEncoder().encode(attempt.body).length > maxBodyBytes) { showError('Please shorten your problem description or conversation excerpt before submitting.'); return; }
    sending = true;
    fields.disabled = true;
    updateButton();
    try {
      const response = await fetch('/api/support-requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: attempt.body, credentials: 'same-origin', signal: AbortSignal.timeout(20000),
      });
      if (response.status !== 202) {
        const failure = requestFailure(response.status, response.headers.get('Retry-After'));
        attempt.uncertain = Boolean(failure.uncertain);
        conflict = Boolean(failure.conflict);
        showError(failure.message);
        if (failure.retryAfterSeconds) retryDelay(failure.retryAfterSeconds);
        if (failure.resetChallenge || response.status === 429) resetChallenge();
        return;
      }
      const result = await response.json();
      if (result.status !== 'submitted' || typeof result.request_id !== 'string' || !/^WEB-[a-zA-Z0-9-]{1,80}$/.test(result.reference)) throw new Error('Invalid receipt');
      complete = true;
      fields.hidden = true;
      receipt.replaceChildren();
      const title = document.createElement('strong'); title.textContent = 'Submitted for review';
      const reference = document.createElement('p'); reference.textContent = `Your reference: ${result.reference}`;
      const followup = document.createElement('p'); followup.textContent = `Our support team will review your request and contact you at ${details.email}.`;
      receipt.append(title, reference, followup);
      receipt.hidden = false;
      receipt.focus({ preventScroll: true });
      removeChallenge();
    } catch {
      attempt.uncertain = true;
      showError('We could not confirm receipt. Your details are still here. Retry this submission to check it without sending another request.');
    } finally {
      sending = false;
      fields.disabled = false;
      updateButton();
    }
  });
  return { isOpen: () => !panel.hidden, close };
}
