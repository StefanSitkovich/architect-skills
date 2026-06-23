---
name: prototype
description: >-
  Use when the user wants to build a throwaway prototype to answer a question
  before committing — sanity-check a data model or state machine, mock up a UI,
  explore design options, validate a greenfield UI with a clickable dummy, or
  spike a technical / architecture unknown. "Prototype this", "let me play with
  it", "try a few designs", "will this approach even work?", "make a clickdummy".
  Routes to one of four branches by the question; the prototype is throwaway, and
  the *answer* is the only thing kept.
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the
shape — pick the branch, build the smallest thing that answers it, capture the
answer, throw the rest away.

## Pick a branch

Identify the question — from the prompt, the surrounding code, or by asking if the
user is around:

| The question                                            | Branch                       | Shape                                                                       |
| ------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| "Does this logic / state model feel right?"             | [Logic](Logic.md)            | a tiny interactive terminal app driving the state machine by hand           |
| "What should this look like?" *(an app exists to host it)* | [UI](UI.md)               | several radically different UI variants on one route, switchable live        |
| "What should this look like?" *(greenfield — no app yet)*  | [ClickDummy](ClickDummy.md) | a clickable dummy via a UI-prototyping tool, from the design's pages          |
| "Will this approach even work?"                         | [Spike](Spike.md)            | a throwaway tracer that de-risks a technical / architecture / integration unknown |

The branches produce very different artifacts — getting the question wrong wastes
the whole prototype. If it's genuinely ambiguous and the user isn't reachable,
default to the branch that best fits the surrounding context and state the
assumption at the top.

## Rules that apply to every branch

1. **Throwaway from day one, and clearly marked.** Locate it near where it would
   really be used so context is obvious, but name it so a casual reader sees it's a
   prototype, not production. Obey the project's existing conventions; don't invent
   a new top-level structure.
2. **One command to run.** Whatever the project's task runner supports — the user
   starts it without thinking.
3. **No persistence by default.** State lives in memory. Persistence is usually the
   thing being *checked*, not depended on; if the question is about it, hit a
   scratch store named "PROTOTYPE — wipe me".
4. **Skip the polish.** No tests, no error handling beyond what makes it runnable,
   no abstractions. Learn fast, then delete.
5. **Surface the state / the options.** Make what changed (logic) or what differs
   (UI) visible at a glance — that's the whole point.
6. **Capture the answer, then delete or absorb.** The *answer* is the only thing
   worth keeping. Write it where it belongs — an ADR in the **decision log** (via
   `design`), a **requirements** / **contracts** doc update, or a commit/issue
   note — with the question it answered. Then delete the prototype, or fold the
   validated decision into the real code. Don't leave it rotting in the repo.

## On the question being answered

Before writing code, write the question down in one line, in the prototype's
location or a top-of-file comment — so it can be checked later, whether the user is
watching now or returning to it. A prototype that answers the wrong question is
pure waste.
