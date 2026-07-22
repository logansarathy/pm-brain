# services/

**What goes here:** Code that talks to the "outside world" — for PM OS right
now, that's `localStorage` (this replaces `loadState()` / `saveState()` from
your HTML version). If PM OS ever talks to a real backend/API, that code
would live here too.

**Why separate from utils/:** services/ touches something external
(storage, network). utils/ is pure logic with no side effects — same input
always gives same output, nothing saved or fetched.

**You will edit this folder:** when you change *how* or *where* data is
persisted (e.g. switching from localStorage to a real database later).
