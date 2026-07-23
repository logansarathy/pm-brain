import React from 'react';
import { ArticleItem } from '../../types';
import { LessonSection } from './LessonSection';

interface ArticleSectionProps {
  articles: ArticleItem[];
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ articles }) => {
  if (!articles.length) return null;
  return (
    <LessonSection title="Articles">
      {articles.map((article) => (
        <div key={article.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{article.title}</div>
          {article.author && <div className="text-xs text-[var(--text-faint)]">{article.author}</div>}
          {article.description && <div className="text-sm text-[var(--text-dim)] mt-2">{article.description}</div>}
          <a href={article.url} target="_blank" rel="noreferrer" className="text-[var(--accent)] text-xs font-semibold">
            Read article ↗
          </a>
        </div>
      ))}
    </LessonSection>
  );
};
