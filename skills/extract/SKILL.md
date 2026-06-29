---
name: extract
description: >-
  Use when the user wants to adopt the docs↔code model on a codebase that already
  exists — the brownfield entry point. Lift existing code into the fact-model:
  scaffold or update the single-source-of-truth docs (requirements / NFRs, entity
  refer-back links) from what the code already does, and suggest @realizes id tags
  for untagged code. "Adopt this on our existing repo", "reverse-engineer the
  docs", "bootstrap docs from the code", "tag the code for coherence". Proposes
  durable facts (REQ / NFR / ADR) for explicit sign-off — never auto-authors them.
  The prerequisite for running audit-coherence on a repo that has no docs yet. Not
  the greenfield path (requirements / design) or change propagation (evolve).
---

# Extract

The **brownfield entry point** (`code → docs`). The forward chain assumes you start at
`requirements`; `extract` is how you adopt the model on a codebase that already exists —
lift the code into the fact-model, scaffold the durable SSoT docs from it, and lay down
the id tags so `audit-coherence` has something to join against.

Reuses the shared convention in **[../audit-coherence/FactModel.md](../audit-coherence/FactModel.md)**
— same fact types, id scheme, and tag grammar.

## Principles

- **Code is the source of truth here.** You're documenting what the code *does*, not
  redesigning it. Where the code already fully expresses a fact (a contract, mechanical
  structure), leave it in code — only durable facts (`REQ`/`NFR`/`ADR`/`ENT`) become docs.
- **Propose, never generate-and-commit.** Every durable fact is **proposed in chat** and
  written only on explicit user sign-off — most load-bearing for ADRs and `REQ`/`NFR`,
  which a brownfield sweep could otherwise spew. A declined proposal writes nothing.
- **Lean.** Don't mint a `REQ` per function or an ADR per choice. Capture the capabilities
  and decisions a future reader would actually need.
- **Tag the load-bearing, flag the rest.** Suggest `@realizes` tags where a fact clearly
  realizes a doc; leave the long tail to fuzzy-matching and report tag coverage.
- **Interview to fill the *why*.** Code shows *what* and *how*; it rarely shows *why*. Ask
  the user for rationale rather than inventing it — an ADR's context is authored, not mined.

## Workflow

1. **Read the model + the repo** — [../audit-coherence/FactModel.md](../audit-coherence/FactModel.md),
   the agent guide (goal + Document Index; run `project-goal` first if there's no guide), any
   docs that already exist, and enough of the code to ground real capabilities and entities.
2. **Derive candidate facts** — from the code's capabilities (→ `REQ`), measurable
   guarantees / budgets (→ `NFR`), rich domain types (→ `ENT`), and load-bearing choices that
   beg a *why* (→ candidate `ADR`).
3. **Propose, then write on sign-off** — present the candidate durable facts; on sign-off,
   write them into the SSoT docs (via `requirements` / `design`) with their stable ids, and
   add each `ENT`'s **refer-back** anchor to its class.
4. **Suggest tags** — list the `@realizes <ID>` comment tags (and scenario-name ids) to add
   to the realizing code; apply them on the user's OK.
5. **Hand off** — once docs + tags exist, point at `audit-coherence` to get the first drift
   report, and `evolve` for the next change. Report tag coverage and anything you couldn't
   ground (a `TBD`, not a guess).
