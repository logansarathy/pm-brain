# utils/

**What goes here:** Small, pure helper functions with no dependency on React
or the DOM — e.g. `formatDate()`, `calculateXpLevel()`, `uid()`. These map
directly to little helper functions scattered through your HTML `<script>`
tag (`fmtDate`, `levelFromXP`, `uid`, etc.).

**"Pure" means:** give it an input, it returns an output — it never reaches
out to touch state, storage, or the page.

**You will edit this folder:** whenever you write a calculation or
formatting helper that doesn't belong to one specific component.
