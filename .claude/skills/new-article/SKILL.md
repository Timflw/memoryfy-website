---
name: new-article
description: Scaffold a new Wissen (blog) article — page folder, preview image slot, and articles.json entry. Use when asked to add, create or draft a new article under /wissen/.
---

Create a new Wissen article with slug `$ARGUMENTS` (kebab-case, German, e.g. `urlaubsvideo-tipps-fuer-gruppen`). If no slug is given, derive one from the requested title and confirm it.

Steps:

1. **Page**: copy `wissen/beste-apps-fuer-urlaubsvideos/index.html` to `wissen/<slug>/index.html`. Keep the `<head>`, header/nav, footer and `<script src="../../js/main.js">` verbatim. Replace:
   - `<title>` → `<Titel> | Memoryfy Wissen`, `meta description`, the JSON-LD `Article` block (`name`, `headline`, `description`, `image`, `datePublished`, `dateModified` = today's ISO date).
   - The breadcrumb, `h1.article-h1`, and `.meta` line (`<Kategorie> · ca. N Min. Lesezeit · Veröffentlicht: DD.MM.YYYY · Aktualisiert: DD.MM.YYYY`).
   - The `.toc` list and the `<section id="…">` blocks with `h2.article-h2` — one `<section>` per TOC entry, ids matching the TOC anchors.
   - Write the body in German. Remove article-specific inline `<style>`/tables from the template unless needed.
   - Indentation: 4 spaces (matches the existing article pages).
2. **Image**: the preview image lives in the article folder, e.g. `wissen/<slug>/vorschau-<slug>.webp`. If the user hasn't supplied one, leave the filename in place and tell them which file to add.
3. **`articles.json`**: prepend an entry (newest first):
   ```json
   {
       "title": "…",
       "description": "…",
       "author": "Memoryfy Team",
       "date": "YYYY-MM-DD",
       "lastEdited": "YYYY-MM-DD",
       "url": "wissen/<slug>/",
       "image": "wissen/<slug>/vorschau-<slug>.webp",
       "category": "Ratgeber | Anleitung | …",
       "published": true
   }
   ```
   Paths are relative to the repo root without a leading slash (they are prefixed with `window.base_path` at runtime). Set `published: false` for a draft — it hides the card but the JSON stays publicly readable.
4. Do not touch `sitemap.xml` (not maintained). Do not commit.
5. Finish by listing the files created/changed and any missing image.
