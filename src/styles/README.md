# styles/

**What goes here:** Global CSS that applies app-wide — your design tokens
(`:root { --bg: ...; --accent: ...; }`), resets, and base element styles from
inside the original `<style>` tag.

**Why not put CSS next to each component?** For PM OS, we're doing a
**1:1 visual port** — not redesigning — so we'll bring the CSS across mostly
as-is first, in one place, exactly like the original single `<style>` block.
Later, if you want, individual components can get their own small CSS files.

**You will edit this folder:** in Phase 2, when we port your design tokens
and global styles over. Rarely after that, unless you want to change the
overall look.
