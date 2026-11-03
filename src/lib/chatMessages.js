import MarkdownIt from 'markdown-it';

const SUPPORT_ORIGIN = 'https://support.editnew.ca';

export function visibleAnswer(text = '') {
  return text.replace(/<think\b[^>]*>[\s\S]*?(?:<\/think\s*>|$)/gi, '')
    .replace(/<(?:t|th|thi|thin|think)\s*$/i, '').trim();
}

export function safeLink(value) {
  try {
    const url = new URL(value, SUPPORT_ORIGIN);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) && !url.username && !url.password ? url : null;
  } catch { return null; }
}

export function createMessageRenderer(guides) {
  const catalog = new Map(guides.map(guide => [new URL(guide.url, SUPPORT_ORIGIN).pathname.replace(/\/$/, ''), guide]));
  const md = new MarkdownIt({ html: false, linkify: true, breaks: true });
  md.disable('image');
  md.validateLink = value => Boolean(safeLink(value));
  const guideFor = url => url?.origin === SUPPORT_ORIGIN ? catalog.get(url.pathname.replace(/\/$/, '')) : null;
  const shortLabel = url => {
    const guide = guideFor(url);
    if (guide) return guide.title.replace(/^How to /i, '');
    if (url.protocol === 'mailto:') return url.pathname === 'info@editnew.ca' ? 'Editnew support' : url.pathname;
    const path = url.pathname === '/' ? '' : url.pathname;
    const label = url.hostname + path;
    return label.length > 65 ? label.slice(0, 62) + '…' : label;
  };
  const defaultLink = md.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const url = safeLink(token.attrGet('href'));
    if (url?.protocol !== 'mailto:') {
      token.attrSet('target', '_blank');
      token.attrSet('rel', 'noopener noreferrer');
      token.attrSet('title', 'Opens in a new tab');
    }
    return defaultLink(tokens, index, options, env, self);
  };
  return text => {
    const tokens = md.parse(visibleAnswer(text), {});
    const linkedGuides = new Map();
    for (const block of tokens) {
      const children = block.children;
      if (!children) continue;
      // Models sometimes wrap a URL or support email in backticks.
      let linkDepth = 0;
      for (let i = 0; i < children.length; i++) {
        const token = children[i];
        if (token.type === 'link_open') linkDepth++;
        if (token.type === 'link_close') linkDepth--;
        if (token.type !== 'code_inline' || linkDepth) continue;
        const value = token.content;
        const destination = /^https?:\/\/\S+$/i.test(value) ? value
          : /^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(value) ? `mailto:${value}` : null;
        if (!destination || !safeLink(destination)) continue;
        const open = new token.constructor('link_open', 'a', 1);
        open.attrSet('href', destination);
        const label = new token.constructor('text', '', 0);
        label.content = value;
        children.splice(i, 1, open, label, new token.constructor('link_close', 'a', -1));
        i += 2;
      }
      for (let i = 0; i < children.length; i++) {
        const token = children[i];
        if (token.type !== 'link_open') continue;
        const url = safeLink(token.attrGet('href'));
        if (!url) continue;
        const guide = guideFor(url);
        if (guide) linkedGuides.set(guide.url, guide);
        const label = children[i + 1];
        if (label?.type === 'text' && children[i + 2]?.type === 'link_close' &&
            (/^(?:https?:\/\/|www\.)/i.test(label.content) || label.content === url.hostname ||
             label.content === url.pathname || /^view the original .+ guide$/i.test(label.content))) {
          label.content = shortLabel(url);
        }
      }
    }
    return { html: md.renderer.render(tokens, md.options, {}), guides: [...linkedGuides.values()] };
  };
}

// The embed sends SSE over fetch; events can span any number of network chunks.
export async function readChatStream(response, onEvent) {
  if (!response.body) throw new Error('The response did not include a message.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let closed = false;
  const dispatch = block => {
    const data = block.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
    if (!data) return;
    if (data === '[DONE]') { closed = true; return; }
    const event = JSON.parse(data);
    onEvent(event);
    if (event.close === true) closed = true;
  };
  try {
    while (!closed) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let boundary;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        dispatch(buffer.slice(0, boundary.index));
        buffer = buffer.slice(boundary.index + boundary[0].length);
        if (closed) break;
      }
      if (done) {
        if (buffer.trim() && !closed) dispatch(buffer);
        break;
      }
    }
    if (!closed) throw new Error('The reply was interrupted before it finished.');
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
