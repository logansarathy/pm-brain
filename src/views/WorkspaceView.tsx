import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, TextareaField } from '../components/CommonUI';
import { Sparkles, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

const WORKSPACE_SECTIONS: Array<{ name: string; weekId: number; label: string; desc: string }> = [
  { name: 'Overview', weekId: 1, label: 'Product Overview & Opportunity', desc: 'Auto-synced from Week 1 Product Strategy & Opportunity' },
  { name: 'Problem', weekId: 2, label: 'Problem Statement & Research', desc: 'Auto-synced from Week 2 User Discovery & Problem Definition' },
  { name: 'Research', weekId: 3, label: 'User Research & Insights', desc: 'Auto-synced from Week 3 User Interviews & Analysis' },
  { name: 'Personas', weekId: 3, label: 'User Personas', desc: 'Auto-synced from Week 3 Target Personas' },
  { name: 'Journey Map', weekId: 4, label: 'Customer Journey Map', desc: 'Auto-synced from Week 4 User Journey Mapping' },
  { name: 'Pain Points', weekId: 4, label: 'Validated Pain Points', desc: 'Auto-synced from Week 4 Pain Point Analysis' },
  { name: 'Solution', weekId: 5, label: 'Value Proposition & Solution', desc: 'Auto-synced from Week 5 Value Proposition & Positioning' },
  { name: 'MVP', weekId: 6, label: 'MVP Scope & Features', desc: 'Auto-synced from Week 6 MVP Definition & Prioritization' },
  { name: 'PRD', weekId: 7, label: 'Product Requirements Document (PRD)', desc: 'Auto-synced from Week 7 Full PRD Writing' },
  { name: 'Roadmap', weekId: 8, label: 'Product Roadmap & Release Plan', desc: 'Auto-synced from Week 8 Roadmap & Milestone Planning' },
  { name: 'Wireframes', weekId: 9, label: 'UX Wireframes & Prototypes', desc: 'Auto-synced from Week 9 Wireframes & Prototypes' },
  { name: 'Launch', weekId: 10, label: 'Go-to-Market & Launch Strategy', desc: 'Auto-synced from Week 10 GTM & Launch Planning' },
  { name: 'Metrics', weekId: 11, label: 'Product Metrics & Analytics', desc: 'Auto-synced from Week 11 Success Metrics & Analytics' },
  { name: 'Retrospective', weekId: 12, label: 'Product Retrospective', desc: 'Auto-synced from Week 12 Post-Launch Retrospective' },
  { name: 'Future Roadmap', weekId: 14, label: 'Growth & Future Vision', desc: 'Auto-synced from Week 14 Scale & Expansion Vision' },
];

export const WorkspaceView: React.FC<{ workspaceKey: 'cleano' | 'gof'; label: string }> = ({
  workspaceKey,
  label,
}) => {
  const { state, navigate } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');

  const currentSection = WORKSPACE_SECTIONS.find((s) => s.name === activeTab) || WORKSPACE_SECTIONS[0];
  const linkedWeek = state.weeks.find((w) => w.id === currentSection.weekId);
  const deliverable = linkedWeek?.deliverable;

  // Derive auto content from linked week assignment
  const autoContent = deliverable?.description || deliverable?.title || '';
  const isShipped = !!deliverable?.done;

  const overridePath = `${workspaceKey}.sections.${activeTab}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={`${label} Architecture`}
        title={label}
        sub={`Living workspace automatically built from your weekly assignments. No manual retyping required.`}
      />

      {/* Workspace Banner */}
      <div className="p-4 rounded-2xl bg-white border border-[#ECECEC] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B7280]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#1E1E1E] block">Automated Living Workspace</span>
            <span>Every tab auto-fills as you complete weekly course assignments. The assignment is your single source of truth.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 bg-[#FAF9F6] border border-[#ECECEC] rounded-full text-[11px] font-mono font-semibold text-[#1E1E1E]">
            {WORKSPACE_SECTIONS.filter((s) => state.weeks.find((w) => w.id === s.weekId)?.deliverable?.done).length} / {WORKSPACE_SECTIONS.length} Sections Live
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {WORKSPACE_SECTIONS.map((s) => {
          const isActive = activeTab === s.name;
          const w = state.weeks.find((week) => week.id === s.weekId);
          const hasData = w?.deliverable?.done || w?.deliverable?.description;

          return (
            <button
              key={s.name}
              onClick={() => setActiveTab(s.name)}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#FF7A00] text-white shadow-2xs'
                  : 'bg-white border border-[#ECECEC] text-[#6B7280] hover:text-[#1E1E1E] hover:border-[#FF7A00]/40'
              }`}
            >
              <span>{s.name}</span>
              {hasData && (
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Display */}
      <div className="space-y-6">
        {/* Auto-populated Assignment Box */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ECECEC]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#FF7A00] uppercase tracking-wider">
                  Week {currentSection.weekId} Assignment
                </span>
                {isShipped && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Shipped &amp; Synced
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-[#1E1E1E] mt-0.5">
                {currentSection.label}
              </h2>
            </div>

            <button
              onClick={() => navigate(`week/${currentSection.weekId}`)}
              className="px-3.5 py-1.5 bg-[#FAF9F6] hover:bg-[#ECECEC]/60 border border-[#ECECEC] text-[#1E1E1E] font-semibold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Edit in Week {currentSection.weekId}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF7A00]" />
            </button>
          </div>

          {/* Render Auto Content */}
          {autoContent ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#ECECEC] text-sm text-[#1E1E1E] whitespace-pre-wrap leading-relaxed font-sans">
                {autoContent}
              </div>
              {deliverable?.link && (
                <div className="text-xs text-[#6B7280] flex items-center gap-2">
                  <span className="font-semibold text-[#1E1E1E]">Submission Link:</span>
                  <a
                    href={deliverable.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF7A00] hover:underline font-medium truncate"
                  >
                    {deliverable.link}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#FAF9F6] border border-dashed border-[#ECECEC] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00] mx-auto flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-[#1E1E1E]">
                No assignment submitted yet for Week {currentSection.weekId}
              </h3>
              <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                Completing the assignment in Week {currentSection.weekId} will automatically populate this section.
              </p>
              <button
                onClick={() => navigate(`week/${currentSection.weekId}`)}
                className="mt-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-xs transition-all inline-flex items-center gap-1.5"
              >
                <span>Go to Week {currentSection.weekId} Assignment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Custom Workspace Notes / Overrides */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider">
              Additional Workspace Notes &amp; Refinements
            </h3>
            <span className="text-[11px] text-[#6B7280]">Saved automatically to workspace</span>
          </div>

          <TextareaField
            path={overridePath}
            label=""
            placeholder={`Add extra notes, team feedback, or refinements for ${activeTab} in ${label}...`}
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};
