# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site for the Memoryfy app, served by GitHub Pages at `memoryfy.app`. **No build step, no package.json, no tests, no linter.** Every page is a hand-written `<dir>/index.html`; JS is loaded via plain `<script>` tags. The only third-party lib is vendored at `js/vendor/paper-shaders-0.0.80.js` (Apache-2.0, see the LICENSE file next to it).

**Pushing to `main` deploys to production immediately.** Never commit or push unless asked.

All page content and UI copy is **German** (`lang="de"`). Keep it that way; code comments may be German or English.

## Local preview

`python3 -m http.server 8000` from the repo root, then open `http://localhost:8000/`. `file://` does not work: `js/hero-shader.js` is an ES module, `js/article-loader.js` `fetch()`es `articles.json`, and `/download/`, `/i/`, `/auth/reset/`, `404.html` use root-absolute paths. The `404.html` → `/i/<TOKEN>` rewrite only works on GitHub Pages (custom 404 routing), not on the local server.

## Gotchas

- **Hero shader** (`js/hero-shader.js`): see the dedicated section below — the noise texture must be `await`ed before `ShaderMount`, and failures must fall back silently to the CSS gradient on `.hero`.
- **Newsletter pages** (`newsletter/confirm/`, `newsletter/unsubscribe/`) each have a `dev/` twin pointing at the dev Supabase project. Always apply the same edit to both; only the Supabase host differs, and each page's CSP `connect-src` must match its own host.
- **Tracking/redirect pages** (`/download/`, `/qr-*/`, `/insta/`, `/tiktok/`, `/yt/`): GoatCounter, cookieless, no consent banner by design. All analytics calls stay inside `try/catch` and must never delay or block the redirect. Use `location.replace`, not `href`.
- **`/i/`** renders server data with `textContent` only — never `innerHTML`.
- **`/auth/reset/`** redirects to Supabase `verify` via JS on purpose, so link scanners don't consume the one-time token.
- Utility pages (`/i/`, `/download/`, `/newsletter/*`) carry `noindex` and a strict inline CSP; marketing pages don't. Don't add external hosts without extending the CSP.
- Relative paths: pages set `window.base_path` inline (`'./'` root, `'../'` one level down) before loading `article-loader.js`; asset/CSS links are relative to the page depth (`../../css/main.css` in articles).
- `sitemap.xml` is not maintained when articles are added; treat it as stale.
- `.nojekyll` must stay — GitHub Pages would otherwise drop `.well-known/`.

## Hero shader

The animated background of the landing-page hero is a Paper Shaders **Warp** shader, mounted only on `index.html` (no other page loads the module). Design source: Paper Design file "Website Shader", artboards **A · Tiefsee** (the implemented variant), **B · Aurora**, **C · Glas**.

**Layer order in `.hero` — keep it:**
1. `.hero` background gradient (`css/main.css`) — the no-WebGL fallback, always present.
2. `.hero-shader` (`z-index: 0`, `opacity: 0` until `.is-ready`) — the WebGL canvas.
3. `.hero::before` (`z-index: 1`) — fade overlay: keeps text readable and fades the shader into `--background-dark` at the bottom so the next section joins seamlessly.
4. `.hero-content` (`z-index: 2`) — copy, store badges, mockup.

**Parameters** live in `WARP_PARAMS` in `js/hero-shader.js` (colors, `distortion`, `swirl`, `shape`, `speed`, …). Rules of thumb:
- The four colors are deliberately **much darker than the brand indigo** (`#3c3c8c` / `#37227e` instead of `#6366f1` / `#8b5cf6`). Using raw brand colors was tested: far too bright and purple, and it clashes with the gradient headline. Aim for "deep water at night", not "neon".
- Colors are hardcoded copies derived from the CSS variables in `css/main.css`; a palette change means editing both places.
- `speed` 0.5 is intentionally calm. Under `prefers-reduced-motion` speed is 0 and `initialFrame` (fixed offset) picks a pleasant static frame — keep both.
- Shader params cannot be edited through the Paper MCP; in Paper the variants only approximate the look via CSS `filter`/`opacity`/overlays. **The code is the source of truth**, not the Paper file.

**Mount contract (`ShaderMount`):**
- `getShaderNoiseTexture()` returns an `<img>`; `await img.decode()` before constructing `ShaderMount`, otherwise it throws "image … must be fully loaded". The catch swallows it, so a broken mount is silent — verify with `.hero-shader.is-ready` and the `data-paper-shader` attribute on the host (both missing ⇒ constructor threw).
- Keep `supportsWebGL2()` guard and `try/catch`; never let the shader break the page.
- Performance guards to keep: `minPixelRatio: 1`, `maxPixelCount: 2560*1440`, `powerPreference: 'low-power'`, and the `IntersectionObserver` + `visibilitychange` handlers that set speed to 0 when the hero is off-screen or the tab is hidden. If mobile performance ever becomes a problem, disable the mount below a width breakpoint rather than lowering quality for everyone.

**Vendored library:** `js/vendor/paper-shaders-0.0.80.js` is the single-file ESM bundle from `https://esm.sh/@paper-design/shaders@0.0.80/es2020/shaders.bundle.mjs` (no external imports). Do **not** switch to a CDN `<script>`: the privacy notice promises no third-party requests besides Google Fonts. To upgrade: download the same bundle for the new version, confirm it still exports `ShaderMount`, `warpFragmentShader`, `WarpPatterns`, `ShaderFitOptions`, `getShaderColorFromString`, `getShaderNoiseTexture`, and check the Warp uniform names (`u_shape`, `u_shapeScale`, `u_proportion`, `u_swirlIterations`, …) — the package ships breaking changes under `0.0.x`. Keep the LICENSE file next to it.

**Testing:** local server required (ES module). Check desktop 1440 px and mobile 390 px, no console errors, and that the hero still reads well with the shader paused (reduced motion) and absent (WebGL disabled).

## Adding a Wissen article

Use `/new-article <slug>`. Manual steps: create `wissen/<slug>/index.html` (copy an existing article), put the preview image in the same folder, add an entry to `articles.json` (newest first; `published: false` hides it in the UI but the JSON is still public).

## Style

Match the indentation of the file you're in: `index.html`, `404.html`, `download/`, `i/`, `auth/`, `newsletter/`, `js/article-loader.js` use 2 spaces; `js/main.js`, `js/hero-shader.js`, `css/main.css` and the older content pages use 4. Single quotes in JS. Tracking stubs use `var` + IIFE; app JS uses `const`/`let`.
