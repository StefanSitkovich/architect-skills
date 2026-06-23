# architect-skills

Skills that mirror the software-development lifecycle, from setting the project
goal to code review. The chain: **project-goal → requirements → design →
draft-plan → prototype → write-e2e-tests → implement-plan → review-code**, with
**visualize** cross-cutting throughout.

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
| `visualize` | draw.io diagrams from the code, docs, or plan (mode optional — detected from the request/repo), the SDLC chain traced end-to-end to surface coverage gaps (`trace`), or anything ad hoc. |

## Install

```text
/plugin marketplace add SnafetsTheOne/architect-skills
/plugin install architect@architect-skills
/reload-plugins (claude code)
```
