/**
 * PURPOSE:
 * Supabase Client Initialization & Authentication Service for PM OS.
 *
 * RESPONSIBILITY:
 * Provides a configured Supabase client and auth utility helpers (signIn, signUp, signOut, etc.).
 * Gracefully falls back if environment variables are not set.
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface AuthUserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'student' | 'creator';
  createdAt?: string;
}

export const authService = {
  isConfigured: isSupabaseConfigured,

  async getSession(): Promise<Session | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  async ensureDefaultUserRecords(userId: string, email: string, fullName: string) {
    if (!supabase) return;
    const now = new Date().toISOString();

    // 1. Ensure Profile
    const { data: existingProf } = await supabase.from('profiles').select('id').eq('id', userId).single();
    if (!existingProf) {
      await supabase.from('profiles').upsert({
        id: userId,
        email,
        full_name: fullName,
        role: 'student',
        updated_at: now,
      });
    }

    // 2. Ensure Progress Record
    const { data: existingProg } = await supabase.from('progress').select('user_id').eq('user_id', userId).single();
    if (!existingProg) {
      await supabase.from('progress').upsert({
        user_id: userId,
        current_week: 0,
        completed_lessons: [],
        week_progress: {},
        xp: 0,
        streak_current: 0,
        streak_longest: 0,
        last_active_date: null,
        updated_at: now,
      });
    }

    // 3. Ensure Settings Record
    const { data: existingSettings } = await supabase.from('settings').select('user_id').eq('user_id', userId).single();
    if (!existingSettings) {
      await supabase.from('settings').upsert({
        user_id: userId,
        hours_logged_total: 0,
        weekly_goal_days: 5,
        monthly_goal_days: 20,
        sidebar_collapsed: false,
        theme: 'light',
        timezone: 'UTC',
        notifications_enabled: true,
        created_at: now,
        updated_at: now,
      });
    }
  },

  async signUp(email: string, password: string, fullName: string) {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;

    if (data.user) {
      await this.ensureDefaultUserRecords(data.user.id, email, fullName);
    }

    return data;
  },

  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/#/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/login`,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password: string) {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  async getUserProfile(userId: string): Promise<AuthUserProfile | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name || '',
      avatarUrl: data.avatar_url || '',
      role: data.role || 'student',
      createdAt: data.created_at,
    };
  },

  async updateUserProfile(userId: string, updates: Partial<AuthUserProfile>) {
    if (!supabase) return;
    await supabase.from('profiles').upsert({
      id: userId,
      full_name: updates.fullName,
      avatar_url: updates.avatarUrl,
      updated_at: new Date().toISOString(),
    });
  },
};
