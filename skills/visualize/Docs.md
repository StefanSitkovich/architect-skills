# Docs mode – diagrams from the project docs

The docs are authoritative; regenerate fresh from them each run.

## Precondition

The project's prose documentation — requirements / spec material, an architecture or design doc, interface contracts (API specs, DB schema, event definitions), a glossary or domain model, a decision log. **Discover what exists**: follow the doc index in `AGENTS.md` / `CLAUDE.md` or the README if there is one; otherwise scan the docs folder / wiki the repo keeps. File names vary by project — match on **content, not a fixed filename**. Not every kind need exist; draw the views the available docs support and note which were skipped for lack of source.

## Views (≥ 6 pages)

A menu grouped by the kind of source content, not a fixed list — draw the views whose source is present; skip and note the rest. Use the standard notation/colors of each diagram type.

**From requirements / spec material**

1. **User Journey** – the primary persona's end-to-end journey, phased.
2. **Stakeholder power/interest grid** – the stakeholders / personas on the classic 2×2 (power vs. interest).
3. **MoSCoW board** – capabilities grouped Must / Should / Could / Won't, where the docs state a prioritization.
4. **NFR / quality-attribute tree** – the non-functional requirements / quality attributes as a mind-map (these are the budgets later checks enforce, so draw them as a set).

**From a domain model or glossary**

5. **DDD Context Map** – bounded contexts and external systems.
6. **Event Storming** – one swimlane per domain process or flow described.

**From architecture / design material**

7. **C4 L1 – System Context** – personas, the system, external systems.
8. **C4 L2 – Container** – deployable units (frontend, services, databases, brokers).
9. **C4 L3 – Component** – modules of the most central container.

**From interface contracts (schema / API / events)**

10. **ER diagram** – entities/tables from the data schema / SQL; skip if none defined.
11. **API / Data Contract Map** – routes + request/response bodies from the API spec.
12. **Event / Stream Schema** – topics/events (producers → topic → consumers); skip if none.

**From a decision log (ADRs)**

13. **ADR status graph** – each decision a node, colored by status (proposed / accepted / superseded), with `supersedes` edges to its predecessor. Surfaces the live decision set vs. the graveyard at a glance.
14. **Decision timeline** – ADRs in chronological order, supersessions/re-opens drawn as branches; add only when the decision history is rich enough to be worth a sequence.

## Assumptions to flag

DDD relationship patterns (OHS/PL/Conformist/Customer-Supplier) and Event Storming policies are rarely stated verbatim in docs → flag them as assumptions in the chat report. Stakeholder power/interest placement and MoSCoW buckets are judgement calls unless the doc states them — flag where you inferred. Where the docs are silent, name the gap instead of guessing.
