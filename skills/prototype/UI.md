# UI Prototype

Several **radically different UI variants** on a single route, switchable from a
floating bar. The user flips between them in the browser, picks one (or steals bits
from each), and the rest is thrown away. Use when **an app already exists** to host
the variants; greenfield with no app yet → [ClickDummy](ClickDummy.md).

A variant set is far easier to judge **butting up against the real app** — real
header and data — than floating on an empty route. Prefer mounting
the variants inside the existing page they belong to; only create a throwaway route
when the thing genuinely has no home yet (name it so it's obviously a prototype,
following the project's routing convention).

## Process

1. **State the question and pick N** — default **3** variants; cap at 5 (more stops
   being radically different). Write the plan in one line.
2. **Generate structurally different variants** — different layout, information
   hierarchy, primary affordance — not just different colours.
   Hold each to the page's purpose, its real data, and the project's component /
   styling system. Clear component names (`VariantA`, …).
3. **Wire them on one route** — a switcher renders the variant from a `?variant=`
   URL param; for an existing page, keep the real data fetching above the switcher,
   only the rendered subtree swaps.
4. **Build the floating switcher** — a fixed bottom-centre bar: prev / current label
   / next, cycling the `?variant=` param via the router (so it's shareable and
   reload-stable); `←`/`→` keys too (not while an input is focused). Visually
   distinct from the page, and hidden in production builds.
5. **Hand it over** — surface the URL and the variant keys. The useful feedback is
   usually "the header from B with the sidebar from C" — that's the real design.
6. **Capture and clean up** — record which won and why (per the shared rule), fold
   the winner into the real page, delete the losers and the switcher.

## Anti-patterns

- Variants differing only in colour / copy; sharing a `<Layout>` so they can't
  really diverge; wiring variants to real mutations (stub them — the question is
  "what should this look like"); shipping the prototype as-is (rewrite the winner
  under real constraints).
