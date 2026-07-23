import React from 'react';
import { FrameworkItem } from '../../types';
import { LessonSection } from './LessonSection';

interface FrameworkSectionProps {
  frameworks: FrameworkItem[];
}

export const FrameworkSection: React.FC<FrameworkSectionProps> = ({ frameworks }) => {
  if (!frameworks.length) return null;
  return (
    <LessonSection title="Frameworks">
      {frameworks.map((framework) => (
        <div key={framework.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{framework.title}</div>
          {framework.description && <div className="text-sm text-[var(--text-dim)] mt-2">{framework.description}</div>}
          {framework.image && (
            <div className="mt-3">
              <img src={framework.image} alt={framework.title} className="w-full rounded-xl" />
            </div>
          )}
        </div>
      ))}
    </LessonSection>
  );
};
