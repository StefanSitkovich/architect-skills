---
name: requirements
description: >-
  Use when the user wants to engineer, capture, change, or restructure project
  requirements — the what & why: vision, stakeholders/personas, functional
  capabilities, non-functional requirements (NFRs / quality attributes), success
  metrics, constraints/assumptions, and prioritization. Maintains the
  single-source-of-truth requirements doc by interviewing the user — it doesn't
  invent. The first content link in the SDLC chain (architect:project-goal bootstraps the
  agent guide and doc index before it); the other SSoT docs (domain, architecture,
  contracts, decisions) are design's job.
---

# Requirements Engineering

The front of the chain: turn a fuzzy idea into a clear, single-source-of-truth
**requirements doc** — the **what** and **why**, never the **how** (that's the
**architecture** / **contracts** docs, via `design`). Requirements are downstream
fuel: the NFRs captured here become the budgets the `implement-plan` gates and
`review-code` check against, so capture them deliberately, not as an afterthought.

## Principles

- **Interview, don't invent.** Requirements are written before everything is
  known. Build them by interviewing the user, not guessing — one question at a
  time, recommend an answer, explore existing code/docs before asking.
- **What & why, not how.** A requirement states a capability and its benefit. The
  moment you're choosing a technology or a schema you've crossed into `design`'s
  territory — stop and note it there.
- **Single source of truth.** Each fact once; link to the **domain model** doc for
  terms rather than redefining. Same SSoT discipline as `design`.
- **Surface contradictions, don't paper over them.** Flag gaps and conflicts;
  capture the undecided as `TBD`, don't fill it in.

## The doc

Everything lives in one **requirements doc** (default `docs/Requirements.md`,
resolved via the agent guide index), a section per concern. Follow the
per-section create / edit / delete rules and **Visualize** defaults in
**[Requirements.md](Requirements.md)**:

| Section                     | Holds                                                              |
| --------------------------- | ----------------------------------------------------------------- |
| Vision                      | what the product is for, and for whom                             |
| Stakeholders & Personas     | who has a stake; the user archetypes and their goals              |
| Functional Requirements     | the capabilities — what a user can do and why                     |
| Non-Functional Requirements | quality attributes & budgets (performance, security, …) — the NFR catalog |
| Success Metrics             | how you'll know it worked — measurable outcomes / KPIs            |
| Constraints & Assumptions   | fixed boundaries, and the assumptions the plan rests on           |
| Prioritization              | MoSCoW (Must / Should / Could / Won't) over the capabilities      |

Add the doc to the index in the agent guide (the indexing rule is in `design`; the
guide itself is established by `architect:project-goal`).

## Workflow

1. **Read first** — the current goal in the agent guide (it bounds what's in scope
   for this round), any existing requirements doc, the **domain model** doc for
   terms, the doc index, and a referenced repo/prototype if one exists.
2. **Interview down the tree** — settle Vision before the capabilities that rest
   on it; capabilities before their NFRs and priorities. One decision at a time,
   resolving dependencies as you go.
3. **Write** each settled answer into its section, in the project's language,
   linking domain terms to the **domain model** doc.
4. **Report** — what you captured, plus the open `TBD`s and any contradictions.

## Interview affordances

Besides answering, three responses are always open at any question:

- **"idk"** — defer it; capture a `TBD` where the answer will live, don't fill it:
  `**TBD** — <the open question>; <options or leaning, if any>.`
- **"zoom out"** — the question was wrong, or an earlier answer no longer holds.
  Stop drilling, surface the assumptions it rested on, go up a level and re-open
  that decision. Offer a pause — work-in-progress is safe (settled facts are
  written, open ones are `TBD`s).
- **"visualize it"** — draw the decision and its competing options before
  answering, with `architect:visualize` (or a throwaway `.drawio` in the temp dir,
  never the repo); then re-pose the question.

When a **significant** requirements decision lands (a scoping call, a priority
tradeoff), record it as an ADR in the **decision log** (via `design`) — the same
record-the-why discipline, on the what/why side.
