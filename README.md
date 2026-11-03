# Editnew Support Centre

Static Astro support, training, troubleshooting, and product-update site for Editnew and S.A.M.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Run a local development server. |
| `npm run build` | Build the production site into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm test` | Check link rendering and streamed reply parsing. |
| `npm run test:chat` | Run browser checks against the production build (requires Playwright Chromium). |

## Content

Published Markdown files in `src/content/news/` automatically become support resources.

## Sam AI chat

`src/components/SupportChat.astro` is the shared, site-owned chat interface. It
uses the existing public AnythingLLM embed endpoint and retains the original
session storage key, so existing conversations can resume. Server-side origin,
request, session, and daily limits remain authoritative; the browser never sends
prompt or model overrides. No administrator credentials are shipped to the site.

`src/lib/supportChat.js` handles session history, streaming, retry, keyboard and
mobile behavior, follow-up choices, and editable support-email drafts. Reset
requires confirmation and clears the existing server session only after a
successful response. Email support prepares a local draft for the customer to
review and send in their own email app.

`src/lib/chatMessages.js` renders Markdown with automatic URL/email linking.
Both streamed and restored answers are sanitized with DOMPurify. Guide names and
related-guide cards come from published content at build time; unknown URLs
remain links but are not promoted to guide cards. The widget does not fetch
model-provided URLs to discover titles. Styling lives in `src/styles/supportChat.css`.

Run `npm run build`, `npm test`, then `npm run test:chat` before publishing.
Install a browser once with `npx playwright install chromium` if necessary.
`CHAT_BROWSER_PATH` optionally selects an existing Chromium executable.
The browser suite mocks chat requests, so it consumes no live reply quota.
Publishing uses the existing Dokploy deployment from GitHub `main`.
