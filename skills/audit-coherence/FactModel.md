# FactModel.md — the shared coherence reference

The operative reference for the docs↔code lattice: what a **fact** is, the **id
scheme**, the **`@realizes` tag grammar**, the **coherence tiering**, the **drift
taxonomy**, and the **finding-record** the report emits. Owned by `audit-coherence`;
`extract` and `evolve` resolve the convention *here* so all three stay consistent.
*(The design rationale lives in the repo-root `Coherence-Extension.md`; this file is
the how-to the skills execute against.)*

## The fact

A **fact** is the smallest projectable unit of intent — stated in the docs, realized
in the code. **Coherence is the invariant that the two projections agree.** A fact has:

- **id** — stable, human-meaningful; the join key.
- **type** — requirement | nfr | decision | entity.
- **doc-anchor** — where it's stated (`file#heading`).
- **code-anchor** — where it's realized (`path:line` / symbol), or null.
- **links** — related fact ids.

Coherence applies **only to facts whose doc projection is durable** — requirements,
NFRs, decisions, entities. Anything the code fully subsumes is **code-owned**: the code
is the source of truth and there is no lasting doc projection to keep in step. A
**contract** is doc **XOR** code — a spec in the contracts doc until built, an artifact
in `contracts/` after — so it can never drift and is out of scope.

## The id scheme

| Prefix       | Fact        | Stated in        | Assigned by    |
| ------------ | ----------- | ---------------- | -------------- |
| `REQ-NNN`    | requirement | requirements doc | `requirements` |
| `NFR-NNN`    | NFR         | requirements doc | `requirements` |
| `ADR-NNNN`   | decision    | decision log     | `design`       |
| `ENT-<Term>` | entity      | entity doc       | `design`       |

Resolve each doc via the agent guide's **Document Index** (the fact-registry root).
Out of scope — code-owned or too granular: **contracts, domain terms, flows**. A
**scenario** has no id of its own; it references the `REQ`/`NFR` it covers.

## The tag grammar — code carries the id

One verb, in the language's comment syntax, on the nearest declaration. The id's prefix
is its type, so one grep finds every tag:

```
// @realizes REQ-012          (C# / Java / TS / Go …)
# @realizes NFR-003           (Python / shell / Ruby …)
<!-- @realizes ENT-Order -->  (HTML / XML / Markdown)
```

- **No language-native attributes** — comments only.
- **Behavior facts ride in the test name** instead: a GWT scenario named for the
  `REQ`/`NFR` it covers (e.g. `RecordExpense_REQ012`, or a `@realizes REQ-012` tag on the
  scenario). A passing scenario *is* that requirement's coherence proof.
- Tag the **load-bearing** facts, not every symbol — untagged facts fall back to AI
  fuzzy-matching (advisory). **Tag coverage is itself a coherence metric**; always report it.

## Coherence tiering — match the mechanism to the fact

Lean on AI **least** where it's weakest:

| Fact                                    | Mechanism                                              | Confidence              |
| --------------------------------------- | ------------------------------------------------------ | ----------------------- |
| REQ / NFR **with** a covering scenario  | the id-linked scenario exists and **passes**           | high (deterministic)    |
| REQ / NFR **without** a scenario        | AI semantic — "is this still reflected in the code?"   | low — **advisory only** |
| Decision (ADR)                          | AI semantic — "is this still reflected?"               | low — **advisory only** |
| Entity (`ENT-`)                         | **link resolution** — does the refer-back anchor resolve? | high (deterministic) |

Entity **structure** (keys / status / fields) is **not** diffed — the class owns it.

## Drift taxonomy

| Finding          | Means                                                            | Applies to              |
| ---------------- | --------------------------------------------------------------- | ----------------------- |
| **Drift**        | doc-fact and code-fact both exist, linked, but disagree         | REQ/NFR, ADR (advisory) |
| **Gap**          | doc-fact has no code realization (planned-not-built)            | REQ/NFR, ADR            |
| **Orphan**       | code carries an id tag whose doc-fact is missing                | any tagged id           |
| **Broken link**  | a traceability id points at a missing target                    | any                     |
| **Stale anchor** | a code-anchor (incl. an entity refer-back) moved or was deleted | ENT, any anchored fact  |

By the refer-back rule, an **entity can only raise broken-link / stale-anchor / orphan**.
**The dangerous failure is a false "coherent"** (missed drift), not a false alarm — bias
every check toward flagging uncertainty rather than asserting agreement.

## The finding-record

The report is **Markdown** (optionally with an inline **Mermaid** graph — see `visualize`),
backed by this record so `visualize:trace` can consume the same data:

```json
{
  "factId": "REQ-012",
  "factType": "requirement",        // requirement | nfr | decision | entity
  "findingType": "drift",           // drift | gap | orphan | broken-link | stale-anchor
  "docAnchor": "docs/Requirements.md#req-012-record-an-expense",
  "codeAnchor": "src/Expenses/RecordExpense.cs:42",   // or null
  "mechanism": "ai-semantic",       // scenario | link-resolve | id-join | ai-semantic
  "confidence": "low",              // high (deterministic) | low (advisory)
  "summary": "one line: what disagrees",
  "evidence": ["quote / snippet / failing scenario name"],
  "links": ["NFR-003"]
}
```

Group findings by type, lead with the **tag-coverage** number, and **never write into the
repo** — the report is a derived, on-demand artifact.
