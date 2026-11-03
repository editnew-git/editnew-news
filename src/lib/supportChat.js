import DOMPurify from 'dompurify';
import { createMessageRenderer, readChatStream, visibleAnswer } from './chatMessages.js';
import { chatResponseError, classifyChatError } from './chatErrors.js';

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value); } catch { /* Chat still works without storage. */ } },
};
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export function initializeSupportChat(root) {
  if (root.dataset.ready) return;
  root.dataset.ready = 'true';
  const find = name => root.querySelector(`[data-${name}]`);
  const panel = root.querySelector('.chat-panel');
  const readingArea = root.querySelector('.chat-reading-area');
  const launcher = find('launcher'), input = find('input'), scroll = find('scroll');
  const messagesNode = find('messages'), followups = find('followups'), status = find('status');
  const errorBox = find('error'), draft = find('draft'), form = find('form');
  const embedId = root.dataset.embedId;
  const endpoint = `https://ai.support.editnew.ca/api/embed/${embedId}`;
  const sessionKey = `allm_${embedId}_session_id`;
  const openKey = '___anythingllm-chat-widget-open___';
  const sessionId = storage.get(sessionKey) || crypto.randomUUID();
  storage.set(sessionKey, sessionId);
  const render = createMessageRenderer(JSON.parse(root.dataset.guides));
  let messages = [], busy = false, historyReady = false, loadingHistory = false;
  let followTail = true, retryAction = null, lastFailed = null, frame = 0;
  let cooldownUntil = 0, cooldownTimer = null, retryLabel = 'Retry reply';
  const cooldownRemaining = () => Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));

  const announce = text => { status.textContent = text; };
  const updateInput = () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 104)}px`;
    find('count').hidden = input.value.length < 1200;
    find('count').textContent = `${input.value.length}/1500`;
    find('send').disabled = busy || Boolean(cooldownRemaining()) || !historyReady || !input.value.trim();
  };
  const setBusy = value => {
    busy = value;
    find('reset').disabled = value;
    const remaining = cooldownRemaining();
    root.querySelectorAll('[data-question], [data-choices], [data-resolved], [data-explain]').forEach(button => { button.disabled = value || Boolean(remaining) || !historyReady; });
    find('retry').disabled = value || Boolean(remaining);
    find('retry').textContent = remaining ? `Retry in ${remaining}s` : retryLabel;
    updateInput();
  };
  const hideError = () => { errorBox.hidden = true; retryAction = null; };
  const showError = (text, retry, label = 'Retry reply', delay = 0) => {
    find('error-text').textContent = text;
    errorBox.hidden = false;
    retryAction = retry;
    find('retry').hidden = !retry;
    retryLabel = label;
    if (delay > 0) {
      cooldownUntil = Date.now() + delay * 1000;
      clearInterval(cooldownTimer);
      cooldownTimer = setInterval(() => {
        setBusy(busy);
        if (!cooldownRemaining()) {
          clearInterval(cooldownTimer);
          if (retryAction) announce('You can retry now.');
        }
      }, 250);
    }
    setBusy(busy);
    announce('Something went wrong. Your conversation is still here.');
  };
  const atBottom = () => scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 50;
  const keepPosition = () => {
    if (followTail) scroll.scrollTop = scroll.scrollHeight;
    find('jump').hidden = atBottom();
  };
  const goToLatest = () => {
    followTail = true;
    scroll.scrollTop = scroll.scrollHeight;
    find('jump').hidden = true;
  };
  scroll.addEventListener('scroll', () => { followTail = atBottom(); find('jump').hidden = followTail; }, { passive: true });
  find('jump').addEventListener('click', goToLatest);

  const paintAnswer = (message, complete = false) => {
    const result = render(message.content);
    message.body.innerHTML = DOMPurify.sanitize(result.html, { USE_PROFILES: { html: true }, ADD_ATTR: ['target', 'rel'] });
    if (!visibleAnswer(message.content)) message.body.textContent = complete ? 'No answer was returned.' : 'Sam AI is thinking…';
    if (complete) {
      message.cards.replaceChildren();
      for (const guide of result.guides) {
        const card = element('a', 'chat-guide');
        card.href = guide.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.append(element('small', '', 'Related guide · Editnew'), element('strong', '', guide.title), element('span', '', 'Open guide ↗'));
        card.setAttribute('aria-label', `${guide.title} — open guide in a new tab`);
        message.cards.append(card);
      }
      // A standalone source line is represented by its card. Keep links that
      // are part of an instruction or explanation in the answer itself.
      for (const paragraph of message.body.querySelectorAll(':scope > p')) {
        const links = paragraph.querySelectorAll('a');
        if (links.length !== 1) continue;
        const link = links[0];
        const isGuide = result.guides.some(guide => new URL(guide.url).origin === new URL(link.href).origin &&
          new URL(guide.url).pathname.replace(/\/$/, '') === new URL(link.href).pathname.replace(/\/$/, ''));
        const surroundingText = paragraph.textContent.replace(link.textContent, '').trim();
        if (isGuide && /^(?:(?:(?:full |original |related )?guide|source|read more)\s*:?)?[.\s]*$/i.test(surroundingText)) paragraph.remove();
      }
    }
    keepPosition();
  };
  const addMessage = (role, content) => {
    find('welcome').hidden = true;
    const node = element('article', 'chat-message');
    node.dataset.role = role;
    node.append(element('span', 'chat-message-label', role === 'user' ? 'You' : 'Sam AI'));
    const body = element(role === 'user' ? 'p' : 'div', role === 'user' ? 'chat-user-text' : 'chat-answer');
    const cards = element('div', 'chat-guide-list');
    node.append(body, cards);
    messagesNode.append(node);
    const message = { role, content, node, body, cards };
    messages.push(message);
    if (role === 'user') body.textContent = content;
    else paintAnswer(message, true);
    return message;
  };
  const loadHistory = async () => {
    if (loadingHistory || historyReady) return;
    loadingHistory = true;
    setBusy(true);
    announce('Loading your conversation…');
    hideError();
    try {
      const response = await fetch(`${endpoint}/${encodeURIComponent(sessionId)}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!Array.isArray(data.history)) throw new Error();
      messages = [];
      messagesNode.replaceChildren();
      for (const row of data.history) {
        if (typeof row.content !== 'string' || !['user', 'assistant', 'system'].includes(row.role)) continue;
        addMessage(row.role === 'user' ? 'user' : 'assistant', row.content);
      }
      followups.hidden = messages.at(-1)?.role !== 'assistant';
      historyReady = true;
      announce('Enter to send · Shift + Enter for a new line');
      goToLatest();
    } catch {
      showError('Your earlier conversation could not load. Try again, or email support below.', loadHistory, 'Retry loading');
    } finally { loadingHistory = false; setBusy(false); }
  };
  const setOpen = (open, focus = true) => {
    panel.hidden = !open;
    launcher.hidden = open;
    launcher.setAttribute('aria-expanded', String(open));
    storage.set(openKey, open ? '1' : null);
    if (open) {
      updateViewport();
      loadHistory();
      if (focus) (matchMedia('(max-width: 540px)').matches ? find('close') : input).focus({ preventScroll: true });
    } else if (focus) launcher.focus({ preventScroll: true });
  };
  const send = async (text, retry = false) => {
    text = text.trim();
    if (!text || text.length > 1500 || busy || cooldownRemaining() || !historyReady) return;
    if (!retry) {
      input.value = '';
      addMessage('user', text);
    } else if (lastFailed) {
      lastFailed.node.remove();
      messages = messages.filter(message => message !== lastFailed);
    }
    lastFailed = null;
    followups.hidden = true;
    find('notice').hidden = true;
    hideError();
    setBusy(true);
    announce('Sam AI is replying…');
    const answer = addMessage('assistant', '');
    paintAnswer(answer);
    goToLatest();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    try {
      // Match the existing widget's request format; no client prompt/model overrides.
      const response = await fetch(`${endpoint}/stream-chat`, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8', Accept: 'text/event-stream' },
        body: JSON.stringify({ message: text, sessionId }), signal: controller.signal,
      });
      if (!response.ok) throw await chatResponseError(response);
      await readChatStream(response, event => {
        if (event.error || event.type === 'abort') throw classifyChatError(200, event);
        if (typeof event.textResponse === 'string') {
          if (event.type === 'textResponse') answer.content = event.textResponse;
          else answer.content += event.textResponse;
          if (!frame) frame = requestAnimationFrame(() => { frame = 0; paintAnswer(answer); });
        }
      });
      if (!visibleAnswer(answer.content)) throw new Error('Sam AI returned an empty reply. Please try again.');
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      paintAnswer(answer, true);
      followups.hidden = false;
      announce('Reply ready.');
      keepPosition();
    } catch (error) {
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      paintAnswer(answer, true);
      if (!visibleAnswer(answer.content)) answer.body.textContent = 'Your question is saved above.';
      else answer.body.append(element('p', 'chat-incomplete', 'This reply was interrupted. Please retry for the complete answer.'));
      lastFailed = answer;
      showError(error.name === 'AbortError' ? 'The reply took too long. Please try again.'
        : error instanceof TypeError ? 'The connection was lost. Check your connection and retry.'
        : error instanceof SyntaxError ? 'Sam AI could not finish this reply. Please try again.' : error.message,
        error.retryable === false ? null : () => send(text, true), 'Retry reply', error.retryAfterSeconds || 0);
    } finally { clearTimeout(timeout); setBusy(false); }
  };
  form.addEventListener('submit', event => { event.preventDefault(); send(input.value); });
  input.addEventListener('input', updateInput);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send(input.value); }
  });
  find('retry').addEventListener('click', () => retryAction?.());
  launcher.addEventListener('click', () => setOpen(true));
  find('close').addEventListener('click', () => setOpen(false));
  root.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const question = event.target.closest('[data-question]');
    if (question && !question.disabled) send(question.dataset.question);
  });

  const choices = {
    connect: { title: 'What are you connecting with?', options: [
      ['Wi-Fi network', 'How do I connect S.A.M. to a Wi-Fi network?'],
      ['Android hotspot', 'How do I connect my S.A.M. Stick using an Android hotspot?'],
      ['iPhone hotspot', 'How do I connect my S.A.M. Stick using an iPhone hotspot?'],
      ['Not sure', 'I need help connecting a device. Please ask me one question to identify my device and connection before giving steps.'],
    ] },
    display: { title: 'What are you seeing?', options: [
      ['Blank / No Signal', 'My S.A.M. display is blank or says No Signal. What should I check?'],
      ['Device is offline', 'My S.A.M. device is offline. Please ask me about my connection before suggesting steps.'],
      ['Content looks wrong', 'The content on my S.A.M. display looks wrong. Please help me identify the issue before suggesting changes.'],
      ['Can’t sign in', 'I cannot sign in to RunSam. Can you help me identify why?'],
    ] },
  };
  root.querySelectorAll('[data-choices]').forEach(button => button.addEventListener('click', () => {
    const choice = choices[button.dataset.choices];
    const box = find('choices-panel');
    box.replaceChildren(element('p', '', choice.title));
    for (const [label, question] of choice.options) {
      const option = element('button', '', label);
      option.dataset.question = question;
      box.append(option);
    }
    box.hidden = false;
    box.querySelector('button').focus({ preventScroll: true });
    goToLatest();
  }));
  find('resolved').addEventListener('click', () => {
    find('notice').textContent = 'Glad that helped. You can ask another question any time.';
    find('notice').hidden = false;
    followups.hidden = true;
    announce('Glad that helped.');
    goToLatest();
    input.focus({ preventScroll: true });
  });
  find('explain').addEventListener('click', () => {
    input.value = 'Please explain step ';
    updateInput();
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
    announce('Add the step number you would like explained.');
  });

  const updateEmailLink = () => {
    find('email-draft').href = `mailto:info@editnew.ca?subject=${encodeURIComponent('Help with S.A.M. / RunSam')}&body=${encodeURIComponent(find('draft-text').value)}`;
  };
  const closeDraft = () => {
    draft.hidden = true;
    readingArea.hidden = false;
    form.hidden = false;
    find('support').focus({ preventScroll: true });
    updateInput();
  };
  find('support').addEventListener('click', () => {
    if (!draft.hidden) { find('draft-text').focus(); return; }
    const firstQuestion = messages.find(message => message.role === 'user')?.content || '[Describe your issue]';
    const recent = messages.slice(-6).map(message => `${message.role === 'user' ? 'Me' : 'Sam AI'}: ${visibleAnswer(message.content).slice(0, 650)}`).join('\n\n');
    find('draft-text').value = `Hello Editnew support,\n\nI need help with: ${firstQuestion.slice(0, 700)}\n\nDevice / screen name and location: [add details]\nSteps I have already tried: [add details]\n\n${recent ? `Recent conversation (Sam AI suggestions may not have been tried):\n${recent}\n\n` : ''}Thank you.`.slice(0, 5000);
    updateEmailLink();
    readingArea.hidden = true;
    form.hidden = true;
    draft.hidden = false;
    find('draft-text').focus({ preventScroll: true });
  });
  find('draft-text').addEventListener('input', updateEmailLink);
  find('close-draft').addEventListener('click', closeDraft);
  find('copy-draft').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(find('draft-text').value);
      find('copy-draft').textContent = 'Copied';
    } catch {
      find('draft-text').focus();
      find('draft-text').select();
      find('copy-draft').textContent = 'Select text to copy';
    }
    setTimeout(() => { find('copy-draft').textContent = 'Copy draft'; }, 2500);
  });

  const closeReset = () => { find('reset-confirm').hidden = true; find('reset').focus({ preventScroll: true }); };
  find('reset').addEventListener('click', () => {
    find('reset-confirm').hidden = false;
    find('cancel-reset').focus({ preventScroll: true });
  });
  find('cancel-reset').addEventListener('click', closeReset);
  find('confirm-reset').addEventListener('click', async () => {
    if (busy) return;
    closeReset();
    setBusy(true);
    hideError();
    try {
      const response = await fetch(`${endpoint}/${encodeURIComponent(sessionId)}`, { method: 'DELETE', signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error();
      messages = [];
      messagesNode.replaceChildren();
      lastFailed = null;
      historyReady = true;
      input.value = '';
      find('welcome').hidden = false;
      find('choices-panel').hidden = true;
      find('notice').hidden = true;
      followups.hidden = true;
      if (!draft.hidden) closeDraft();
      announce('Conversation cleared.');
      input.focus({ preventScroll: true });
    } catch { showError('The conversation could not be cleared. Please try Reset chat again.', null); }
    finally { setBusy(false); }
  });
  panel.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (!find('reset-confirm').hidden) closeReset();
    else if (!draft.hidden) closeDraft();
    else setOpen(false);
  });
  function updateViewport() {
    const viewport = window.visualViewport;
    root.style.setProperty('--chat-viewport-height', `${viewport?.height || innerHeight}px`);
    root.style.setProperty('--chat-keyboard-offset', `${Math.max(0, innerHeight - (viewport?.height || innerHeight) - (viewport?.offsetTop || 0))}px`);
    if (!panel.hidden) keepPosition();
  }
  window.visualViewport?.addEventListener('resize', updateViewport);
  window.visualViewport?.addEventListener('scroll', updateViewport);
  window.addEventListener('resize', updateViewport);
  launcher.hidden = false;
  if (storage.get(openKey)) setOpen(true, false);
}
