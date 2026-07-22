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
  weekChecklist,
  weekProgressPct,
  lessonIsComplete,
  fmtDate,
} from '../lib/data';
import { BoltIcon, JournalIcon } from '../components/Icons';

export const HomeView: React.FC = () => {
  const { state, navigate } = useApp();

  const week =
    state.weeks.find((w) => w.status === 'active') ||
    state.weeks[state.currentWeek] ||
    state.weeks[0];

  const pct = weekProgressPct(week);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  const firstName = (state.profile.name || 'Logansarathy').split(' ')[0];

  const nextLesson = (week.lessons || []).find((l) => !lessonIsComplete(l));
  const missionLabel = nextLesson
    ? `Lesson: ${nextLesson.title}`
    : week.deliverable && !week.deliverable.done
    ? `Ship: ${week.deliverable.title || 'this week’s deliverable'}`
    : 'Review & reflect on this week';

  const currentLessonLabel = nextLesson
    ? nextLesson.title
    : (week.lessons || []).every((l) => lessonIsComplete(l)) && (week.lessons || []).length
    ? 'All lessons complete'
    : '—';

  const estHours = parseFloat(week.estimatedHours) || 0;
  const lessonsTotal = (week.lessons || []).length;
  const lessonsDone = (week.lessons || []).filter((l) => lessonIsComplete(l)).length;
  const estRemaining =
    estHours && lessonsTotal
      ? Math.max(0, Math.round(estHours * (1 - lessonsDone / lessonsTotal) * 10) / 10)
      : null;

  const pendingPractice = weekChecklist(week).filter((x) => !x).length;
  const pendingReflection = !(week.reflection.learned && week.reflection.learned.trim());
  const pendingAssignment = !week.deliverable.done;
  const interviewCount = state.interviewPrep.length;
  const interviewReadiness = Math.min(100, interviewCount * 4);
  const hoursLearned = state.settings.hoursLoggedTotal || 0;
  const recent = state.journal.slice().reverse().slice(0, 3);

  return (
    <>
      <BreadcrumbNav crumbs={[{ label: 'Dashboard' }]} />

      <div className="hero-card">
        <div>
          <div className="page-eyebrow">{greeting}</div>
          <div className="hero-greet">
            Good {hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'}, {firstName}.
          </div>
          <div
            className="hero-quote"
            style={{
              marginTop: '2px',
              fontStyle: 'normal',
              color: 'var(--text)',
              fontSize: '14.5px',
              maxWidth: '520px',
            }}
          >
            <strong>Today's Mission</strong> — {missionLabel}
          </div>

          <div className="hero-stats" style={{ marginTop: '16px' }}>
            <div className="hero-stat">
              <div className="hero-stat-label">Current Week</div>
              <div className="hero-stat-value">{week.title}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Current Lesson</div>
              <div className="hero-stat-value" style={{ fontSize: '14px' }}>
                {currentLessonLabel}
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Streak</div>
              <div className="hero-stat-value">{state.streak.current}d 🔥</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">XP</div>
              <div className="hero-stat-value">
                {state.xp} · Lv {levelFromXP(state.xp)}
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Learning Hours</div>
              <div className="hero-stat-value">{hoursLearned}h</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Est. Time Remaining</div>
              <div className="hero-stat-value">{estRemaining == null ? '—' : estRemaining + 'h'}</div>
            </div>
          </div>

          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => navigate('week/' + week.id)}>
              <BoltIcon /> Continue Learning
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('journal')}>
              <JournalIcon /> Journal Today
            </button>
            <button className="btn" onClick={() => navigate('interview')}>
              Interview Prep
            </button>
          </div>
        </div>

        <ProgressRing pct={pct} label="This week" />
      </div>

      <div className="grid grid-4">
        <StatCard label="Overall Progress" value={`${overallProgressPct(state.weeks)}%`} icon="tracker" />
        <StatCard label="Portfolio Progress" value={`${portfolioProgressPct(state.weeks)}%`} icon="portfolio" />
        <StatCard label="Interview Readiness" value={`${interviewReadiness}%`} icon="interview" />
        <StatCard label="Current Streak" value={`${state.streak.current}d`} icon="streak" sub={`best ${state.streak.longest}d`} />
      </div>

      <div className="grid grid-2" style={{ marginTop: '14px' }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('week/' + week.id)}>
          <div className="section-title">
            Weekly Progress <span className="tag">{week.title}</span>
          </div>
          <SectionProgressList week={week} />
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '14px' }}>
          <div className="card" onClick={() => navigate('week/' + week.id)} style={{ cursor: 'pointer' }}>
            <div className="section-title">⚡ Pending Assignment</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              {pendingAssignment
                ? week.deliverable.title || 'Not shipped yet — open this week to define it.'
                : 'All shipped for this week ✓'}
            </div>
          </div>

          <div className="card" onClick={() => navigate('week/' + week.id)} style={{ cursor: 'pointer' }}>
            <div className="section-title">📊 Pending Practice</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              {pendingPractice > 0
                ? `${pendingPractice} item(s) left this week`
                : 'Practice complete for this week ✓'}
            </div>
          </div>

          <div className="card" onClick={() => navigate('week/' + week.id)} style={{ cursor: 'pointer' }}>
            <div className="section-title">📝 Pending Reflection</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              {pendingReflection ? 'You haven’t reflected on this week yet.' : 'Reflection logged ✓'}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '14px' }}>
        <div className="section-title">Recent Activity</div>
        {recent.length === 0 ? (
          <EmptyState
            icon="journal"
            title="Nothing logged yet"
            sub="Journal entries and completed lessons will show up here."
          />
        ) : (
          recent.map((j) => (
            <div
              className="collection-row"
              style={{ cursor: 'pointer' }}
              key={j.id}
              onClick={() => navigate('journal')}
            >
              <div>
                <div className="collection-row-title">Journaled · {fmtDate(j.date)}</div>
                <div className="collection-row-meta">
                  <span className="tag">{j.mood || 'reflection'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
