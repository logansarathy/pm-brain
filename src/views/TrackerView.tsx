import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatCard } from '../components/CommonUI';
import { overallProgressPct, TOTAL_WEEKS, weekProgressPct } from '../lib/data';

export const TrackerView: React.FC = () => {
  const { state, navigate } = useApp();

  return (
    <>
      <PageHeader eyebrow="Track" title="Progress Tracker" sub="How the 16 weeks are moving, at a glance." />

      <div className="grid grid-3" style={{ marginBottom: '20px' }}>
        <StatCard label="Overall Progress" value={`${overallProgressPct(state.weeks)}%`} icon="tracker" />
        <StatCard
          label="Weeks Complete"
          value={`${state.weeks.filter((w) => w.status === 'complete').length} / ${TOTAL_WEEKS + 1}`}
          icon="check"
        />
        <StatCard
          label="Deliverables Shipped"
          value={`${state.weeks.filter((w) => w.deliverable.done).length} / ${TOTAL_WEEKS + 1}`}
          icon="bolt"
        />
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
