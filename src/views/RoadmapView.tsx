import React from 'react';
import { useApp } from '../context/AppContext';
import { BreadcrumbNav, PageHeader } from '../components/CommonUI';
import { weekProgressPct } from '../lib/data';

export const RoadmapView: React.FC = () => {
  const { state, navigate } = useApp();

  return (
    <>
      <BreadcrumbNav crumbs={[{ label: 'Dashboard', route: 'home' }, { label: 'Learning Roadmap' }]} />
      <PageHeader
        eyebrow="Timeline"
        title="Learning Roadmap"
        sub="Weeks 0 through 16. Click a week to open its workspace."
      />

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
                <div className="week-meta">
                  <span>{w.difficulty || 'Difficulty not set'}</span>
                  <span>{w.estimatedHours ? `${w.estimatedHours}h estimated` : 'Hours not set'}</span>
                </div>
              </div>
              <span className={`badge badge-${w.status}`}>{w.status}</span>
              <div className="week-progress-mini">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
