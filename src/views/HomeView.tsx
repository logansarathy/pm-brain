import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BreadcrumbNav,
  ProgressRing,
  StatCard,
  SectionProgressList,
  EmptyState,
} from '../components/CommonUI';
import {
  levelFromXP,
  overallProgressPct,
  portfolioProgressPct,
  weekProgressPct,
  lessonIsComplete,
  fmtDate,
  TOTAL_WEEKS,
} from '../lib/data';
import { BoltIcon, JournalIcon, CheckIcon, RoadmapIcon } from '../components/Icons';
import { Sparkles, Clock, Flame, Award, BookOpen, Send, Layers } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { state, navigate } = useApp();

  const week =
    state.weeks.find((w) => w.id === state.currentWeek) ||
    state.weeks.find((w) => w.status === 'active') ||
    state.weeks[0];

  const pct = weekProgressPct(week);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (state.profile.name || 'Student').split(' ')[0];

  const nextLesson = (week.lessons || []).find((l) => !lessonIsComplete(l));
  const missionLabel = nextLesson
    ? `Lesson: ${nextLesson.title}`
    : week.deliverable && !week.deliverable.done
    ? `Ship: ${week.deliverable.title || 'this week’s deliverable'}`
    : 'Review & reflect on this week';

  const currentLessonLabel = nextLesson
    ? nextLesson.title
    : (week.lessons || []).every((l) => lessonIsComplete(l)) && (week.lessons || []).length
    ? 'All lessons complete ✓'
    : '—';

  const estHours = parseFloat(week.estimatedHours) || 0;
  const lessonsTotal = (week.lessons || []).length;
  const lessonsDone = (week.lessons || []).filter((l) => lessonIsComplete(l)).length;
  const estRemaining =
    estHours && lessonsTotal
      ? Math.max(0, Math.round(estHours * (1 - lessonsDone / lessonsTotal) * 10) / 10)
      : null;

  const pendingPractice = (week.practice.exercises || []).filter((x) => !x.done).length;
  const pendingReflection = !(week.reflection.learned && week.reflection.learned.trim());
  const pendingAssignment = !week.deliverable.done;
  const hoursLearned = state.settings.hoursLoggedTotal || 0;
  const recentJournal = state.journal.slice().reverse().slice(0, 3);
  const weeksCompleted = state.weeks.filter((w) => w.status === 'complete').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <BreadcrumbNav crumbs={[{ label: 'Home Workspace' }]} />

      {/* Hero Greeting & Current Mission */}
      <div className="bg-white border border-[#ECECEC] p-6 sm:p-8 rounded-2xl shadow-2xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{greeting}, {firstName}</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1E]">
              Week {week.id}: {week.title}
            </h1>
            <p className="text-sm text-[#6B7280] mt-1.5 flex items-center gap-2">
              <span className="font-semibold text-[#1E1E1E]">Today's Mission:</span>
              <span className="text-[#FF7A00] font-medium">{missionLabel}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#ECECEC]">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block">Current Lesson</span>
              <span className="text-xs font-bold text-[#1E1E1E] truncate block mt-0.5">{currentLessonLabel}</span>
            </div>
            <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#ECECEC]">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block">Streak</span>
              <span className="text-xs font-bold text-[#1E1E1E] block mt-0.5">{state.streak.current}d 🔥</span>
            </div>
            <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#ECECEC]">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block">XP Level</span>
              <span className="text-xs font-bold text-[#FF7A00] block mt-0.5">{state.xp} XP · Lv {levelFromXP(state.xp)}</span>
            </div>
            <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#ECECEC]">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block">Hours Learned</span>
              <span className="text-xs font-bold text-[#1E1E1E] block mt-0.5">{hoursLearned}h</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-xs transition-all shadow-2xs flex items-center gap-2"
              onClick={() => navigate('week/' + week.id)}
            >
              <BoltIcon />
              <span>Continue Learning Week {week.id}</span>
            </button>
            <button
              className="px-4 py-2.5 bg-white hover:bg-[#FAF9F6] border border-[#ECECEC] text-[#1E1E1E] font-medium rounded-xl text-xs transition-colors flex items-center gap-2 shadow-2xs"
              onClick={() => navigate('journal')}
            >
              <JournalIcon />
              <span>Journal Reflection</span>
            </button>
            <button
              className="px-4 py-2.5 bg-white hover:bg-[#FAF9F6] border border-[#ECECEC] text-[#1E1E1E] font-medium rounded-xl text-xs transition-colors flex items-center gap-2 shadow-2xs"
              onClick={() => navigate('interview')}
            >
              <span>Interview Prep</span>
            </button>
          </div>
        </div>

        <div className="shrink-0 self-center md:self-auto">
          <ProgressRing pct={pct} label={`Week ${week.id}`} />
        </div>
      </div>

      {/* Grid of Key Product Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Overall Progress" value={`${overallProgressPct(state.weeks)}%`} icon="tracker" />
        <StatCard label="Portfolio Progress" value={`${portfolioProgressPct(state.weeks)}%`} icon="portfolio" />
        <StatCard label="Weeks Completed" value={`${weeksCompleted} / ${TOTAL_WEEKS + 1}`} icon="check" />
        <StatCard label="Learning Streak" value={`${state.streak.current}d`} icon="streak" sub={`best ${state.streak.longest}d`} />
      </div>

      {/* Week Progress & Pending Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#ECECEC] p-6 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
            <h2 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF7A00]" />
              <span>Weekly Progress: {week.title}</span>
            </h2>
            <button
              onClick={() => navigate('week/' + week.id)}
              className="text-xs font-semibold text-[#FF7A00] hover:underline"
            >
              Open Week {week.id} →
            </button>
          </div>
          <SectionProgressList week={week} />
        </div>

        <div className="space-y-4">
          <div
            className="bg-white border border-[#ECECEC] hover:border-[#FF7A00]/50 p-5 rounded-2xl shadow-2xs cursor-pointer transition-all space-y-1.5"
            onClick={() => navigate('week/' + week.id)}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
              <Send className="w-3.5 h-3.5 text-[#FF7A00]" /> Pending Assignment
            </div>
            <p className="text-xs text-[#6B7280]">
              {pendingAssignment
                ? week.deliverable.title || 'Not shipped yet — open week to submit deliverable.'
                : 'Assignment shipped for this week ✓'}
            </p>
          </div>

          <div
            className="bg-white border border-[#ECECEC] hover:border-[#FF7A00]/50 p-5 rounded-2xl shadow-2xs cursor-pointer transition-all space-y-1.5"
            onClick={() => navigate('week/' + week.id)}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-[#FF7A00]" /> Pending Practice
            </div>
            <p className="text-xs text-[#6B7280]">
              {pendingPractice > 0
                ? `${pendingPractice} product sense item(s) remaining`
                : 'Practice complete for this week ✓'}
            </p>
          </div>

          <div
            className="bg-white border border-[#ECECEC] hover:border-[#FF7A00]/50 p-5 rounded-2xl shadow-2xs cursor-pointer transition-all space-y-1.5"
            onClick={() => navigate('week/' + week.id)}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#FF7A00]" /> Pending Reflection
            </div>
            <p className="text-xs text-[#6B7280]">
              {pendingReflection ? 'Reflection not logged yet for this week.' : 'Reflection logged ✓'}
            </p>
          </div>
        </div>
      </div>

      {/* Full 16-Week Curriculum Roadmap Rail */}
      <div className="bg-white border border-[#ECECEC] p-6 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
          <h2 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider flex items-center gap-2">
            <RoadmapIcon /> Curriculum Roadmap
          </h2>
          <span className="text-xs font-semibold text-[#6B7280]">
            {weeksCompleted} of {TOTAL_WEEKS + 1} Weeks Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.weeks.map((w) => {
            const weekPct = weekProgressPct(w);
            const isActive = w.id === state.currentWeek;
            const isComplete = w.status === 'complete';

            return (
              <div
                key={w.id}
                onClick={() => navigate('week/' + w.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-[#FFFDF9] border-[#FF7A00] ring-1 ring-[#FF7A00]/20'
                    : isComplete
                    ? 'bg-[#FAF9F6] border-emerald-500/30'
                    : 'bg-white border-[#ECECEC] hover:border-[#FF7A00]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FF7A00] uppercase tracking-wider block">
                      Week {w.id}
                    </span>
                    <h3 className="text-xs font-bold text-[#1E1E1E] line-clamp-1">{w.title}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${
                      isComplete
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : isActive
                        ? 'bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20'
                        : 'bg-[#ECECEC] text-[#6B7280]'
                    }`}
                  >
                    {isComplete ? 'Complete' : isActive ? 'Active' : 'Locked'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                    <span>Progress</span>
                    <span>{weekPct}%</span>
                  </div>
                  <div className="w-full bg-[#ECECEC] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-[#FF7A00]'}`}
                      style={{ width: `${weekPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#ECECEC] p-6 rounded-2xl shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider">
          Recent Activity
        </h2>
        {recentJournal.length === 0 ? (
          <EmptyState
            icon="journal"
            title="Nothing logged yet"
            sub="Journal reflections and completed weekly deliverables will show up here."
          />
        ) : (
          <div className="space-y-2">
            {recentJournal.map((j) => (
              <div
                key={j.id}
                onClick={() => navigate('journal')}
                className="p-3 bg-[#FAF9F6] border border-[#ECECEC] hover:border-[#FF7A00]/30 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-[#1E1E1E]">{j.learning || 'Daily Journal Reflection'}</div>
                  <div className="text-[11px] text-[#6B7280]">Logged on {fmtDate(j.date)}</div>
                </div>
                <span className="px-2.5 py-1 bg-[#FF7A00]/10 text-[#FF7A00] rounded-full text-[10px] font-semibold">
                  {j.mood || 'Reflection'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
