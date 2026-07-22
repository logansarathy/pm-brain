# PM OS — Scalable Learning Platform

Welcome to **PM OS**, a Product Management learning operating system built with React, Vite, Tailwind CSS, and TypeScript.

---

## 📌 Project Overview

PM OS is structured as a scalable content-driven learning platform (similar to Coursera or NextLeap). It decouples **React application code** from **Course Content**.

- **React Components**: Serve as pure visual view engines for displaying content and capturing student input.
- **Course Content**: Stored separately in `src/content/` as Markdown (`.md`) and JSON files across 17 structured module folders (`foundation`, `week-01` through `week-16`).

---

## 📁 Key Folder Responsibilities

| Directory | Responsibility | When to Edit | When NOT to Edit |
|---|---|---|---|
| `src/content/` | Static markdown and JSON course files (lessons, assignments, labs, quizzes) | When writing or updating course curriculum | When making UI layout or styling changes |
| `src/services/` | Content loader and database persistence interfaces (LocalStorage, Supabase) | When modifying data fetching or storage logic | When writing course content |
| `src/views/` | Page layout views (`WeekView`, `HomeView`, `RoadmapView`, etc.) | When changing application page layouts or navigation | When updating course text |
| `src/components/` | Reusable UI widgets and atomic components | When modifying UI elements or design patterns | When adding new course weeks |
| `src/context/` | React Context for global app state and student progress tracking | When adding new global application actions | When modifying static curriculum |
| `docs/` | System architecture, content guides, status logs, and roadmaps | When documenting system or architectural changes | During routine UI tweaks |

---

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🧭 Documentation Index

1. [Architecture Overview](./ARCHITECTURE.md)
2. [Content System Guide](./CONTENT_ARCHITECTURE.md)
3. [Project Status](./PROJECT_STATUS.md)
4. [Roadmap](./ROADMAP.md)
5. [Changelog](./CHANGELOG.md)
