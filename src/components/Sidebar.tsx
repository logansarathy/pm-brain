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
      items: [
        { route: 'home', label: 'Home Workspace', icon: 'dashboard', sub: false, status: undefined },
      ],
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
        { route: 'pmlab', label: 'PM Lab Timeline', icon: 'tracker', sub: false, status: undefined },
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
        { route: 'knowledge', label: 'Knowledge Hub', icon: 'knowledge', sub: false, status: undefined },
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
        { route: 'profile', label: 'My Account', icon: 'dashboard', sub: false, status: undefined },
        { route: 'search', label: 'Search', icon: 'search', sub: false, status: undefined },
        { route: 'settings', label: 'Settings', icon: 'settings', sub: false, status: undefined },
      ],
    },
  ];

  return (
    <aside id="sidebar" className={`${collapsed ? 'collapsed' : ''} ${isSidebarMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => {
            navigate('home');
            closeSidebarMobile();
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#FF7A00',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
            }}
          >
            PM
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.2' }}>
                PM OS
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Operating System
              </div>
            </div>
          )}
        </div>
        <button
          className="sidebar-collapse-toggle desktop-only"
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((g, idx) => (
          <div className="nav-group" key={idx}>
            {g.group && !collapsed && <div className="nav-group-title">{g.group}</div>}
            {g.items.map((item) => {
              const isActive = route === item.route || (item.route.startsWith('week/') && route === item.route);
              return (
                <div
                  key={item.route}
                  className={`nav-item ${isActive ? 'active' : ''} ${item.sub ? 'sub' : ''}`}
                  onClick={() => {
                    navigate(item.route);
                    closeSidebarMobile();
                  }}
                  title={item.label}
                >
                  <span className="nav-icon">{getIcon(item.icon)}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                  {!collapsed && item.status && (
                    <span className={`nav-badge status-${item.status}`}>
                      {item.status === 'complete' ? '✓' : item.status === 'active' ? '•' : ''}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
