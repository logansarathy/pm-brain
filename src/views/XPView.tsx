import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatCard } from '../components/CommonUI';
import { levelFromXP, xpIntoLevel } from '../lib/data';
import { XpIcon } from '../components/Icons';

export const XPView: React.FC = () => {
  const { state } = useApp();

  const lvl = levelFromXP(state.xp);
  const into = xpIntoLevel(state.xp);
  const widthPct = Math.round((into / 150) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Gamification"
        title="XP System"
        sub="Earn XP by checking off topics, tasks, and shipped deliverables."
      />

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="stat-label">
          <XpIcon /> Level {lvl}
        </div>
        <div className="stat-value" style={{ marginBottom: '10px' }}>
          {state.xp} XP
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${widthPct}%`, background: 'var(--amber)' }}
          ></div>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-faint)', marginTop: '6px' }}>
          {150 - into} XP to Level {lvl + 1}
        </div>
      </div>

      <div className="grid grid-3">
        <StatCard label="Checklist items" value="+5 XP each" icon="check" />
        <StatCard label="Deliverable shipped" value="+25 XP" icon="bolt" />
        <StatCard label="Day logged" value="+10 XP" icon="streak" />
      </div>
    </>
  );
};
