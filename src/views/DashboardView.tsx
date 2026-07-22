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
import { ClockIcon, RoadmapIcon, SparklesIcon, CheckIcon } from '../components/Icons';

export const DashboardView: React.FC = () => {
  const { state, navigate } = useApp();

  // Find Current Active Week
  const currentWeekObj = state.weeks.find((w) => w.id === state.currentWeek) || state.weeks[0];
  const currentWeekPct = weekProgressPct(currentWeekObj);

  // Find Next Pending Lesson in Current Week
  const nextLesson = (currentWeekObj.lessons || []).find((l) => !lessonIsComplete(l)) || currentWeekObj.lessons[0];

  // Calculated Metrics
  const totalLessons = state.weeks.reduce((sum, w) => sum + (w.lessons || []).length, 0);
  const lessonsCompleted = state.weeks.reduce(
    (sum, w) => sum + (w.lessons || []).filter((l) => lessonIsComplete(l)).length,
    0
  );

  const totalAssignments = state.weeks.length;
  const assignmentsCompleted = state.weeks.filter((w) => w.deliverable.done).length;

  const practiceCompleted = state.weeks.reduce(
    (sum, w) =>
      sum +
      (w.practice.critique ? 1 : 0) +
      (w.practice.prioritization ? 1 : 0) +
      w.practice.exercises.filter((t) => t.done).length +
      w.practice.miniTasks.filter((t) => t.done).length,
    0
  );

  const pmLabCompletedCount = state.weeks.filter((w) => w.pmLab && w.pmLab.done).length;
  const portfolioCount = (state.portfolio || []).length + assignmentsCompleted;
  const weeksCompleted = state.weeks.filter((w) => w.status === 'complete').length;

  // Derive Upcoming Task dynamically
  let upcomingTask = 'Complete current lesson';
  if (nextLesson) {
    upcomingTask = `Complete Lesson: "${nextLesson.title}" (Week ${currentWeekObj.id})`;
  } else if (!currentWeekObj.deliverable.done) {
    upcomingTask = `Submit Deliverable for Week ${currentWeekObj.id}: "${currentWeekObj.deliverable.title || 'Assignment'}"`;
  } else if (!currentWeekObj.pmLab.done) {
    upcomingTask = `Complete PM Lab for Week ${currentWeekObj.id}`;
  } else {
    upcomingTask = `Review & complete reflection for Week ${currentWeekObj.id}`;
  }

  // Derive Recent Activity feed
  const recentActivities: Array<{ title: string; subtitle: string; time: string; type: string }> = [];

  state.weeks.forEach((w) => {
    (w.lessons || []).forEach((l) => {
      if (lessonIsComplete(l)) {
        recentActivities.push({
          title: `Completed Lesson: ${l.title}`,
          subtitle: `Week ${w.id} · ${w.title}`,
          time: 'Recently',
          type: 'lesson',
        });
      }
    });
    if (w.pmLab.done) {
      recentActivities.push({
        title: `Saved PM Lab: Week ${w.id}`,
        subtitle: w.title,
        time: 'Saved',
        type: 'pmlab',
      });
    }
    if (w.deliverable.done) {
      recentActivities.push({
        title: `Shipped Assignment: ${w.deliverable.title || 'Deliverable'}`,
        subtitle: `Week ${w.id}`,
        time: 'Submitted',
        type: 'deliverable',
      });
    }
  });

  (state.journal || []).slice(0, 3).forEach((j) => {
    recentActivities.push({
      title: `Journal Entry: ${j.learning || 'Daily Reflection'}`,
      subtitle: j.date,
      time: j.date,
      type: 'journal',
    });
  });

  const displayActivity = recentActivities.slice(-6).reverse();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Dashboard"
        title="Learning Overview"
        sub="Your dynamic progress, upcoming tasks, and metrics loaded from Supabase & local storage."
      />

      {/* Hero Continue Learning & Current Week Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Continue Learning Banner */}
        <div className="md:col-span-2 card bg-gradient-to-r from-[var(--card-bg)] to-[var(--bg-main)] border border-[var(--border-color)] p-6 rounded-xl flex flex-col justify-between shadow-md">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-color)] uppercase tracking-wider">
              <SparklesIcon /> Continue Learning
            </div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">
              Week {currentWeekObj.id}: {currentWeekObj.title}
            </h2>
            <p className="text-xs text-[var(--text-dim)] line-clamp-2">
              Next up: <span className="text-[var(--text-main)] font-medium">{nextLesson ? nextLesson.title : 'Complete Week Deliverable'}</span>
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-24 bg-[var(--bg-main)] rounded-full h-2 overflow-hidden border border-[var(--border-color)]">
                <div
                  className="bg-[var(--accent-color)] h-full transition-all"
                  style={{ width: `${currentWeekPct}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-[var(--text-dim)]">{currentWeekPct}% complete</span>
            </div>

            <button
              onClick={() => navigate(`week/${currentWeekObj.id}`)}
              className="btn btn-primary btn-sm flex items-center gap-1"
            >
              Resume Learning →
            </button>
          </div>
        </div>

        {/* Upcoming Task Card */}
        <div className="card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <ClockIcon /> Upcoming Task
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-main)]">{upcomingTask}</h3>
            <p className="text-xs text-[var(--text-dim)]">
              Stay on track with your weekly goal of {state.settings.weeklyGoalDays || 5} active learning days.
            </p>
          </div>

          <button
            onClick={() => navigate(`week/${currentWeekObj.id}`)}
            className="mt-4 text-xs font-medium text-[var(--accent-color)] hover:underline flex items-center gap-1"
          >
            Go to Task →
          </button>
        </div>
      </div>

      {/* Grid of 6 Key Metrics */}
      <div className="grid grid-2 md:grid-3 lg:grid-6 gap-3">
        <StatCard label="Learning Streak" value={`${state.streak.current} Days`} icon="streak" />
        <StatCard label="Total XP" value={`${state.xp} · Lv ${levelFromXP(state.xp)}`} icon="xp" />
        <StatCard label="Lessons Done" value={`${lessonsCompleted} / ${totalLessons}`} icon="check" />
        <StatCard label="Assignments" value={`${assignmentsCompleted} / ${totalAssignments}`} icon="bolt" />
        <StatCard label="PM Labs Saved" value={`${pmLabCompletedCount} / ${TOTAL_WEEKS + 1}`} icon="tracker" />
        <StatCard label="Portfolio Items" value={`${portfolioCount}`} icon="portfolio" />
      </div>

      {/* Main Content Area: Week Rail + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Per Week Progress Rail */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
              <RoadmapIcon /> Curriculum Roadmap Progress
            </h3>
            <span className="text-xs text-[var(--text-dim)]">
              {weeksCompleted} of {TOTAL_WEEKS + 1} Weeks Completed
            </span>
          </div>

          <div className="week-rail space-y-2">
            {state.weeks.map((w) => {
              const pct = weekProgressPct(w);
              const isActive = w.id === state.currentWeek;
              return (
                <div
                  key={w.id}
                  className={`week-row status-${w.status} ${isActive ? 'ring-1 ring-[var(--accent-color)]' : ''}`}
                  onClick={() => navigate('week/' + w.id)}
                >
                  <div className="week-index">{String(w.id).padStart(2, '0')}</div>
                  <div className="week-main">
                    <div className="week-name flex items-center gap-2">
                      <span>{w.title}</span>
                      {w.status === 'complete' && (
                        <span className="text-emerald-400 text-xs">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="week-progress-mini" style={{ width: '140px' }}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--text-dim)',
                      width: '40px',
                      textAlign: 'right',
                    }}
                  >
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
            ⚡ Recent Activity
          </h3>

          <div className="card bg-[var(--card-bg)] border border-[var(--border-color)] p-4 rounded-xl space-y-3">
            {displayActivity.length === 0 ? (
              <p className="text-xs text-[var(--text-dim)] py-4 text-center">
                No recent activity yet. Start by completing your first lesson!
              </p>
            ) : (
              displayActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs pb-3 border-b border-[var(--border-color)] last:border-b-0 last:pb-0">
                  <span className="w-6 h-6 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === 'lesson' ? '📚' : act.type === 'pmlab' ? '🧪' : act.type === 'deliverable' ? '🚀' : '📝'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[var(--text-main)] truncate">{act.title}</div>
                    <div className="text-[var(--text-dim)] text-[11px] truncate">{act.subtitle}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
