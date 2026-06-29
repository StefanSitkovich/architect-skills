# architect-skills

Skills that mirror the software-development lifecycle, from setting the project
goal to code review. The forward chain: **project-goal → requirements → design →
draft-plan → prototype → write-e2e-tests → implement-plan → review-code**, with
**visualize** cross-cutting throughout.

A **coherence** extension turns the one-way pipeline into a living docs↔code
lattice — facts (requirements, NFRs, decisions, entities) carry stable ids that
code echoes with `@realizes` tags, so the two sides can be reconciled:
**extract** adopts the model on existing code, **audit-coherence** reports where
docs and code have drifted, and **evolve** plans a change doc-diff-first. Plus
**daily-digest**, a standalone repo-overview utility for standup prep.

## Skills

| Skill | Use for |
| --- | --- |
| `project-goal` | Set the project's *current goal* — the one objective being pursued now — in the root agent guide (`AGENTS.md`/`CLAUDE.md`) so other skills read it as scope orientation. Also bootstraps the guide and the SSoT *document structure* (the index mapping each doc concept to its file under `docs/`) when none exists. |
| `requirements` | Engineer the *what* & *why* into a single-source-of-truth requirements doc — vision, stakeholders/personas, functional + non-functional requirements (NFR catalog), success metrics, constraints, MoSCoW. |
| `design` | Maintain the other SSoT docs — architecture, domain model, entities, per-feature technical contracts, and a decision log (ADRs). |
| `draft-plan` | Plan upcoming work into a `plan/` folder — a roadmap, or user stories that link the docs' contracts. |
| `prototype` | Build a throwaway prototype to answer a question before committing — a logic TUI, live UI variants, a greenfield clickdummy, or a technical spike. |
| `write-e2e-tests` | Write BDD-style Given/When/Then E2E tests; scaffold the layered test harness for C#, Java, or TypeScript. |
| `implement-plan` | Execute an existing plan with an agent team — a delegating-only team lead, dev personas in isolated git worktrees, and per-story verification gates (sourced from `review-code`). |
| `review-code` | Review or audit existing code — a PR, branch, module, or whole repo — with fresh per-lens reviewers (correctness, architecture, performance, security, compliance). Owns the review personas the `implement-plan` gates reuse. |
| `visualize` | draw.io or Mermaid diagrams from the code, docs, or plan (mode optional — detected from the request/repo), the SDLC chain traced end-to-end to surface coverage gaps (`trace`), or anything ad hoc. |
| `audit-coherence` | Audit whether the docs and code still agree — derive a fact-model from both sides, join by stable id (`REQ`/`NFR`/`ADR`/`ENT` + `@realizes` code tags), and report drift / gaps / orphans with evidence and confidence. Read-only, on demand. |
| `extract` | Brownfield entry — lift existing code into the fact-model, scaffold the durable SSoT docs from it, and suggest `@realizes` id tags. Proposes facts for sign-off; never auto-authors. |
| `evolve` | Plan a change on existing code + docs by writing the doc-diff first — update the durable facts (`REQ`/`NFR`/ADR) so the docs *are* the spec. Stops at the docs. |
| `daily-digest` | Daily repo overview for standup prep — what the team landed, what's in flight or blocked, and CI health, from git + `gh`. Summarize-only, to chat. Standalone, outside the docs chain. |

## Install

```text
/plugin marketplace add SnafetsTheOne/architect-skills
/plugin install architect@architect-skills
/reload-plugins (claude code)
```
