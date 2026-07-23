/**
 * PURPOSE:
 * Content Loader Service for PM OS.
 * Loads static markdown and JSON course files from `src/content/` for all weeks.
 *
 * RESPONSIBILITY:
 * Separates React UI code from course content by serving as the single source of truth
 * for lessons, overviews, frameworks, assignments, PM labs, quizzes, and resources.
 *
 * WHEN TO EDIT THIS FILE:
 * - When adding new content file types (e.g. adding podcast.md or case-study.md to weeks).
 * - When altering the content loading strategy or parsing logic.
 *
 * WHEN NOT TO EDIT THIS FILE:
 * - When writing new course content (edit files in `src/content/week-XX/` instead).
 * - When changing UI layout or styling (edit components in `src/components/` or `src/views/` instead).
 */

import { LessonContent } from '../types';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  answer: number;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface LoadedLesson {
  id: string;
  filename: string;
  title: string;
  markdown: string;
  lessonContent?: LessonContent;
}

export interface WeekContent {
  weekId: number;
  folderName: string;
  metadata: {
    id: number;
    folder: string;
    title: string;
    difficulty?: string;
    estimatedHours?: string;
  };
  overview: string;
  objectives: string;
  lessons: LoadedLesson[];
  frameworks: string;
  resources: string;
  assignment: string;
  practice: string;
  pmlab: string;
  interview: string;
  portfolio: string;
  linkedin: string;
  reflection: string;
  quiz: QuizData;
}

// Use Vite eager glob imports for raw markdown and parsed JSON modules
const markdownFiles = import.meta.glob('/src/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const jsonFiles = import.meta.glob('/src/content/**/*.json', { eager: true }) as Record<string, any>;

const folderMap: Record<number, string> = {
  0: 'foundation',
  1: 'week-01',
  2: 'week-02',
  3: 'week-03',
  4: 'week-04',
  5: 'week-05',
  6: 'week-06',
  7: 'week-07',
  8: 'week-08',
  9: 'week-09',
  10: 'week-10',
  11: 'week-11',
  12: 'week-12',
  13: 'week-13',
  14: 'week-14',
  15: 'week-15',
  16: 'week-16',
};

function getFolderForWeek(weekId: number): string {
  if (folderMap[weekId]) return folderMap[weekId];
  return `week-${String(weekId).padStart(2, '0')}`;
}

/**
 * Gets loaded static week content by weekId (0..16)
 */
export function getWeekContent(weekId: number): WeekContent {
  const folder = getFolderForWeek(weekId);
  const basePath = `/src/content/${folder}`;

  const getMd = (filename: string): string => {
    const key = `${basePath}/${filename}`;
    return markdownFiles[key] || '';
  };

  const getJson = (filename: string): any => {
    const key = `${basePath}/${filename}`;
    const mod = jsonFiles[key];
    return mod?.default || mod || {};
  };

  const metadata = getJson('metadata.json') || {
    id: weekId,
    folder,
    title: weekId === 0 ? 'Foundation · Orientation' : `Week ${weekId}`,
    difficulty: 'Beginner',
    estimatedHours: '6',
  };

  const rawQuiz = getJson('quiz.json');
  const quizData: QuizData = rawQuiz && Array.isArray(rawQuiz.questions)
    ? rawQuiz
    : { title: '', questions: [] };

  const lessonKeys = Object.keys(markdownFiles)
    .filter((path) => path.startsWith(`${basePath}/lesson-`))
    .sort();

  const lessons: LoadedLesson[] = lessonKeys.map((key, index) => {
    const filename = key.split('/').pop() || `lesson-${String(index + 1).padStart(2, '0')}.md`;
    const markdown = markdownFiles[key] || '';
    const jsonFilename = filename.replace(/\.md$/, '.json');
    const rawLessonContent = getJson(jsonFilename);
    const lessonContent = rawLessonContent && Object.keys(rawLessonContent).length ? (rawLessonContent as LessonContent) : undefined;

    const firstLine = markdown.split('\n').find((l) => l.startsWith('# '));
    const title = lessonContent?.title || (firstLine ? firstLine.replace(/^#\s+/, '').trim() : `Lesson ${index + 1}`);

    return {
      id: `content_lsn_${weekId}_${index + 1}`,
      filename,
      title,
      markdown,
      lessonContent,
    };
  });

  return {
    weekId,
    folderName: folder,
    metadata,
    overview: getMd('overview.md'),
    objectives: getMd('objectives.md'),
    lessons,
    frameworks: getMd('frameworks.md'),
    resources: getMd('resources.md'),
    assignment: getMd('assignment.md'),
    practice: getMd('practice.md'),
    pmlab: getMd('pmlab.md'),
    interview: getMd('interview.md'),
    portfolio: getMd('portfolio.md'),
    linkedin: getMd('linkedin.md'),
    reflection: getMd('reflection.md'),
    quiz: quizData,
  };
}

/**
 * Get all week contents for overall platform rendering
 */
export function getAllWeekContents(): WeekContent[] {
  return Array.from({ length: 17 }, (_, i) => getWeekContent(i));
}
