export type Mode = 'study' | 'creator';

export interface ContentBlock {
  id: string;
  type: string;
  text?: string;
  title?: string;
  url?: string;
  author?: string;
  description?: string;
  caption?: string;
  items?: Array<{ text: string; url?: string; done: boolean }>;
  prompt?: string;
  studentAnswer?: string;
  questions?: Array<{ text: string; url?: string; done: boolean }>;
  score?: number | null;
  icon?: string;
}

export interface Lesson {
  id: string;
  title: string;
  objective: string;
  estimatedTime: string;
  contentBlocks: ContentBlock[];
  notes: string;
  keyTakeaways: string;
  completion: { done: boolean };
}

export interface ResourceItem {
  text: string;
  url?: string;
  done: boolean;
}

export interface Week {
  id: number;
  title: string;
  status: 'active' | 'locked' | 'complete';
  difficulty: string;
  estimatedHours: string;
  overview: {
    goal: string;
    why: string;
    outcome: string;
    skills: string;
    timeRequired: string;
  };
  lessons: Lesson[];
  learn: {
    topics: ResourceItem[];
    videos: ResourceItem[];
    articles: ResourceItem[];
    books: ResourceItem[];
    frameworks: ResourceItem[];
    podcasts: ResourceItem[];
    blogs: ResourceItem[];
    researchPapers: ResourceItem[];
    websites: ResourceItem[];
    aiNotes: string;
    keyTakeaways: string;
  };
  practice: {
    exercises: ResourceItem[];
    miniTasks: ResourceItem[];
    pmQuestions: ResourceItem[];
    metricsQuestions: ResourceItem[];
    uxQuestions: ResourceItem[];
    wireframing: ResourceItem[];
    reflectionPractice: ResourceItem[];
    critique: string;
    prioritization: string;
  };
  apply: {
    concept: string;
    problems: ResourceItem[];
    ideas: string;
    before: string;
    after: string;
    lessons: string;
  };
  deliverable: {
    type: string;
    title: string;
    description: string;
    link: string;
    done: boolean;
  };
  aiMentor: {
    log: ResourceItem[];
  };
  quiz: {
    questions: ResourceItem[];
    score: number | null;
  };
  pmLab: {
    goal: string;
    task: string;
    instructions: string;
    evaluationCriteria: string;
    template: string;
    observations: string;
    ideas: string;
    evidence: string;
    reflection: string;
    screenshots: ResourceItem[];
    links: ResourceItem[];
    done: boolean;
  };
  linkedinTask: {
    idea: string;
    draft: string;
    link: string;
    published: boolean;
  };
  portfolioArtifact: {
    description: string;
    downloadLink: string;
    linkedinDraft: string;
  };
  reflection: {
    learned: string;
    mistake: string;
    newIdea: string;
    questions: string;
    confidence: number | string;
  };
}

export interface CollectionItem {
  id: string;
  title: string;
  category: string;
  content?: string;
  link?: string;
  date: string;
  tags?: string;
  bookmarked?: boolean;
  done?: boolean;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  content: string;
}

export interface JournalItem {
  id: string;
  date: string;
  learning: string;
  wins: string;
  problems: string;
  ideas: string;
  mood: string;
  tomorrowGoal: string;
}

export interface WorkspaceDoc {
  sections: Record<string, string>;
}

export interface AppState {
  profile: {
    name: string;
    track: string;
    education: string;
  };
  goals: string[];
  projects: string[];
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
    freezeAvailable: number;
  };
  currentWeek: number;
  weeks: Week[];
  knowledge: CollectionItem[];
  resources: CollectionItem[];
  notes: CollectionItem[];
  frameworks: CollectionItem[];
  teardowns: CollectionItem[];
  improvement: CollectionItem[];
  casestudies: CollectionItem[];
  portfolio: CollectionItem[];
  journal: JournalItem[];
  interviewPrep: CollectionItem[];
  aiPrompts: CollectionItem[];
  linkedin: CollectionItem[];
  templates: TemplateItem[];
  cleano: WorkspaceDoc;
  gof: WorkspaceDoc;
  settings: {
    hoursLoggedTotal: number;
    weeklyGoalDays: number;
    monthlyGoalDays: number;
    sidebarCollapsed: boolean;
  };
}
