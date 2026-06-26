# Design — Coherence Extension

> A design proposal for extending `architect-skills` from a one-way SDLC *pipeline* into a
> *living* docs↔code lattice. Locks the abstraction, the shared fact-model, and the ID-join
> scheme before any new skill is cut. Status: **proposal, for review.**

## Problem

- The suite today is a forward pipeline: `project-goal → requirements → design → draft-plan → prototype → write-e2e-tests → implement-plan → review-code`. Intent flows one way, into code.
  It has no first-class way to go the other way or to keep the two in step over time:
- **No brownfield entry.** Everything assumes you start at `requirements`. You can't adopt the
  model on a codebase that already exists.
- **No steady-state coherence check.** `review-code` reviews a *change* against doc *rules*;
  `visualize:trace` checks coverage *within* the docs/plan. Neither audits whether the whole
  body of docs still agrees with the actual code.
- **No change-propagation loop.** "Plan a feature on existing code by writing the doc-diff
  first, then the code-diff" is a workflow the suite implies but doesn't own.

## The abstraction

> **One intent, projected into many artifacts** — requirements, decisions, contracts, diagrams,
> code, tests. **Coherence is the invariant: the projections agree.** Every skill either
> *creates* a projection or *reconciles two* of them.

The pipeline becomes a lattice. The lifecycle "modes" are just directions across it:

| Mode                          | Direction                                | Owner                          |
| ----------------------------- | ---------------------------------------- | ------------------------------ |
| **New** (greenfield)    | intent → docs → code                   | existing forward chain ✅      |
| **Compare** (drift)     | code ⇄ docs                             | `audit-coherence` (new)      |
| **Expand** (brownfield) | code → docs, then doc-diff → code-diff | `extract` + `evolve` (new) |

## The fact-model (the load-bearing decision)

For docs and code to be compared, both must reduce to a common structured layer. A **fact** is
the smallest projectable unit of intent. Both a doc section and a code symbol are *projections*
of the same fact.

A fact has:

- **id** — stable, human-meaningful (`REQ-…`, `NFR-…`, `ADR-…`, contract/entity/flow ids). The
  join key. Already partly in use (ADR numbers, contract anchors).
- **type** — one of the kinds below.
- **doc-anchor** — where it's *stated* (`file#heading`).
- **code-anchor** — where it's *realized* (`path:line` / symbol), or null.
- **links** — edges to other fact ids (the traceability chain).

Fact types and their natural projections:

| Fact type                       | Doc projection            | Code projection                   |
| ------------------------------- | ------------------------- | --------------------------------- |
| Requirement / NFR               | requirements doc          | (indirect — via contracts/tests) |
| Decision (ADR)                  | decision log              | a tagged choice in code           |
| Domain term / Entity            | domain model / entity doc | class / type                      |
| Contract (API / event / config) | contracts doc + diagram   | interface / schema / settings     |
| Flow / behavior                 | sequence diagram          | code path                         |
| Guarantee / invariant           | NFR + business rule       | an executable scenario            |
| Component / container           | C4 diagram                | module / package                  |
| Scenario (GWT)                  | test-as-doc               | the test                          |

> **Design choice: don't persist a separate model file.** A checked-in model would itself drift.
> The model is *derived* on each run from docs + code; the only persisted anchors are the **IDs**
> (in doc anchors and code tags). IDs are the single source of linkage; everything else is
> recomputed. Cache for speed, never trust the cache as truth.

## The ID-join scheme

Coherence checking is only reliable if the doc-side and code-side facts can be matched
**deterministically**. IDs are how:

- **Docs** already reference ids in anchors and cross-links (ADR-0007, contract anchors).
- **Code** carries the same id via a lightweight, language-adapted tag — a comment annotation
  (`// @realizes ADR-0007`, `# @contract relay.monitor`), an attribute/annotation, or a test
  name encoding the id. Where C#/Java/TS differ, the convention adapts (mirrors how
  `write-e2e-tests` already splits per language).
- The join is then **id → fact pair**, computed mechanically. **AI only judges one question per
  matched pair — "do these two still agree?"** — which is far more reliable than asking it to
  discover drift from scratch.
- Facts with no id tag fall back to AI fuzzy-matching: **advisory, low-confidence**, and a prompt
  to add a tag. Tag coverage is itself a coherence metric.

This is why `audit-coherence` is built first: it forces the fact-model and the tagging
convention into existence, and `extract` / `evolve` then reuse both.

## Coherence tiering — match the mechanism to the fact type

Not everything is checkable the same way. Lean on AI **least** where it's weakest:

| Fact type                              | Coherence mechanism                                                                                    | Confidence                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Behavior / guarantee                   | executable **GWT** scenario — coherent ⇔ scenario exists, is id-linked, and passes            | high (deterministic)          |
| Structure / contract / schema / config | **generate from code** + structural diff — coherent ⇔ empty diff (or the doc *is* generated) | high (deterministic)          |
| Requirement / decision / rationale     | **AI semantic judgment** — "is this still reflected?"                                           | low —**advisory only** |

## Drift taxonomy (what `audit-coherence` reports)

- **Drift** — doc-fact and code-fact both exist, linked, but disagree.
- **Gap** — doc-fact has no code realization (doc ahead / planned-not-built).
- **Orphan** — code-fact has no doc (code ahead / built-not-documented).
- **Broken link** — a traceability id points at a missing target.
- **Stale anchor** — doc-fact's code-anchor moved or was deleted.

Every finding carries both anchors (`file:line` ↔ `doc#heading`), a type, and a confidence.
**The dangerous failure is a false "coherent"** (missed drift), not a false alarm — so every
check biases toward flagging uncertainty rather than asserting agreement.

## Skills

**New:**

- **`extract`** *(code → docs)* — the brownfield entry point. Lift existing code into the
  fact-model, scaffold/update the SSoT docs + diagrams, and suggest id tags for untagged code.
  Prerequisite for comparing anything.
- **`audit-coherence`** *(code ⇄ docs)* — the keystone. Derive fact-models from both sides, join
  by id, diff, and emit the drift report (above) with evidence and confidence. Read-only.
  CI-runnable.
- **`evolve`** *(change propagation)* — given a desired feature on existing code+docs: write the
  **doc-diff first** (it *is* the spec), hand the code-diff to `implement-plan`, then re-run
  `audit-coherence` to close the loop.

**Extensions to existing skills:**

- `write-e2e-tests` — scenarios carry fact ids, so a GWT test doubles as a guarantee's coherence
  proof.
- `visualize:trace` — extend across the code boundary (today it's intra-doc); render the
  coherence report as a graph with orphans/gaps highlighted, reusing the trace view.
- `design` / `requirements` — emit stable ids and code-anchor placeholders so facts are joinable
  from birth, not retrofitted.
- `project-goal` — the doc-structure index becomes the fact-model's registry root.

## Non-goals / realism

- **Not** auto-verifying rationale, and **not** generating the *why* — ADRs are authored.
- **Deterministic-first.** Generate structure/schema from one source and diff mechanically;
  reserve AI for the genuinely semantic gaps.
- AI verdicts are **advisory and human-gated**, always with evidence anchors.
- Don't build a parallel suite — these compose with the existing one.

## Open decisions to lock before cutting skills

1. **Code tagging convention** — comment annotation vs attribute/annotation vs test-name
   encoding, per language. (Proposal: comment annotation + test-name, language-adapted.)
2. **Report schema** — the finding record shape, so CI and `visualize:trace` can both consume it.
3. **CI shape** — `audit-coherence` as a gate (fail on new high-confidence drift) vs report-only.
4. **`visualize-architecture` (Mermaid)** — fold in as the Mermaid counterpart to the draw.io
   `visualize`, or keep separate?

## Sequential build order

`audit-coherence` → `extract` → `evolve`, because the first forces the fact-model + ID-join that
the other two reuse.
