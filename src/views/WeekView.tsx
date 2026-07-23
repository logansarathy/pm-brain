import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  BreadcrumbNav,
  EmptyState,
  InputField,
  ListEditor,
  PageHeader,
  SectionProgressList,
  SelectField,
  TextareaField,
} from '../components/CommonUI';
import {
  BLOCK_TYPES,
  ensureLessonShape,
  isLessonLocked,
  lessonIsComplete,
  newBlock,
  uid,
  weekIsReadyToComplete,
  weekProgressPct,
  weekRequiredSections,
} from '../lib/data';
import { ContentBlock } from '../types';
import {
  ClockIcon,
  InterviewIcon,
  PlusIcon,
  RoadmapIcon,
  TrashIcon,
} from '../components/Icons';
import { getWeekContent, WeekContent } from '../services/contentLoader';
import { MarkdownView } from '../components/MarkdownView';
import { VideoSection } from '../components/lesson/VideoSection';
import { ArticleSection } from '../components/lesson/ArticleSection';
import { BookSection } from '../components/lesson/BookSection';
import { FrameworkSection } from '../components/lesson/FrameworkSection';
import { ImageSection } from '../components/lesson/ImageSection';
import { QuoteSection } from '../components/lesson/QuoteSection';
import { ChecklistSection } from '../components/lesson/ChecklistSection';
import { ExerciseSection } from '../components/lesson/ExerciseSection';
import { QuizSection } from '../components/lesson/QuizSection';
import { ResourcesSection } from '../components/lesson/ResourcesSection';

const WEEK_TABS: Array<[string, string]> = [
  ['overview', 'Overview'],
  ['theory', 'Theory'],
  ['lessons', 'Lessons'],
  ['quiz', 'Checkpoint Quiz'],
  ['frameworks', 'Frameworks'],
  ['summary', 'Summary Notes'],
  ['deliverable', 'Assignment'],
  ['practice', 'Practice'],
  ['apply', 'Apply to Project'],
  ['pmlab', 'PM Lab'],
  ['aiMentor', 'Interview Prep'],
  ['portfolioArtifact', 'Portfolio Deliverable'],
  ['linkedinTask', 'LinkedIn Task'],
  ['reflection', 'Weekly Reflection'],
  ['completion', 'Week Completion'],
];

const LESSON_STATUS_META = {
  completed: { icon: '✅', label: 'Completed' },
  'not-started': { icon: '⬜', label: 'Not Started' },
  locked: { icon: '🔒', label: 'Locked' },
};

export const WeekView: React.FC<{ weekId: number }> = ({ weekId }) => {
  const { state, setState, updatePath, mode, navigate, showToast, addXP, markTodayActive } = useApp();
  const [activeTab, setActiveTab] = useState<string>('lessons');

  const w = state.weeks.find((x) => x.id === weekId);
  const loadedContent: WeekContent = getWeekContent(weekId);

  // Auto-completion check
  useEffect(() => {
    if (!w) return;
    if (w.status !== 'complete' && weekIsReadyToComplete(w)) {
      setState((prevState) => {
        const nextWeeks = prevState.weeks.map((weekItem) => {
          if (weekItem.id === w.id) {
            return { ...weekItem, status: 'complete' as const };
          }
          if (weekItem.id === w.id + 1 && weekItem.status === 'locked') {
            return { ...weekItem, status: 'active' as const };
          }
          return weekItem;
        });
        return {
          ...prevState,
          xp: Math.max(0, (prevState.xp || 0) + 50),
          weeks: nextWeeks,
        };
      });
      showToast('Week completed! +50 XP');
    }
  }, [w, setState, showToast]);

  if (!w) {
    return <EmptyState icon="roadmap" title="Week not found" sub="Head back to the roadmap." />;
  }

  const pct = weekProgressPct(w);
  const prevWeek = state.weeks.find((x) => x.id === w.id - 1);
  const nextWeek = state.weeks.find((x) => x.id === w.id + 1);

  const tabIdx = WEEK_TABS.findIndex(([k]) => k === activeTab);
  const prevTab = WEEK_TABS[tabIdx - 1];
  const nextTab = WEEK_TABS[tabIdx + 1];

  const handleLessonToggle = (idx: number, checked: boolean) => {
    const lessons = [...(w.lessons || [])];
    const lsn = ensureLessonShape({ ...lessons[idx] });
    lsn.completion = { done: checked };
    lessons[idx] = lsn;

    if (checked) {
      addXP(15);
      markTodayActive();
      showToast('Lesson completed! +15 XP');
    } else {
      addXP(-15);
      showToast('Lesson marked not started.');
    }

    updatePath(`weeks.${w.id}.lessons`, lessons);
  };

  const handleAddLesson = () => {
    const lessons = [...(w.lessons || [])];
    const newLsn = ensureLessonShape({
      id: uid('lsn'),
      title: `Lesson ${lessons.length + 1}`,
      objective: '',
      estimatedTime: '',
      contentBlocks: [newBlock('paragraph'), newBlock('quiz')],
      notes: '',
      keyTakeaways: '',
      completion: { done: false },
    });
    lessons.push(newLsn);
    updatePath(`weeks.${w.id}.lessons`, lessons);
  };

  const handleRemoveLesson = (idx: number) => {
    const lessons = (w.lessons || []).filter((_, i) => i !== idx);
    updatePath(`weeks.${w.id}.lessons`, lessons);
  };

  const handleAddBlock = (lessonIdx: number, type: string) => {
    const lessons = [...(w.lessons || [])];
    const lsn = { ...lessons[lessonIdx] };
    lsn.contentBlocks = [...(lsn.contentBlocks || []), newBlock(type)];
    lessons[lessonIdx] = lsn;
    updatePath(`weeks.${w.id}.lessons`, lessons);
  };

  const handleRemoveBlock = (lessonIdx: number, blockIdx: number) => {
    const lessons = [...(w.lessons || [])];
    const lsn = { ...lessons[lessonIdx] };
    lsn.contentBlocks = lsn.contentBlocks.filter((_, i) => i !== blockIdx);
    lessons[lessonIdx] = lsn;
    updatePath(`weeks.${w.id}.lessons`, lessons);
  };

  const handleBlockQuizRetry = (lessonIdx: number, blockIdx: number) => {
    const lessons = [...(w.lessons || [])];
    const lsn = { ...lessons[lessonIdx] };
    const blocks = [...lsn.contentBlocks];
    blocks[blockIdx] = { ...blocks[blockIdx], score: null };
    lsn.contentBlocks = blocks;
    lessons[lessonIdx] = lsn;
    updatePath(`weeks.${w.id}.lessons`, lessons);
    showToast('Mini quiz reset.');
  };

  const base = `weeks.${w.id}`;

  const renderContentBlock = (blk: ContentBlock, lessonIdx: number, blockIdx: number) => {
    const typeInfo = BLOCK_TYPES.find((t) => t[0] === blk.type) || ['paragraph', 'Paragraph', '¶'];
    const path = `${base}.lessons.${lessonIdx}.contentBlocks.${blockIdx}`;

    let body = null;
    switch (blk.type) {
      case 'heading':
        body = (
          <>
            <div className="creator-only">
              <InputField path={`${path}.text`} label="Heading text" placeholder="e.g. Why Discovery Matters" />
            </div>
            <div className="block-heading-text study-only">{blk.text}</div>
          </>
        );
        break;
      case 'paragraph':
        body = <TextareaField path={`${path}.text`} label="Paragraph" placeholder="Write the lesson content here…" rows={5} />;
        break;
      case 'video':
        body = (
          <>
            <InputField path={`${path}.title`} label="Video title" />
            <InputField path={`${path}.url`} label="Video link" placeholder="YouTube, Loom, etc." />
          </>
        );
        break;
      case 'article':
        body = (
          <>
            <InputField path={`${path}.title`} label="Article title" />
            <InputField path={`${path}.url`} label="Article link" />
          </>
        );
        break;
      case 'book':
        body = (
          <>
            <InputField path={`${path}.title`} label="Book title" />
            <InputField path={`${path}.author`} label="Author" />
            <InputField path={`${path}.url`} label="Link (optional)" />
          </>
        );
        break;
      case 'framework':
        body = (
          <>
            <InputField path={`${path}.title`} label="Framework name" placeholder="e.g. RICE, Jobs to be Done" />
            <TextareaField path={`${path}.description`} label="Description" />
          </>
        );
        break;
      case 'image':
        body = (
          <>
            <div className="creator-only">
              <InputField path={`${path}.url`} label="Image URL" />
              <InputField path={`${path}.caption`} label="Caption" />
            </div>
            {blk.url && (
              <img className="block-image-preview study-only" src={blk.url} alt={blk.caption || ''} />
            )}
          </>
        );
        break;
      case 'quote':
        body = (
          <>
            <div className="creator-only">
              <TextareaField path={`${path}.text`} label="Quote" rows={2} />
              <InputField path={`${path}.author`} label="Attribution" />
            </div>
            <div className="block-quote study-only">
              “{blk.text}”{blk.author ? ` — ${blk.author}` : ''}
            </div>
          </>
        );
        break;
      case 'checklist':
        body = <ListEditor path={`${path}.items`} placeholder="Add a checklist item" />;
        break;
      case 'exercise':
        body = (
          <>
            <TextareaField path={`${path}.prompt`} label="Exercise prompt" placeholder="What should the student do or answer?" />
            <TextareaField path={`${path}.studentAnswer`} label="Your Answer" isStudent />
          </>
        );
        break;
      case 'quiz':
        body = (
          <>
            <ListEditor path={`${path}.questions`} placeholder="Add a mini quiz question" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div>
                <div className="field-label">Score</div>
                <div className="stat-value">{blk.score == null ? '—' : `${blk.score}%`}</div>
              </div>
              <button
                className="btn btn-sm student-input"
                onClick={() => handleBlockQuizRetry(lessonIdx, blockIdx)}
              >
                Retry Quiz
              </button>
            </div>
          </>
        );
        break;
      case 'divider':
        body = <hr className="block-divider" />;
        break;
      case 'callout':
        body = (
          <>
            <div className="creator-only">
              <SelectField path={`${path}.icon`} label="Icon" options={['💡', '⚠️', 'ℹ️', '✅', '🚀']} />
              <TextareaField path={`${path}.text`} label="Callout text" rows={2} />
            </div>
            <div className="block-callout study-only">
              <span className="block-callout-icon">{blk.icon || '💡'}</span>
              <span>{blk.text}</span>
            </div>
          </>
        );
        break;
    }

    return (
      <div className="content-block" key={blk.id || blockIdx}>
        <div className="content-block-head">
          <span className="block-type-badge">
            {typeInfo[2]} {typeInfo[1]}
          </span>
          <button
            className="btn btn-ghost btn-sm list-remove creator-only"
            title="Remove block"
            onClick={() => handleRemoveBlock(lessonIdx, blockIdx)}
          >
            <TrashIcon />
          </button>
        </div>
        {body}
      </div>
    );
  };

  const renderLessons = () => {
    const contentLessons = loadedContent.lessons;
    const lessons = w.lessons && w.lessons.length ? w.lessons : contentLessons.map((cl, i) => ({
      id: cl.id,
      title: cl.title,
      objective: '',
      estimatedTime: '20 min',
      content: cl.markdown,
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
      contentBlocks: [],
    } as any));

    return (
      <>
        <div className="lessons-intro study-only">
          Work through each lesson in order — completing one unlocks the next.
        </div>
        <div className="lessons-intro creator-only">
          Every lesson is always open here for editing, regardless of student progress. Locking only applies in Study Mode.
        </div>

        {lessons.map((lsn, idx) => {
          const lsnShape = ensureLessonShape(lsn);
          const locked = isLessonLocked(w, idx, mode);
          const completed = lessonIsComplete(lsnShape);
          const statusKey = locked ? 'locked' : completed ? 'completed' : 'not-started';
          const meta = LESSON_STATUS_META[statusKey];
          const staticMd = contentLessons[idx]?.markdown || '';

          return (
            <div className={`lesson-card status-${statusKey}`} key={lsnShape.id || idx}>
              <div className="lesson-card-head">
                <div className="lesson-badge">Lesson {idx + 1}</div>
                <input
                  className="lesson-title-input"
                  value={lsnShape.title || contentLessons[idx]?.title || `Lesson ${idx + 1}`}
                  placeholder="Lesson title"
                  disabled={locked}
                  onChange={(e) => updatePath(`${base}.lessons.${idx}.title`, e.target.value)}
                />
                <div
                  className={`lesson-status-pill status-${statusKey}`}
                  title="Status is calculated automatically from your progress"
                >
                  {meta.icon} {meta.label}
                </div>
              </div>

              {locked && (
                <div className="p-3 my-3 rounded-xl bg-[#FFFDF9] border border-[#FF7A00]/30 text-[#1E1E1E] text-xs font-medium flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1 rounded-lg bg-[#FF7A00]/10 text-[#FF7A00] font-bold">🔒</span>
                    <div>
                      <span className="font-semibold text-[#FF7A00] block">Read-Only Preview Mode</span>
                      <span className="text-[#6B7280]">Complete Lesson {idx} to unlock interactive tasks and notes.</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#ECECEC]/60 rounded-full text-[11px] text-[#6B7280] font-semibold">Locked</span>
                </div>
              )}

              <div className="lesson-meta-row">
                <InputField
                  path={`${base}.lessons.${idx}.objective`}
                  label="Objective"
                  placeholder="What will the student be able to do after this lesson?"
                />
                <InputField
                  path={`${base}.lessons.${idx}.estimatedTime`}
                  label="Estimated Time"
                  placeholder="e.g. 20 minutes"
                />
              </div>

              {/* Render Static Markdown Content from src/content/ if available */}
              {staticMd && (
                <div className="card my-3 bg-[var(--card-bg)] border border-[var(--border-color)] p-4 rounded-md">
                  <MarkdownView content={staticMd} />
                </div>
              )}

              {/* Structured Lesson Content Sections */}
              <VideoSection videos={lsnShape.videos} />
              <ArticleSection articles={lsnShape.articles} />
              <BookSection books={lsnShape.books} />
              <FrameworkSection frameworks={lsnShape.frameworks} />
              <ImageSection images={lsnShape.images} />
              <QuoteSection quotes={lsnShape.quotes} />
              <ChecklistSection checklists={lsnShape.checklists} />
              <ExerciseSection exercises={lsnShape.exercises} />
              <QuizSection quiz={lsnShape.quiz} />
              <ResourcesSection resources={lsnShape.resources} />

              <div className="content-blocks">
                {(lsnShape.contentBlocks || []).map((blk, blockIdx) =>
                  renderContentBlock(blk, idx, blockIdx)
                )}
              </div>

              <div className="block-add-row creator-only">
                {BLOCK_TYPES.map(([type, label, icon]) => (
                  <button
                    key={type}
                    className="btn btn-ghost btn-sm block-add-btn"
                    onClick={() => handleAddBlock(idx, type)}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              <TextareaField
                path={`${base}.lessons.${idx}.notes`}
                label="📝 Notes"
                placeholder="Your notes for this lesson…"
                rows={3}
                isStudent
              />
              <TextareaField
                path={`${base}.lessons.${idx}.keyTakeaways`}
                label="🔑 Key Takeaways"
                placeholder="What are the key things to remember from this lesson?"
                rows={3}
                isStudent
              />

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '4px 0 0 0',
                  fontSize: '13px',
                  color: 'var(--text-dim)',
                  opacity: locked ? 0.6 : 1,
                }}
                title={locked ? `Complete Lesson ${idx} first to mark this complete` : ''}
              >
                <input
                  type="checkbox"
                  className="list-check student-input"
                  checked={completed}
                  disabled={locked}
                  onChange={(e) => handleLessonToggle(idx, e.target.checked)}
                />{' '}
                Mark this lesson complete {locked ? '(Locked)' : ''}
              </label>

              <div className="lesson-card-foot creator-only">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleRemoveLesson(idx)}
                >
                  <TrashIcon /> Remove Lesson
                </button>
              </div>
            </div>
          );
        })}

        <button className="btn creator-only" onClick={handleAddLesson}>
          <PlusIcon /> Add Lesson
        </button>
      </>
    );
  };

  const renderTabBody = () => {
    switch (activeTab) {
      case 'lessons':
        return renderLessons();
      case 'overview':
        return (
          <div className="card space-y-4">
            {loadedContent.overview && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.overview} />
              </div>
            )}
            {loadedContent.objectives && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.objectives} />
              </div>
            )}
            <div className="creator-only space-y-3 pt-3 border-t border-[var(--border-color)]">
              <TextareaField path={`${base}.overview.goal`} label="Goal Override" placeholder="What is this week meant to achieve?" />
              <TextareaField path={`${base}.overview.why`} label="Why This Matters Override" />
              <TextareaField path={`${base}.overview.outcome`} label="Expected Outcome Override" />
              <InputField path={`${base}.overview.skills`} label="Skills Learned" placeholder="e.g. User Research, RICE Prioritization" />
              <InputField path={`${base}.overview.timeRequired`} label="Time Required" placeholder="e.g. 6 hours" />
            </div>
          </div>
        );
      case 'theory':
        return (
          <>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Core Topics</div>
              <ListEditor path={`${base}.learn.topics`} placeholder="Add a topic" />
            </div>
            <div className="card">
              <div className="lessons-intro">
                Read this before moving into Lessons — the grounding theory for the week.
              </div>
              <TextareaField
                path={`${base}.learn.aiNotes`}
                label="Theory Notes"
                placeholder="Write or paste the core theory for this week…"
                rows={8}
              />
            </div>
          </>
        );
      case 'frameworks':
        return (
          <div className="card space-y-4">
            {loadedContent.frameworks && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.frameworks} />
              </div>
            )}
            <div className="section-title">Frameworks Covered This Week</div>
            <ListEditor path={`${base}.learn.frameworks`} placeholder="Framework name" />
          </div>
        );
      case 'summary':
        return (
          <div className="card">
            {loadedContent.resources && (
              <div className="p-4 mb-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.resources} />
              </div>
            )}
            <TextareaField path={`${base}.learn.keyTakeaways`} label="Key Takeaways" />
          </div>
        );
      case 'practice':
        return (
          <>
            {loadedContent.practice && (
              <div className="card mb-4 p-4">
                <MarkdownView content={loadedContent.practice} />
              </div>
            )}
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Product Sense</div>
              <ListEditor path={`${base}.practice.exercises`} placeholder="Add a product sense exercise" />
            </div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Product Strategy</div>
              <ListEditor path={`${base}.practice.pmQuestions`} placeholder="Add a strategy question" />
            </div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Metrics</div>
              <ListEditor path={`${base}.practice.metricsQuestions`} placeholder="Add a metrics question" />
            </div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Execution</div>
              <ListEditor path={`${base}.practice.miniTasks`} placeholder="Add an execution task" />
            </div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Prioritization</div>
              <ListEditor path={`${base}.practice.uxQuestions`} placeholder="Add a prioritization exercise" />
            </div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Wireframing</div>
              <ListEditor path={`${base}.practice.wireframing`} withUrl placeholder="Wireframing exercise (link optional)" />
            </div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Reflection</div>
              <ListEditor path={`${base}.practice.reflectionPractice`} placeholder="Add a reflection prompt" />
            </div>
            <div className="card">
              <TextareaField path={`${base}.practice.critique`} label="Product Teardown / Feature Improvement — Your Answer" isStudent />
              <TextareaField path={`${base}.practice.prioritization`} label="Prioritization Exercise — Your Answer" isStudent />
            </div>
          </>
        );
      case 'pmlab':
        return (
          <>
            {loadedContent.pmlab && (
              <div className="card mb-4 p-4">
                <MarkdownView content={loadedContent.pmlab} />
              </div>
            )}
            <div className="card creator-only" style={{ marginBottom: '14px' }}>
              <div className="section-title">
                Assignment Brief <span className="badge badge-locked">Creator defines this</span>
              </div>
              <TextareaField path={`${base}.pmLab.goal`} label="Goal" placeholder="What is this lab meant to achieve?" />
              <TextareaField path={`${base}.pmLab.task`} label="Task" placeholder="What exactly should the student do?" />
              <TextareaField path={`${base}.pmLab.instructions`} label="Instructions" placeholder="Step-by-step guidance for completing the task" />
              <TextareaField path={`${base}.pmLab.evaluationCriteria`} label="Evaluation Criteria" placeholder="How will this be judged as complete / well done?" />
              <TextareaField path={`${base}.pmLab.template`} label="Template" placeholder="Optional starting structure or template for the student to fill in" />
            </div>

            <div className="pmlab-notebook">
              <div className="section-title" style={{ marginBottom: '14px' }}>
                Your Working Notebook
              </div>
              <TextareaField path={`${base}.pmLab.observations`} label="Observations" placeholder="What did you notice?" isStudent />
              <TextareaField path={`${base}.pmLab.ideas`} label="Ideas" isStudent />
              <TextareaField path={`${base}.pmLab.evidence`} label="Evidence" isStudent />
              <TextareaField path={`${base}.pmLab.reflection`} label="Reflection" isStudent />

              <div className="field field-student">
                <div className="field-label">Screenshots</div>
                <ListEditor path={`${base}.pmLab.screenshots`} withUrl student placeholder="Screenshot caption" />
              </div>

              <div className="field field-student">
                <div className="field-label">Links</div>
                <ListEditor path={`${base}.pmLab.links`} withUrl student placeholder="Link title" />
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '6px',
                  fontSize: '13px',
                  color: 'var(--text-dim)',
                }}
              >
                <input
                  type="checkbox"
                  className="list-check student-input"
                  id="pmlab-done-cb"
                  checked={!!w.pmLab.done}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updatePath(`${base}.pmLab.done`, checked);
                    if (checked) {
                      addXP(15);
                      markTodayActive();
                      showToast('PM Lab complete! +15 XP');
                    } else {
                      addXP(-15);
                    }
                  }}
                />{' '}
                Mark PM Lab complete for this week
              </label>
            </div>
          </>
        );
      case 'apply':
        return (
          <>
            <div className="card" style={{ marginBottom: '14px' }}>
              <TextareaField path={`${base}.apply.concept`} label="How does this concept apply to your project?" isStudent />
            </div>
            <div className="card" style={{ marginBottom: '14px' }}>
              <div className="section-title">Problems to Solve</div>
              <ListEditor path={`${base}.apply.problems`} placeholder="Add a problem" />
            </div>
            <div className="card">
              <TextareaField path={`${base}.apply.ideas`} label="Ideas" isStudent />
              <TextareaField path={`${base}.apply.before`} label="Before" isStudent />
              <TextareaField path={`${base}.apply.after`} label="After" isStudent />
              <TextareaField path={`${base}.apply.lessons`} label="Lessons" isStudent />
            </div>
          </>
        );
      case 'deliverable':
        return (
          <div className="card space-y-4">
            {loadedContent.assignment && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.assignment} />
              </div>
            )}
            <InputField path={`${base}.deliverable.type`} label="Type" placeholder="e.g. PRD, Persona, Roadmap, Wireframe" />
            <InputField path={`${base}.deliverable.title`} label="Title" />
            <TextareaField path={`${base}.deliverable.description`} label="Your Submission" placeholder="Write or describe your submission here…" isStudent />
            <InputField path={`${base}.deliverable.link`} label="Submission Link" placeholder="https://…" isStudent />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '6px',
                fontSize: '13px',
                color: 'var(--text-dim)',
              }}
            >
              <input
                type="checkbox"
                className="list-check student-input"
                id="deliverable-done-cb"
                checked={!!w.deliverable.done}
                onChange={(e) => {
                  const checked = e.target.checked;
                  updatePath(`${base}.deliverable.done`, checked);
                  if (checked) {
                    addXP(25);
                    markTodayActive();
                    showToast('Deliverable shipped! +25 XP');
                  } else {
                    addXP(-25);
                  }
                }}
              />{' '}
              Mark assignment as shipped
            </label>
          </div>
        );
      case 'aiMentor':
        return (
          <div className="card space-y-4">
            {loadedContent.interview && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.interview} />
              </div>
            )}
            <div className="section-title">Interview Questions For This Week</div>
            <ListEditor path={`${base}.aiMentor.log`} placeholder="Add an interview question to prep" />
            <p style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '10px' }}>
              Categorize by Behavioral, Product Sense, Execution, Metrics, Strategy, AI PM, and Mock Interviews in the global Interview Prep page — every week contributes there.
            </p>
            <div style={{ marginTop: '10px' }}>
              <button className="btn btn-sm" onClick={() => navigate('interview')}>
                <InterviewIcon /> Open Interview Prep
              </button>
            </div>
          </div>
        );
      case 'quiz':
        return (
          <>
            {loadedContent.quiz && loadedContent.quiz.questions.length > 0 && (
              <div className="card mb-4 p-4">
                <div className="section-title mb-3">{loadedContent.quiz.title}</div>
                {loadedContent.quiz.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="mb-4 pb-3 border-b border-[var(--border-color)] last:border-b-0">
                    <div className="font-medium text-sm mb-2">{qIdx + 1}. {q.text}</div>
                    <div className="space-y-1 pl-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="text-sm text-[var(--text-dim)] flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-[var(--border-color)] inline-flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="card creator-only" style={{ marginBottom: '14px' }}>
              <div className="section-title">Custom Questions Override</div>
              <ListEditor path={`${base}.quiz.questions`} placeholder="Add a quiz question" />
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="field-label">Score</div>
                <div className="stat-value">{w.quiz.score == null ? '—' : `${w.quiz.score}%`}</div>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => {
                  updatePath(`${base}.quiz.score`, null);
                  showToast('Quiz reset.');
                }}
              >
                Retry Quiz
              </button>
            </div>
          </>
        );
      case 'portfolioArtifact':
        return (
          <div className="card space-y-4">
            {loadedContent.portfolio && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.portfolio} />
              </div>
            )}
            <TextareaField path={`${base}.portfolioArtifact.description`} label="Description" isStudent />
            <InputField path={`${base}.portfolioArtifact.downloadLink`} label="Download Link" isStudent />
            <TextareaField path={`${base}.portfolioArtifact.linkedinDraft`} label="LinkedIn Post Draft" isStudent />
          </div>
        );
      case 'linkedinTask':
        return (
          <div className="card space-y-4">
            {loadedContent.linkedin && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.linkedin} />
              </div>
            )}
            <TextareaField path={`${base}.linkedinTask.idea`} label="Idea" placeholder="What will this post be about?" isStudent />
            <TextareaField path={`${base}.linkedinTask.draft`} label="Draft" isStudent />
            <InputField path={`${base}.linkedinTask.link`} label="Published Link" placeholder="https://…" isStudent />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '6px',
                fontSize: '13px',
                color: 'var(--text-dim)',
              }}
            >
              <input
                type="checkbox"
                className="list-check student-input"
                id="linkedin-done-cb"
                checked={!!w.linkedinTask.published}
                onChange={(e) => {
                  const checked = e.target.checked;
                  updatePath(`${base}.linkedinTask.published`, checked);
                  if (checked) {
                    addXP(10);
                    markTodayActive();
                    showToast('LinkedIn task published! +10 XP');
                  } else {
                    addXP(-10);
                  }
                }}
              />{' '}
              Mark as published
            </label>
          </div>
        );
      case 'reflection':
        return (
          <div className="card space-y-4">
            {loadedContent.reflection && (
              <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                <MarkdownView content={loadedContent.reflection} />
              </div>
            )}
            <TextareaField path={`${base}.reflection.learned`} label="What did I learn?" isStudent />
            <TextareaField path={`${base}.reflection.mistake`} label="Biggest mistake" isStudent />
            <TextareaField path={`${base}.reflection.newIdea`} label="New idea" isStudent />
            <TextareaField path={`${base}.reflection.questions`} label="Open questions" isStudent />
            <SelectField path={`${base}.reflection.confidence`} label="Confidence Rating" options={['1', '2', '3', '4', '5']} />
          </div>
        );
      case 'completion':
        const reqSections = weekRequiredSections(w);
        const allDone = reqSections.every((s) => s.done);

        if (w.status === 'complete') {
          return (
            <div className="completion-banner">
              <div className="big-check">🎉</div>
              <div className="section-title" style={{ justifyContent: 'center' }}>
                Week Completed
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '13px', maxWidth: '420px', margin: '0 auto 14px auto' }}>
                Every required section for this week is done. XP was awarded and the next week has been unlocked.
              </p>
            </div>
          );
        }

        return (
          <div className="card">
            <div className="section-title">Required to Complete This Week</div>
            <div className="section-progress-list">
              {reqSections.map((s, idx) => (
                <div className="section-progress-row" key={idx}>
                  <span className="section-progress-name">{s.label}</span>
                  <span className={`section-progress-state ${s.done ? 'state-done' : 'state-pending'}`}>
                    {s.done ? '✓ Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '14px' }}>
              {allDone
                ? 'Everything is done — this week will complete automatically.'
                : 'Finish the remaining sections above; the week completes automatically, awards XP, and unlocks the next week.'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <BreadcrumbNav
        crumbs={[
          { label: 'Dashboard', route: 'home' },
          { label: 'Learning Roadmap', route: 'roadmap' },
          { label: w.title },
        ]}
      />

      <PageHeader
        eyebrow={w.id === 0 ? 'Foundation' : `Week ${w.id}`}
        title={w.title}
        sub={`${w.status} · ${pct}% complete`}
      />

      {w.status === 'locked' && (
        <div className="p-4 mb-5 rounded-2xl bg-[#FFFDF9] border border-[#FF7A00]/30 text-[#1E1E1E] text-xs font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00] font-bold text-base">
              🔒
            </div>
            <div>
              <span className="font-bold text-[#FF7A00] text-sm block">Week Preview Mode</span>
              <span className="text-[#6B7280]">Complete Week {Math.max(0, w.id - 1)} to unlock assignment submissions for Week {w.id}. All curriculum content and objectives are visible in preview mode below.</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#ECECEC] rounded-full text-xs text-[#6B7280] font-semibold shrink-0">Locked</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button className="btn btn-sm" onClick={() => navigate('roadmap')}>
          <RoadmapIcon /> Back to Roadmap
        </button>
        <button
          className="btn btn-sm"
          disabled={!prevWeek}
          onClick={() => prevWeek && navigate('week/' + prevWeek.id)}
        >
          ← Previous Week
        </button>
        <button
          className="btn btn-sm"
          disabled={!nextWeek}
          onClick={() => nextWeek && navigate('week/' + nextWeek.id)}
        >
          Next Week →
        </button>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="section-title">Learning Objectives &amp; Setup</div>
          <div className="field">
            <div className="field-label">
              Status{' '}
              <span style={{ textTransform: 'none', fontWeight: 400, opacity: 0.7 }}>
                (auto-calculated from student progress)
              </span>
            </div>
            <span className={`badge badge-${w.status}`}>{w.status}</span>
          </div>
          <SelectField path={`${base}.difficulty`} label="Difficulty" options={['Beginner', 'Intermediate', 'Advanced']} />
          <InputField path={`${base}.estimatedHours`} label="Estimated Time" placeholder="e.g. 6 hours" />
        </div>

        <div className="card">
          <div className="section-title">Weekly Progress</div>
          <SectionProgressList week={w} />
        </div>
      </div>

      <div className="tabs">
        {WEEK_TABS.map(([k, label]) => (
          <div
            key={k}
            className={`tab ${activeTab === k ? 'active' : ''}`}
            onClick={() => setActiveTab(k)}
          >
            {label}
          </div>
        ))}
      </div>

      <div id="week-tab-body">{renderTabBody()}</div>

      <div className="week-nav-rail">
        <button
          className="btn"
          disabled={!prevTab}
          onClick={() => prevTab && setActiveTab(prevTab[0])}
        >
          ← Previous Section{prevTab ? `: ${prevTab[1]}` : ''}
        </button>
        <span className="week-nav-spacer"></span>
        <button
          className="btn btn-primary"
          disabled={!nextTab}
          onClick={() => nextTab && setActiveTab(nextTab[0])}
        >
          Next Section{nextTab ? `: ${nextTab[1]}` : ''} →
        </button>
      </div>
    </>
  );
};
