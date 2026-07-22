import React from 'react';
import { useApp } from '../context/AppContext';
import { InputField, PageHeader, SelectField } from '../components/CommonUI';
import { defaultState, todayStr } from '../lib/data';

export const SettingsView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pmos-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exported.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        setState(Object.assign(defaultState(), parsed));
        showToast('Backup imported.');
      } catch (err) {
        alert('Could not read that file as PM OS backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('This will permanently erase all PM OS data in this browser. Continue?')) {
      setState(defaultState());
      showToast('All data reset.');
    }
  };

  return (
    <>
      <PageHeader eyebrow="System" title="Settings" sub="Your profile, goals, and workspace preferences." />

      <div className="grid grid-2">
        <div className="card">
          <div className="section-title">Profile</div>
          <InputField path="profile.name" label="Name" />
          <InputField path="profile.track" label="Track" />
          <InputField path="profile.education" label="Education" />
        </div>

        <div className="card">
          <div className="section-title">Preferences</div>
          <SelectField path="settings.weeklyGoalDays" label="Weekly Goal (days)" options={['1', '2', '3', '4', '5', '6', '7']} />
          <SelectField path="settings.monthlyGoalDays" label="Monthly Goal (days)" options={['5', '10', '15', '20', '25', '30']} />
          <InputField path="settings.hoursLoggedTotal" label="Total Hours Learned (manual)" placeholder="0" />
        </div>
      </div>

      <div className="card" style={{ marginTop: '14px' }}>
        <div className="section-title">Data</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '12.5px', marginBottom: '12px' }}>
          Everything in PM OS is stored locally in this browser via localStorage. Export a backup regularly.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn" id="export-btn" onClick={handleExportBackup}>
            Export Backup (JSON)
          </button>
          <label className="btn" style={{ position: 'relative', overflow: 'hidden' }}>
            Import Backup
            <input
              type="file"
              id="import-input"
              accept="application/json"
              onChange={handleImportBackup}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          </label>
          <button className="btn btn-danger" id="reset-btn" onClick={handleResetData}>
            Reset All Data
          </button>
        </div>
      </div>
    </>
  );
};
