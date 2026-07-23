import React from 'react';
import { ResourceItem } from '../../types';
import { LessonSection } from './LessonSection';

interface ResourcesSectionProps {
  resources: ResourceItem[];
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources }) => {
  if (!resources.length) return null;
  return (
    <LessonSection title="Resources">
      {resources.map((resource) => (
        <div key={resource.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{resource.text}</div>
          {resource.url && (
            <a href={resource.url} target="_blank" rel="noreferrer" className="text-[var(--accent)] text-xs font-semibold">
              Open resource ↗
            </a>
          )}
        </div>
      ))}
    </LessonSection>
  );
};
