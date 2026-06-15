# Trace mode – the SDLC chain end to end

Draw the spine that links the artifacts a project produces across its lifecycle,
and **surface the orphans** — the gaps no single-source view can see (a
requirement nothing implements, a contract no test exercises, a quality
attribute no check enforces).

## Precondition

At least two adjacent layers of the chain present (e.g. spec docs + a backlog).
Trace is **named-only** — never auto-detected, because documentation or a plan
alone resolves to docs/plan mode. Reach it when the user says "trace",
"traceability", "coverage", "what's not covered", "orphans", or "gaps".

## Sources

Whatever the project has, across the chain — discover them from the repo and its
doc index, matching on content, not a fixed filename:

- requirements / spec material — requirements and quality attributes (the left edge).
- a decision log — ADRs.
- interface contracts — schema / API / event definitions.
- the plan / backlog — stories or work items and the contracts they reference.
- the test suite — e2e / BDD / acceptance scenarios (the right edge).
- optionally the implementation, when a story→code link is checkable.

## The chain

**Requirement → Decision → Contract → Story → (code) → Test**, plus the
side-edge **quality attribute → enforcing check / test**. Links are matched by
shared language and explicit references — rarely by hard IDs.

## Views

No rigid 6-page minimum — draw the cuts the present sources support. The spine
and the orphan report are the always-on payoff pages.

1. **Traceability spine** – a layered left-to-right graph: requirements, then
   decisions, contracts, stories, tests. Edges = "traces to". Mark every
   **orphan** (a node with no downstream link) in red.
2. **Requirements coverage matrix** – requirements (rows) × stories & tests
   (columns); empty rows are uncovered requirements.
3. **Quality-attribute enforcement map** – each NFR / quality attribute linked to
   the check, gate, or test that enforces it; unenforced ones flagged.
4. **Contract coverage** – contracts × implementing stories *and* exercising
   tests. This extends plan mode's story→contract map ([Plan.md](Plan.md)) one
   layer further, to tests; contracts with no story or no test are flagged.
5. **Orphan report** – one summary page collecting every gap found: requirements
   with no story, contracts with no test, stories with no acceptance test,
   decisions never reflected in a contract, quality attributes with no check.

## Assumptions to flag

The links between layers are rarely explicit IDs — you match them by name,
section reference, or inference. **Say how you matched** (exact name, linked
section, or inferred) and flag the fuzzy matches: a missed match shows up as a
false orphan, so report your matching confidence alongside the gaps. Where a
layer is absent, say which edges of the chain you couldn't trace.
