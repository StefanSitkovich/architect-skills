# ClickDummy Prototype

A clickable dummy for **greenfield UI** — "what should this look like / flow like?"
when there's **no app yet** to host live variants. Built with a UI-prototyping tool
(v0, Lovable, Figma Make, or Claude Code itself) from the intended pages, so
stakeholders can click through the experience before any of it is built.

If an app already exists to host variants, prefer [UI](UI.md) — real context beats a
vacuum. This branch is for when that context doesn't exist yet.

## Process

1. **Gather the pages** — the `### Pages` of the **contracts** doc (routes and
   interactions), the personas and journey from the **requirements** doc, the
   ubiquitous language from the **domain model** doc. If the pages aren't defined
   yet, raise that gap — a clickdummy of undefined pages is guesswork.
2. **Write the prototyping prompt** — from those pages, generate a self-contained
   prompt for the chosen tool: the screens, the navigation between them, the key
   interactions per screen, the terminology, and the look/tone. Write it to
   `plan/clickdummy.prompt.md` so it's reproducible. Read-only data, no real
   backend.
3. **Generate / point to the tool** — run it through Claude Code, or hand the prompt
   to v0 / Lovable / Figma Make and link the result. The dummy lives outside the
   repo (or in a clearly-marked `clickdummy/` folder) — it is not production code.
4. **Hand it over** — share the link / folder. The feedback is which flows feel
   right and which screens are missing — that feeds back into the **requirements**
   / **contracts** docs.
5. **Capture the answer** — record the validated flow / pages where they belong (the
   contract pages, the requirements journey, an ADR for a notable UX decision). The
   dummy itself is disposable; the agreed design is what's kept.

## Anti-patterns

- Building it against a real backend or real data — it's a facade.
- Treating the generated code as a production starting point — it was generated
  under prototype constraints; rebuild properly.
- Click-dummying pages that were never defined — define them in the **contracts**
  doc first, or the dummy invents requirements silently.
