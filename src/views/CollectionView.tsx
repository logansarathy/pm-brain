import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CollectionRow, EmptyState, PageHeader } from '../components/CommonUI';
import { COLLECTION_CONFIG } from '../lib/data';
import { CollectionItem, Week } from '../types';
import { PlusIcon, SparklesIcon } from '../components/Icons';
import { ArrowRight, FlaskConical, FileText, ExternalLink } from 'lucide-react';

const PORTFOLIO_CATEGORIES = [
  'Research',
  'Personas',
  'Journey Maps',
  'PRDs',
  'Wireframes',
  'Roadmaps',
  'Case Studies',
  'Presentations',
  'LinkedIn Posts',
  'Resume',
];

export const CollectionView: React.FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const { state, openEntryModal, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const cfg = COLLECTION_CONFIG[collectionKey] || {
    title: collectionKey === 'improvement' ? 'Experiment Log' : 'Collection',
    icon: 'notes',
    emptyTitle: 'No entries yet',
    emptySub: 'Add an entry to get started.',
    fields: ['title', 'category', 'content', 'link'],
  };

  let items: CollectionItem[] = [];

  if (collectionKey === 'portfolio') {
    const autoPortfolioItems: CollectionItem[] = [];

    state.weeks.forEach((w: Week) => {
      if (w.deliverable && (w.deliverable.done || w.deliverable.link || w.deliverable.description)) {
        const typeLower = (w.deliverable.type || 'PRDs').toLowerCase();
        let cat = 'PRDs';
        if (typeLower.includes('research')) cat = 'Research';
        else if (typeLower.includes('persona')) cat = 'Personas';
        else if (typeLower.includes('journey')) cat = 'Journey Maps';
        else if (typeLower.includes('wireframe')) cat = 'Wireframes';
        else if (typeLower.includes('roadmap')) cat = 'Roadmaps';
        else if (typeLower.includes('case')) cat = 'Case Studies';
        else if (typeLower.includes('presentation')) cat = 'Presentations';
        else if (typeLower.includes('resume')) cat = 'Resume';

        autoPortfolioItems.push({
          id: `port_week_${w.id}`,
          title: w.deliverable.title || `Week ${w.id} Deliverable: ${w.title}`,
          category: cat,
          content: w.deliverable.description || w.portfolioArtifact.description || `Completed during Week ${w.id}`,
          link: w.deliverable.link || w.portfolioArtifact.downloadLink || '',
          date: new Date().toISOString().slice(0, 10),
          bookmarked: true,
        });
      }

      if (w.linkedinTask && w.linkedinTask.published) {
        autoPortfolioItems.push({
          id: `port_link_${w.id}`,
          title: `LinkedIn Post: Week ${w.id} - ${w.title}`,
          category: 'LinkedIn Posts',
          content: w.linkedinTask.draft || w.linkedinTask.idea || '',
          link: w.linkedinTask.link || '',
          date: new Date().toISOString().slice(0, 10),
          bookmarked: false,
        });
      }
    });

    const manualItems = (state.portfolio || []) as CollectionItem[];
    items = [...autoPortfolioItems, ...manualItems];
  } else if (collectionKey === 'linkedin') {
    const autoLinkedin: CollectionItem[] = [];
    state.weeks.forEach((w) => {
      if (w.linkedinTask && (w.linkedinTask.published || w.linkedinTask.draft || w.linkedinTask.link)) {
        autoLinkedin.push({
          id: `link_week_${w.id}`,
          title: `Week ${w.id}: ${w.title}`,
          category: w.linkedinTask.published ? 'Published Posts' : 'Drafts',
          content: w.linkedinTask.draft || w.linkedinTask.idea || '',
          link: w.linkedinTask.link || '',
          date: new Date().toISOString().slice(0, 10),
          bookmarked: !!w.linkedinTask.published,
        });
      }
    });
    const manualLinkedin = (state.linkedin || []) as CollectionItem[];
    items = [...autoLinkedin, ...manualLinkedin];
  } else if (collectionKey === 'casestudies') {
    // Auto-generate Case Studies from completed projects (CleanO and GOF)
    const autoCaseStudies: CollectionItem[] = [
      {
        id: 'case_cleano_01',
        title: 'CleanO Case Study: On-Demand Cleaning Service Product Strategy',
        category: 'Flagship Case Study',
        content: `• Problem: Residential users suffer from inconsistent booking flows, pricing opacity, and trust deficits.
• Solution: End-to-end mobile platform with instant price estimators, vetted cleaner credentials, and real-time tracking.
• PRD & Roadmap: Derived from Week 2–8 coursework covering discovery, personas, user journey, PRD, and wireframes.
• Metrics: Target CSAT 92%, booking conversion +35%, cleaner retention 85%.`,
        link: 'cleano',
        date: new Date().toISOString().slice(0, 10),
        bookmarked: true,
      },
      {
        id: 'case_gof_01',
        title: 'GOF Case Study: Gamified Outdoor Fitness & Social Ecosystem',
        category: 'Flagship Case Study',
        content: `• Problem: Fitness enthusiasts lose motivation due to isolated workouts and lack of local community accountability.
• Solution: Social outdoor fitness platform with augmented reality route discovery, group challenges, and reward streaks.
• PRD & Roadmap: Assembled from Week 9–16 coursework covering prototyping, metrics, GTM strategy, and retrospectives.
• Metrics: WAU growth 40%, 30-day streak retention +28%, referral viral coefficient 1.2.`,
        link: 'gof',
        date: new Date().toISOString().slice(0, 10),
        bookmarked: true,
      },
    ];

    // Include completed weekly case studies
    state.weeks.forEach((w) => {
      if (w.deliverable && w.deliverable.done && (w.deliverable.type || '').toLowerCase().includes('case')) {
        autoCaseStudies.push({
          id: `case_week_${w.id}`,
          title: `Case Study: ${w.deliverable.title || w.title}`,
          category: 'Weekly Case Study',
          content: w.deliverable.description || `Developed during Week ${w.id}`,
          link: `week/${w.id}`,
          date: new Date().toISOString().slice(0, 10),
          bookmarked: true,
        });
      }
    });

    const manualCase = (state.casestudies || []) as CollectionItem[];
    items = [...autoCaseStudies, ...manualCase];
  } else if (collectionKey === 'improvement') {
    // Auto-generate Experiment Log items linking back to originating weeks
    const autoExperiments: CollectionItem[] = [];

    state.weeks.forEach((w) => {
      if (w.pmLab && (w.pmLab.observations || w.pmLab.evidence || w.pmLab.ideas || w.pmLab.done)) {
        autoExperiments.push({
          id: `exp_week_${w.id}`,
          title: `Experiment: Week ${w.id} - ${w.title}`,
          category: w.pmLab.done ? 'Validated' : 'Testing',
          content: `• Originating Week: Week ${w.id} (${w.title})
• Hypothesis: Completing structured PM Lab hypotheses improves product decision accuracy.
• Problem: ${w.pmLab.goal || 'Needs validation'}
• Solution: ${w.pmLab.task || 'Feature prototype'}
• Success Metric: 80% user satisfaction & task completion.
• Result / Evidence: ${w.pmLab.evidence || 'In progress'}
• Learning: ${w.pmLab.reflection || w.pmLab.ideas || 'Recorded in PM Lab'}`,
          link: `week/${w.id}`,
          date: new Date().toISOString().slice(0, 10),
          bookmarked: !!w.pmLab.done,
        });
      }
    });

    const manualExp = (state.improvement || []) as CollectionItem[];
    items = [...autoExperiments, ...manualExp];
  } else {
    items = ((state as any)[collectionKey] || []) as CollectionItem[];
  }

  if (bookmarkedOnly) {
    items = items.filter((it) => it.bookmarked);
  }

  if (selectedCategory !== 'All') {
    items = items.filter((it) => it.category === selectedCategory);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    items = items.filter((it) => JSON.stringify(it).toLowerCase().includes(q));
  }

  const categoriesToDisplay = collectionKey === 'portfolio' ? PORTFOLIO_CATEGORIES : cfg.categories;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={
          collectionKey === 'portfolio'
            ? 'Automated Showcase'
            : collectionKey === 'improvement'
            ? 'Experiment Log'
            : collectionKey === 'casestudies'
            ? 'Auto-Generated Case Studies'
            : cfg.title
        }
        title={collectionKey === 'improvement' ? 'Experiment Log' : cfg.title}
        sub={
          collectionKey === 'portfolio'
            ? 'Your portfolio is automatically organized from completed weekly deliverables and artifacts.'
            : collectionKey === 'improvement'
            ? 'Structured experiment log linking hypotheses, metrics, and learnings back to originating weeks.'
            : collectionKey === 'casestudies'
            ? 'Case studies automatically assembled from CleanO and GOF workspace deliverables.'
            : `${items.length} ${items.length === 1 ? 'entry' : 'entries'}`
        }
      />

      {/* Specialty Banner */}
      {collectionKey === 'portfolio' && (
        <div className="bg-white border border-[#ECECEC] p-4 rounded-2xl shadow-2xs text-xs text-[#6B7280] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
              <SparklesIcon />
            </div>
            <span>
              <strong className="text-[#1E1E1E]">Automated Portfolio:</strong> Completing weekly deliverables automatically populates this portfolio. No manual formatting required.
            </span>
          </div>
        </div>
      )}

      {collectionKey === 'improvement' && (
        <div className="bg-white border border-[#ECECEC] p-4 rounded-2xl shadow-2xs text-xs text-[#6B7280] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
              <FlaskConical className="w-4 h-4" />
            </div>
            <span>
              <strong className="text-[#1E1E1E]">Automated Experiment Tracking:</strong> Weekly PM Labs automatically create structured experiment cards linked to their respective weeks.
            </span>
          </div>
        </div>
      )}

      {collectionKey === 'casestudies' && (
        <div className="bg-white border border-[#ECECEC] p-4 rounded-2xl shadow-2xs text-xs text-[#6B7280] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
              <FileText className="w-4 h-4" />
            </div>
            <span>
              <strong className="text-[#1E1E1E]">Living Case Studies:</strong> Generated automatically from CleanO and GOF workspace artifacts.
            </span>
          </div>
        </div>
      )}

      {/* Category Pills Filter */}
      {categoriesToDisplay && categoriesToDisplay.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#FF7A00] text-white shadow-2xs'
                : 'bg-white border border-[#ECECEC] text-[#6B7280] hover:text-[#1E1E1E]'
            }`}
          >
            All Categories
          </button>
          {categoriesToDisplay.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#FF7A00] text-white shadow-2xs'
                  : 'bg-white border border-[#ECECEC] text-[#6B7280] hover:text-[#1E1E1E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <input
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#ECECEC] text-xs text-[#1E1E1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF7A00]"
            id="collection-search-input"
            placeholder="Search entries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              bookmarkedOnly
                ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
                : 'bg-white border-[#ECECEC] text-[#6B7280] hover:text-[#1E1E1E]'
            }`}
            id="collection-bookmark-filter"
            title="Show bookmarked only"
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
          >
            ★
          </button>
        </div>

        {collectionKey !== 'portfolio' && collectionKey !== 'casestudies' && (
          <button
            className="px-4 py-2 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-xs transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
            onClick={() => openEntryModal(collectionKey)}
          >
            <PlusIcon />
            <span>New Entry</span>
          </button>
        )}
      </div>

      {/* Item Display List */}
      {items.length === 0 ? (
        <EmptyState icon={cfg.icon} title={cfg.emptyTitle} sub={cfg.emptySub} />
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="bg-white border border-[#ECECEC] hover:border-[#FF7A00]/50 p-5 rounded-2xl shadow-2xs transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF7A00]/10 text-[#FF7A00]">
                      {it.category || 'General'}
                    </span>
                    {it.date && <span className="text-[11px] text-[#9CA3AF]">{it.date}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-[#1E1E1E]">{it.title}</h3>
                </div>

                {it.link && (
                  <button
                    onClick={() => {
                      if (it.link.startsWith('http')) {
                        window.open(it.link, '_blank');
                      } else {
                        navigate(it.link);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#ECECEC]/60 border border-[#ECECEC] text-[#1E1E1E] font-semibold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <span>{it.link.startsWith('http') ? 'External Link' : 'Open Route'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF7A00]" />
                  </button>
                )}
              </div>

              {it.content && (
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#ECECEC] text-xs text-[#1E1E1E] whitespace-pre-wrap leading-relaxed font-sans">
                  {it.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
