import React from 'react';
import { useApp } from '../context/AppContext';
import { getIcon, TrashIcon, PlusIcon } from './Icons';
import { CollectionItem, Week } from '../types';
import { COLLECTION_CONFIG, fmtDate, weekSectionStatus } from '../lib/data';

export interface Crumb {
  label: string;
  route?: string;
}

export const BreadcrumbNav: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => {
  const { navigate } = useApp();
  return (
    <div className="breadcrumb">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="breadcrumb-sep">/</span>}
          <span
            className={`breadcrumb-item ${c.route ? '' : 'current'}`}
            onClick={() => {
              if (c.route) navigate(c.route);
            }}
          >
            {c.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export const PageHeader: React.FC<{ eyebrow: string; title: string; sub?: string }> = ({ eyebrow, title, sub }) => {
  return (
    <div className="page-header">
      <div className="page-eyebrow">{eyebrow}</div>
      <h1 className="page-title">{title}</h1>
      {sub && <div className="page-sub">{sub}</div>}
    </div>
  );
};

export const EmptyState: React.FC<{ icon: string; title: string; sub: string }> = ({ icon, title, sub }) => {
  return (
    <div className="empty-state">
      {getIcon(icon)}
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
    </div>
  );
};

export const StatCard: React.FC<{ label: string; value: React.ReactNode; icon?: string; sub?: string }> = ({
  label,
  value,
  icon,
  sub,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-label">
        {icon && getIcon(icon)}
        {label}
      </div>
      <div className="stat-value">
        {value}
        {sub && <small> {sub}</small>}
      </div>
    </div>
  );
};

export const ProgressRing: React.FC<{ pct: number; label: string; size?: number }> = ({ pct, label, size = 118 }) => {
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div className="ring-wrap" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-2)" strokeWidth="9" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--accent)"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-center">
        <div className="ring-pct">{pct}%</div>
        <div className="ring-label">{label}</div>
      </div>
    </div>
  );
};

export const InputField: React.FC<{
  path: string;
  label: string;
  placeholder?: string;
  isStudent?: boolean;
}> = ({ path, label, placeholder, isStudent }) => {
  const { state, updatePath } = useApp();

  const getPathVal = (obj: any, p: string) => {
    return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  };

  const val = getPathVal(state, path) || '';

  return (
    <div className={`field ${isStudent ? 'field-student' : ''}`}>
      <div className="field-label">{label}</div>
      <input
        className={`input ${isStudent ? 'student-input' : ''}`}
        type="text"
        placeholder={placeholder || 'Not written yet…'}
        value={val}
        onChange={(e) => updatePath(path, e.target.value)}
      />
    </div>
  );
};

export const TextareaField: React.FC<{
  path: string;
  label: string;
  placeholder?: string;
  rows?: number;
  isStudent?: boolean;
}> = ({ path, label, placeholder, rows = 4, isStudent }) => {
  const { state, updatePath } = useApp();

  const getPathVal = (obj: any, p: string) => {
    return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  };

  const val = getPathVal(state, path) || '';

  return (
    <div className={`field ${isStudent ? 'field-student' : ''}`}>
      <div className="field-label">{label}</div>
      <textarea
        className={`input ${isStudent ? 'student-input' : ''}`}
        rows={rows}
        placeholder={placeholder || 'Not written yet…'}
        value={val}
        onChange={(e) => updatePath(path, e.target.value)}
      />
    </div>
  );
};

export const SelectField: React.FC<{
  path: string;
  label: string;
  options: string[];
}> = ({ path, label, options }) => {
  const { state, updatePath } = useApp();

  const getPathVal = (obj: any, p: string) => {
    return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  };

  const val = getPathVal(state, path) || '';

  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <select
        className="input"
        value={val}
        onChange={(e) => updatePath(path, e.target.value)}
      >
        <option value="">Not set</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

export interface ListEditorProps {
  path: string;
  student?: boolean;
  withUrl?: boolean;
  placeholder?: string;
}

export const ListEditor: React.FC<ListEditorProps> = ({ path, student, withUrl, placeholder }) => {
  const { state, updatePath, addXP } = useApp();
  const [newText, setNewText] = React.useState('');
  const [newUrl, setNewUrl] = React.useState('');

  const getPathVal = (obj: any, p: string) => {
    return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  };

  const items: Array<{ text: string; url?: string; done: boolean }> = getPathVal(state, path) || [];

  const handleToggle = (idx: number, checked: boolean) => {
    const next = [...items];
    next[idx] = { ...next[idx], done: checked };
    if (checked) addXP(5);
    else addXP(-5);
    updatePath(path, next);
  };

  const handleTextChange = (idx: number, text: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], text };
    updatePath(path, next);
  };

  const handleUrlChange = (idx: number, url: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], url };
    updatePath(path, next);
  };

  const handleRemove = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    updatePath(path, next);
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const next = [...items, { text: newText.trim(), url: newUrl.trim(), done: false }];
    updatePath(path, next);
    setNewText('');
    setNewUrl('');
  };

  const studentCls = student ? ' student-list' : '';
  const textCls = student ? ' student-input' : '';

  return (
    <div className={`list-editor${studentCls}`}>
      {items.length === 0 ? (
        <div style={{ color: 'var(--text-faint)', fontSize: '12.5px', padding: '6px 4px' }}>Nothing added yet.</div>
      ) : (
        items.map((it, idx) => (
          <div className="list-row" key={idx}>
            <input
              type="checkbox"
              className="list-check"
              checked={!!it.done}
              onChange={(e) => handleToggle(idx, e.target.checked)}
            />
            <input
              type="text"
              className={`list-text${it.done ? ' done' : ''}${textCls}`}
              value={it.text}
              placeholder="Untitled"
              onChange={(e) => handleTextChange(idx, e.target.value)}
            />
            {withUrl && (
              <input
                type="text"
                className={`list-url${textCls}`}
                value={it.url || ''}
                placeholder="link (optional)"
                onChange={(e) => handleUrlChange(idx, e.target.value)}
              />
            )}
            <button
              className="btn btn-ghost btn-sm list-remove"
              title="Remove"
              onClick={() => handleRemove(idx)}
            >
              <TrashIcon />
            </button>
          </div>
        ))
      )}
      <div className="list-add-row">
        <input
          type="text"
          className="input"
          placeholder={placeholder || 'Add an item and press Enter'}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        {withUrl && (
          <input
            type="text"
            className="input"
            style={{ maxWidth: '180px' }}
            placeholder="link (optional)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        )}
        <button className="btn btn-sm" onClick={handleAdd}>
          <PlusIcon /> Add
        </button>
      </div>
    </div>
  );
};

export const CollectionRow: React.FC<{ item: CollectionItem; collectionKey: string }> = ({
  item,
  collectionKey,
}) => {
  const { setState, openEntryModal, showToast } = useApp();

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState((prevState) => {
      const list = [...((prevState as any)[collectionKey] || [])] as CollectionItem[];
      const it = list.find((x) => x.id === item.id);
      if (it) it.bookmarked = !it.bookmarked;
      return { ...prevState, [collectionKey]: list };
    });
  };

  const handleToggleDone = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const checked = e.target.checked;
    setState((prevState) => {
      const list = [...((prevState as any)[collectionKey] || [])] as CollectionItem[];
      const it = list.find((x) => x.id === item.id);
      if (it) it.done = checked;
      return { ...prevState, [collectionKey]: list };
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState((prevState) => {
      const list = [...((prevState as any)[collectionKey] || [])] as CollectionItem[];
      return { ...prevState, [collectionKey]: list.filter((x) => x.id !== item.id) };
    });
    showToast('Deleted.');
  };

  const tags = (item.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div className="collection-row">
      <button
        className="btn btn-ghost btn-sm"
        title={item.bookmarked ? 'Bookmarked' : 'Bookmark'}
        onClick={handleBookmark}
        style={{
          flexShrink: 0,
          padding: '5px 8px',
          color: item.bookmarked ? 'var(--amber)' : undefined,
        }}
      >
        {item.bookmarked ? '★' : '☆'}
      </button>

      <div
        style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
        onClick={() => openEntryModal(collectionKey, item.id)}
      >
        <div className="collection-row-title">
          {item.title || 'Untitled'}{' '}
          {item.done && <span className="tag" style={{ color: 'var(--success)' }}>done</span>}
        </div>
        <div className="collection-row-meta">
          {item.category && <span className="tag">{item.category}</span>}
          {tags.map((t, idx) => (
            <span className="tag" key={idx}>
              #{t}
            </span>
          ))}
          <span>{fmtDate(item.date)}</span>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="study-only"
              style={{ color: 'var(--accent)' }}
              onClick={(e) => e.stopPropagation()}
            >
              Open ↗
            </a>
          )}
        </div>
      </div>

      <label className="creator-only" style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="list-check"
          checked={!!item.done}
          onChange={handleToggleDone}
          title="Mark completed"
        />
      </label>

      <button className="btn btn-ghost btn-sm creator-only" onClick={handleDelete}>
        <TrashIcon />
      </button>
    </div>
  );
};

export const SectionProgressList: React.FC<{ week: Week }> = ({ week }) => {
  const sections = weekSectionStatus(week);
  const stateLabel: Record<string, string> = {
    done: '✓ Done',
    partial: 'In Progress',
    pending: 'Pending',
  };

  return (
    <div className="section-progress-list">
      {sections.map((s, idx) => (
        <div className="section-progress-row" key={idx}>
          <span className="section-progress-name">{s.label}</span>
          <span className={`section-progress-state state-${s.state}`}>
            {s.count && s.state !== 'done' ? s.count : stateLabel[s.state]}
          </span>
        </div>
      ))}
    </div>
  );
};
