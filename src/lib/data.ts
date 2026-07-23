import { AppState, ContentBlock, Lesson, Week } from '../types';

export const TOTAL_WEEKS = 16;
export const STORAGE_KEY = 'pmos_state_v1';

export function uid(prefix: string = 'id'): string {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function levelFromXP(xp: number): number {
  return Math.floor(xp / 150) + 1;
}

export function xpIntoLevel(xp: number): number {
  return xp % 150;
}

export const BLOCK_TYPES: Array<[string, string, string]> = [
  ['heading', 'Heading', 'H'],
  ['paragraph', 'Paragraph', '¶'],
  ['video', 'Video', '▶'],
  ['article', 'Article', '📖'],
  ['book', 'Book', '📚'],
  ['framework', 'Framework', '🧩'],
  ['image', 'Image', '🖼'],
  ['quote', 'Quote', '❝'],
  ['checklist', 'Checklist', '☑'],
  ['exercise', 'Exercise', '✏️'],
  ['quiz', 'Quiz', '❓'],
  ['resource', 'Resource', '🔗'],
  ['divider', 'Divider', '—'],
  ['callout', 'Callout', '💡'],
];

export function newBlock(type: string): ContentBlock {
  const id = uid('blk');
  switch (type) {
    case 'heading':
      return { id, type, text: '' };
    case 'paragraph':
      return { id, type, text: '' };
    case 'video':
      return { id, type, title: '', url: '', description: '', caption: '' };
    case 'article':
      return { id, type, title: '', url: '', author: '', description: '' };
    case 'book':
      return { id, type, title: '', author: '', url: '' };
    case 'framework':
      return { id, type, title: '', description: '', caption: '' };
    case 'image':
      return { id, type, url: '', caption: '' };
    case 'quote':
      return { id, type, text: '', author: '' };
    case 'checklist':
      return { id, type, items: [] };
    case 'exercise':
      return { id, type, prompt: '', studentAnswer: '' };
    case 'quiz':
      return { id, type, questions: [], score: null };
    case 'resource':
      return { id, type, text: '', url: '' };
    case 'divider':
      return { id, type };
    case 'callout':
      return { id, type, icon: '💡', text: '' };
    default:
      return { id, type: 'paragraph', text: '' };
  }
}

export function defaultLessons(): Lesson[] {
  return [1, 2, 3].map((n) => ({
    id: uid('lsn'),
    title: `Lesson ${n}`,
    objective: '',
    estimatedTime: '',
    content: '',
    videos: [],
    articles: [],
    books: [],
    frameworks: [],
    images: [],
    quotes: [],
    checklists: [],
    exercises: [],
    quiz: [],
    resources: [],
    notes: '',
    keyTakeaways: '',
    completion: { done: false },
    contentBlocks: [newBlock('paragraph'), newBlock('quiz')],
  }));
}

export function ensureLessonShape(lsn: Partial<Lesson>): Lesson {
  if (typeof lsn.content !== 'string') lsn.content = '';
  if (!lsn.videos) lsn.videos = [];
  if (!lsn.articles) lsn.articles = [];
  if (!lsn.books) lsn.books = [];
  if (!lsn.frameworks) lsn.frameworks = [];
  if (!lsn.images) lsn.images = [];
  if (!lsn.quotes) lsn.quotes = [];
  if (!lsn.checklists) lsn.checklists = [];
  if (!lsn.exercises) lsn.exercises = [];
  if (!lsn.quiz) lsn.quiz = [];
  if (!lsn.resources) lsn.resources = [];
  if (!lsn.contentBlocks) lsn.contentBlocks = [];
  if (typeof lsn.objective !== 'string') lsn.objective = '';
  if (typeof lsn.estimatedTime !== 'string') lsn.estimatedTime = '';
  if (typeof lsn.notes !== 'string') lsn.notes = '';
  if (typeof lsn.keyTakeaways !== 'string') lsn.keyTakeaways = '';
  if (!lsn.completion) lsn.completion = { done: false };
  return lsn as Lesson;
}

export function lessonIsComplete(lsn: Lesson): boolean {
  return !!(lsn.completion && lsn.completion.done);
}

export function isLessonLocked(w: Week, idx: number, mode: 'study' | 'creator'): boolean {
  if (mode !== 'study') return false;
  if (idx === 0) return false;
  const prev = w.lessons[idx - 1];
  return !prev || !lessonIsComplete(prev);
}

export function emptyWeek(n: number): Week {
  return {
    id: n,
    title: n === 0 ? 'Foundation · Orientation' : `Week ${n}`,
    status: n === 0 ? 'active' : 'locked',
    difficulty: '',
    estimatedHours: '',
    overview: { goal: '', why: '', outcome: '', skills: '', timeRequired: '' },
    lessons: defaultLessons(),
    learn: {
      topics: [],
      videos: [],
      articles: [],
      books: [],
      frameworks: [],
      podcasts: [],
      blogs: [],
      researchPapers: [],
      websites: [],
      aiNotes: '',
      keyTakeaways: '',
    },
    practice: {
      exercises: [],
      miniTasks: [],
      pmQuestions: [],
      metricsQuestions: [],
      uxQuestions: [],
      wireframing: [],
      reflectionPractice: [],
      critique: '',
      prioritization: '',
    },
    apply: { concept: '', problems: [], ideas: '', before: '', after: '', lessons: '' },
    deliverable: { type: '', title: '', description: '', link: '', done: false },
    aiMentor: { log: [] },
    quiz: { questions: [], score: null },
    pmLab: {
      goal: '',
      task: '',
      instructions: '',
      evaluationCriteria: '',
      template: '',
      observations: '',
      ideas: '',
      evidence: '',
      reflection: '',
      screenshots: [],
      links: [],
      done: false,
    },
    linkedinTask: { idea: '', draft: '', link: '', published: false },
    portfolioArtifact: { description: '', downloadLink: '', linkedinDraft: '' },
    reflection: { learned: '', mistake: '', newIdea: '', questions: '', confidence: 3 },
  };
}

export function defaultState(): AppState {
  const weeks: Week[] = [];
  for (let n = 0; n <= TOTAL_WEEKS; n++) weeks.push(emptyWeek(n));
  return {
    profile: {
      name: 'Logan Sarathy',
      track: 'Product Management Journey',
      education: 'B.Tech AI & DS · KGiSL Institute of Technology',
    },
    goals: [],
    projects: ['CleanO', 'GOF'],
    xp: 0,
    streak: { current: 0, longest: 0, lastActiveDate: null, freezeAvailable: 1 },
    currentWeek: 0,
    weeks,
    knowledge: [],
    resources: [],
    notes: [],
    frameworks: [],
    teardowns: [],
    improvement: [],
    casestudies: [],
    portfolio: [],
    journal: [],
    interviewPrep: [],
    aiPrompts: [],
    linkedin: [],
    templates: [
      ['Research Plan', 'Discovery'],
      ['Interview Script', 'Discovery'],
      ['Persona', 'Discovery'],
      ['Empathy Map', 'Discovery'],
      ['Journey Map', 'Research'],
      ['Opportunity Solution Tree', 'Research'],
      ['Meeting Notes', 'Research'],
      ['PRD', 'Strategy'],
      ['BRD', 'Strategy'],
      ['One Pager', 'Strategy'],
      ['Lean Canvas', 'Strategy'],
      ['North Star', 'Strategy'],
      ['RICE', 'Execution'],
      ['Kano', 'Execution'],
      ['MoSCoW', 'Execution'],
      ['Sprint Review', 'Execution'],
      ['Retrospective', 'Execution'],
      ['Experiment Tracker', 'Analytics'],
      ['AARRR', 'Analytics'],
      ['Growth Loop Canvas', 'Growth'],
      ['AI Prompt Log', 'AI'],
    ].map(([name, category], i) => ({ id: 'tpl_' + i, name, category, content: '' })),
    cleano: { sections: {} },
    gof: { sections: {} },
    settings: { hoursLoggedTotal: 0, weeklyGoalDays: 5, monthlyGoalDays: 20, sidebarCollapsed: false },
  };
}

export function loadSavedState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    const weeks =
      parsed.weeks && parsed.weeks.length === TOTAL_WEEKS + 1
        ? parsed.weeks.map((w: Week, i: number) =>
            Object.assign({}, base.weeks[i], w, {
              lessons: w.lessons && w.lessons.length ? w.lessons.map(ensureLessonShape) : base.weeks[i].lessons,
            })
          )
        : base.weeks;
    return Object.assign({}, base, parsed, { weeks });
  } catch (e) {
    console.warn('PM OS: could not parse saved state, starting fresh.', e);
    return defaultState();
  }
}

export function weekChecklist(w: Week): boolean[] {
  const items: boolean[] = [];
  const pushList = (arr?: Array<{ done: boolean }>) => (arr || []).forEach((it) => items.push(!!it.done));
  pushList(w.learn.topics);
  pushList(w.learn.videos);
  pushList(w.learn.articles);
  pushList(w.learn.frameworks);
  pushList(w.practice.exercises);
  pushList(w.practice.miniTasks);
  pushList(w.practice.pmQuestions);
  pushList(w.apply.problems);
  items.push(!!w.deliverable.done);
  items.push(!!(w.overview.goal && w.overview.goal.trim()));
  items.push(!!(w.reflection.learned && w.reflection.learned.trim()));
  return items;
}

export function weekProgressPct(w: Week): number {
  const items = weekChecklist(w);
  if (items.length === 0) return 0;
  const done = items.filter(Boolean).length;
  return Math.round((done / items.length) * 100);
}

export function overallProgressPct(weeks: Week[]): number {
  const pcts = weeks.map(weekProgressPct);
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
}

export function portfolioProgressPct(weeks: Week[]): number {
  const withDeliverable = weeks.filter((w) => w.deliverable.done).length;
  return Math.round((withDeliverable / (TOTAL_WEEKS + 1)) * 100);
}

export interface SectionStatus {
  key: string;
  label: string;
  state: 'done' | 'partial' | 'pending';
  count?: string | null;
}

export function weekSectionStatus(w: Week): SectionStatus[] {
  const countState = (total: number, done: number): 'done' | 'partial' | 'pending' =>
    total === 0 ? 'pending' : done === total ? 'done' : done > 0 ? 'partial' : 'pending';

  const lessonsTotal = (w.lessons || []).length;
  const lessonsDone = (w.lessons || []).filter((l) => lessonIsComplete(l)).length;
  const videosTotal = w.learn.videos.length;
  const videosDone = w.learn.videos.filter((x) => x.done).length;
  const articlesTotal = w.learn.articles.length;
  const articlesDone = w.learn.articles.filter((x) => x.done).length;

  const practiceTotal =
    w.practice.exercises.length +
    w.practice.miniTasks.length +
    w.practice.pmQuestions.length +
    w.practice.metricsQuestions.length +
    w.practice.uxQuestions.length +
    w.practice.wireframing.length +
    w.practice.reflectionPractice.length;

  const practiceDone =
    w.practice.exercises.filter((x) => x.done).length +
    w.practice.miniTasks.filter((x) => x.done).length +
    w.practice.pmQuestions.filter((x) => x.done).length +
    w.practice.metricsQuestions.filter((x) => x.done).length +
    w.practice.uxQuestions.filter((x) => x.done).length +
    w.practice.wireframing.filter((x) => x.done).length +
    w.practice.reflectionPractice.filter((x) => x.done).length;

  return [
    { key: 'lessons', label: 'Lessons', state: countState(lessonsTotal, lessonsDone), count: lessonsTotal ? `${lessonsDone}/${lessonsTotal}` : null },
    { key: 'videos', label: 'Videos', state: countState(videosTotal, videosDone), count: videosTotal ? `${videosDone}/${videosTotal}` : null },
    { key: 'articles', label: 'Articles', state: countState(articlesTotal, articlesDone), count: articlesTotal ? `${articlesDone}/${articlesTotal}` : null },
    { key: 'practice', label: 'Practice', state: countState(practiceTotal, practiceDone), count: practiceTotal ? `${practiceDone}/${practiceTotal}` : null },
    { key: 'pmlab', label: 'PM Lab', state: w.pmLab.done ? 'done' : 'pending' },
    { key: 'assignment', label: 'Assignment', state: w.deliverable.done ? 'done' : 'pending' },
    { key: 'portfolio', label: 'Portfolio Deliverable', state: (w.portfolioArtifact.description || '').trim() ? 'done' : 'pending' },
    { key: 'linkedin', label: 'LinkedIn Task', state: w.linkedinTask.published || (w.linkedinTask.draft || '').trim() ? 'done' : 'pending' },
    { key: 'reflection', label: 'Weekly Reflection', state: (w.reflection.learned || '').trim() ? 'done' : 'pending' },
  ];
}

export function weekRequiredSections(w: Week): Array<{ label: string; done: boolean }> {
  return [
    { label: 'Lessons', done: (w.lessons || []).length > 0 && w.lessons.every((l) => lessonIsComplete(l)) },
    { label: 'Assignment', done: !!w.deliverable.done },
    {
      label: 'Practice',
      done: (() => {
        const t =
          w.practice.exercises.length +
          w.practice.miniTasks.length +
          w.practice.pmQuestions.length +
          w.practice.metricsQuestions.length +
          w.practice.uxQuestions.length +
          w.practice.wireframing.length +
          w.practice.reflectionPractice.length;
        if (t === 0) return false;
        const d =
          w.practice.exercises.filter((x) => x.done).length +
          w.practice.miniTasks.filter((x) => x.done).length +
          w.practice.pmQuestions.filter((x) => x.done).length +
          w.practice.metricsQuestions.filter((x) => x.done).length +
          w.practice.uxQuestions.filter((x) => x.done).length +
          w.practice.wireframing.filter((x) => x.done).length +
          w.practice.reflectionPractice.filter((x) => x.done).length;
        return d === t;
      })(),
    },
    { label: 'PM Lab', done: !!w.pmLab.done },
    { label: 'Reflection', done: !!(w.reflection.learned || '').trim() },
    { label: 'Portfolio Task', done: !!(w.portfolioArtifact.description || '').trim() },
    { label: 'LinkedIn Task', done: !!(w.linkedinTask.published || (w.linkedinTask.draft || '').trim()) },
  ];
}

export function weekIsReadyToComplete(w: Week): boolean {
  return weekRequiredSections(w).every((s) => s.done);
}

export interface CollectionConfigItem {
  title: string;
  icon: string;
  emptyTitle: string;
  emptySub: string;
  fields: string[];
  categories?: string[];
}

export const COLLECTION_CONFIG: Record<string, CollectionConfigItem> = {
  notes: {
    title: 'Notes',
    icon: 'notes',
    emptyTitle: 'No notes yet',
    emptySub: 'Capture what you learn as you go — every note becomes searchable later.',
    fields: ['title', 'category', 'content', 'link'],
  },
  knowledge: {
    title: 'Knowledge Hub',
    icon: 'knowledge',
    emptyTitle: 'Your second brain is empty',
    emptySub: 'This is where concepts from every week will live, organized by category, taggable and bookmarkable.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['Discovery', 'Research', 'Frameworks', 'Metrics', 'Analytics', 'Growth', 'AI', 'UX', 'SQL', 'Stakeholders', 'Interview Notes', 'Personal Learnings'],
  },
  frameworks: {
    title: 'Frameworks',
    icon: 'knowledge',
    emptyTitle: 'No frameworks saved yet',
    emptySub: 'Save PM frameworks with a short summary and a reference link for quick recall.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['Discovery', 'Prioritization', 'Strategy', 'Metrics', 'Growth', 'Design', 'Research', 'Agile', 'Leadership'],
  },
  resources: {
    title: 'Resources',
    icon: 'library',
    emptyTitle: 'No resources saved',
    emptySub: 'Required and optional material you want to keep handy.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['Required · Videos', 'Required · Articles', 'Required · Books', 'Optional · Podcasts', 'Optional · Blogs', 'Optional · Research Papers', 'Optional · Useful Websites'],
  },
  aiPrompts: {
    title: 'AI Workspace',
    icon: 'knowledge',
    emptyTitle: 'No prompts saved yet',
    emptySub: 'Build a reusable library of ChatGPT, Claude, and Gemini prompts for PM work.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['ChatGPT Prompt', 'Claude Prompt', 'Gemini Prompt', 'Deep Research', 'Reusable Prompt', 'AI Experiment'],
  },
  linkedin: {
    title: 'LinkedIn',
    icon: 'notes',
    emptyTitle: 'No LinkedIn content yet',
    emptySub: 'Ideas, drafts, published posts and links, on a content calendar.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['Ideas', 'Drafts', 'Published Posts', 'Published Links', 'Content Calendar', 'Weekly Reflection Posts'],
  },
  teardowns: {
    title: 'Product Teardowns',
    icon: 'roadmap',
    emptyTitle: 'No teardowns yet',
    emptySub: 'Break down products you admire — problem, users, flows, and what you would improve.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['Consumer', 'B2B', 'Fintech', 'Marketplace', 'SaaS', 'Mobile App'],
  },
  improvement: {
    title: 'Product Improvement',
    icon: 'bolt',
    emptyTitle: 'No improvement projects yet',
    emptySub: 'Pick a real product, find a gap, and design your fix end-to-end.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['UX', 'Growth', 'Retention', 'Onboarding', 'Monetization', 'Performance'],
  },
  casestudies: {
    title: 'Case Studies',
    icon: 'portfolio',
    emptyTitle: 'No case studies yet',
    emptySub: 'Turn your best work into STAR-format case studies for interviews and your portfolio.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['CleanO', 'GOF', 'Teardown', 'Improvement', 'Course Project'],
  },
  portfolio: {
    title: 'Portfolio',
    icon: 'portfolio',
    emptyTitle: 'Your portfolio is empty',
    emptySub: 'Deliverables you mark complete in each week can be added here as portfolio pieces.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['Projects', 'Case Studies', 'Research', 'PRDs', 'Product Teardowns', 'Feature Improvements', 'Published Work'],
  },
  interviewPrep: {
    title: 'Interview Prep',
    icon: 'interview',
    emptyTitle: 'No interview questions logged',
    emptySub: 'Every week contributes questions here — behavioral, product sense, execution, metrics, strategy, AI PM, and mock interviews.',
    fields: ['title', 'category', 'content', 'link'],
    categories: ['Behavioral', 'Product Sense', 'Execution', 'Metrics', 'Strategy', 'AI PM', 'Mock Interviews'],
  },
};
