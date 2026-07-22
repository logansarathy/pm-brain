import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, TextareaField } from '../components/CommonUI';
import { TemplatesIcon } from '../components/Icons';

const TEMPLATE_CATEGORIES = ['Discovery', 'Research', 'Strategy', 'Execution', 'Analytics', 'Growth', 'AI'];

export const TemplatesView: React.FC = () => {
  const { state } = useApp();
  const [openTemplateId, setOpenTemplateId] = useState<string | null>(null);

  const openTemplate = state.templates.find((t) => t.id === openTemplateId);
  const openTemplateIdx = state.templates.findIndex((t) => t.id === openTemplateId);

  return (
    <>
      <PageHeader
        eyebrow="Prepare"
        title="Templates"
        sub="Your reusable PM toolkit, organized by workflow stage. Open one to start filling it in."
      />

      {TEMPLATE_CATEGORIES.map((cat) => {
        const items = state.templates.filter((t) => (t.category || 'Strategy') === cat);
        if (items.length === 0) return null;
        return (
          <React.Fragment key={cat}>
            <div className="section-title" style={{ marginTop: '18px' }}>
              {cat}
            </div>
            <div className="grid grid-3">
              {items.map((t) => (
                <div
                  className="card card-tight"
                  style={{ cursor: 'pointer' }}
                  key={t.id}
                  onClick={() => setOpenTemplateId(t.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TemplatesIcon />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{t.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        {t.content.trim() ? 'In progress' : 'Blank'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      })}

      {openTemplate && openTemplateIdx >= 0 && (
        <div style={{ marginTop: '22px' }} className="card">
          <div className="section-title">{openTemplate.name}</div>
          <TextareaField
            path={`templates.${openTemplateIdx}.content`}
            label="Content"
            placeholder="Start filling in this template…"
            rows={10}
          />
        </div>
      )}
    </>
  );
};
