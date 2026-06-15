# Plan mode – diagrams from the plan / backlog

The plan is authoritative; derive fresh from the planning material each run.

## Precondition

A plan, backlog, or roadmap — wherever the project keeps it: a `plan/` folder, a
backlog or roadmap file, milestone docs, an issue/ticket export. It holds the
work breakdown (epics / stories / milestones) and their ordering. The technical
contracts the stories reference live in the project's documentation; read them
for the contract-linked views below. The pure contract diagrams (ER, API map,
event schema) are **Docs mode** — see [Docs.md](Docs.md). Not every artifact need
exist; draw the views the available material supports and note which were skipped
for lack of source.

## Views (≥ 6 pages)

Use the standard notation/colors of each diagram type.

1. **Story Map** – the stories/work items sliced into releases per the roadmap.
2. **Hierarchy Tree** – Milestone → Epic → Story.
3. **Roadmap / Dependency order** – milestones in delivery order with their
   dependency edges; an ordered dependency view if the plan carries no dates, a
   timeline if it does.
4. **Story → Contract coverage map** – each story linked to the contract sections
   it implements; surfaces stories with no contract and contracts no story uses.
5. **Sequence diagram** – a key planned flow, from the stories' acceptance
   criteria and the contracts they reference.
6. **C4 L2 – Container (as planned)** – the to-be target architecture from the
   roadmap scope plus the architecture / contract docs.

## Assumptions to flag

The plan often leaves gaps the diagram has to bridge — story→task decomposition,
the chosen key flow, container boundaries not yet built. Flag these as
assumptions in the chat report. Where the planning material contradicts itself or
the docs, report it instead of guessing.
