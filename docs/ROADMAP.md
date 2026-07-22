# Platform Roadmap — PM OS

## 🚩 Phase 1: Foundation & Tech Stack Migration (Completed)
- [x] Migrate HTML/CSS/JS project to React + Vite + TypeScript.
- [x] Establish global state management with React Context (`AppContext.tsx`).
- [x] Build atomic UI components and view layouts (`HomeView`, `WeekView`, `RoadmapView`, `JournalView`, etc.).

## 🚩 Phase 2: Content Architecture Refactor (Completed)
- [x] Separate code from course content into `src/content/`.
- [x] Create 17 module folders (`foundation` + `week-01` to `week-16`).
- [x] Implement dynamic content loader (`contentLoader.ts`).
- [x] Render Markdown and JSON quiz data in `WeekView`.
- [x] Build database interface layer (`src/services/db/`) with LocalStorage and Supabase preparation.
- [x] Create documentation in `docs/`.

## 🚩 Phase 3: Supabase Backend Integration (Upcoming)
- [ ] Connect Supabase Auth for multi-user login.
- [ ] Sync `UserProgress` and `JournalEntries` to PostgreSQL tables.
- [ ] Enable cloud-based portfolio sharing and peer reviews.

## 🚩 Phase 4: AI & Advanced Analytics
- [ ] Connect server-side Gemini API for automated PRD reviews and interview mock coaching.
- [ ] Add learning analytics dashboard with study time distribution.
