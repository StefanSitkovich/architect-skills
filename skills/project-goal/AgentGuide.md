# AgentGuide.md — guidance

Guidance for the **agent guide** a project keeps at its root — `AGENTS.md` or
`CLAUDE.md`, the file an agent auto-loads on entering the repo. `project-goal` owns
two sections of it: the **Goal** (the single current objective) and the **Document
Index** (the concept→file map every other skill resolves against). The guide
**points to** the SSoT docs under `docs/`; it never duplicates their content.
*(Meta-guidance for the skill, not an actual agent guide.)*

Per section, deltas from the workflow in [SKILL.md](SKILL.md#workflow) on
**create / edit / delete**.

## Goal

A sentence or two naming the **current objective** — what the project is working
toward *right now*. This is the orientation every other skill reads to judge what's
in scope vs out of scope; keep it to the objective itself, not a stored scope list.
It is *not* the full Vision (that's the requirements doc's job) — when a roadmap
exists, the goal is usually the active milestone's objective.

- **Create** — write it from the README / code / active milestone and the goal
  interview. Mark anything unsettled as `**TBD** — <question>`, don't invent it.
- **Edit** — setting a new goal **replaces** the current one; the guide holds
  exactly one. Don't keep a list of past goals here.
- **Delete** — keep at least a one-line current goal; a guide with no statement of
  what's being pursued has lost its orientation value.

> ## Goal
>
> Ship multi-currency support for the expense tracker — let a household record and
> report spend in more than one currency. **TBD** — whether historical FX rates are
> in scope.

## Document Index

A single table linking every SSoT doc with a one-line summary, so a reader (or a
later agent) finds the right doc without grepping. This is the authoritative
concept→file map: when a skill needs "the architecture doc", it reads the path
from this table.

- **Create** — seed the rows from the doc concepts in [SKILL.md](SKILL.md#the-doc-structure)
  using their default `docs/` filenames. Add a row the moment a doc is created;
  it's fine to omit a concept whose doc doesn't exist yet.
- **Edit** — renaming or relocating a doc → update its row (the row is what's
  authoritative, not the default name). Adding a doc → add a row.
- **Delete** — removing a doc → remove its row, so the index never points at a
  file that isn't there.

> | Topic                | Document                                     |
> | -------------------- | -------------------------------------------- |
> | Vision & requirements | [docs/Requirements.md](docs/Requirements.md) |
> | Context & data flow  | [docs/Architecture.md](docs/Architecture.md) |
> | Contracts            | [docs/Contracts.md](docs/Contracts.md)       |
> | Terminology / domain | [docs/DomainModel.md](docs/DomainModel.md)   |
> | Decisions (ADRs)     | [docs/Decisions.md](docs/Decisions.md)       |
