import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { PMLabTimelineView } from './views/PMLabTimelineView';

import { LoginView } from './views/auth/LoginView';
import { SignupView } from './views/auth/SignupView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';
import { ProfileView } from './views/auth/ProfileView';
import { ProtectedRoute } from './components/ProtectedRoute';

const MainContent: React.FC = () => {
  const { route, navigate } = useApp();
  const { user, loading, isConfigured } = useAuth();

  const parts = route.split('/');
  const mainRoute = parts[0];
  const subParam = parts[1] ? decodeURIComponent(parts[1]) : '';

  const isAuthRoute = ['login', 'signup', 'forgot-password'].includes(mainRoute);

  // Auto-redirect authenticated users away from login/signup to home workspace
  React.useEffect(() => {
    if (!loading && user && isAuthRoute) {
      navigate('home');
    }
    // If Supabase is configured and unauthenticated user attempts to access app, redirect to login
    if (!loading && isConfigured && !user && !isAuthRoute) {
      navigate('login');
    }
  }, [user, loading, isAuthRoute, isConfigured, mainRoute, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-sm text-[var(--text-dim)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying PM OS session…</span>
        </div>
      </div>
    );
  }

  if (isAuthRoute && !user) {
    return (
      <div className="min-h-screen w-full bg-[#FFFDF9]">
        {mainRoute === 'login' && <LoginView />}
        {mainRoute === 'signup' && <SignupView />}
        {mainRoute === 'forgot-password' && <ForgotPasswordView />}
        <Toast />
      </div>
    );
  }

  const renderView = () => {
    switch (mainRoute) {
      case 'login':
        return <LoginView />;
      case 'signup':
        return <SignupView />;
      case 'forgot-password':
        return <ForgotPasswordView />;
      case 'profile':
        return (
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        );
      case 'home':
      case 'dashboard':
        return <HomeView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'week':
        return <WeekView weekId={parseInt(subParam, 10) || 0} />;
      case 'pmlab':
        return <PMLabTimelineView />;
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
        return (
          <ProtectedRoute>
            <JournalView />
          </ProtectedRoute>
        );
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
        <main id="view" className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          {renderView()}
        </main>
      </div>
      <Toast />
      <Modal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </AppProvider>
  );
}
