import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatCard } from '../components/CommonUI';
import {
  levelFromXP,
  overallProgressPct,
  portfolioProgressPct,
  TOTAL_WEEKS,
  weekProgressPct,
  lessonIsComplete,
} from '../lib/data';

export const DashboardView: React.FC = () => {
  const { state, navigate } = useApp();

  const lessonsCompleted = state.weeks.reduce(
    (sum, w) => sum + (w.lessons || []).filter((l) => lessonIsComplete(l)).length,
    0
  );

  const assignmentsCompleted = state.weeks.filter((w) => w.deliverable.done).length;

  const practiceCompleted = state.weeks.reduce(
    (sum, w) =>
      sum +
      w.practice.exercises.filter((t) => t.done).length +
      w.practice.miniTasks.filter((t) => t.done).length +
      w.practice.pmQuestions.filter((t) => t.done).length +
      w.practice.metricsQuestions.filter((t) => t.done).length +
      w.practice.uxQuestions.filter((t) => t.done).length +
      w.practice.wireframing.filter((t) => t.done).length +
      w.practice.reflectionPractice.filter((t) => t.done).length,
    0
  );

  const resourcesCompleted = state.resources.filter((r) => r.done).length;
  const booksFinished = state.weeks.reduce(
    (sum, w) => sum + w.learn.books.filter((b) => b.done).length,
    0
  );
  const weeksCompleted = state.weeks.filter((w) => w.status === 'complete').length;

  const stats: Array<{ label: string; value: React.ReactNode; icon: string }> = [
    { label: 'Lessons Completed', value: lessonsCompleted, icon: 'check' },
    { label: 'Assignments Completed', value: `${assignmentsCompleted} / ${TOTAL_WEEKS + 1}`, icon: 'bolt' },
    { label: 'Practice Completed', value: practiceCompleted, icon: 'tracker' },
    { label: 'Resources Completed', value: `${resourcesCompleted} / ${state.resources.length}`, icon: 'library' },
    { label: 'Interview Questions Solved', value: state.interviewPrep.length, icon: 'interview' },
    {
      label: 'LinkedIn Posts',
      value: (state.linkedin || []).filter((p) => p.category === 'Published').length,
      icon: 'notes',
    },
    { label: 'Case Studies', value: state.casestudies.length, icon: 'portfolio' },
    { label: 'Portfolio Progress', value: `${portfolioProgressPct(state.weeks)}%`, icon: 'portfolio' },
    { label: 'Books Finished', value: booksFinished, icon: 'knowledge' },
    { label: 'Hours Studied', value: `${state.settings.hoursLoggedTotal}h`, icon: 'clock' },
    { label: 'Weeks Completed', value: `${weeksCompleted} / ${TOTAL_WEEKS + 1}`, icon: 'roadmap' },
    { label: 'Current Streak', value: `${state.streak.current}d`, icon: 'streak' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Track"
        title="Analytics"
        sub="A live snapshot of your Product Management Fellowship."
      />

      <div className="grid grid-4" style={{ marginBottom: '20px' }}>
        {stats.map((s, idx) => (
          <StatCard key={idx} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid grid-3" style={{ marginBottom: '20px' }}>
        <StatCard label="Overall Progress" value={`${overallProgressPct(state.weeks)}%`} icon="tracker" />
        <StatCard label="Longest Streak" value={`${state.streak.longest}d`} icon="streak" />
        <StatCard label="XP" value={`${state.xp} · Lv ${levelFromXP(state.xp)}`} icon="xp" />
      </div>

      <div className="section-title">Per-Week Breakdown</div>
      <div className="week-rail">
        {state.weeks.map((w) => {
          const pct = weekProgressPct(w);
          return (
            <div
              key={w.id}
              className={`week-row status-${w.status}`}
              onClick={() => navigate('week/' + w.id)}
            >
              <div className="week-index">{String(w.id).padStart(2, '0')}</div>
              <div className="week-main">
                <div className="week-name">{w.title}</div>
              </div>
              <div className="week-progress-mini" style={{ width: '160px' }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  color: 'var(--text-dim)',
                  width: '38px',
                  textAlign: 'right',
                }}
              >
                {pct}%
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
