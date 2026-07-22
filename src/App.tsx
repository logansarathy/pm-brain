import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Toast } from './components/Toast';
import { Modal } from './components/Modal';

import { HomeView } from './views/HomeView';
import { DashboardView } from './views/DashboardView';
import { RoadmapView } from './views/RoadmapView';
import { WeekView } from './views/WeekView';
import { CollectionView } from './views/CollectionView';
import { WorkspaceView } from './views/WorkspaceView';
import { TemplatesView } from './views/TemplatesView';
import { JournalView } from './views/JournalView';
import { SearchView } from './views/SearchView';
import { SettingsView } from './views/SettingsView';
import { TrackerView } from './views/TrackerView';
import { StreakView } from './views/StreakView';
import { XPView } from './views/XPView';

const MainContent: React.FC = () => {
  const { route } = useApp();

  const parts = route.split('/');
  const mainRoute = parts[0];
  const subParam = parts[1] ? decodeURIComponent(parts[1]) : '';

  const renderView = () => {
    switch (mainRoute) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'week':
        return <WeekView weekId={parseInt(subParam, 10) || 0} />;
      case 'tracker':
        return <TrackerView />;
      case 'streaksys':
        return <StreakView />;
      case 'xpsys':
        return <XPView />;
      case 'knowledge':
        return <CollectionView collectionKey="knowledge" />;
      case 'frameworks':
        return <CollectionView collectionKey="frameworks" />;
      case 'resources':
        return <CollectionView collectionKey="resources" />;
      case 'notes':
        return <CollectionView collectionKey="notes" />;
      case 'teardowns':
        return <CollectionView collectionKey="teardowns" />;
      case 'improvement':
        return <CollectionView collectionKey="improvement" />;
      case 'casestudies':
        return <CollectionView collectionKey="casestudies" />;
      case 'portfolio':
        return <CollectionView collectionKey="portfolio" />;
      case 'interview':
        return <CollectionView collectionKey="interviewPrep" />;
      case 'aiworkspace':
        return <CollectionView collectionKey="aiPrompts" />;
      case 'linkedin':
        return <CollectionView collectionKey="linkedin" />;
      case 'cleano':
        return <WorkspaceView workspaceKey="cleano" label="CleanO Workspace" />;
      case 'gof':
        return <WorkspaceView workspaceKey="gof" label="GOF Workspace" />;
      case 'templates':
        return <TemplatesView />;
      case 'journal':
        return <JournalView />;
      case 'search':
        return <SearchView initialQuery={subParam} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div id="app-shell">
      <Sidebar />
      <div id="main-col">
        <Topbar />
        <main id="view">{renderView()}</main>
      </div>
      <Toast />
      <Modal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
