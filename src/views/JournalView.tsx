import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EmptyState, InputField, PageHeader, TextareaField } from '../components/CommonUI';
import { fmtDate, todayStr, uid } from '../lib/data';
import { JournalIcon, TrashIcon } from '../components/Icons';

export const JournalView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const today = todayStr();
  const todaysEntry = state.journal.find((j) => j.date === today);

  useEffect(() => {
    if (!todaysEntry) {
      const newEntry = {
        id: uid('j'),
        date: today,
        learning: '',
        wins: '',
        problems: '',
        ideas: '',
        mood: '',
        tomorrowGoal: '',
      };
      setState((prev) => ({
        ...prev,
        journal: [...prev.journal, newEntry],
      }));
    }
  }, [todaysEntry, today, setState]);

  const entryIdx = state.journal.findIndex((j) => j.date === today);
  const basePath = entryIdx >= 0 ? `journal.${entryIdx}` : '';

  const pastEntries = state.journal.filter((j) => j.date !== today);

  const handleDeletePast = (id: string) => {
    setState((prev) => ({
      ...prev,
      journal: prev.journal.filter((j) => j.id !== id),
    }));
    showToast('Deleted.');
  };

  return (
    <>
      <PageHeader eyebrow="Reflect" title="Journal" sub="A daily log of wins, problems, ideas, and mood." />

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="section-title">Today · {fmtDate(today)}</div>
        {basePath && (
          <>
            <TextareaField path={`${basePath}.learning`} label="Today's Learning" />
            <TextareaField path={`${basePath}.wins`} label="Today's Wins" />
            <TextareaField path={`${basePath}.problems`} label="Problems" />
            <TextareaField path={`${basePath}.ideas`} label="Ideas" />
            <InputField path={`${basePath}.mood`} label="Mood" placeholder="e.g. Focused, Tired, Excited" />
            <TextareaField path={`${basePath}.tomorrowGoal`} label="Tomorrow's Goal" />
          </>
        )}
      </div>

      <div className="section-title">Past Entries</div>
      {pastEntries.length === 0 ? (
        <EmptyState
          icon="journal"
          title="No past entries yet"
          sub="Once you journal for a few days, they will show up here."
        />
      ) : (
        pastEntries
          .slice()
          .reverse()
          .map((j) => (
            <div className="collection-row" key={j.id}>
              <div>
                <div className="collection-row-title">{fmtDate(j.date)}</div>
                <div className="collection-row-meta">
                  <span className="tag">{j.mood || 'no mood set'}</span>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleDeletePast(j.id)}
              >
                <TrashIcon />
              </button>
            </div>
          ))
      )}
    </>
  );
};
