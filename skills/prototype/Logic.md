# Logic Prototype

A tiny interactive terminal app that lets the user drive a state model by hand —
for questions about **business logic, state transitions, or data shape**: the kind
of thing that looks fine on paper but feels wrong once you push real cases through
it.

Right when the question is "I'm not sure this state machine handles X then Y", "can
this data model even represent…", "what should this API feel like". If the question
is "what should this look like" — wrong branch ([UI](UI.md) / [ClickDummy](ClickDummy.md)).

## Process

1. **State the question** — one paragraph at the top of the file: the state model
   and what you're testing.
2. **Pick the language** — whatever the host project uses; don't add a runtime just
   for the prototype. No obvious runtime (a docs repo)? ask.
3. **Isolate the logic in a portable, pure module** — a reducer `(state, action) =>
   state`, an explicit state machine, a set of pure functions, or a class with a
   clear method surface — whichever fits the *question*, not whichever is easiest to
   wire to a terminal. No I/O, no terminal code inside it. This module is the bit
   worth keeping; the TUI is the shell. The validated module lifts straight into the
   real code later.
4. **Build the smallest TUI that exposes the state** — on each action, clear the
   screen and re-render the whole frame: current state pretty-printed
   (diff-friendly, one field per line), then the keyboard shortcuts. Read one
   keystroke, dispatch to a handler that mutates state, re-render, loop until quit.
   The frame fits one screen.
5. **One command to run** — wire it into the project's task runner.
6. **Hand it over** — give the run command; the user drives it. The valuable moments
   are "wait, that shouldn't be possible" — bugs in the *idea*. Add the actions they
   ask for; prototypes evolve.
7. **Capture the answer** — per the shared rule: the verdict goes somewhere durable
   (often an ADR), then the shell is deleted and the pure module promoted.

## Anti-patterns

- Tests, generalization ("what if we later…"), or wiring to the real database.
- Blurring logic and TUI — if the module references the terminal, it's no longer
  portable. Keep the TUI a thin shell over a pure core.
