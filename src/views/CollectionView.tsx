import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CollectionRow, EmptyState, PageHeader } from '../components/CommonUI';
import { COLLECTION_CONFIG } from '../lib/data';
import { CollectionItem } from '../types';
import { PlusIcon } from '../components/Icons';

export const CollectionView: React.FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const { state, openEntryModal } = useApp();
  const [query, setQuery] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const cfg = COLLECTION_CONFIG[collectionKey] || {
    title: 'Collection',
    icon: 'notes',
    emptyTitle: 'No entries yet',
    emptySub: 'Add an entry to get started.',
    fields: ['title', 'category', 'content', 'link'],
  };

  let items = ((state as any)[collectionKey] || []) as CollectionItem[];

  if (bookmarkedOnly) {
    items = items.filter((it) => it.bookmarked);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    items = items.filter((it) => JSON.stringify(it).toLowerCase().includes(q));
  }

  const grouped = !!cfg.categories;

  return (
    <>
      <PageHeader
        eyebrow={cfg.title}
        title={cfg.title}
        sub={`${((state as any)[collectionKey] || []).length} ${
          ((state as any)[collectionKey] || []).length === 1 ? 'entry' : 'entries'
        }`}
      />

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px', maxWidth: '420px' }}>
          <input
            className="input"
            id="collection-search-input"
            placeholder="Search this list…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className={`btn btn-sm ${bookmarkedOnly ? 'btn-primary' : ''}`}
            id="collection-bookmark-filter"
            title="Show bookmarked only"
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
          >
            ★
          </button>
        </div>
        <button className="btn btn-primary creator-only" onClick={() => openEntryModal(collectionKey)}>
          <PlusIcon /> New Entry
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={cfg.icon} title={cfg.emptyTitle} sub={cfg.emptySub} />
      ) : grouped && cfg.categories ? (
        <>
          {cfg.categories.map((cat) => {
            const catItems = items.filter((it) => it.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat}>
                <div className="section-title" style={{ marginTop: '18px' }}>
                  {cat} <span className="tag">{catItems.length}</span>
                </div>
                {catItems
                  .slice()
                  .reverse()
                  .map((it) => (
                    <CollectionRow key={it.id} item={it} collectionKey={collectionKey} />
                  ))}
              </div>
            );
          })}
          {items.some((it) => !it.category) && (
            <div>
              <div className="section-title" style={{ marginTop: '18px' }}>
                Uncategorized
              </div>
              {items
                .filter((it) => !it.category)
                .map((it) => (
                  <CollectionRow key={it.id} item={it} collectionKey={collectionKey} />
                ))}
            </div>
          )}
        </>
      ) : (
        items
          .slice()
          .reverse()
          .map((it) => (
            <CollectionRow key={it.id} item={it} collectionKey={collectionKey} />
          ))
      )}
    </>
  );
};
