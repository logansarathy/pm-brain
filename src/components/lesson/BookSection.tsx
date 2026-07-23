import React from 'react';
import { BookItem } from '../../types';
import { LessonSection } from './LessonSection';

interface BookSectionProps {
  books: BookItem[];
}

export const BookSection: React.FC<BookSectionProps> = ({ books }) => {
  if (!books.length) return null;
  return (
    <LessonSection title="Books">
      {books.map((book) => (
        <div key={book.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{book.bookName}</div>
          {book.author && <div className="text-xs text-[var(--text-faint)]">{book.author}</div>}
          <div className="text-sm text-[var(--text-dim)] mt-2">
            {book.chapter ? `Chapter: ${book.chapter}` : ''}
            {book.chapter && book.pages ? ' · ' : ''}
            {book.pages ? `Pages: ${book.pages}` : ''}
          </div>
          {book.url && (
            <a href={book.url} target="_blank" rel="noreferrer" className="text-[var(--accent)] text-xs font-semibold">
              Open book link ↗
            </a>
          )}
        </div>
      ))}
    </LessonSection>
  );
};
