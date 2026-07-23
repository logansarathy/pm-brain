import React from 'react';
import { ChecklistItem } from '../../types';
import { LessonSection } from './LessonSection';

interface ChecklistSectionProps {
  checklists: ChecklistItem[];
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({ checklists }) => {
  if (!checklists.length) return null;
  return (
    <LessonSection title="Checklists">
      {checklists.map((checklist) => (
        <div key={checklist.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{checklist.title}</div>
          {checklist.items && checklist.items.length > 0 && (
            <ul className="mt-2 text-sm text-[var(--text-dim)] list-disc list-inside space-y-1">
              {checklist.items.map((item) => (
                <li key={item.id} className={item.done ? 'text-[var(--text-faint)] line-through' : ''}>
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </LessonSection>
  );
};
