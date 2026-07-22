import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COLLECTION_CONFIG, CollectionConfigItem } from '../lib/data';
import { CollectionItem } from '../types';

export const Modal: React.FC = () => {
  const { modalState, closeModal, saveEntryModal } = useApp();
  const [draft, setDraft] = useState<CollectionItem | null>(null);

  useEffect(() => {
    if (modalState) {
      setDraft({ ...modalState.draft });
    } else {
      setDraft(null);
    }
  }, [modalState]);

  if (!modalState || !draft) return null;

  const cfg: CollectionConfigItem = COLLECTION_CONFIG[modalState.key] || {
    title: 'Entry',
    icon: 'notes',
    emptyTitle: '',
    emptySub: '',
    fields: ['title', 'category', 'content', 'link'],
  };

  const handleSave = () => {
    if (!draft) return;
    saveEntryModal({
      ...draft,
      title: draft.title.trim() || 'Untitled',
    });
  };

  return (
    <div className="modal-backdrop" id="modal-backdrop" onClick={(e) => {
      if ((e.target as HTMLElement).id === 'modal-backdrop') closeModal();
    }}>
      <div className="modal">
        <div className="modal-title">
          {modalState.id ? 'Edit' : 'New'} {cfg.title.replace(/s$/, '')}
        </div>

        <div className="field">
          <div className="field-label">Title</div>
          <input
            className="input"
            id="modal-title-input"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Give it a name"
          />
        </div>

        {cfg.categories ? (
          <div className="field">
            <div className="field-label">Category</div>
            <select
              className="input"
              id="modal-category-input"
              value={draft.category || ''}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              <option value="">None</option>
              {cfg.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="field">
            <div className="field-label">Category / Tag</div>
            <input
              className="input"
              id="modal-category-input"
              value={draft.category || ''}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="Optional tag"
            />
          </div>
        )}

        {cfg.fields.includes('link') && (
          <div className="field">
            <div className="field-label">Link</div>
            <input
              className="input"
              id="modal-link-input"
              value={draft.link || ''}
              onChange={(e) => setDraft({ ...draft, link: e.target.value })}
              placeholder="https://…"
            />
          </div>
        )}

        {cfg.fields.includes('content') && (
          <div className="field">
            <div className="field-label">Content</div>
            <textarea
              className="input"
              id="modal-content-input"
              rows={6}
              value={draft.content || ''}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              placeholder="Write here…"
            />
          </div>
        )}

        <div className="field">
          <div className="field-label">Tags</div>
          <input
            className="input"
            id="modal-tags-input"
            value={draft.tags || ''}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            placeholder="comma, separated, tags"
          />
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--text-dim)',
          }}
        >
          <input
            type="checkbox"
            className="list-check"
            id="modal-bookmark-input"
            checked={!!draft.bookmarked}
            onChange={(e) => setDraft({ ...draft, bookmarked: e.target.checked })}
          />{' '}
          Bookmark this
        </label>

        <div className="modal-actions">
          <button className="btn btn-ghost" id="modal-cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-primary" id="modal-save" onClick={handleSave}>
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};
