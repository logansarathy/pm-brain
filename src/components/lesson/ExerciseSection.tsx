import React from 'react';
import { ExerciseItem } from '../../types';
import { LessonSection } from './LessonSection';

interface ExerciseSectionProps {
  exercises: ExerciseItem[];
}

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({ exercises }) => {
  if (!exercises.length) return null;
  return (
    <LessonSection title="Exercises">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{exercise.title}</div>
          {exercise.difficulty && <div className="text-xs text-[var(--text-faint)]">Difficulty: {exercise.difficulty}</div>}
          {exercise.description && <div className="text-sm text-[var(--text-dim)] mt-2">{exercise.description}</div>}
        </div>
      ))}
    </LessonSection>
  );
};
