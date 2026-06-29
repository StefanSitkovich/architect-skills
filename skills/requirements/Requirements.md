# Requirements.md — guidance

Guidance for maintaining the **requirements doc** (default `docs/Requirements.md`,
resolved via the agent guide index) — the *what* and *why*. Not the *how* (→ the
**architecture** / **contracts** docs), and not acceptance criteria / milestones /
story breakdowns (→ the plan). *(Meta-guidance for the skill, not an actual
requirements doc.)*

Per header, deltas from the workflow in [SKILL.md](SKILL.md#workflow) on **create /
edit / delete** — plus a **Visualize** default for sections worth drawing.

## Vision

One short paragraph: what the product is for, and for whom.

- **Create** — once, at doc creation.

> A web/mobile app that helps a person track personal spending: record expenses,
> group them by category, and see spend against monthly budgets.

## Stakeholders & Personas

Who has a stake in the product, and the user archetypes who use it.

- **Create** — `**Name** — their stake / what they need from the system`. Mark
  *users* (personas with goals) vs *non-user stakeholders* (sponsor, ops,
  compliance). A persona maps to an Actor in the **domain model** doc — link,
  don't redefine.
- **Delete** — when a stakeholder no longer has a stake; check no requirement is
  justified solely by them.
- **Visualize** — Stakeholder map / persona cards: who surrounds the system and
  what each wants.

> **Budget-conscious individual** *(persona)* — wants to see at a glance whether
> they're overspending this month.

## Functional Requirements

One heading per capability — what a user can do and why.

- **Create** — add a `### REQ-NNN — Capability` heading (a stable id + the capability
  name; the id is the join key code is tagged against). Describe **behaviour**, not UI
  or tech. Link domain terms to the **domain model** doc, entity detail to the **entity
  docs**. Tag its **priority** (see Prioritization).
- **Delete** — retiring a capability: remove it, then check whether any entity it
  was the *sole* reason for is now orphaned (→ domain model doc delete). Retire the id;
  don't reuse the number.
- **Visualize** — User Journey / capability map: the capabilities as steps a user
  walks through.

> ### REQ-012 — Record an expense
> The user records an [Expense](DomainModel.md) with an amount, a date and a
> [Category](DomainModel.md).

## Non-Functional Requirements

The quality attributes and budgets the system must meet — the **NFR catalog**.
These are the numbers the downstream Performance / Security / Compliance lenses
check against, so state them as concretely as the project allows.

- **Create** — group by attribute (performance, scalability, availability,
  security, privacy, accessibility, operability, …). Lead each entry with a stable
  `NFR-NNN` id, then the attribute, a **measurable** target where possible, and the
  capability/scope it applies to. A target with no number is a `TBD`, not a vague adjective.
- **Edit** — tightening or loosening a budget ripples to the plan and the gates;
  note why it changed.
- **Visualize** — quality-attribute tree: attributes and their targets.

> - **NFR-001 · Performance** — the monthly summary loads in < 500 ms for up to 10k expenses.
> - **NFR-002 · Privacy** — expense data is personal; never shared with third parties (see
>   [Architecture](Architecture.md) for the data classification).

## Success Metrics

How you'll know the product worked — measurable outcomes, not features.

- **Create** — `**Metric** — target + how it's measured`. Tie each to the Vision
  or a capability it validates.
- **Delete** — when a metric no longer reflects success.
- **Visualize** — metric / KPI board: the outcomes and their targets.

> - **Weekly active budgeters** — ≥ 40% of signups record an expense every week.

## Constraints & Assumptions

The fixed boundaries the solution must respect, and the assumptions the plan rests
on (so a wrong one stays visible).

- **Create** — separate **Constraints** (hard: budget, deadline, mandated tech,
  regulation, platform) from **Assumptions** (believed true but unverified). A
  disproven assumption is a `zoom out` trigger.
- **Delete** — when a constraint lifts, or an assumption is confirmed (promote it
  to a fact in the right doc) or disproven (re-open what depended on it).

> - **Constraint** — must run on the user's existing PostgreSQL; no new datastore.
> - **Assumption** — users track a single currency (revisit for multi-currency).

## Prioritization

MoSCoW across the capabilities, so scope can flex against constraints.

- **Create** — tag each Functional Requirement **Must / Should / Could / Won't**
  (this release). Keep "Won't" visible — recording what's *out* prevents
  re-litigation.
- **Edit** — a re-prioritization is a real decision; if significant, record it as
  an ADR (the **decision log**, via `design`).
- **Visualize** — MoSCoW board: capabilities bucketed by priority.

> - **Must** — Record an expense · **Should** — Monthly budget alerts · **Won't**
>   (this release) — Multi-currency.
