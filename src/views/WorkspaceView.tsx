import React, { useState } from 'react';
import { PageHeader, TextareaField } from '../components/CommonUI';

const WORKSPACE_SECTIONS = [
  'Overview',
  'Problem',
  'Research',
  'Personas',
  'Journey Map',
  'Pain Points',
  'Solution',
  'MVP',
  'PRD',
  'Roadmap',
  'Wireframes',
  'Launch',
  'Metrics',
  'Retrospective',
  'Future Roadmap',
];

export const WorkspaceView: React.FC<{ workspaceKey: 'cleano' | 'gof'; label: string }> = ({
  workspaceKey,
  label,
}) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const path = `${workspaceKey}.sections.${activeTab}`;

  return (
    <>
      <PageHeader eyebrow="Build" title={label} sub="Document this product end-to-end as you learn." />

      <div className="tabs">
        {WORKSPACE_SECTIONS.map((s) => (
          <div
            key={s}
            className={`tab ${activeTab === s ? 'active' : ''}`}
            onClick={() => setActiveTab(s)}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="card">
        <TextareaField
          path={path}
          label={activeTab}
          placeholder={`Write about ${activeTab.toLowerCase()} for ${label}…`}
          rows={10}
        />
      </div>
    </>
  );
};
