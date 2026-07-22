/**
 * PURPOSE:
 * Database Types & Interfaces for PM OS persistence.
 *
 * RESPONSIBILITY:
 * Defines contracts for user progress, journal entries, PM lab answers/entries,
 * knowledge notes, portfolio artifacts, practice answers, linkedin posts, and user settings.
 */

export interface DBProfile {
  id: string; // UUID
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'student' | 'creator';
  createdAt?: string;
  updatedAt?: string;
}

export interface DBLessonProgress {
  id: string; // UUID
  userId: string;
  weekId: number;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface DBUserProgress {
  userId: string;
  currentWeek: number;
  completedLessons: string[]; // Aggregated list for backward compatibility
  weekProgress: Record<number, number>;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
  updatedAt: string;
}

export interface DBJournalEntry {
  id: string; // UUID
  userId: string;
  title: string;
  date: string; // DATE (YYYY-MM-DD)
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DBPracticeAnswer {
  id: string; // UUID
  userId: string;
  weekId: number;
  exerciseType: string;
  answerText: string;
  updatedAt: string;
}

export interface DBPMLabEntry {
  id: string; // UUID
  userId: string;
  weekId: number;
  goal: string;
  problemStatement?: string;
  hypothesis?: string;
  experiment: string;
  evidence: string;
  observations: string;
  insights: string;
  outcome?: string;
  nextAction?: string;
  reflection: string;
  completed: boolean;
  updatedAt: string;
}

export interface DBPortfolioItem {
  id: string; // UUID
  userId: string;
  weekId: number;
  category: 'Research' | 'Personas' | 'Journey Maps' | 'PRDs' | 'Wireframes' | 'Roadmaps' | 'Case Studies' | 'Presentations' | 'LinkedIn Posts' | 'Resume' | string;
  title: string;
  description: string;
  downloadLink?: string;
  fileUrl?: string;
  linkedinDraft?: string;
  status: 'draft' | 'submitted' | 'completed';
  createdAt: string;
}

export interface DBKnowledgeNote {
  id: string; // UUID
  userId: string;
  lessonId?: string;
  weekId?: number;
  type: 'bookmark' | 'framework' | 'glossary' | 'note';
  title: string;
  category: string;
  content: string;
  link?: string;
  favorite: boolean;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBLinkedInPost {
  id: string; // UUID
  userId: string;
  weekId: number;
  postTitle: string;
  draft: string;
  url: string;
  publishedDate?: string; // DATE or TIMESTAMP
  published: boolean;
  createdAt: string;
}

export interface DBUserSettings {
  userId: string;
  hoursLoggedTotal: number;
  weeklyGoalDays: number;
  monthlyGoalDays: number;
  sidebarCollapsed: boolean;
  theme?: string;
  timezone: string;
  notificationsEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDatabaseService {
  // Profiles
  getProfile(userId: string): Promise<DBProfile | null>;
  saveProfile(profile: DBProfile): Promise<void>;

  // User Progress & Lesson Progress
  getUserProgress(userId: string): Promise<DBUserProgress | null>;
  saveUserProgress(progress: DBUserProgress): Promise<void>;
  getLessonProgress(userId: string): Promise<DBLessonProgress[]>;
  saveLessonProgress(progress: DBLessonProgress): Promise<void>;
  markLessonComplete(userId: string, weekId: number, lessonId: string, completed: boolean): Promise<void>;

  // Journal
  getJournalEntries(userId: string): Promise<DBJournalEntry[]>;
  saveJournalEntry(entry: DBJournalEntry): Promise<void>;
  deleteJournalEntry(id: string): Promise<void>;

  // Practice Answers
  getPracticeAnswers(userId: string, weekId?: number): Promise<DBPracticeAnswer[]>;
  savePracticeAnswer(answer: DBPracticeAnswer): Promise<void>;

  // PM Lab Entries
  getPMLabEntries(userId: string): Promise<DBPMLabEntry[]>;
  getPMLabEntry(userId: string, weekId: number): Promise<DBPMLabEntry | null>;
  savePMLabEntry(entry: DBPMLabEntry): Promise<void>;

  // Portfolio Items
  getPortfolioItems(userId: string): Promise<DBPortfolioItem[]>;
  savePortfolioItem(item: DBPortfolioItem): Promise<void>;

  // Knowledge Notes
  getKnowledgeNotes(userId: string): Promise<DBKnowledgeNote[]>;
  saveKnowledgeNote(note: DBKnowledgeNote): Promise<void>;
  deleteKnowledgeNote(id: string): Promise<void>;

  // LinkedIn Posts
  getLinkedInPosts(userId: string): Promise<DBLinkedInPost[]>;
  saveLinkedInPost(post: DBLinkedInPost): Promise<void>;

  // Settings
  getUserSettings(userId: string): Promise<DBUserSettings | null>;
  saveUserSettings(settings: DBUserSettings): Promise<void>;
}
