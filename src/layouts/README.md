# layouts/

**What goes here:** The "frame" that wraps around every page — your Sidebar +
Topbar shell from the HTML version. A layout renders once and the current
page appears inside it.

**Why it's separate from components/:** a layout isn't reusable UI you drop
in randomly — it's structural. There is usually only one main layout in a
small app like this (`AppLayout.tsx`).

**You will edit this folder:** rarely, only when the overall page skeleton
changes (e.g. adding a new topbar icon).
