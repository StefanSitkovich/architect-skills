# Contracts.md — guidance

Guidance for maintaining a project's `Contracts.md` — the **per-feature technical
contracts** work must honor: database tables, API / data contracts, event /
stream schemas, pages, and config. The durable system-level *how* lives in
`Architecture.md`; term meanings in `DomainModel.md`; capabilities in
`Requirements.md` — link, don't restate. *(Meta-guidance for the skill, not an
actual contracts doc.)*

A contract starts here, scoped to the feature that introduces it. **When a
contract becomes standing** — every feature now depends on it, it is no longer
"this feature's" — promote the *rule* it encodes into `Architecture.md` (a stack
choice, a boundary, a cross-cutting pattern) and keep the concrete schema here.
That promotion is the line between this doc and `Architecture.md`.

Per header, deltas from the standard workflow in
[SKILL.md](SKILL.md#workflow-for-every-change) on **create / edit / delete** —
plus a **Visualize** default for sections worth drawing.

## Form

- **Group by bounded context / feature**, so a feature's table, API and event sit
  together; add a shared section for cross-cutting artifacts.
- **Stable heading per artifact** so plans and stories can deep-link:
  `Contracts.md#incident-tables`.
- Write each artifact as a fenced code block with its rationale beside it —
  narrative + cross-reference, not a runnable script.

## Tables

Pseudo-SQL `CREATE TABLE` per table: schema, table, every column with its type and
nullability; `--` comments for anything non-obvious.

- **Create** — list all columns incl. PKs/FKs; use the target DB's type names
  (`BIGINT`, `TEXT`, `TIMESTAMP`, `BOOLEAN`). Link the entity to `DomainModel.md`.
- **Edit** — for an alter, show only the affected columns with
  `-- ADD` / `-- DROP` / `-- MODIFY`.
- **Visualize** — ER diagram: the tables and the relationships among them.

> ```sql
> CREATE TABLE <schema>.<table> (
>     column_name   TYPE   NOT NULL,
>     -- comment if non-obvious
> );
> ```

## API / Data Contracts

One entry per endpoint: the route, plus the query params, request body and
response body that apply.

- **Create** — inline the JSON, or reference the file for a large body
  (`→ contracts/incident.response.json`). When just listing, one line each:
  `` `GET /incidents/{id}` ``.
- **Visualize** — API / data-contract map: routes with their request/response shapes.

> **`POST /incidents`** — create an incident
> Request: `{ "field": "type / example" }` · Response: `{ "field": "type / example" }`

## Events / Stream Schemas

Per topic/stream: the name, when it is emitted, the payload schema (JSON or Avro),
and the key fields.

- **Create** — inline small schemas; promote Avro/registry schemas to a file
  (`→ contracts/incident.avsc`).
- **Visualize** — event / stream map: producers → topic → consumers.

> **`incident.created`** (Kafka topic) — emitted when an incident is opened
> `{ "incidentId": "uuid", "status": "string", "openedAt": "timestamp" }`

## Pages

One entry per page: the route (with query params when they carry state) and the
user interactions. No API wiring or states — endpoints live under **API**, the
states are user-story acceptance criteria.

- **Create** — route + interactions; link the prototype / clickdummy if one
  exists (see `architect:prototype`).
- **Visualize** — page / flow map: pages and the navigation between them.

> **`/incidents?status=<enum>&page=<int>`**
> Interactions: filter by status/date, open incident details, acknowledge an incident.

## Config

Each parameter with a suggested name in `Namespace.Key` dot-notation.

- **Create** — one entry per parameter.

> - `Namespace.Key` — description, e.g. default value or unit
