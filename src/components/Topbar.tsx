import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { levelFromXP } from '../lib/data';
import { SearchIcon, StreakIcon, XpIcon } from './Icons';
import { CreatorPasscodeModal } from './CreatorPasscodeModal';

export const Topbar: React.FC = () => {
  const { state, mode, setMode, dark, toggleDark, navigate, toggleSidebarMobile, showToast } = useApp();
  const { profile, user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

  // Ctrl + Shift + M keyboard listener for Creator Mode unlock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        if (mode === 'creator') {
          setMode('study');
          showToast('Switched to Study Mode');
        } else {
          setIsPasscodeModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, setMode, showToast]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      navigate('search/' + encodeURIComponent(searchInput));
    }
  };

  const userInitials = (profile?.fullName || state.profile?.name || user?.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header id="topbar" className="relative">
      <button
        className="btn btn-ghost mobile-topbar-toggle"
        id="mobile-nav-toggle"
        aria-label="Open navigation"
        onClick={toggleSidebarMobile}
      >
        ☰
      </button>

      {/* Creator Mode Banner - Hidden for students, visible only when instructor unlocks */}
      {mode === 'creator' && (
        <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs font-semibold">
          <span>✏️ Creator Mode</span>
          <button
            onClick={() => {
              setMode('study');
              showToast('Locked Creator Mode');
            }}
            className="hover:underline opacity-80 text-[10px] uppercase ml-1"
          >
            Lock 🔒
          </button>
        </div>
      )}

      <div className="topbar-spacer"></div>

      <div className="topbar-search" id="topbar-search-trigger" style={{ flex: '0 1 260px' }}>
        <SearchIcon />
        <input
          type="text"
          id="global-search-input"
          placeholder="Search lessons, frameworks…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <kbd>/</kbd>
      </div>

      <div
        className="topbar-pill pill-amber cursor-pointer hover:opacity-90"
        title="Current streak"
        onClick={() => navigate('streaksys')}
      >
        <StreakIcon />
        <span id="pill-streak">{state.streak.current} days</span>
      </div>

      <div
        className="topbar-pill pill-accent cursor-pointer hover:opacity-90"
        title="XP Points"
        onClick={() => navigate('xpsys')}
      >
        <XpIcon />
        <span id="pill-xp">
          {state.xp} XP · Lv {levelFromXP(state.xp)}
        </span>
      </div>

      <button className="theme-toggle" id="theme-toggle-btn" title="Toggle dark mode" onClick={toggleDark}>
        {dark ? '☀️' : '🌙'}
      </button>

      <div
        className="topbar-avatar cursor-pointer hover:ring-2 hover:ring-[var(--accent-color)] transition-all"
        title="Profile & Settings"
        onClick={() => navigate('profile')}
      >
        {userInitials}
      </div>

      <CreatorPasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={() => setMode('creator')}
      />
    </header>
  );
};
