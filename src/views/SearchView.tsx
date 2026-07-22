import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EmptyState, PageHeader } from '../components/CommonUI';
import { COLLECTION_CONFIG } from '../lib/data';

export const SearchView: React.FC<{ initialQuery?: string }> = ({ initialQuery = '' }) => {
  const { state, navigate } = useApp();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const cleanQuery = query.trim().toLowerCase();
  const results: Array<{ key: string; title: string; id: string }> = [];

  const scan = (arr: any[], key: string, labelField: string) => {
    (arr || []).forEach((item) => {
      const hay = JSON.stringify(item).toLowerCase();
      if (cleanQuery && hay.includes(cleanQuery)) {
        results.push({
          key,
          title: item[labelField] || item.title || 'Untitled',
          id: item.id,
        });
      }
    });
  };

  if (cleanQuery) {
    scan(state.notes, 'notes', 'title');
    scan(state.knowledge, 'knowledge', 'title');
    scan(state.frameworks, 'frameworks', 'title');
    scan(state.resources, 'resources', 'title');
    scan(state.teardowns, 'teardowns', 'title');
    scan(state.improvement, 'improvement', 'title');
    scan(state.casestudies, 'casestudies', 'title');
    scan(state.portfolio, 'portfolio', 'title');
    scan(state.interviewPrep, 'interviewPrep', 'title');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      navigate('search/' + encodeURIComponent(val));
    } else {
      navigate('search');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="System"
        title="Search"
        sub="Search across notes, knowledge, resources, portfolio, and interview prep."
      />

      <div className="field" style={{ maxWidth: '480px' }}>
        <input
          className="input"
          id="search-page-input"
          value={query}
          onChange={handleInputChange}
          placeholder="Type to search…"
        />
      </div>

      {!cleanQuery ? (
        <EmptyState
          icon="search"
          title="Start typing to search"
          sub="Your entries across the workspace will appear here."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No results"
          sub={`Nothing matches "${query}" yet.`}
        />
      ) : (
        results.map((r, idx) => (
          <div
            className="collection-row"
            style={{ cursor: 'pointer' }}
            key={idx}
            onClick={() => navigate(r.key)}
          >
            <div className="collection-row-title">{r.title}</div>
            <div className="collection-row-meta">
              <span className="tag">
                {COLLECTION_CONFIG[r.key] ? COLLECTION_CONFIG[r.key].title : r.key}
              </span>
            </div>
          </div>
        ))
      )}
    </>
  );
};
