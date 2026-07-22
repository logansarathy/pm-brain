import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { levelFromXP } from '../lib/data';
import { SearchIcon, StreakIcon, XpIcon } from './Icons';

export const Topbar: React.FC = () => {
  const { state, mode, setMode, dark, toggleDark, navigate, toggleSidebarMobile } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate('search/' + encodeURIComponent(searchInput));
    }
  };

  return (
    <header id="topbar">
      <button
        className="btn btn-ghost mobile-topbar-toggle"
        id="mobile-nav-toggle"
        aria-label="Open navigation"
        onClick={toggleSidebarMobile}
      >
        ☰
      </button>

      <div className="mode-switch" id="mode-switch">
        <button
          className={mode === 'study' ? 'active' : ''}
          data-mode-set="study"
          title="Study Mode"
          onClick={() => setMode('study')}
        >
          📚<span> Study</span>
        </button>
        <button
          className={mode === 'creator' ? 'active' : ''}
          data-mode-set="creator"
          title="Creator Mode"
          onClick={() => setMode('creator')}
        >
          ✏️<span> Creator</span>
        </button>
      </div>

      <div className="mode-banner">✏️ Editing content</div>

      <div className="topbar-spacer"></div>

      <div className="topbar-search" id="topbar-search-trigger" style={{ flex: '0 1 260px' }}>
        <SearchIcon />
        <input
          type="text"
          id="global-search-input"
          placeholder="Search…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <kbd>/</kbd>
      </div>

      <div className="topbar-pill pill-amber" title="Current streak">
        <StreakIcon />
        <span id="pill-streak">{state.streak.current} days</span>
      </div>

      <div className="topbar-pill pill-accent" title="XP">
        <XpIcon />
        <span id="pill-xp">
          {state.xp} XP · Lv {levelFromXP(state.xp)}
        </span>
      </div>

      <button className="theme-toggle" id="theme-toggle-btn" title="Toggle dark mode" onClick={toggleDark}>
        {dark ? '☀️' : '🌙'}
      </button>

      <div className="topbar-avatar">LS</div>
    </header>
  );
};
