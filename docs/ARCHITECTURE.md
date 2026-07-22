# System Architecture — PM OS

## 🎯 Architecture Goals

1. **Separation of Concerns**: React components contain zero hardcoded course text.
2. **Scalability**: New weeks and modules can be added simply by dropping a new folder into `src/content/`.
3. **Pluggable Persistence**: User progress, journals, and lab submissions are managed via an abstract service layer (`IDatabaseService`) supporting LocalStorage and future Supabase database synchronization.

---

## 🏛️ High-Level Component Diagram

```
+-------------------------------------------------------------------+
|                           PM OS UI                                |
|  (HomeView, WeekView, RoadmapView, JournalView, WorkspaceView)    |
+-------------------------------------------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|  src/services/        |                   |  src/context/         |
|  contentLoader.ts     |                   |  AppContext.tsx       |
|  (Loads .md & .json)  |                   |  (Manages AppState)   |
+-----------------------+                   +-----------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|  src/content/         |                   |  src/services/db/     |
|  (foundation,         |                   |  (LocalStorage /      |
|   week-01 .. week-16) |                   |   Supabase Adapter)   |
+-----------------------+                   +-----------------------+
```

---

## 🔄 Data Flow

1. **Static Curriculum**: `contentLoader.ts` scans `src/content/` at compile time using Vite's eager glob imports and returns structured `WeekContent` objects.
2. **Rendering**: `WeekView.tsx` calls `getWeekContent(weekId)` and renders the Markdown files dynamically using `<MarkdownView />`.
3. **Student Input**: Notebook entries, progress checkboxes, and quiz submissions update `AppState` via `AppContext.tsx`.
4. **Persistence**: `AppState` changes are automatically saved through `src/services/db/` (`LocalStorageAdapter` by default or `SupabaseAdapter` when configured).

---

## 🔐 Modes

- **Study Mode**: Displays rendered Markdown content, enforces lesson locking rules, and tracks student progress.
- **Creator Mode**: Unlocks all lessons for editing and allows creators to define custom state overrides without editing source code.
