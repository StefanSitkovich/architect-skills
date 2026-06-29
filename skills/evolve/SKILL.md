---
name: evolve
description: >-
  Use when the user wants to plan a change or new feature on an existing
  code+docs project by writing the doc-diff FIRST — update the durable facts
  (requirements / NFRs, and any decision you sign off) so the docs describe the
  target state before any code is touched. "Plan this feature against the docs
  first", "doc-diff first", "what docs change for X?", "spec this change". The
  doc-diff is the spec; evolve stops there — implementing it and re-auditing
  coherence are your call. Not for greenfield requirements (requirements), drift
  auditing (audit-coherence), or brownfield bootstrap (extract).
---

# Evolve

Change propagation, **doc-diff first** (`intent → doc-diff`). The suite implies but
doesn't otherwise own the workflow "plan a feature on existing code by writing the
doc-diff before the code-diff." `evolve` owns that first hop: turn a desired change into
edits to the **durable facts**, so the docs describe the target state and *are* the spec
for the work that follows.

Reuses the shared convention in **[../audit-coherence/FactModel.md](../audit-coherence/FactModel.md)**.

## Principles

- **The doc-diff is the spec.** Express the change as edits to durable facts first
  (`REQ`/`NFR`, and any `ADR` you sign off) — not as a code plan. The updated docs become
  the source of truth the implementation is measured against.
- **Stops at the docs.** `evolve` authors the doc-diff and **stops**. Carrying it into code
  and re-running `audit-coherence` afterward are **user-initiated** steps, not part of this
  skill — they're your decisions to make.
- **Sign-off precedes writing.** Same gate as everywhere: a new/changed `REQ`/`NFR` or `ADR`
  is proposed in chat and written only on explicit sign-off. Reversing a past decision is a
  *new* ADR that supersedes the old (see `design`'s `Decisions.md`), never an edit to it.
- **Keep ids stable; only state changes.** Edit a fact in place under its existing id so the
  join survives; mint a new id only for a genuinely new fact.
- **Leave code-anchors as placeholders.** The doc-diff may point at code that doesn't exist
  yet — that's a planned gap `audit-coherence` will later show until it's built.

## Workflow

1. **Read** — [../audit-coherence/FactModel.md](../audit-coherence/FactModel.md), the agent
   guide (goal + Document Index), the current durable-fact docs, and the relevant code so the
   diff is grounded in what exists.
2. **Locate the affected facts** — which `REQ`/`NFR`/`ADR`/`ENT` the change touches, and which
   are genuinely new.
3. **Draft the doc-diff** — propose the edits/additions to those facts (and any decision the
   change forces); resolve the open questions by interview, one at a time.
4. **Write on sign-off** — apply the approved doc-diff via `requirements` / `design`, keeping
   ids stable.
5. **Report and stop** — summarize the doc-diff (the spec) and the planned gaps it introduces.
   Note that implementing it and re-auditing are the user's next moves; don't initiate them.
