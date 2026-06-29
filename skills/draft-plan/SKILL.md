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

- **Read the docs, don't change them.** Use the requirements, domain model,
  architecture, and contracts docs and the entity docs as **read-only** input and
  follow their terminology. To change a fact in the docs — including a technical
  contract — use `design`, not this skill.
- **One level per invocation.** A single run drafts **exactly one** level —
  roadmap or user stories. Pick the level from the request.
- **Neither level requires the other.** You can draft user stories even if no
  `plan/roadmap.md` exists; each level stands alone.
- **Ask in chat, never via a tool.** Pose any clarifying question as plain text in
  the conversation; don't use the `AskUserQuestion` tool.

## Levels & output

| Level        | Drafts…                                         | Output file            | Format reference                 |
| ------------ | ----------------------------------------------- | ---------------------- | -------------------------------- |
| Roadmap      | the milestone outline (goals & scope, ordering) | `plan/roadmap.md`      | [Roadmap.md](Roadmap.md)         |
| User Stories | the stories themselves, in full story format    | `plan/user-stories.md` | [UserStories.md](UserStories.md) |

Create the `plan/` folder if missing. The **technical contracts** stories honor
(tables, APIs, events, pages, config) are not a plan level — they are a doc, the
**contracts** doc, maintained by `design`. Stories *link* to its sections instead
of re-embedding them.

## Workflow (every invocation)

1. **Read first** — the current goal in the agent guide (it bounds the scope of
   what to plan now), the SSoT docs relevant to the plan (requirements, domain
   model, architecture, contracts, entities), and the existing `plan/` file for
   this level if present.
2. **Pick the level** — from the user's intent. Do **only** that level; if they
   ask for both, do one and tell them to invoke again for the other.
3. **Clarify** — one focused question if the scope is ambiguous.
4. **Draft** the single level into its `plan/` file (formats above).
5. **Report** — summarize what you drafted; surface gaps or contradictions you
   found against the docs.

## User Stories level → `plan/user-stories.md`

Follow the full story format in **[UserStories.md](UserStories.md)** (story opener,
acceptance-criteria prefixes, optional contract links, ID scheme, document
structure). Group stories under milestone headings; if `plan/roadmap.md` exists,
mirror its milestones and goals.

**Link to the contracts doc when it exists** — a story references the contract
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
- Use terms already defined in the project's **domain model** doc / glossary —
  don't introduce synonyms.
