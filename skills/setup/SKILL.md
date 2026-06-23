---
name: setup
description: >-
  Use when the user wants to initialize or bootstrap a repo for the architect
  chain — create the agent guide (AGENTS.md / CLAUDE.md) if the repo has none,
  capture the project's goal/purpose as a first seed, and establish the
  single-source-of-truth document structure (the index that maps each doc
  concept — requirements, architecture, contracts, domain model, entities,
  decisions — to its file under docs/). The zeroth link in the SDLC chain: it
  lays down the guide and the doc index that requirements (architect:requirements)
  and design (architect:design) then fill in. Doesn't write the docs themselves.
---

# Project Setup

The zeroth link in the chain: give a repo the **agent guide** and the **document
structure** the rest of the chain assumes. Two artifacts, both lightweight:

- a root **agent guide** (`AGENTS.md` / `CLAUDE.md`) holding the project's
  **goal** — a seed sentence or two, meant to be expanded — and the **document
  index**;
- the **document index** itself: the table that maps each SSoT-doc *concept* to
  its file, so every other skill resolves "the requirements doc" or "the decision
  log" to a real path instead of guessing.

Setup establishes the *structure*; it does **not** write the docs. The
requirements doc is `architect:requirements`' job; architecture, contracts,
domain model, entities, and the decision log are `architect:design`'s.

## Principles

- **Detect, don't clobber.** If a root agent guide already exists, never
  overwrite it — read it, and only add what's missing (a goal section, an index,
  or rows for docs that exist but aren't listed). Create a file only when none
  exists.
- **Root guide, `docs/` for the rest.** The agent guide lives at the repo root so
  it auto-loads; the SSoT docs live under `docs/`. The guide points into `docs/`,
  it doesn't hold the content.
- **The goal is a seed.** Capture enough to orient a reader — what the project is
  for, and for whom — and mark the rest `TBD`. `architect:requirements` expands it
  into a real Vision; don't pre-empt that here.
- **Structure by concept, not filename.** The index is the single place a concept
  maps to a filename. Other skills name the concept and resolve the path here, so
  a project can rename or relocate a doc by editing one row.
- **Interview, don't invent.** Settle the goal by asking, not guessing — recommend
  a draft from the README/code, one question at a time.

## The doc structure

Setup seeds the index with these concepts and their default files. A project may
rename or relocate any of them — the index row is what's authoritative; the
default is only the starting point.

| Concept            | What it holds                                   | Default file            | Owner skill              |
| ------------------ | ----------------------------------------------- | ----------------------- | ------------------------ |
| requirements doc   | the *what* & *why* — vision, NFRs, priorities   | `docs/Requirements.md`  | `architect:requirements` |
| architecture doc   | the durable *how* — context, modules, data flow | `docs/Architecture.md`  | `architect:design`       |
| contracts doc      | per-feature technical contracts                 | `docs/Contracts.md`     | `architect:design`       |
| domain model doc   | terminology SSoT — actors, terms, glossary      | `docs/DomainModel.md`   | `architect:design`       |
| entity docs        | one term's structure — keys, status, fields     | `docs/entities/<Term>.md` | `architect:design`     |
| decision log       | significant settled choices and why (ADRs)      | `docs/Decisions.md`     | `architect:design`       |

**Resolution rule** — every skill in the chain follows this, and it's stated once
here: to read or write a doc, look up its concept in the agent guide's index and
use that path. If the index has no row for it yet, fall back to the default above
and add the row. Don't hardcode a filename anywhere else.

## Workflow

1. **Read first** — look for an existing root `AGENTS.md` / `CLAUDE.md`, the
   `README`, and enough of the code to draft a goal. Note whether a `docs/` folder
   and any SSoT docs already exist.
2. **Settle the guide file** — if a guide exists, use it. If neither exists,
   create `AGENTS.md` at the repo root (the tool-agnostic default).
3. **Capture the goal** — interview for the project's purpose (one question,
   recommend a draft from what you read); write it as the Goal section per
   **[AgentGuide.md](AgentGuide.md)**, leaving open parts as `TBD`.
4. **Establish the index** — write the Document Index table, seeded from the
   concepts above. Add a row for any SSoT doc that already exists in the repo;
   leave concepts whose docs don't exist yet as rows the owner skills will point
   at when they create them (or omit until created — see the guidance file).
5. **Report** — what was created or extended, the open `TBD`s in the goal, and the
   next link in the chain (`architect:requirements` to flesh out the *what & why*).

## Interview affordances

Besides answering, three responses are always open at any question:

- **"idk"** — defer it; capture a `TBD` where the answer will live, don't fill it:
  `**TBD** — <the open question>; <options or leaning, if any>.`
- **"zoom out"** — the question was wrong, or an earlier answer no longer holds.
  Stop drilling, surface the assumptions it rested on, go up a level and re-open
  that decision. Offer a pause — work-in-progress is safe.
- **"visualize it"** — draw the decision and its competing options before
  answering, with `architect:visualize` (or a throwaway `.drawio` in the temp dir,
  never the repo); then re-pose the question.
