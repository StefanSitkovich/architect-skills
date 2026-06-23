# AgentGuide.md — guidance

Guidance for the **agent guide** a project keeps at its root — `AGENTS.md` or
`CLAUDE.md`, the file an agent auto-loads on entering the repo. Setup owns two
sections of it: the **Goal** (a seed the chain expands) and the **Document
Index** (the concept→file map every other skill resolves against). The guide
**points to** the SSoT docs under `docs/`; it never duplicates their content.
*(Meta-guidance for the skill, not an actual agent guide.)*

Per section, deltas from the workflow in [SKILL.md](SKILL.md#workflow) on
**create / edit / delete**.

## Goal / Purpose

One short paragraph — what the project is for, and for whom. Enough to orient a
reader who lands in the repo cold; not the full Vision (that's the requirements
doc's job).

- **Create** — write a seed from the README/code and the goal interview. Mark
  anything unsettled as `**TBD** — <question>`, don't invent it.
- **Edit** — broaden or correct the seed as the project sharpens; once the
  requirements doc has a real Vision, this can shrink to a one-liner that links to
  it rather than restating it.
- **Delete** — keep at least a one-line purpose; a guide with no statement of what
  the project is for has lost its point.

> ## Goal
>
> A self-hosted expense tracker for a single household — capture receipts, split
> shared costs, and report monthly spend per category. **TBD** — whether
> multi-household sharing is in scope.

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
> | Goal & requirements  | [docs/Requirements.md](docs/Requirements.md) |
> | Context & data flow  | [docs/Architecture.md](docs/Architecture.md) |
> | Contracts            | [docs/Contracts.md](docs/Contracts.md)       |
> | Terminology / domain | [docs/DomainModel.md](docs/DomainModel.md)   |
> | Decisions (ADRs)     | [docs/Decisions.md](docs/Decisions.md)       |
