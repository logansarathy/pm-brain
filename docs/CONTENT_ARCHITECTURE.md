# Content Architecture Guide — PM OS

## 📂 Content Folder Structure (`src/content/`)

All course curriculum is organized into week directories:

```
src/content/
├── foundation/
│   ├── metadata.json
│   ├── overview.md
│   ├── objectives.md
│   ├── lesson-01.md
│   ├── lesson-02.md
│   ├── lesson-03.md
│   ├── frameworks.md
│   ├── resources.md
│   ├── assignment.md
│   ├── practice.md
│   ├── pmlab.md
│   ├── interview.md
│   ├── portfolio.md
│   ├── linkedin.md
│   ├── reflection.md
│   └── quiz.json
├── week-01/
│   └── ...
└── week-16/
    └── ...
```

---

## 📜 File Specifications

### 1. `metadata.json`
Specifies week identifier, folder title, difficulty rating, and estimated completion time.
```json
{
  "id": 1,
  "folder": "week-01",
  "title": "Product Discovery & User Research",
  "difficulty": "Beginner",
  "estimatedHours": "6"
}
```

### 2. Markdown Files (`.md`)
Standard Markdown files containing headers, lists, callouts, and code snippets.
- `overview.md`: High-level summary of the week's goals.
- `objectives.md`: Bulleted list of key learning objectives.
- `lesson-01.md`, `lesson-02.md`, `lesson-03.md`: Core lesson readings.
- `frameworks.md`: Summary of product frameworks covered.
- `resources.md`: Curated articles, videos, and books.
- `assignment.md`: Main project deliverable instructions.
- `practice.md`: Practice questions for product sense and strategy.
- `pmlab.md`: Lab notebook instructions.
- `interview.md`: Sample interview questions and answer structures.
- `portfolio.md`: Portfolio artifact guidelines.
- `linkedin.md`: LinkedIn content post prompts.
- `reflection.md`: Weekly self-reflection prompts.

### 3. `quiz.json`
JSON structured questions for weekly checkpoint quizzes:
```json
{
  "title": "Week 1 Checkpoint Quiz",
  "questions": [
    {
      "id": "q1",
      "text": "What is the primary objective of continuous discovery?",
      "options": [
        "To validate assumptions before building",
        "To write code faster",
        "To hire more engineers",
        "To design icons"
      ],
      "answer": 0
    }
  ]
}
```

---

## ✍️ How to Add a New Week

1. Create a new directory `src/content/week-17/`.
2. Add `metadata.json` with `"id": 17`.
3. Add the required `.md` and `.json` files.
4. The application will automatically detect and load the week via `contentLoader.ts`.
