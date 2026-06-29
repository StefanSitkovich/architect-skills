---
name: audit-coherence
description: >-
  Use when the user wants to check whether the project's docs and code still
  agree — audit drift between the single-source-of-truth docs (requirements,
  NFRs, decisions, entities) and the actual code: find what's documented-but-not-
  built (gaps), built-but-not-documented (orphans), or linked-but-diverged
  (drift). "Are the docs still true?", "audit coherence", "what's drifted?",
  "check docs vs code", "what's not documented?". Read-only — derives a fact-model
  from both sides, joins by id, and emits a drift report with evidence and
  confidence. Not for reviewing a change (review-code), bootstrapping docs from
  code (extract), or propagating a new feature (evolve).
---

# Audit Coherence

The keystone of the docs↔code lattice. Reconciles the two projections of every
**durable fact**: derive the fact-model from the docs and from the code, **join by
id**, and report where they disagree. Read-only — it produces findings; you act on
them.

This skill **owns the shared convention** — the fact-model, the `@realizes` tag
grammar, the tiering, the drift taxonomy, and the finding-record — in
**[FactModel.md](FactModel.md)**. `extract` and `evolve` reuse the same reference, so
all three skills speak one model.

## Principles

- **Read-only, no repo writes, no CI.** It emits an on-demand report; it changes
  nothing and gates nothing. (A CI gate is a deliberate non-goal for now.)
- **Deterministic join, AI only on the matched pair.** Match doc-fact to code-fact by
  **id**, mechanically. AI judges exactly one question per pair — "do these two still
  agree?" — never "discover drift from scratch."
- **Lean on AI least where it's weakest.** Prefer the deterministic tiers (a passing
  id-linked scenario; a resolving entity anchor); AI-semantic verdicts are **advisory**
  and carry low confidence.
- **Bias toward flagging uncertainty.** A false "coherent" (missed drift) is the
  dangerous failure — when unsure, flag it.
- **Tag coverage is a finding too.** Untagged facts can only be fuzzy-matched; report
  coverage so the audit's own reliability is visible.

## Input

| What    | Default                  | Notes                                                      |
| ------- | ------------------------ | ---------------------------------------------------------- |
| Subject | the whole repo (docs + code) | a path / module narrows it; say what you scoped         |
| Docs    | the SSoT docs            | resolved via the agent guide's Document Index              |

## Workflow

1. **Read the model** — [FactModel.md](FactModel.md), then the agent guide's Document
   Index to resolve where the requirements / decision / entity docs live.
2. **Derive doc-side facts** — collect `REQ`/`NFR`/`ADR`/`ENT` ids with their doc-anchors
   and links from the docs.
3. **Derive code-side facts** — grep the `@realizes <ID>` tags and the scenario names
   carrying `REQ`/`NFR` ids; resolve each entity's refer-back anchor. Compute **tag
   coverage**.
4. **Join by id** — pair doc-fact ↔ code-fact. Classify each fact by the taxonomy:
   matched pair → judge agreement by its **tier** (scenario passes = deterministic; else
   AI-semantic advisory; entity = does the anchor resolve); unmatched doc-fact → **gap**;
   unmatched code tag → **orphan**; dangling id → **broken link**; moved/deleted anchor →
   **stale anchor**.
5. **Report** in chat — findings grouped by type, **worst/high-confidence first**, each
   with both anchors, mechanism, and confidence; lead with the tag-coverage number; collapse
   the all-clear facts to a line. Offer (don't auto-do) a Mermaid coherence graph via
   `visualize:trace`. Write **no file** unless asked.

## Reporting findings

Use the finding-record shape in [FactModel.md](FactModel.md). Separate **high-confidence**
(deterministic: failing/missing scenario, broken link, stale anchor) from **advisory**
(AI-semantic drift on a requirement or ADR) — never present an AI guess as settled. Where
a fact is untagged and could only be fuzzy-matched, say so and suggest adding a tag.
