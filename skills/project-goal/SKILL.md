---
name: project-goal
description: >-
  Use when the user wants to set, change, or advance the project's current goal —
  the single objective the team is working toward right now ("the next goal"). The
  current goal lives in the root agent guide (AGENTS.md / CLAUDE.md) so every other
  skill reads it as orientation for what's in scope vs out of scope. Also bootstraps
  a repo for the chain when needed: creates the agent guide if none exists and
  establishes the single-source-of-truth document structure (the index mapping each
  doc concept — requirements, architecture, contracts, domain model, entities,
  decisions — to its file under docs/). Doesn't write the docs themselves.
---
# Project Goal

The head of the chain: name the **current goal** — the one objective the project
is working toward *right now* — and put it where every other skill can see it. The
goal is **orientation**: `requirements`, `design`, `draft-plan`, and `review-code`
read it to judge what's in scope vs out of scope for the work in front of them.

It lives in the root **agent guide** (`AGENTS.md` / `CLAUDE.md`), alongside the
**document index** the rest of the chain resolves paths against. Two lightweight
things in one root file:

- the **current goal** — a sentence or two, and *only the current one*;
- the **document index** — the table mapping each SSoT-doc *concept* to its file,
  so every skill resolves "the requirements doc" or "the decision log" to a real
  path instead of guessing.

This skill sets the goal and lays down the structure; it does **not** write the
docs. The requirements doc is `architect:requirements`' job; architecture,
contracts, domain model, entities, and the decision log are `architect:design`'s.

## Principles

- **One current goal, superseded not stacked.** The guide holds exactly one goal —
  the current objective. Setting a new goal **replaces** the old one; don't keep a
  history of past goals here.
- **The goal orients, it doesn't constrain in writing.** It's the input other
  skills use to reason about in/out of scope — not a stored scope list. Keep it to
  the objective itself; let each skill derive scope from it.
- **Goal ≠ Vision ≠ milestone.** The requirements doc's **Vision** is what the
  product is *for*, enduring. The current goal is what's being pursued *now* — and
  when a roadmap exists, it usually *is* the active milestone's objective. Point at
  that milestone rather than restating it.
- **Detect, don't clobber.** If a root agent guide already exists, never overwrite
  it — read it, update the goal, and only add what's missing (a goal, an index, or
  rows for docs not yet listed). Create a file only when none exists.
- **Root guide, `docs/` for the rest.** The agent guide lives at the repo root so
  it auto-loads; the SSoT docs live under `docs/`. The guide points into `docs/`,
  it doesn't hold the content.
- **Structure by concept, not filename.** The index is the single place a concept
  maps to a filename. Other skills name the concept and resolve the path here, so a
  project can rename or relocate a doc by editing one row.
- **Interview, don't invent.** Settle the goal by asking, not guessing — recommend
  a draft from the README / code / active milestone, one question at a time.

## The doc structure

Seed the index with these concepts and their default files. A project may rename or
relocate any of them — the index row is what's authoritative; the default is only
the starting point.

| Concept             | What it holds                                     | Default location            | Owner skill                  |
| ------------------- | ------------------------------------------------- | --------------------------- | ---------------------------- |
| requirements doc    | the*what* & *why* — vision, NFRs, priorities | `docs/Requirements.md`    | `architect:requirements`   |
| architecture doc    | the durable*how* — context, modules, data flow | `docs/Architecture.md`    | `architect:design`         |
| contracts doc       | per-feature technical contracts (**spec**)  | `docs/Contracts.md`       | `architect:design`         |
| contracts artifacts | the **implemented** contracts (real files) | `contracts/`              | `architect:implement-plan` |
| domain model doc    | terminology SSoT — actors, terms, glossary       | `docs/DomainModel.md`     | `architect:design`         |
| entity docs         | one term's structure — keys, status, fields      | `docs/entities/<Term>.md` | `architect:design`         |
| decision log        | significant settled choices and why (ADRs)        | `docs/Decisions.md`       | `architect:design`         |

**Resolution rule** — every skill in the chain follows this, and it's stated once
here: to read or write a doc, look up its concept in the agent guide's index and
use that path. If the index has no row for it yet, fall back to the default above
and add the row. Don't hardcode a filename anywhere else.

**Contracts have two layers.** A contract is a *spec* while it's being designed
(the contracts doc) and an *artifact* once it's built (`contracts/`). The same
contract never lives in both — on implementation it moves from the doc to
`contracts/` (see `architect:design`'s contracts guidance and `architect:implement-plan`).

**The index is the fact-registry root.** The durable doc facts carry stable ids —
`REQ-`/`NFR-` (requirements), `ADR-` (decisions), `ENT-` (entities) — and resolve
through the docs this index maps. That's how `architect:audit-coherence`,
`architect:extract`, and `architect:evolve` find a fact from its id and join it to the
`@realizes` tags in the code.

## Workflow

1. **Read first** — the existing root `AGENTS.md` / `CLAUDE.md` (its current goal
   and index), the `README`, the active roadmap milestone if one exists, and enough
   of the code to ground a goal.
2. **Settle the guide file** — if a guide exists, use it. If neither exists, create
   `AGENTS.md` at the repo root (the tool-agnostic default).
3. **Set the goal** — interview for the current objective (one question, recommend
   a draft from what you read); write it as the Goal per
   **[AgentGuide.md](AgentGuide.md)**, replacing any prior goal. Leave open parts as
   `TBD`.
4. **Establish / refresh the index** — write the Document Index table, seeded from
   the concepts above. Add a row for any SSoT doc that already exists; leave
   concepts whose docs don't exist yet for the owner skills to add when they create
   them (see the guidance file).
5. **Report** — the goal you set, what was created or refreshed, and the next link
   in the chain (`architect:requirements` to turn the goal into a real *what & why*).

## Interview affordances

**Ask in chat, never via a tool.** Pose every question as plain text in the
conversation. Do **not** use the `AskUserQuestion` tool — its fixed options can't
carry the "idk" / "zoom out" / "visualize it" affordances below, and they pin the
user to a menu instead of an open answer.

Besides answering, three responses are always open at any question:

- **"idk"** — defer it; capture a `TBD` where the answer will live, don't fill it:
  `**TBD** — <the open question>; <options or leaning, if any>.`
- **"zoom out"** — the question was wrong, or an earlier answer no longer holds.
  Stop drilling, surface the assumptions it rested on, go up a level and re-open
  that decision. Offer a pause — work-in-progress is safe.
- **"visualize it"** — draw the decision and its competing options before
  answering, with `architect:visualize` (or a throwaway `.drawio` in the temp dir,
  never the repo); then re-pose the question.
