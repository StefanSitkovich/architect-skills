# Design — Coherence Extension

> Locked spec for extending `architect-skills` from a one-way SDLC *pipeline* into a
> *living* docs↔code lattice. The abstraction, the shared fact-model, the ID-join
> scheme, and the coherence mechanism are settled here before any new skill is cut.
> Status: **locked — ready to build.** Build order: `audit-coherence → extract → evolve`.

## Problem

The suite today is a forward pipeline: `project-goal → requirements → design → draft-plan
→ prototype → write-e2e-tests → implement-plan → review-code`. Intent flows one way, into
code. It has no first-class way to go the other way or to keep the two in step over time:

- **No brownfield entry.** Everything assumes you start at `requirements`. You can't adopt
  the model on a codebase that already exists.
- **No steady-state coherence check.** `review-code` reviews a *change* against doc *rules*;
  `visualize:trace` checks coverage *within* the docs/plan. Neither audits whether the whole
  body of docs still agrees with the actual code.
- **No change-propagation loop.** "Plan a feature on existing code by writing the doc-diff
  first, then the code-diff" is a workflow the suite implies but doesn't own.

## The abstraction

> **One intent, projected into many artifacts** — requirements, decisions, entities, code,
> tests. **Coherence is the invariant: the projections agree.** Every skill either *creates*
> a projection or *reconciles two* of them.

The pipeline becomes a lattice. The lifecycle "modes" are just directions across it:

| Mode                    | Direction                                | Owner                        |
| ----------------------- | ---------------------------------------- | ---------------------------- |
| **New** (greenfield)    | intent → docs → code                     | existing forward chain       |
| **Compare** (drift)     | code ⇄ docs                              | `audit-coherence` (new)      |
| **Expand** (brownfield) | code → docs, then the doc-diff as spec   | `extract` + `evolve` (new)   |

## The spine — coherence only where the doc projection is durable

A fact is worth coherence-checking only if its **doc projection persists**. Where code
*fully subsumes* a fact, the code is the source of truth and the doc projection *disappears*
— there is nothing left to keep in agreement, so the fact is out of scope. This single rule
is what narrows the model:

- **Durable doc facts (checked)** — requirements, NFRs, decisions. The *what / why* lives in
  docs permanently, and code must keep reflecting it.
- **Code-owned facts (not checked)** — contracts and anything mechanical the code expresses
  completely. A contract is a *spec* in the docs only until it is built; on implementation it
  moves to `contracts/` and the doc entry is gone (the existing two-layer rule). It is doc
  **XOR** code, never both at once — so it can never drift, and drops out of coherence.
- **Entities (linked, not diffed)** — the middle case. The class owns the structure, but the
  entity doc carries durable domain narrative, so the entity is *linked back* to its class
  (refer-back), not structurally diffed.

## The fact-model

A **fact** is the smallest projectable unit of intent. Both a doc section and a code symbol
are *projections* of the same fact. A fact has:

- **id** — stable, human-meaningful, the join key (`REQ-…`, `NFR-…`, `ADR-…`, `ENT-…`).
- **type** — one of the kinds below.
- **doc-anchor** — where it's *stated* (`file#heading`).
- **code-anchor** — where it's *realized* (`path:line` / symbol), or null.
- **links** — edges to other fact ids (the traceability chain).

The locked joinable set:

| Fact type           | ID          | Doc projection                | Code projection                        | Coherence mechanism                                   |
| ------------------- | ----------- | ----------------------------- | -------------------------------------- | ----------------------------------------------------- |
| Requirement         | `REQ-NNN`   | requirements doc capability   | indirect — a tagged scenario / @realizes | deterministic if a scenario covers it; else advisory |
| NFR / quality attr  | `NFR-NNN`   | requirements NFR catalog      | a check / scenario                     | deterministic if a scenario covers it; else advisory  |
| Decision            | `ADR-NNNN`  | decision log                  | a tagged choice (`@realizes`)          | AI-semantic, advisory only; human-authored, lean      |
| Entity              | `ENT-<Term>`| entity doc                    | class / type                           | refer-back — link integrity only, no structural diff  |

Explicitly **out** of coherence — the code is the source of truth where it exists:

- **Contracts** — doc XOR code; the doc entry is dropped on implementation.
- **Domain terms** — glossary entries; too granular to tag.
- **Flows** — too granular.
- **Scenarios / guarantees** — no id of their own; a test `@realizes` the `REQ`/`NFR` it
  proves, so a passing scenario *is* that requirement's coherence proof.

> **Design choice: don't persist a separate model file.** A checked-in model would itself
> drift. The model is *derived* on each run from docs + code; the only persisted anchors are
> the **IDs** (in doc anchors and code tags). IDs are the single source of linkage; everything
> else is recomputed. Cache for speed, never trust the cache as truth.

## The ID-join scheme

Coherence checking is reliable only if the doc-side and code-side facts match
**deterministically**. IDs are how:

- **Docs** carry ids in anchors and cross-links — `ADR-NNNN` already, and now `REQ-`/`NFR-`
  assigned at birth by `requirements`, `ENT-<Term>` by `design`.
- **Code** carries the same id via one lightweight **comment annotation**, `@realizes <ID>`,
  in the language's comment syntax, on the nearest declaration. The id's **prefix is the
  type**, so a single grep finds every tag and the parser stays trivial.
- **Behavior facts ride in the test/scenario name** instead — a GWT scenario named for the
  `REQ`/`NFR` it covers *is* that requirement's coherence proof.
- The join is then `id → fact pair`, computed mechanically. **AI judges only one question per
  matched pair — "do these two still agree?"** — far more reliable than discovering drift
  from scratch.
- Facts with no id tag fall back to AI fuzzy-matching: **advisory, low-confidence**, with a
  prompt to add a tag. **Tag coverage is itself a coherence metric.**

### Tag grammar

One verb. The prefix carries the type:

| Prefix       | Fact        | Assigned by    |
| ------------ | ----------- | -------------- |
| `REQ-NNN`    | requirement | `requirements` |
| `NFR-NNN`    | NFR         | `requirements` |
| `ADR-NNNN`   | decision    | `design`       |
| `ENT-<Term>` | entity      | `design`       |

Comment syntax adapts per language — `// @realizes REQ-012`, `# @realizes NFR-003`,
`<!-- @realizes ENT-Order -->`. **No language-native attributes** — comments only, plus the
test-name carrier for behavior. Scenarios reference a `REQ`/`NFR` id; they have no id of their
own.

## Coherence tiering — match the mechanism to the fact

Lean on AI **least** where it's weakest:

| Fact                                       | Mechanism                                                         | Confidence              |
| ------------------------------------------ | ---------------------------------------------------------------- | ----------------------- |
| Requirement / NFR **with** a scenario      | the GWT scenario is id-linked and **passes**                     | high (deterministic)    |
| Requirement / NFR **without** a scenario   | AI semantic — "is this still reflected?"                         | low — **advisory only** |
| Decision (ADR)                             | AI semantic — "is this still reflected?"                         | low — **advisory only** |
| Entity                                     | **link resolution** — does the refer-back code-anchor resolve?   | high (deterministic)    |

This shifts from the original proposal: with contracts dropped, the deterministic tier now
rests on **id-linked passing scenarios** (requirements) and **link resolution** (entities).
The "generate structure from code and structurally diff" mechanism left with contracts.

## Drift taxonomy — and which findings each fact can raise

| Finding          | Means                                                            | Applies to                |
| ---------------- | --------------------------------------------------------------- | ------------------------- |
| **Drift**        | doc-fact and code-fact both exist, linked, but disagree         | REQ/NFR, ADR (advisory)   |
| **Gap**          | doc-fact has no code realization (planned-not-built)            | REQ/NFR, ADR              |
| **Orphan**       | code carries an id tag whose doc-fact is missing (built-not-documented) | any tagged id     |
| **Broken link**  | a traceability id points at a missing target                    | any                       |
| **Stale anchor** | a code-anchor (incl. an entity refer-back) moved or was deleted | ENT, any anchored fact    |

By the refer-back decision, **entities can only ever raise broken-link / stale-anchor /
orphan — never a structural "drift."**

Every finding carries both anchors (`file:line` ↔ `doc#heading`), a type, and a confidence.
**The dangerous failure is a false "coherent"** (missed drift), not a false alarm — so every
check biases toward flagging uncertainty rather than asserting agreement.

## The report finding-record

`audit-coherence` emits the report as **Markdown** (with an optional inline **Mermaid** graph),
backed by this record shape so `visualize:trace` can consume the same data:

```json
{
  "factId": "REQ-012",
  "factType": "requirement",        // requirement | nfr | decision | entity
  "findingType": "drift",           // drift | gap | orphan | broken-link | stale-anchor
  "docAnchor": "docs/Requirements.md#record-an-expense",
  "codeAnchor": "src/Expenses/RecordExpense.cs:42",   // or null
  "mechanism": "ai-semantic",       // scenario | link-resolve | id-join | ai-semantic
  "confidence": "low",              // high (deterministic) | low (advisory)
  "summary": "one line: what disagrees",
  "evidence": ["quote / snippet / failing scenario name"],
  "links": ["NFR-003"]
}
```

The report groups findings by type, leads with a **tag-coverage** number, and **never writes
into the repo** — it is a derived, on-demand artifact. There is no CI consumer; run it when you
want it.

## Skills

**New** (build order: `audit-coherence → extract → evolve`):

- **`audit-coherence`** *(code ⇄ docs)* — the keystone. Read-only, run on demand. Derive the
  fact-model from both sides, join by id, diff, and emit the report above with evidence and
  confidence. It forces the fact-model and tag grammar into existence; `extract` and `evolve`
  reuse both.
- **`extract`** *(code → docs)* — the brownfield entry point. Lift existing code into the
  fact-model, scaffold/update the **durable** SSoT docs (requirements `REQ`/`NFR`, entity
  refer-back links), and suggest `@realizes` tags for untagged code. It **proposes** decisions;
  it never auto-authors an ADR. Prerequisite for comparing anything.
- **`evolve`** *(doc-diff first)* — given a desired feature on existing code + docs, author the
  **doc-diff**: update the durable facts (`REQ`/`NFR`, and any ADR you sign off) so the docs
  describe the target state. The doc-diff *is* the spec; `evolve` stops there.

**Extensions to existing skills:**

- **`requirements`** — assigns stable `REQ-NNN` / `NFR-NNN` ids at birth, so facts are joinable
  from the start. *(Visible change: each functional-requirement capability and each NFR entry
  carries an id.)* Like ADRs, a `REQ`/`NFR` is written only on **explicit user sign-off** —
  proposed, never generated (most load-bearing when `extract` derives them from existing code).
- **`design`** — entity docs gain a **refer-back** code-anchor (`ENT-<Term>` → its class);
  decisions already carry `ADR-NNNN`. Emits ids and leaves code-anchor placeholders. ADR
  authoring follows the sign-off rule (see `Decisions.md`).
- **`write-e2e-tests`** — a scenario carries the `REQ`/`NFR` id it covers in the scenario name,
  so a passing GWT test doubles as that requirement's coherence proof. The only change to the
  test convention.
- **`visualize`** — gains a **draw.io-or-Mermaid** format option (draw.io default for the
  exploration modes; Mermaid for inline / GitHub-native output). `visualize:trace` extends
  across the code boundary — consuming the coherence report and rendering orphans/gaps/drift,
  now joined by **hard ids** rather than fuzzy name-matching.
- **`project-goal`** — the doc index becomes the **fact-registry root**: where the durable doc
  facts live and resolve.

## Non-goals / realism

- **Code is the source of truth where it exists.** Anything the code fully expresses (contracts,
  mechanical structure) lives in code; its doc projection is dropped, not kept in sync.
  Coherence applies only to durable doc facts.
- **Durable facts are authored on sign-off, not generated.** `REQ` / `NFR` / ADR are *proposed*
  by a skill and written only on explicit user sign-off — most load-bearing for `extract`, which
  derives them from existing code. ADRs are additionally kept **lean** (record only a decision a
  future reader would re-litigate), written straight as `Accepted`; a missing ADR is advisory,
  never a gate.
- **Deterministic-first.** Lean on id-linked passing scenarios and link resolution; reserve AI
  for the genuinely semantic gaps, where verdicts are **advisory and human-gated**, always with
  evidence anchors.
- **No CI for now.** `audit-coherence` is read-only and run on demand; a gate is a possible-later,
  not a current goal.
- **Don't build a parallel suite** — these compose with the existing chain.

## Locked decisions

1. **Tagging** — one comment annotation `@realizes <typed-id>` (language-adapted comment syntax),
   plus test/scenario-name encoding for behavior facts. No language-native attributes. Untagged
   → advisory fuzzy-match; tag coverage is a metric.
2. **Joinable id set** — `REQ-NNN`, `NFR-NNN`, `ADR-NNNN`, `ENT-<Term>` (refer-back only).
   Contracts, domain terms, and flows are out. Scenarios reference the `REQ`/`NFR` they cover.
3. **Entities** — refer-back (link integrity), not structural diff; upgradeable per-entity to a
   full join later if drift ever bites.
4. **ADRs (and `REQ`/`NFR`)** — lean bar; explicit user sign-off precedes writing. ADR states
   are `Accepted → Superseded/Deprecated` (`Proposed` dropped — undecided lives as a `TBD`).
5. **CI** — none for now; report-only, on demand.
6. **Rendering** — `visualize` gains a draw.io / Mermaid option; the coherence report renders
   inline Mermaid.

## Build order

`audit-coherence → extract → evolve` — the first forces the fact-model + ID-join that the other
two reuse.
