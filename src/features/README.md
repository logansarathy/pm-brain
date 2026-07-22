# features/

**What goes here:** Bigger, self-contained "chunks" of app behaviour that
bundle together their own components + logic, e.g. `features/xp/` (XP bar,
level-up logic) or `features/weekProgress/` (the section-progress list,
auto-completion logic).

**Why not just put these in components/?** components/ is for *dumb* reusable
UI. features/ is for UI that comes bundled with real logic specific to one
part of PM OS. This keeps components/ clean and makes each feature easy to
find as the app grows.

**You will edit this folder:** as PM OS grows. For our first conversion pass
we may keep things simple and lean mostly on components/ + hooks/, and only
introduce features/ once a feature earns its own folder.
