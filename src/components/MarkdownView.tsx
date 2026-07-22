import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return <div className="text-gray-400 italic py-2 text-sm">No content provided for this section.</div>;
  }

  return (
    <div className={`prose max-w-none text-sm text-[var(--text-main)] space-y-3 ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
