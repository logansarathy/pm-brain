import React from 'react';

interface LessonSectionProps {
  title: string;
  children: React.ReactNode;
}

export const LessonSection: React.FC<LessonSectionProps> = ({ title, children }) => {
  return (
    <div className="lesson-section">
      <div className="section-title">{title}</div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};
