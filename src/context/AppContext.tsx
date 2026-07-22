import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppState, Mode, CollectionItem } from '../types';
import { defaultState, loadSavedState, STORAGE_KEY, todayStr, uid } from '../lib/data';

interface ModalState {
  key: string;
  id?: string;
  draft: CollectionItem;
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updatePath: (path: string, value: any) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  dark: boolean;
  toggleDark: () => void;
  route: string;
  navigate: (r: string) => void;
  showToast: (msg: string) => void;
  toast: { show: boolean; msg: string };
  modalState: ModalState | null;
  openEntryModal: (key: string, id?: string) => void;
  closeModal: () => void;
  saveEntryModal: (entry: CollectionItem) => void;
  addXP: (amount: number) => void;
  markTodayActive: () => void;
  isSidebarMobileOpen: boolean;
  toggleSidebarMobile: () => void;
  closeSidebarMobile: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadSavedState);
  const [mode, setModeState] = useState<Mode>('study');
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('pmos_theme') === 'dark');
  const [route, setRoute] = useState<string>(() => location.hash.replace('#/', '') || 'home');
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

  // Sync mode to body data attribute
  useEffect(() => {
    document.body.dataset.mode = mode;
  }, [mode]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('pmos_theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Hash route listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = location.hash.replace('#/', '') || 'home';
      setRoute(hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('PM OS: save failed', e);
    }
  }, [state]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
  }, []);

  const toggleDark = useCallback(() => {
    setDark((prev) => !prev);
  }, []);

  const navigate = useCallback((r: string) => {
    location.hash = '#/' + r;
    setRoute(r);
    setIsSidebarMobileOpen(false);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => {
      setToast({ show: false, msg: '' });
    }, 1800);
  }, []);

  const updatePath = useCallback((path: string, value: any) => {
    setState((prevState) => {
      const next = JSON.parse(JSON.stringify(prevState));
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (cur[keys[i]] === undefined) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setState((prevState) => ({
      ...prevState,
      xp: Math.max(0, (prevState.xp || 0) + amount),
    }));
  }, []);

  const markTodayActive = useCallback(() => {
    const today = todayStr();
    setState((prevState) => {
      const s = { ...prevState.streak };
      if (s.lastActiveDate === today) return prevState;
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (s.lastActiveDate === y) {
        s.current += 1;
      } else {
        s.current = 1;
      }
      s.longest = Math.max(s.longest, s.current);
      s.lastActiveDate = today;
      return { ...prevState, streak: s };
    });
  }, []);

  const openEntryModal = useCallback((key: string, id?: string) => {
    setState((currState) => {
      const list = (currState as any)[key] as CollectionItem[] | undefined;
      const existing = id && list ? list.find((x) => x.id === id) : null;
      const draft: CollectionItem = existing
        ? { ...existing }
        : {
            id: uid('e'),
            title: '',
            category: '',
            content: '',
            link: '',
            date: todayStr(),
            tags: '',
            bookmarked: false,
          };
      setModalState({ key, id, draft });
      return currState;
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  const saveEntryModal = useCallback((entry: CollectionItem) => {
    if (!modalState) return;
    const key = modalState.key;
    setState((prevState) => {
      const list = [...((prevState as any)[key] || [])] as CollectionItem[];
      const existingIdx = list.findIndex((x) => x.id === entry.id);
      if (existingIdx >= 0) {
        list[existingIdx] = entry;
      } else {
        list.push(entry);
      }
      return { ...prevState, [key]: list };
    });
    setModalState(null);
    showToast('Saved.');
  }, [modalState, showToast]);

  const toggleSidebarMobile = useCallback(() => {
    setIsSidebarMobileOpen((prev) => !prev);
  }, []);

  const closeSidebarMobile = useCallback(() => {
    setIsSidebarMobileOpen(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        updatePath,
        mode,
        setMode,
        dark,
        toggleDark,
        route,
        navigate,
        showToast,
        toast,
        modalState,
        openEntryModal,
        closeModal,
        saveEntryModal,
        addXP,
        markTodayActive,
        isSidebarMobileOpen,
        toggleSidebarMobile,
        closeSidebarMobile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
