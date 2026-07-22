import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isConfigured } = useAuth();
  const { navigate } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-[var(--text-dim)]">
        Verifying authentication…
      </div>
    );
  }

  // If Supabase is configured and user is not signed in, show prompt or redirect
  if (isConfigured && !user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-center space-y-4">
        <div className="text-3xl">🔒</div>
        <h2 className="text-lg font-bold text-[var(--text-main)]">Sign In Required</h2>
        <p className="text-xs text-[var(--text-dim)]">
          Please sign in to access your personalized learning progress, PM labs, and journal entries.
        </p>
        <button
          onClick={() => navigate('login')}
          className="btn btn-primary w-full py-2 text-sm font-medium"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
