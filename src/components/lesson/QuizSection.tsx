import React from 'react';
import { QuizQuestion } from '../../types';
import { LessonSection } from './LessonSection';

interface QuizSectionProps {
  quiz: QuizQuestion[];
}

export const QuizSection: React.FC<QuizSectionProps> = ({ quiz }) => {
  const safeQuiz = quiz ?? [];
  if (!safeQuiz.length) return null;
  return (
    <LessonSection title="Quiz">
      {safeQuiz.map((question, index) => (
        <div key={question.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">Question {index + 1}</div>
          <div className="mt-2 text-sm text-[var(--text-dim)]">{question.question}</div>
          {question.options && question.options.length > 0 && (
            <ul className="mt-3 text-sm text-[var(--text-dim)] list-disc list-inside space-y-1">
              {question.options.map((option, optionIdx) => (
                <li key={optionIdx} className={optionIdx === question.correctAnswer ? 'font-semibold text-[var(--text-main)]' : ''}>
                  {option}
                </li>
              ))}
            </ul>
          )}
          {question.explanation && <div className="mt-3 text-xs text-[var(--text-faint)]">Explanation: {question.explanation}</div>}
        </div>
      ))}
    </LessonSection>
  );
};
