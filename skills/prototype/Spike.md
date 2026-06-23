# Spike Prototype

A throwaway **tracer** that answers "**will this approach even work?**" — a
technical, architecture, or integration unknown you can't settle by reasoning: does
this library handle our data shape, can this broker meet the throughput, will this
auth flow integrate, is this query fast enough at volume. This is the feasibility
check, answered by *building the smallest risky slice* — not by a paper review.

## Process

1. **State the risk as a falsifiable question** — one line: the specific unknown and
   what result counts as "works" vs "doesn't". "Can Postgres `LISTEN/NOTIFY` fan out
   to 500 subscribers within our latency budget?" beats "try the messaging". Pull
   the budget from the NFRs in the **requirements** doc where one exists.
2. **Build the thinnest slice through the risk** — only the part in doubt, with real
   versions of the risky pieces (the actual library, broker, dataset shape) and
   stubs for everything else. No surrounding app, no polish.
3. **Measure against the bar** — run it, capture the number or the behaviour, and
   compare to the "works" criterion from step 1. Label anything you couldn't measure
   as an estimate.
4. **Capture the verdict** — works / doesn't / works-with-caveats, plus the evidence
   — almost always an **ADR** in the **decision log** (via `design`), since a spike's
   whole output is a technical decision and its rationale. Note any caveat the real
   implementation must honour.
5. **Delete the spike** — the tracer is disposable; the decision is what's kept.
   Don't grow the spike into the real implementation — it was built to answer one
   question, not to last.

## Anti-patterns

- Spiking what you could settle by reading the docs — a spike is for genuine
  unknowns, not procrastination.
- Stubbing the risky part — then the spike proves nothing; stub everything *except*
  the risk.
- Keeping the spike as the foundation of the real code; gold-plating it beyond the
  one question it answered.
