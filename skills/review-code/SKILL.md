---
name: review-code
description: >-
  Use when the user wants to review or audit existing code — a pull request, a
  branch diff, a module, or a whole codebase — for correctness, architecture
  fit, performance, security, or compliance against the project's docs.
  "Review this PR", "audit the auth module", "is this branch sound?", "review my
  changes". Spawns fresh, read-only reviewers (one per lens) and reports findings
  tied to file:line and the doc rule or defect behind each. Owns the review
  personas that the implement-plan gates also use — one source of truth. Not for
  writing code (implement-plan), drafting docs (design), or planning
  (draft-plan).
---

# Review Code

Reviews existing code with a panel of fresh, read-only reviewers — one per lens.
The lenses live in [personas/](personas) and are the **single source** for the
project's review personas: `implement-plan` references these same files for its
per-story gates. One set of personas, two harnesses — this skill runs them
standalone against existing code; `implement-plan` runs them in-flight against a
story branch.

## Principles

- **Read-only.** Reviewers change nothing — no fixes, no commits, no "small
  cleanups". They produce findings; the user (or `implement-plan`) acts on them.
- **Fresh eyes, one per lens.** A separate reviewer per lens, in parallel, each
  with no stake in the work. Fresh contexts catch what the author can't see.
- **Docs are the rulebook.** Every finding ties to a documented rule (in the
  architecture, domain model, requirements, contracts, or decision-log docs) or a
  concrete defect. An opinion with no rule and no measurable
  risk behind it is a remark, not a finding.
- **Report, don't guess.** Where the docs are silent, flag a doc gap — don't
  invent a standard to enforce.
- **Mind the current goal.** The goal in the agent guide says what's in scope now;
  work that drifts well outside it is fair to flag as a scope finding.

## Input

| What    | Default                       | Notes                                                          |
| ------- | ----------------------------- | -------------------------------------------------------------- |
| Subject | the current branch vs its base | a PR number, a branch/diff, a path/module, or the whole repo  |
| Docs    | the SSoT docs                 | read-only rulebook for the lenses                              |

Resolve the subject to a concrete change to read:

- **PR** — `gh pr diff <n>`, plus the PR description as the stated intent.
- **Branch** — merge-base diff vs its base: `git diff <base>...<branch>`.
- **Module / path** — review the files as they stand.
- **Whole repo** — an audit; scope by the lenses, riskiest/newest areas first, and
  **say what you sampled vs read in full** (no silent truncation).

## Workflow

1. **Scope** — resolve the subject and read the change. State the **intent** it
   should satisfy: acceptance criteria if a plan covers it, else the PR/issue
   description or what the user says it is for.
2. **Pick the lenses** — Correctness and Architect always; the optional lenses by
   their trigger (table below).
3. **Spawn the panel** — one subagent per lens, in parallel (Agent tool),
   read-only. Give each: read `<skill-dir>/personas/<Lens>.md`; how to obtain the
   subject (the diff/files); the intent/spec; and the docs to check against. Each
   returns its verdict in the persona's shape. `<skill-dir>` is this skill's base
   directory — pass it as an absolute path, teammates don't inherit your context.
4. **Report** — collect the verdicts and present findings in chat as one list
   **ordered by severity, worst first**; each line names its lens, the file:line,
   and the rule or defect behind it. Collapse the all-clear lenses to a line.
   Don't write a file unless asked — then offer to post PR comments, open issues,
   or hand the findings to `implement-plan` for the fix.

## Lenses

| Lens                                    | Runs                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| [Correctness](personas/Correctness.md)  | always — does the change do what it claims, free of defects                            |
| [Architect](personas/Architect.md)      | always — fit vs the architecture / domain model / contracts / decision-log docs |
| [Performance](personas/Performance.md)  | docs/contracts state budgets or NFRs, or the change touches a hot path or bulk data    |
| [Security](personas/Security.md)        | the change touches authn/authz, input parsing, secrets, PII, new endpoints or deps     |
| [Compliance](personas/Compliance.md)    | docs carry regulatory requirements (audit, retention, licensing, residency)            |

…or whenever the user asks for a specific lens. A subject **passes** review when
every applied lens passes; report all findings together so they can be addressed
in one pass.
