# Entity.md — guidance

How to write and maintain an **entity doc** (default `docs/entities/<Term>.md`,
resolved via the agent guide index) — the detailed structure of one Core Domain
term. The term's *meaning* stays in the **domain model** doc; this doc elaborates
only its structure. *(Meta-guidance for the skill, not an actual entity.)*

Per header, deltas from the standard workflow in
[SKILL.md](SKILL.md#workflow-for-every-change) on **create / edit / delete** — plus a
**Visualize** default for sections worth drawing.

## Does the term even need its own doc?

Give a term its own doc when it has **rich structure** — its own keys, a lifecycle
(status), or several fields; leave trivial terms as a one-line Core Domain entry. Be
consistent within a project: document only the rich entities, or give every core
entity a doc — don't mix.

Creating one → also add the index row in the agent guide.

## Description

- **Create** — one or two lines; link the **domain model** term, don't restate its
  meaning.

> Detailed structure of the **Expense** entity. The term is defined once in the
> [Domain Model](../DomainModel.md); this document only elaborates its structure.

## Realizing code (refer-back)

The entity carries a stable id, `ENT-<Term>` (e.g. `ENT-Expense`), and a **refer-back**
link to the class/type that realizes it.

- **Create** — once the entity exists in code, add a one-line link to its realizing symbol
  (`path:symbol`); the class may also carry `// @realizes ENT-<Term>`. Until then, leave it
  as a `TBD` — a planned gap.
- **Edit** — if the class moves or is renamed, update the link.

The link is what `audit-coherence` checks — that it still **resolves** (else a broken-link /
stale-anchor / orphan finding). It does **not** diff the fields: **the class owns the
structure**, so keys/status/fields below are durable domain narrative, not a spec the code
must match line-for-line.

> Realized by [`Expense`](../../src/Expenses/Expense.cs) — `// @realizes ENT-Expense`.

## Key(s)

The natural identifier(s).

- **Create** — name the natural key; note a surrogate (DB) key if there is one.
- **Edit** — a key change is structural; check the Relationships that reference it.

> - numeric primary key in the database
> - **Reference** — a human-readable identifier (e.g. `EXP-2026-00042`)

## Status

Lifecycle states — **omit the whole section if the entity has none.**

- **Create** — list the states + what each means.
- **Edit** — adding/renaming a state: check Business Rules tied to status.
- **Delete** — removing a state: ensure nothing still transitions into it.
- **Visualize** — State-machine diagram: the states and the transitions between them.

> - Draft — not yet counted against a budget
> - Recorded — counts against the matching Budget
> - Voided

## Fields / Information

The data the entity holds.

- **Create** — `**Name** — what it is`; link types/terms to their SSoT (the
  **domain model** and **architecture** docs).
- **Visualize** — single-entity ER / class box: this entity's keys and fields in one box.

> - **Amount** — a monetary value (single currency, see [Architecture](../Architecture.md))
> - **Category** — exactly one [Category](../DomainModel.md)
> - **Note** — optional free text
