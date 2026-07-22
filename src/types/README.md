# types/

**What goes here:** TypeScript's descriptions of your data's *shape* — e.g.
"a `Lesson` always has an `id: string`, a `title: string`, and a
`completion: { done: boolean }`". This is new compared to your HTML version,
which was plain JavaScript with no shape-checking.

**Why this matters for a beginner:** TypeScript will now warn you the moment
you typo a field name or forget one, instead of you finding out at runtime
that something rendered blank. It's a safety net, not extra work.

**You will edit this folder:** whenever your data's shape changes (new field
on a lesson, new state property, etc.) — usually alongside `content/`.
