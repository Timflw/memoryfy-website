---
name: preview
description: Serve the site locally for manual checks or screenshots. Use when asked to run, start, preview, or screenshot the website.
---

The site is static with no build step, but it must be served over HTTP (ES-module shader, `fetch('articles.json')`, root-absolute paths break on `file://`).

1. From the repo root run in the background: `python3 -m http.server 8000` (pick another port if 8000 is busy).
2. Open `http://localhost:8000/` — sub-pages are `http://localhost:8000/<dir>/` (e.g. `/wissen/`, `/download/`).
3. Known local limitations: the `404.html` → `/i/<TOKEN>` rewrite only works on GitHub Pages; use `http://localhost:8000/i/?t=<TOKEN>` instead. The `/download/` page redirects mobile user agents to the stores immediately.
4. Stop the server when done.
