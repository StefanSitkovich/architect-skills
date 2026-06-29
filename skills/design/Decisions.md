# Decisions.md — guidance

Guidance for maintaining the **decision log** (default `docs/Decisions.md`,
resolved via the agent guide index): the significant choices the project has
settled, and *why*. It is the counterpart to
the open questions captured as `TBD` and re-opened on "zoom out" (see
[SKILL.md](SKILL.md)): a `TBD` is a decision **not yet made**; an entry here is one
**made** — recorded so a future reader (or agent) needn't reverse-engineer the
reasoning or re-litigate it. *(Meta-guidance for the skill, not an actual decision
log.)*

## When to record

**Default to *not* recording.** Most choices don't earn an entry, and the log's
value collapses as it grows — too many ADRs is the common failure, not too few.
Record a decision only when a future reader would genuinely **re-litigate** it and
be worse off reverse-engineering the *why* — a chosen technology, a boundary, a
pattern, a tradeoff with live alternatives. **Not** every micro-choice. One lean
entry per decision worth explaining.

**Sign-off precedes writing.** A skill never writes an ADR on its own. It
**proposes** the decision in chat — context, choice, consequences — and only on the
user's explicit sign-off is it written, straight as `Accepted`. A declined proposal
writes **nothing**; there is no record of a rejected decision. This binds every
skill that can touch the log — `design`, and the coherence skills `extract` /
`evolve` / `audit-coherence` — they propose ADRs, never author them.

## Entry format

One `### ADR-NNNN — <title>` per decision, newest at the top, numbered
sequentially:

    ### ADR-0007 — Publish events via an outbox table
    **Status:** Accepted · 2026-06-15
    **Context:** <the forces — what made this a real decision, the constraints>
    **Decision:** <what was chosen>
    **Consequences:** <what it makes easy, what it costs, what it rules out>
    **Alternatives:** <what else was weighed, and why not>

- **Create** — on sign-off, append a new ADR as `Accepted`; link the docs it touches
  (the **architecture** and **contracts** docs, the entity). If it settles a `TBD`,
  clear that `TBD` in the same pass.
- **Edit** — an Accepted ADR is **immutable**; don't rewrite history. New
  information → a *new* ADR that supersedes it.
- **Delete** — never. To reverse a decision (the "zoom out" outcome), add a new
  ADR with `Status: Accepted` that supersedes the old, and flip the old to
  `Status: Superseded by ADR-NNNN`. The trail of *why it changed* is the point.

## Status values

`Accepted` → `Superseded by ADR-NNNN` (or `Deprecated`).

- A decision **not yet made** lives as a `TBD` (in `design`), not as an on-disk ADR.
  When it lands and the user signs off, it's written straight as `Accepted`, and the
  `TBD` is cleared in the same pass.
- A **reversed** decision becomes a new `Accepted` ADR that supersedes the old; the old
  flips to `Superseded by ADR-NNNN`. A decision no longer in force but not replaced is
  `Deprecated`.
