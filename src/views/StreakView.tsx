import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ProgressRing, SelectField, StatCard } from '../components/CommonUI';
import { todayStr } from '../lib/data';
import { StreakIcon } from '../components/Icons';

export const StreakView: React.FC = () => {
  const { state } = useApp();

  const s = state.streak;
  const doneToday = s.lastActiveDate === todayStr();
  const pct = Math.min(100, Math.round((s.current / Math.max(s.longest, 7)) * 100));

  return (
    <>
      <PageHeader eyebrow="Momentum" title="Daily Streak" sub="Consistency compounds. Log a day every day you show up." />

      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ProgressRing pct={pct} label={`${s.current} days`} size={118} />
          <div>
            <div className="stat-label">
              <StreakIcon /> Current Streak
            </div>
            <div className="stat-value" style={{ marginBottom: '10px' }}>
              {s.current} days
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-dim)' }}>
              {doneToday
                ? 'Logged for today ✓'
                : 'Complete a lesson, deliverable, or PM Lab to log today automatically.'}
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ alignContent: 'start' }}>
          <StatCard label="Longest Streak" value={`${s.longest}d`} icon="streak" />
          <StatCard label="Freeze Available" value={s.freezeAvailable} icon="clock" />
        </div>
      </div>

      <div className="card">
        <div className="section-title">Goals</div>
        <div className="grid grid-2">
          <SelectField path="settings.weeklyGoalDays" label="Weekly Goal (days)" options={['1', '2', '3', '4', '5', '6', '7']} />
          <SelectField path="settings.monthlyGoalDays" label="Monthly Goal (days)" options={['5', '10', '15', '20', '25', '30']} />
        </div>
      </div>
    </>
  );
};
