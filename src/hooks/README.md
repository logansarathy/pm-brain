# hooks/

**What goes here:** Reusable pieces of *logic* (not visuals) that start with
the word `use`, e.g. `useTheme()`, `useToast()`, `useAutoSave()`.

**Why React needs this:** in your HTML version, logic like "toggle dark mode"
or "debounce-save to localStorage" was just a floating function. In React, if
that logic needs to remember state or react to changes, it becomes a
"custom hook" — a function that can use React's `useState`/`useEffect` inside it.

**You will edit this folder:** whenever you find yourself copy-pasting the
same stateful logic into two different components — that's the signal to
extract a hook.
