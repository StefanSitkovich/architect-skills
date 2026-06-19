---
name: draft-plan
description: >-
  Use when the user wants to plan upcoming work — a roadmap (milestones &
  ordering) or user stories. Reads the SSoT docs (requirements, domain model,
  architecture, contracts) read-only and follows their terminology. To change a
  technical contract use architect:design; to prototype or de-risk a design
  use architect:prototype.
---

# Draft Plan

## Principles

- **Read the docs, don't change them.** Use `Requirements.md`, `DomainModel.md`,
  `Architecture.md`, `Contracts.md` and the entity docs as **read-only** input and
  follow their terminology. To change a fact in the docs — including a technical
  contract — use `design`, not this skill.
- **One level per invocation.** A single run drafts **exactly one** level —
  roadmap or user stories. Pick the level from the request.
- **Neither level requires the other.** You can draft user stories even if no
  `plan/roadmap.md` exists; each level stands alone.

## Levels & output

| Level        | Drafts…                                         | Output file            | Format reference                 |
| ------------ | ----------------------------------------------- | ---------------------- | -------------------------------- |
| Roadmap      | the milestone outline (goals & scope, ordering) | `plan/roadmap.md`      | [Roadmap.md](Roadmap.md)         |
| User Stories | the stories themselves, in full story format    | `plan/user-stories.md` | [UserStories.md](UserStories.md) |

Create the `plan/` folder if missing. The **technical contracts** stories honor
(tables, APIs, events, pages, config) are not a plan level — they are a doc,
`Contracts.md`, maintained by `design`. Stories *link* to its sections instead
of re-embedding them.

## Workflow (every invocation)

1. **Read first** — the SSoT docs relevant to the plan (Requirements, DomainModel,
   Architecture, Contracts, entities) and the existing `plan/` file for this level
   if present.
2. **Pick the level** — from the user's intent. Do **only** that level; if they
   ask for both, do one and tell them to invoke again for the other.
3. **Clarify** — one focused question if the scope is ambiguous.
4. **Draft** the single level into its `plan/` file (formats above).
5. **Report** — summarize what you drafted; surface gaps or contradictions you
   found against the docs.
6. **Lint** the file you wrote (below) and fix what it reports — loop until clean.

## Lint the plan

After **every edit** to a `plan/` file, run this skill's structure linter and fix
what it reports — **loop until it passes** (no errors):

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/draft-plan/lint.mjs" <path/to/plan/file.md>
```

It checks the format by filename — `roadmap.md` (each `## Milestone N — …` carries
**Goal** / **Scope** / **Depends on**) and `user-stories.md` (each `#### <ID> — …`
carries **As a** / **I want** / **so that** and an **Acceptance Criteria** section)
— plus the checks that keep the plan renderable in `architect:serve-docs`:
closed/valid ` ```mermaid ` fences, resolvable relative links, a single H1. A
missing field is an **error**; fix it and re-run until clean.

The Roadmap level is drafted straight from its reference file
([Roadmap.md](Roadmap.md)). The User Stories level has extra steps:

## User Stories level → `plan/user-stories.md`

Follow the full story format in **[UserStories.md](UserStories.md)** (story opener,
acceptance-criteria prefixes, optional contract links, ID scheme, document
structure). Group stories under milestone headings; if `plan/roadmap.md` exists,
mirror its milestones and goals.

**Link to `Contracts.md` when it exists** — a story references the contract
sections it implements (`Contracts: docs/Contracts.md#incident-tables`) instead of
re-embedding the schema. The contracts are docs, maintained by `design`; if a
story needs a contract that doesn't exist yet, note the gap so it can be drafted
there. See the Linking note in **[UserStories.md](UserStories.md)**.

**De-risk before committing — prototype check.** If a story rests on an
unvalidated UI or a technical unknown, offer to prototype it first with
`architect:prototype` — a clickdummy for "what should this look like", a spike for
"will this approach work". Advisory — stories can still be drafted without one.

## Language & terminology

- Match the documentation language of the project.
- Use terms already defined in the project's `DomainModel.md` / glossary — don't
  introduce synonyms.
- Code identifiers (table names, field names, modules) follow the project's code
  conventions.
