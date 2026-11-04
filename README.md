# Editnew Support Centre

Static Astro support, training, troubleshooting, and product-update site for Editnew and S.A.M.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Run a local development server. |
| `npm run build` | Build the production site into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm test` | Check chat rendering, error handling, and support-request validation. |
| `npm run test:chat` | Build and run browser checks with mocked chat, intake, and Turnstile (requires Playwright Chromium). |

## Content

Published Markdown files in `src/content/news/` automatically become support resources.

## Sam AI chat

`src/components/SupportChat.astro` is the shared, site-owned chat interface. It
uses the existing public AnythingLLM embed endpoint and retains the original
session storage key, so existing conversations can resume. Server-side origin,
request, session, and daily limits remain authoritative; the browser never sends
prompt or model overrides. No administrator credentials are shipped to the site.
Quota errors distinguish the rolling session allowance from the site-wide daily
cap. Temporary proxy limits use a manual retry countdown (honoring `Retry-After`
when available); exhausted quotas direct customers to support instead of an
immediate retry. Resetting history does not renew the server's rolling allowance.

`src/lib/supportChat.js` handles session history, streaming, retry, keyboard and
mobile behavior, and follow-up choices. Reset requires confirmation and clears
the existing server session only after a successful response.

`src/lib/supportRequest.js` handles customer-reviewed support requests separately
from AI replies. Set both `PUBLIC_SUPPORT_REQUESTS_ENABLED=true` and
`PUBLIC_SUPPORT_TURNSTILE_SITE_KEY` at build time only after the Deskwise intake
backend is ready. Without both values, the widget offers the plain support email
link. The Turnstile secret belongs only on the backend; never use a `PUBLIC_`
variable for it. Verification loads when the customer opens the request form.

Requests go to the same-origin `POST /api/support-requests` route, which hosting
must proxy to the secured Deskwise intake service. The API returns a request
reference with `status: "submitted"`; the interface says "Submitted for review."
Staff approve requests in Slack and follow up manually by email. The site never
claims a ticket was created or an email was sent. Chat excerpts are optional,
unchecked by default, and reviewed separately from steps actually attempted.
An uncertain submission is retried with its original ID and body; editing the
details starts a different submission. Contact details stay in page memory and
are not stored in localStorage.

`src/lib/chatMessages.js` renders Markdown with automatic URL/email linking.
Both streamed and restored answers are sanitized with DOMPurify. Guide names and
related-guide cards come from published content at build time; unknown URLs
remain links but are not promoted to guide cards. The widget does not fetch
model-provided URLs to discover titles. Styling lives in `src/styles/supportChat.css`.

Run `npm run build`, `npm test`, then `npm run test:chat` before publishing.
Install a browser once with `npx playwright install chromium` if necessary.
`CHAT_BROWSER_PATH` optionally selects an existing Chromium executable.
The browser suite builds with a test site key and runs on port 4323. It mocks all
chat, request, and verification calls, so it sends no real requests or tickets.
Production builds keep support requests disabled unless explicitly configured.
Publishing uses the existing Dokploy deployment from GitHub `main`.
