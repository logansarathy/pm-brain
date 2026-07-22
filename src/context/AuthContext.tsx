import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, AuthUserProfile, isSupabaseConfigured, supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: AuthUserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  const loadProfileForUser = async (u: User | null) => {
    if (!u) {
      setProfile(null);
      return;
    }
    const email = u.email || '';
    const fullName = u.user_metadata?.full_name || email.split('@')[0] || 'Learner';

    // Auto-create profiles, progress, and settings records if missing
    try {
      await authService.ensureDefaultUserRecords(u.id, email, fullName);
    } catch (e) {
      console.warn('Failed ensuring default user records:', e);
    }

    const prof = await authService.getUserProfile(u.id);
    if (prof) {
      setProfile(prof);
    } else {
      setProfile({
        id: u.id,
        email,
        fullName,
        role: 'student',
      });
    }
  };

  useEffect(() => {
    // Check if local workspace user exists first
    const savedLocal = localStorage.getItem('pmos_local_user');
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        setUser(parsed);
        setProfile({
          id: parsed.id || 'local-user',
          email: parsed.email || 'student@pmos.local',
          fullName: parsed.user_metadata?.full_name || 'Student',
          role: 'student',
        });
      } catch (e) {
        console.warn('Failed parsing local user:', e);
      }
    }

    if (!isConfigured) {
      setLoading(false);
      return;
    }

    authService.getSession().then(async (sess) => {
      if (sess?.user) {
        setSession(sess);
        setUser(sess.user);
        await loadProfileForUser(sess.user);
      }
      setLoading(false);
    });

    // Listen to Auth changes
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event: string, currentSession: Session | null) => {
          if (currentSession?.user) {
            setSession(currentSession);
            setUser(currentSession.user);
            await loadProfileForUser(currentSession.user);
          } else if (!localStorage.getItem('pmos_local_user')) {
            setSession(null);
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isConfigured]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (!isConfigured) {
        const localUser = {
          id: 'local-user',
          email: email || 'student@pmos.local',
          app_metadata: {},
          user_metadata: { full_name: email.split('@')[0] || 'Student' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(localUser);
        setProfile({
          id: 'local-user',
          email: email || 'student@pmos.local',
          fullName: email.split('@')[0] || 'Student',
          role: 'student',
        });
        localStorage.setItem('pmos_local_user', JSON.stringify(localUser));
        return;
      }
      const data = await authService.signIn(email, pass);
      setSession(data.session);
      setUser(data.user);
      if (data.user) await loadProfileForUser(data.user);
    } catch (err: any) {
      if (!isConfigured) {
        const localUser = {
          id: 'local-user',
          email: email || 'student@pmos.local',
          app_metadata: {},
          user_metadata: { full_name: email.split('@')[0] || 'Student' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(localUser);
        setProfile({
          id: 'local-user',
          email: email || 'student@pmos.local',
          fullName: email.split('@')[0] || 'Student',
          role: 'student',
        });
        localStorage.setItem('pmos_local_user', JSON.stringify(localUser));
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      if (!isConfigured) {
        const localUser = {
          id: 'local-user',
          email: email || 'student@pmos.local',
          app_metadata: {},
          user_metadata: { full_name: name || email.split('@')[0] || 'Student' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(localUser);
        setProfile({
          id: 'local-user',
          email: email || 'student@pmos.local',
          fullName: name || email.split('@')[0] || 'Student',
          role: 'student',
        });
        localStorage.setItem('pmos_local_user', JSON.stringify(localUser));
        return;
      }
      const data = await authService.signUp(email, pass, name);
      setSession(data.session);
      setUser(data.user);
      if (data.user) await loadProfileForUser(data.user);
    } catch (err: any) {
      if (!isConfigured) {
        const localUser = {
          id: 'local-user',
          email: email || 'student@pmos.local',
          app_metadata: {},
          user_metadata: { full_name: name || email.split('@')[0] || 'Student' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(localUser);
        setProfile({
          id: 'local-user',
          email: email || 'student@pmos.local',
          fullName: name || email.split('@')[0] || 'Student',
          role: 'student',
        });
        localStorage.setItem('pmos_local_user', JSON.stringify(localUser));
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!isConfigured) {
      const localUser = {
        id: 'local-user',
        email: 'google.student@pmos.local',
        app_metadata: {},
        user_metadata: { full_name: 'Google Student' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(localUser);
      setProfile({
        id: 'local-user',
        email: 'google.student@pmos.local',
        fullName: 'Google Student',
        role: 'student',
      });
      localStorage.setItem('pmos_local_user', JSON.stringify(localUser));
      return;
    }
    await authService.signInWithGoogle();
  };

  const resetPassword = async (email: string) => {
    if (isConfigured) {
      await authService.resetPassword(email);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isConfigured) {
        await authService.signOut();
      }
      localStorage.removeItem('pmos_local_user');
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfileForUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        login,
        signup,
        loginWithGoogle,
        resetPassword,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
