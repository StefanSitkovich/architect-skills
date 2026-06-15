# Decisions.md — guidance

Guidance for maintaining a project's `Decisions.md` — the **decision log**: the
significant choices the project has settled, and *why*. It is the counterpart to
the open questions captured as `TBD` and re-opened on "zoom out" (see
[SKILL.md](SKILL.md)): a `TBD` is a decision **not yet made**; an entry here is one
**made** — recorded so a future reader (or agent) needn't reverse-engineer the
reasoning or re-litigate it. *(Meta-guidance for the skill, not an actual decision
log.)*

## When to record

Record a decision when a future reader would ask **"why was it done this way?"** —
a chosen technology, a boundary, a pattern, a tradeoff with live alternatives.
**Not** every micro-choice; the log is for decisions worth explaining, not a diary.
Keep it lean — one entry per decision.

## Entry format

One `### ADR-NNNN — <title>` per decision, newest at the top, numbered
sequentially:

    ### ADR-0007 — Publish events via an outbox table
    **Status:** Accepted · 2026-06-15
    **Context:** <the forces — what made this a real decision, the constraints>
    **Decision:** <what was chosen>
    **Consequences:** <what it makes easy, what it costs, what it rules out>
    **Alternatives:** <what else was weighed, and why not>

- **Create** — append a new ADR; link the docs it touches (`Architecture.md`,
  `Contracts.md`, the entity). If it settles a `TBD`, clear that `TBD` in the same
  pass.
- **Edit** — an Accepted ADR is **immutable**; don't rewrite history. New
  information → a *new* ADR that supersedes it.
- **Delete** — never. To reverse a decision (the "zoom out" outcome), add a new
  ADR with `Status: Accepted` that supersedes the old, and flip the old to
  `Status: Superseded by ADR-NNNN`. The trail of *why it changed* is the point.

## Status values

`Proposed` → `Accepted` → `Superseded by ADR-NNNN` (or `Deprecated`). A `Proposed`
ADR pairs with a `TBD` elsewhere; promote both together when the decision lands.
