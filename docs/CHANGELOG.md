# Changelog — PM OS

All notable changes to the PM OS platform architecture will be documented in this file.

---

## [1.1.0] - 2026-07-22

### Added
- Created `src/content/` directory with 17 module folders (`foundation`, `week-01` through `week-16`).
- Created `src/services/contentLoader.ts` to dynamically fetch Markdown and JSON files via Vite glob imports.
- Created `src/components/MarkdownView.tsx` powered by `react-markdown`.
- Created database abstraction layer in `src/services/db/` (`types.ts`, `localStorageAdapter.ts`, `supabaseAdapter.ts`, `index.ts`).
- Created comprehensive system documentation under `docs/` (`README.md`, `ARCHITECTURE.md`, `CONTENT_ARCHITECTURE.md`, `PROJECT_STATUS.md`, `ROADMAP.md`, `CHANGELOG.md`).

### Refactored
- Refactored `src/views/WeekView.tsx` to display course content dynamically loaded from Markdown and JSON files while maintaining exact UI, UX, styling, and Study/Creator mode functionality.

---

## [1.0.0] - Initial Release

### Added
- Initial React + Vite + TypeScript application conversion from baseline HTML/CSS/JS code.
- Hash-based SPA routing and global state management via `AppContext.tsx`.
