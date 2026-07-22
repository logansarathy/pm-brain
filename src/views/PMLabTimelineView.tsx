import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, TextareaField } from '../components/CommonUI';
import { Sparkles, ArrowRight, CheckCircle2, Clock, Layers, X, FlaskConical } from 'lucide-react';

export const PMLabTimelineView: React.FC = () => {
  const { state, updatePath, addXP, markTodayActive, showToast, navigate } = useApp();
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);

  const selectedWeek = selectedWeekId !== null ? state.weeks.find((w) => w.id === selectedWeekId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="PM Lab Architecture"
        title="PM Lab Timeline"
        sub="Your structured timeline of weekly PM Labs (Week 0 to Week 16) automatically assembled from your completed assignments."
      />

      {/* Top Banner */}
      <div className="bg-white border border-[#ECECEC] p-4 rounded-2xl shadow-2xs flex items-center justify-between text-xs text-[#6B7280]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#1E1E1E] block">Automatic Timeline Assembly</span>
            <span>Completed assignments automatically feed into your PM Lab timeline. Add reflections and experiment results per week.</span>
          </div>
        </div>
        <span className="font-mono text-[#FF7A00] font-semibold bg-[#FF7A00]/10 px-3 py-1 rounded-full text-[11px]">
          {state.weeks.filter((w) => w.pmLab && w.pmLab.done).length} / {state.weeks.length} Labs Saved
        </span>
      </div>

      {/* Timeline Railway */}
      <div className="relative border-l-2 border-[#ECECEC] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
        {state.weeks.map((w) => {
          const lab = w.pmLab;
          const deliverable = w.deliverable;
          const isDone = lab && lab.done;
          const hasDeliverable = deliverable && (deliverable.done || deliverable.description);
          const hasLabNotes = lab && (lab.reflection || lab.ideas || lab.evidence);

          return (
            <div key={w.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                    : hasDeliverable
                    ? 'bg-[#FF7A00] border-[#FF7A00] text-white'
                    : 'bg-white border-[#ECECEC] text-[#9CA3AF]'
                }`}
              >
                {isDone ? '✓' : w.id}
              </div>

              {/* Timeline Card */}
              <div
                onClick={() => setSelectedWeekId(w.id)}
                className={`bg-white border hover:border-[#FF7A00] p-5 rounded-2xl cursor-pointer transition-all shadow-2xs ${
                  isDone
                    ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'border-[#ECECEC]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FF7A00] uppercase tracking-wider">
                      Week {w.id}
                    </span>
                    <h3 className="text-base font-bold text-[#1E1E1E]">{w.title}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border self-start sm:self-auto ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : hasDeliverable
                        ? 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20'
                        : 'bg-[#FAF9F6] text-[#6B7280] border-[#ECECEC]'
                    }`}
                  >
                    {isDone ? 'Completed' : hasDeliverable ? 'Assignment Live' : 'Pending'}
                  </span>
                </div>

                {/* Assignment Deliverable Auto Preview */}
                {deliverable && (deliverable.title || deliverable.description) ? (
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#ECECEC]">
                      <span className="font-semibold text-[#1E1E1E] block mb-0.5">
                        📦 Auto-Synced Assignment: {deliverable.title || 'Weekly Deliverable'}
                      </span>
                      <p className="text-[#6B7280] line-clamp-2">
                        {deliverable.description || 'No detailed description.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#9CA3AF] mt-2 italic">
                    Complete Week {w.id} assignment to auto-populate this timeline entry.
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-[#ECECEC] flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Click to record reflection &amp; experiment results</span>
                  <span className="text-[#FF7A00] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Lab Details →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Week Modal Drawer */}
      {selectedWeek && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#ECECEC] p-6 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-4">
              <div>
                <span className="text-xs font-mono text-[#FF7A00] font-bold uppercase tracking-wider">
                  Week {selectedWeek.id} PM Lab
                </span>
                <h2 className="text-lg font-bold text-[#1E1E1E]">{selectedWeek.title}</h2>
              </div>
              <button
                onClick={() => setSelectedWeekId(null)}
                className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#6B7280] hover:text-[#1E1E1E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auto Populated Assignment Work */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#ECECEC] space-y-2">
                <div className="flex items-center gap-2 text-[#FF7A00] font-bold uppercase tracking-wider text-[11px]">
                  <Layers className="w-3.5 h-3.5" /> Auto-Populated Assignment Content
                </div>
                <h3 className="font-bold text-[#1E1E1E] text-sm">
                  {selectedWeek.deliverable?.title || `Week ${selectedWeek.id} Deliverable`}
                </h3>
                <p className="text-[#6B7280] whitespace-pre-wrap leading-relaxed">
                  {selectedWeek.deliverable?.description || 'No submission recorded yet for this week.'}
                </p>
                {selectedWeek.deliverable?.link && (
                  <div className="pt-2">
                    <a
                      href={selectedWeek.deliverable.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF7A00] font-semibold hover:underline"
                    >
                      View Submission Artifact →
                    </a>
                  </div>
                )}
              </div>

              {/* Editable Fields: Reflection, Key Learnings, Experiment Results */}
              <div className="space-y-3 pt-2">
                <TextareaField
                  path={`weeks.${selectedWeek.id}.pmLab.reflection`}
                  label="💭 Reflection"
                  placeholder="What went well? What surprised you about this lab work?"
                  rows={3}
                  isStudent
                />

                <TextareaField
                  path={`weeks.${selectedWeek.id}.pmLab.ideas`}
                  label="🔑 Key Learnings"
                  placeholder="What core product principles or takeaways did you gain?"
                  rows={3}
                  isStudent
                />

                <TextareaField
                  path={`weeks.${selectedWeek.id}.pmLab.evidence`}
                  label="🧪 Experiment Results"
                  placeholder="Record user feedback, data metrics, or test results..."
                  rows={3}
                  isStudent
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECECEC] flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#1E1E1E]">
                <input
                  type="checkbox"
                  checked={!!selectedWeek.pmLab?.done}
                  className="w-4 h-4 rounded border-[#ECECEC] text-[#FF7A00] accent-[#FF7A00]"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updatePath(`weeks.${selectedWeek.id}.pmLab.done`, checked);
                    if (checked) {
                      addXP(15);
                      markTodayActive();
                      showToast('PM Lab marked complete! +15 XP');
                    } else {
                      addXP(-15);
                    }
                  }}
                />
                <span className="font-semibold">Mark PM Lab complete for Week {selectedWeek.id}</span>
              </label>

              <button
                onClick={() => {
                  const id = selectedWeek.id;
                  setSelectedWeekId(null);
                  navigate(`week/${id}`);
                }}
                className="px-4 py-2 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-xs transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>Edit in Week {selectedWeek.id}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
