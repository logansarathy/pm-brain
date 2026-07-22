import React from 'react';
import { useApp } from '../context/AppContext';
import { getIcon } from './Icons';

export const Sidebar: React.FC = () => {
  const { state, setState, route, navigate, isSidebarMobileOpen, closeSidebarMobile } = useApp();

  const collapsed = !!state.settings.sidebarCollapsed;

  const toggleCollapse = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        sidebarCollapsed: !prev.settings.sidebarCollapsed,
      },
    }));
  };

  const weekItems = state.weeks
    .filter((w) => w.id > 0)
    .map((w) => ({
      route: 'week/' + w.id,
      label: `Week ${w.id}`,
      icon: 'roadmap',
      sub: true,
      status: w.status,
    }));

  const navGroups = [
    {
      group: null,
      items: [{ route: 'home', label: 'Home', icon: 'dashboard', sub: false, status: undefined }],
    },
    {
      group: 'Learning Journey',
      items: [
        { route: 'week/0', label: 'Foundation', icon: 'bolt', sub: true, status: state.weeks[0]?.status },
        { route: 'roadmap', label: 'Full Roadmap', icon: 'tracker', sub: false, status: undefined },
        ...weekItems,
      ],
    },
    {
      group: 'PM Lab',
      items: [
        { route: 'cleano', label: 'CleanO', icon: 'cleano', sub: false, status: undefined },
        { route: 'gof', label: 'GOF', icon: 'gof', sub: false, status: undefined },
        { route: 'improvement', label: 'Experiments', icon: 'bolt', sub: false, status: undefined },
        { route: 'casestudies', label: 'Case Studies', icon: 'portfolio', sub: false, status: undefined },
        { route: 'teardowns', label: 'Research', icon: 'roadmap', sub: false, status: undefined },
      ],
    },
    {
      group: 'Knowledge Hub',
      items: [
        { route: 'notes', label: 'Notes', icon: 'notes', sub: false, status: undefined },
        { route: 'frameworks', label: 'Frameworks', icon: 'knowledge', sub: false, status: undefined },
        { route: 'resources', label: 'Resources', icon: 'library', sub: false, status: undefined },
      ],
    },
    {
      group: 'AI Workspace',
      items: [{ route: 'aiworkspace', label: 'Prompt Library', icon: 'knowledge', sub: false, status: undefined }],
    },
    {
      group: 'Build',
      items: [
        { route: 'portfolio', label: 'Portfolio', icon: 'portfolio', sub: false, status: undefined },
        { route: 'linkedin', label: 'LinkedIn', icon: 'notes', sub: false, status: undefined },
      ],
    },
    {
      group: 'Prepare',
      items: [
        { route: 'interview', label: 'Interview Prep', icon: 'interview', sub: false, status: undefined },
        { route: 'templates', label: 'Templates', icon: 'templates', sub: false, status: undefined },
      ],
    },
    {
      group: 'Reflect',
      items: [{ route: 'journal', label: 'Journal', icon: 'journal', sub: false, status: undefined }],
    },
    {
      group: 'System',
      items: [
        { route: 'dashboard', label: 'Analytics', icon: 'tracker', sub: false, status: undefined },
        { route: 'search', label: 'Search', icon: 'search', sub: false, status: undefined },
        { route: 'settings', label: 'Settings', icon: 'settings', sub: false, status: undefined },
      ],
    },
  ];

  return (
    <aside id="sidebar" className={`${collapsed ? 'collapsed' : ''} ${isSidebarMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">LS</div>
        <div className="brand-text">
          Logansarathy
          <span>Building Products. Building Myself.</span>
        </div>
      </div>

      <nav className="sidebar-scroll" id="sidebar-nav">
        {navGroups.map((group, gIdx) => (
          <div className="nav-group" key={gIdx}>
            {group.group && <div className="nav-group-label">{group.group}</div>}
            {group.items.map((item, iIdx) => {
              const isActive = route === item.route;
              return (
                <div
                  key={iIdx}
                  className={`nav-item ${item.sub ? 'nav-sub' : ''} ${item.status ? 'status-' + item.status : ''} ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => {
                    navigate(item.route);
                    closeSidebarMobile();
                  }}
                >
                  {item.sub ? <span className="nav-dot"></span> : getIcon(item.icon)}
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="collapse-btn" id="collapse-btn" onClick={toggleCollapse}>
          Collapse
        </button>
      </div>
    </aside>
  );
};
