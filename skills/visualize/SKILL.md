---
name: visualize
description: >-
  Generates draw.io (diagrams.net) or Mermaid diagrams — draw.io as a single
  multi-page .drawio file in a fresh, timestamped temp folder (never in the repo)
  that it validates and opens; Mermaid as inline blocks for Markdown / GitHub-native
  output (e.g. an audit-coherence report). Four standard modes, picked from an optional argument or detected
  from the repo — code (C4 as built, dependency graph, sequence, class/ER from
  the source tree), docs (user journey, stakeholder grid, MoSCoW, NFR tree, DDD
  context map, event storming, C4, ER/API/event contracts, ADR graph from the
  project docs), plan (story map, epic/story tree, roadmap dependency order,
  story→contract coverage from a plan/backlog), trace (named-only — the SDLC chain end to
  end: requirement→decision→contract→story→test, highlighting orphans/gaps) —
  plus an ad-hoc mode for anything else worth drawing. Use when the user wants to
  visualize the code, architecture, docs, domain, plan, requirements, decisions,
  traceability/coverage, or anything on the fly, asks for draw.io / diagrams.net
  diagrams, a C4 model, context map, story map, dependency graph, ER/class,
  sequence, event-storming, ADR/decision, or user-journey diagram, asks for a
  Mermaid diagram, or runs /visualize (optionally /visualize code|docs|plan|trace|<topic>
  and an optional mermaid format).
---

# visualize – draw.io or Mermaid diagrams from code, docs, plan, or ad hoc

## Principle

Diagrams are **derived views**, not a single source of truth.

- **Never write into the repo.** No signpost entry (the agent guide), no changelog.
- Derive fresh from the chosen source each run. On contradictions, **report instead of guessing**.
- Diagram labels use the project's own language; if the project has a glossary or domain model, apply that ubiquitous language consistently.

## Output format — draw.io or Mermaid

The **mode** picks *what* to draw; the **format** picks *how* to emit it.

- **draw.io** (default) — rich, interactive, multi-page; the right choice for the exploration
  modes (`code` / `docs` / `plan` / `trace`) and any diagram you'll open and pan around.
- **Mermaid** — text diagrams that embed inline in Markdown and render natively on GitHub. Use
  it when the diagram lives *inside* a Markdown artifact (a PR comment, an issue, the
  `audit-coherence` report) — it's the **default when `trace` is rendered into a coherence
  report**. Select it with a `mermaid` argument (e.g. `/visualize trace mermaid`).

Mermaid trades richness for portability: reach for it for an at-a-glance graph that travels with
the text, draw.io for a diagram explored on its own.

## Picking the mode

The argument is **optional**. Resolve in this order:

1. **Named mode** — the user said `code`, `docs`, `plan`, or `trace`, or clearly meant one ("as built" → code, "the domain" → docs, "the roadmap" → plan, "what's not covered" / "orphans" / "coverage" → trace). Use it.
2. **Free-form subject** — the user named something that isn't one of the standard sets (a single flow, one entity, a decision, something from the conversation). Use **Ad-hoc mode** below.
3. **No hint** — detect what the repo offers: planning material (a backlog, roadmap, or `plan/` folder) → plan, project documentation → docs, a detectable implementation → code. Exactly one match → use it; several → ask the user which (offering "all of them" is fine). `trace` is never auto-detected — it spans several sources and would otherwise be shadowed by docs/plan, so it must be named explicitly.

For a standard mode, read its reference — [Code.md](Code.md), [Docs.md](Docs.md), [Plan.md](Plan.md), or [Trace.md](Trace.md) — for sources, views, and mode-specific assumptions. Code, docs, and plan each produce **≥ 6 pages**; trace draws the cuts its sources support, always including the spine and the orphan report. If the chosen mode's sources are missing, say so and name the modes whose sources do exist instead.

## Ad-hoc mode

For anything that doesn't fit a standard mode:

- **Scope = the request.** Draw exactly what the user asked about, from whatever source fits (code, docs, plan, or the conversation itself).
- **No page minimum.** One page is fine; add pages only when they clarify.
- Pick the diagram types that make the subject clearest; standard notation/colors still apply.

## Output & open

For the **draw.io** format (the default), write a self-contained, **multi-page** .drawio file to the OS temp directory so nothing lands in the repo (for **Mermaid**, see *Output format* above and *Mermaid mechanics* below). Resolve the temp dir from `$TMPDIR` (fallback `/tmp`, or `%TEMP%` on Windows); each run gets a fresh path `<tmpdir>/visualize-<mode>-<timestamp>/<project>-<mode>-<timestamp>.drawio`, where `<mode>` is `code`/`docs`/`plan`/`adhoc` and `<project>` is the project name. Validate it as XML after writing (snippet below). Open it for the user — `xdg-open <path>` (Linux), `open <path>` (macOS), `start <path>` (Windows). **Always** end by stating the **full absolute path** to the generated file (so the user can reopen it even if it didn't come to the foreground), along with the assumptions you interpreted.

## draw.io mechanics

- One `<mxfile>` with multiple `<diagram name="…" id="…">` (one per view) → draw.io tabs.
- Escape text: `&` → `&amp;`, line break `&#10;`, avoid raw `<`/`>` (use `→`), non-ASCII as UTF-8.
- Validate after writing:
```powershell
Get-ChildItem "$dir\*.drawio" | ForEach-Object { try { [xml]$x=Get-Content $_.FullName -Raw; "OK $($_.Name) cells=$($x.SelectNodes('//mxCell').Count)" } catch { "FAIL $($_.Name): $($_.Exception.Message)" } }
```

## Mermaid mechanics

- Emit fenced ` ```mermaid ` blocks — `flowchart`, `sequenceDiagram`, `classDiagram`,
  `erDiagram`, and `stateDiagram-v2` cover the standard views.
- **Embedding** (a report / PR comment / issue) → write the block *into* that Markdown.
  **Standalone** → write a `.md` (or `.mmd`) to the temp dir like the draw.io path, and state
  the absolute path; there's no separate validate/open step.
- One diagram per block; labels in the project's language; escape `"` inside node text, and
  avoid raw `<`/`>` (use `→`).

## Flag assumptions

Every inferred choice (the key flow picked for a sequence diagram, a boundary the source leaves implicit) is an **assumption** — list them in the chat report. Where sources are silent or contradict each other, name the gap instead of guessing. Mode-specific pitfalls are listed in each reference file.
