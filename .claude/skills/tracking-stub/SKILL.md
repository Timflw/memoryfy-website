---
name: tracking-stub
description: Create a new GoatCounter-tracked redirect stub page (like /insta/, /tiktok/, /qr-sticker/) for a QR code or social-media link. Use when asked to add a tracked short link or QR landing path.
---

Create a tracked redirect page at `/<name>/index.html` for `$ARGUMENTS` (path name, lowercase kebab-case, e.g. `qr-messe-2026`). If no name is given, ask for one.

1. Copy `insta/index.html` to `<name>/index.html` exactly, replacing both occurrences of `p=/insta` with `p=/<name>` (the `<noscript>` pixel and the JS `url`). Keep everything else byte-identical: `meta refresh` to `/`, `noindex`, `canonical`, the `fetch(..., { mode: 'no-cors', keepalive: true, credentials: 'omit' })` inside `try/catch` with the `new Image()` fallback, and `window.location.replace('/')`.
2. Only change the redirect target from `/` if the user explicitly asks; then update the `meta refresh` URL, the `<noscript>` link, and `location.replace` consistently.
3. The tracker must never block or delay the redirect — don't add awaits, timeouts, or extra requests.
4. Do not add the page to `sitemap.xml` (stubs are `noindex`). Do not commit.
5. Report the new path and the GoatCounter page path (`/<name>`) so it can be found in the dashboard.
