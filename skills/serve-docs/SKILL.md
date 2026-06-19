---
name: serve-docs
description: >-
  Launches a live, browser-based documentation site (a Docsify single-page app)
  for the project's single-source-of-truth docs on a free local port and opens
  it in the default browser. Renders Markdown richly, draws Mermaid diagrams,
  turns relative links between docs into in-app navigation, and live-reloads when
  files change — so the session that started it can keep editing and the page
  updates on save. The server runs detached (your session keeps working); a
  pidfile lets you stop it. Use when the user wants to read, browse, present,
  preview, or "see" the docs in a browser, wants a live/rendered docs site, a
  docs server, a docs preview with Mermaid, or runs /serve-docs. For static,
  shareable draw.io diagrams instead, use architect:visualize.
---

# serve-docs — a live docs SPA in the browser

Stands up a **Docsify** single-page app over the project's docs and opens it in
the browser. It is a *live viewer over the real files*, not a build artifact:
edits the session makes show up on save.

This is the complement to `architect:visualize` — that one produces static
`.drawio` diagrams in a temp dir; this one serves the prose docs as a navigable,
Mermaid-rendering website.

## What it gives you

- A local URL (free port, picked automatically) opened in the default browser.
- Rendered Markdown with a sidebar built from the **doc index**, full-text search,
  and **Mermaid** diagrams rendered from ` ```mermaid ` fences.
- Relative Markdown links (`[Architecture](Architecture.md)`) become in-app
  navigation between docs.
- **Live reload** — Docsify watches the real files in place; saving a doc
  refreshes the page. The launching session keeps working the whole time.

## Runtime

The live-reload server is `npx docsify-cli serve`, so the project needs **Node**
(first run fetches `docsify-cli` via npx — needs network once). The launcher
itself has **zero dependencies**. If Node/npx is unavailable, say so and stop —
don't hand-roll a substitute server.

## Workflow

1. **Lint first (recommended).** Before serving, run the bundled linter over the
   doc set so nothing renders as a broken diagram or dead link:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/skills/serve-docs/lint.mjs" docs   # or the docs root / explicit files
   ```
   Report any errors; the doc-producing skills (`requirements`, `design`,
   `draft-plan`) carry the same checks and should have kept their docs clean.
2. **Start the server** from the **repo root**:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/skills/serve-docs/serve.mjs"
   ```
   It discovers the docs (from the `AGENTS.md`/`CLAUDE.md` index, else a `docs/`
   scan), writes the scaffold, picks a free port, launches detached, and opens
   the browser.
3. **Report** the URL, the doc count, and the stop command. Then **continue with
   whatever the user was doing** — the server is detached.

## Lifecycle & commands

The server runs **detached** with its pid/port/url recorded in
`<repo>/.docs-spa/server.json`.

```bash
node serve.mjs            # start (replaces any running instance)
node serve.mjs --status   # is it running? where?
node serve.mjs --stop     # stop it
```

Useful options: `--docs a.md,b.md` (explicit list), `--root <dir>` (force the web
root), `--name "Title"`, `--no-open` (don't open the browser).

## Footprint (small, gitignored)

Docsify needs an `index.html` beside the docs and watches them in place, so the
skill writes three files into the **web root** (the common ancestor of the docs,
usually `docs/`) and adds them to `.gitignore`:

- `index.html` — the Docsify app (CDN-loaded; Mermaid + search + relative links)
- `_sidebar.md` — generated nav, grouped by folder
- `.nojekyll`

Runtime state lives in `<repo>/.docs-spa/` (also gitignored). A managed block is
added to `.gitignore` automatically; everything is safe to delete. Unlike
`visualize`, this skill *does* touch the repo — that's the cost of live-reloading
the real files — but only with ignored, regenerable scaffold.

## Notes

- **Mermaid** is rendered client-side from ` ```mermaid ` fences; if a diagram
  shows an error box, run the linter — a malformed fence is the usual cause.
- The doc set is the **indexed SSoT docs**. If there's no index and no `docs/`
  folder, the launcher reports it rather than guessing — add an index or pass
  `--docs`.
- Re-running `serve.mjs` regenerates the sidebar (picking up newly added docs)
  and restarts the server.
