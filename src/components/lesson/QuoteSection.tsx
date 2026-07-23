import React from 'react';
import { QuoteItem } from '../../types';
import { LessonSection } from './LessonSection';

interface QuoteSectionProps {
  quotes: QuoteItem[];
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ quotes }) => {
  if (!quotes.length) return null;
  return (
    <LessonSection title="Quotes">
      {quotes.map((quote) => (
        <div key={quote.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-sm text-[var(--text-dim)]">“{quote.text}”</div>
          {quote.author && <div className="mt-2 text-xs text-[var(--text-faint)]">— {quote.author}</div>}
        </div>
      ))}
    </LessonSection>
  );
};
