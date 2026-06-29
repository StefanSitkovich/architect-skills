---
name: daily-digest
description: >-
  Use when the user wants a daily overview of a GitHub repo's state to prepare
  for a standup — what landed, what's in flight, what's blocked, and CI health
  across the whole repo (the team's commits, PRs, and issues), pulled from git and
  GitHub via the gh CLI. "Daily digest", "prep for standup", "what happened in the
  repo since yesterday", "what's in flight / blocked?", "state of the repo". A
  neutral repo-wide overview, summarize-only, output to chat — writes no file. A
  standalone utility, not part of the SDLC docs chain (it never reads plan/ or the
  SSoT docs).
---

# Daily Digest

A daily, repo-wide overview to prep for a standup: one scannable summary of the **state
of the GitHub repo** — what the team landed, what's in flight, what's blocked, and whether
CI is healthy. Assembled from git + the `gh` CLI. **Summarize-only** (it reports state, it
doesn't plan or editorialize) and **ephemeral** — output goes to chat and **no file is
written**. Standalone: it ignores the SSoT docs and `plan/` entirely.

## Prerequisites

- `gh` authenticated with access to the repo (`gh auth status`). Run inside a git repo with
  a GitHub remote.
- **Caveat — GitHub Actions only.** CI health reads GitHub Actions (`gh run`). External CI
  (CircleCI, Jenkins, Azure Pipelines) is invisible unless it reports back through GitHub's
  Checks API; say so if the repo's CI looks external.

## Inputs

| Input  | Default                        | Notes                                                       |
| ------ | ------------------------------ | ----------------------------------------------------------- |
| Window | since the previous working day | an arg widens it (`daily-digest 3d`, `daily-digest 1w`); widen on a Monday |
| Repo   | the current repo               | the GitHub remote of the cwd                                |

## Workflow

1. **Resolve the window** — compute the since-date (default ≈ 1 day; honor an explicit window arg).
2. **Gather** (read-only `gh` / `git`), **repo-wide** within the window, showing the
   author/assignee on each item so it's clear who did what:
   - **Landed** — commits to the default branch (`git log --since=<date>`); merged PRs
     (`gh pr list --state merged --search "merged:>=<date>"`); issues closed.
   - **In flight** — open PRs with review + CI state (`gh pr list --state open --json
     number,title,author,reviewDecision,statusCheckRollup,updatedAt`); recently opened/updated
     open issues (`gh issue list --state open`).
   - **Blocked / stalled** — open PRs that are `CHANGES_REQUESTED`, awaiting review, or have a
     failing `statusCheckRollup`; issues labelled blocked.
   - **CI health** — latest run per workflow on the default branch, push/schedule-triggered
     (`gh run list --branch <default> --json name,conclusion,event,headBranch,createdAt`); surface
     failing or stuck ones (exclude `pull_request` runs — those are covered under "In flight").
3. **Render to chat** — four sections, each a tight bulleted list, newest first; PRs/issues as
   `#123 title — @author` with their state (review decision, CI red/green, age). Collapse an empty
   section to one line ("Nothing landed since <date>"). Lead with a one-line headline (e.g. "5
   landed · 4 in flight · 2 awaiting review · main is green").

## Sections

1. **Landed** — merged PRs, closed issues, and commits to the default branch in the window (with authors).
2. **In flight** — all open PRs (review + CI state) and recently active open issues.
3. **Blocked / stalled** — PRs stalled on review or red CI; blocked issues.
4. **CI health** — standalone (non-PR) workflow runs on the default branch: is it green, are the
   scheduled workflows passing.

Keep it summarize-only and neutral — report the repo's state and who did what; don't invent a
"today we'll…" plan or single anyone out. Write no file; everything goes to chat.
