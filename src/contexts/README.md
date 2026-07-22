# contexts/

**What goes here:** "Global state" that many far-apart components need —
this replaces your single global `STATE` object.

Example: `AppStateContext.tsx` will hold the whole PM OS state (weeks,
lessons, XP, streak, theme) and give every component in the tree a way to
read it and update it, without passing props down manually through every
level ("prop drilling").

**You will edit this folder:** rarely, only when you introduce a genuinely
new piece of app-wide state.

**You will NOT put here:** state that only one page cares about — that can
just be local `useState` inside that page/component.
