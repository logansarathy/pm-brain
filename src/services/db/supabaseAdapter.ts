/**
 * PURPOSE:
 * Supabase Database Adapter for PM OS.
 *
 * RESPONSIBILITY:
 * Interacts directly with PostgreSQL tables in Supabase for user data sync.
 * Tables handled: profiles, progress, journal_entries, practice_answers,
 * pmlab_entries, portfolio_items, knowledge_notes, linkedin_posts, settings.
 *
 * Note: Course content (lessons, assignments, frameworks) remains as static files
 * inside `src/content/`. Supabase handles dynamic user state.
 */

import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { LocalStorageAdapter } from './localStorageAdapter';
import {
  DBProfile,
  DBJournalEntry,
  DBKnowledgeNote,
  DBPMLabEntry,
  DBPortfolioItem,
  DBPracticeAnswer,
  DBLinkedInPost,
  DBUserProgress,
  DBUserSettings,
  DBLessonProgress,
  IDatabaseService,
} from './types';

export class SupabaseAdapter implements IDatabaseService {
  private fallback = new LocalStorageAdapter();

  private canUseSupabase(): boolean {
    return isSupabaseConfigured() && supabase !== null;
  }

  async getProfile(userId: string): Promise<DBProfile | null> {
    if (!this.canUseSupabase()) return this.fallback.getProfile(userId);
    try {
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return this.fallback.getProfile(userId);

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name || '',
        avatarUrl: data.avatar_url || '',
        role: data.role || 'student',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return this.fallback.getProfile(userId);
    }
  }

  async saveProfile(profile: DBProfile): Promise<void> {
    await this.fallback.saveProfile(profile);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('profiles').upsert({
        id: profile.id,
        email: profile.email,
        full_name: profile.fullName,
        avatar_url: profile.avatarUrl,
        role: profile.role,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase saveProfile failed:', e);
    }
  }

  async getUserProgress(userId: string): Promise<DBUserProgress | null> {
    if (!this.canUseSupabase()) return this.fallback.getUserProgress(userId);
    try {
      const { data, error } = await supabase!
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return this.fallback.getUserProgress(userId);

      // Fetch dedicated lesson_progress table records
      const lessonProgs = await this.getLessonProgress(userId);
      const completedFromTable = lessonProgs.filter((lp) => lp.completed).map((lp) => lp.lessonId);
      const combinedCompleted = Array.from(new Set([...(data.completed_lessons || []), ...completedFromTable]));

      return {
        userId: data.user_id,
        currentWeek: data.current_week || 0,
        completedLessons: combinedCompleted,
        weekProgress: data.week_progress || {},
        xp: data.xp || 0,
        streak: {
          current: data.streak_current || 0,
          longest: data.streak_longest || 0,
          lastActiveDate: data.last_active_date || null,
        },
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch {
      return this.fallback.getUserProgress(userId);
    }
  }

  async saveUserProgress(progress: DBUserProgress): Promise<void> {
    await this.fallback.saveUserProgress(progress);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('progress').upsert({
        user_id: progress.userId,
        current_week: progress.currentWeek,
        completed_lessons: progress.completedLessons,
        week_progress: progress.weekProgress,
        xp: progress.xp,
        streak_current: progress.streak.current,
        streak_longest: progress.streak.longest,
        last_active_date: progress.streak.lastActiveDate,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase saveUserProgress failed:', e);
    }
  }

  async getLessonProgress(userId: string): Promise<DBLessonProgress[]> {
    if (!this.canUseSupabase()) return this.fallback.getLessonProgress(userId);
    try {
      const { data, error } = await supabase!
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId);

      if (error || !data) return this.fallback.getLessonProgress(userId);

      return data.map((d) => ({
        id: d.id,
        userId: d.user_id,
        weekId: d.week_id,
        lessonId: d.lesson_id,
        completed: Boolean(d.completed),
        completedAt: d.completed_at,
      }));
    } catch {
      return this.fallback.getLessonProgress(userId);
    }
  }

  async saveLessonProgress(progress: DBLessonProgress): Promise<void> {
    await this.fallback.saveLessonProgress(progress);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('lesson_progress').upsert({
        user_id: progress.userId,
        week_id: progress.weekId,
        lesson_id: progress.lessonId,
        completed: progress.completed,
        completed_at: progress.completedAt || new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });
    } catch (e) {
      console.warn('Supabase saveLessonProgress failed:', e);
    }
  }

  async markLessonComplete(userId: string, weekId: number, lessonId: string, completed: boolean): Promise<void> {
    await this.saveLessonProgress({
      id: `${userId}_${lessonId}`,
      userId,
      weekId,
      lessonId,
      completed,
      completedAt: new Date().toISOString(),
    });
  }

  async getJournalEntries(userId: string): Promise<DBJournalEntry[]> {
    if (!this.canUseSupabase()) return this.fallback.getJournalEntries(userId);
    try {
      const { data, error } = await supabase!
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return this.fallback.getJournalEntries(userId);

      return data.map((d) => ({
        id: d.id,
        userId: d.user_id,
        title: d.title || '',
        date: d.date || '',
        content: d.content || '',
        tags: d.tags || [],
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch {
      return this.fallback.getJournalEntries(userId);
    }
  }

  async saveJournalEntry(entry: DBJournalEntry): Promise<void> {
    await this.fallback.saveJournalEntry(entry);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('journal_entries').upsert({
        id: entry.id,
        user_id: entry.userId,
        title: entry.title,
        date: entry.date,
        content: entry.content,
        tags: entry.tags,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase saveJournalEntry failed:', e);
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await this.fallback.deleteJournalEntry(id);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('journal_entries').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteJournalEntry failed:', e);
    }
  }

  async getPracticeAnswers(userId: string, weekId?: number): Promise<DBPracticeAnswer[]> {
    if (!this.canUseSupabase()) return this.fallback.getPracticeAnswers(userId, weekId);
    try {
      let query = supabase!.from('practice_answers').select('*').eq('user_id', userId);
      if (weekId !== undefined) {
        query = query.eq('week_id', weekId);
      }
      const { data, error } = await query;
      if (error || !data) return this.fallback.getPracticeAnswers(userId, weekId);

      return data.map((d) => ({
        id: d.id,
        userId: d.user_id,
        weekId: d.week_id,
        exerciseType: d.exercise_type,
        answerText: d.answer_text,
        updatedAt: d.updated_at,
      }));
    } catch {
      return this.fallback.getPracticeAnswers(userId, weekId);
    }
  }

  async savePracticeAnswer(answer: DBPracticeAnswer): Promise<void> {
    await this.fallback.savePracticeAnswer(answer);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('practice_answers').upsert({
        id: answer.id,
        user_id: answer.userId,
        week_id: answer.weekId,
        exercise_type: answer.exerciseType,
        answer_text: answer.answerText,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase savePracticeAnswer failed:', e);
    }
  }

  async getPMLabEntries(userId: string): Promise<DBPMLabEntry[]> {
    if (!this.canUseSupabase()) return this.fallback.getPMLabEntries(userId);
    try {
      const { data, error } = await supabase!
        .from('pmlab_entries')
        .select('*')
        .eq('user_id', userId)
        .order('week_id', { ascending: true });

      if (error || !data) return this.fallback.getPMLabEntries(userId);

      return data.map((d) => ({
        id: d.id,
        userId: d.user_id,
        weekId: d.week_id,
        goal: d.goal || '',
        problemStatement: d.problem_statement || '',
        hypothesis: d.hypothesis || '',
        experiment: d.experiment || '',
        evidence: d.evidence || '',
        observations: d.observations || '',
        insights: d.insights || '',
        outcome: d.outcome || '',
        nextAction: d.next_action || '',
        reflection: d.reflection || '',
        completed: Boolean(d.completed),
        updatedAt: d.updated_at,
      }));
    } catch {
      return this.fallback.getPMLabEntries(userId);
    }
  }

  async getPMLabEntry(userId: string, weekId: number): Promise<DBPMLabEntry | null> {
    if (!this.canUseSupabase()) return this.fallback.getPMLabEntry(userId, weekId);
    try {
      const { data, error } = await supabase!
        .from('pmlab_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('week_id', weekId)
        .single();

      if (error || !data) return this.fallback.getPMLabEntry(userId, weekId);

      return {
        id: data.id,
        userId: data.user_id,
        weekId: data.week_id,
        goal: data.goal || '',
        problemStatement: data.problem_statement || '',
        hypothesis: data.hypothesis || '',
        experiment: data.experiment || '',
        evidence: data.evidence || '',
        observations: data.observations || '',
        insights: data.insights || '',
        outcome: data.outcome || '',
        nextAction: data.next_action || '',
        reflection: data.reflection || '',
        completed: Boolean(data.completed),
        updatedAt: data.updated_at,
      };
    } catch {
      return this.fallback.getPMLabEntry(userId, weekId);
    }
  }

  async savePMLabEntry(entry: DBPMLabEntry): Promise<void> {
    await this.fallback.savePMLabEntry(entry);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('pmlab_entries').upsert({
        id: entry.id,
        user_id: entry.userId,
        week_id: entry.weekId,
        goal: entry.goal,
        problem_statement: entry.problemStatement,
        hypothesis: entry.hypothesis,
        experiment: entry.experiment,
        evidence: entry.evidence,
        observations: entry.observations,
        insights: entry.insights,
        outcome: entry.outcome,
        next_action: entry.nextAction,
        reflection: entry.reflection,
        completed: entry.completed,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase savePMLabEntry failed:', e);
    }
  }

  async getPortfolioItems(userId: string): Promise<DBPortfolioItem[]> {
    if (!this.canUseSupabase()) return this.fallback.getPortfolioItems(userId);
    try {
      const { data, error } = await supabase!
        .from('portfolio_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return this.fallback.getPortfolioItems(userId);

      return data.map((d) => ({
        id: d.id,
        userId: d.user_id,
        weekId: d.week_id,
        category: d.category,
        title: d.title,
        description: d.description,
        downloadLink: d.download_link,
        fileUrl: d.file_url,
        linkedinDraft: d.linkedin_draft,
        status: d.status || 'draft',
        createdAt: d.created_at,
      }));
    } catch {
      return this.fallback.getPortfolioItems(userId);
    }
  }

  async savePortfolioItem(item: DBPortfolioItem): Promise<void> {
    await this.fallback.savePortfolioItem(item);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('portfolio_items').upsert({
        id: item.id,
        user_id: item.userId,
        week_id: item.weekId,
        category: item.category,
        title: item.title,
        description: item.description,
        download_link: item.downloadLink,
        file_url: item.fileUrl,
        linkedin_draft: item.linkedinDraft,
        status: item.status || 'draft',
        created_at: item.createdAt || new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase savePortfolioItem failed:', e);
    }
  }

  async getKnowledgeNotes(userId: string): Promise<DBKnowledgeNote[]> {
    if (!this.canUseSupabase()) return this.fallback.getKnowledgeNotes(userId);
    try {
      const { data, error } = await supabase!
        .from('knowledge_notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return this.fallback.getKnowledgeNotes(userId);

      return data.map((d) => ({
        id: d.id,
        userId: d.user_id,
        lessonId: d.lesson_id,
        weekId: d.week_id,
        type: d.type,
        title: d.title,
        category: d.category,
        content: d.content,
        link: d.link,
        favorite: Boolean(d.favorite),
        pinned: Boolean(d.pinned),
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch {
      return this.fallback.getKnowledgeNotes(userId);
    }
  }

  async saveKnowledgeNote(note: DBKnowledgeNote): Promise<void> {
    await this.fallback.saveKnowledgeNote(note);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('knowledge_notes').upsert({
        id: note.id,
        user_id: note.userId,
        lesson_id: note.lessonId,
        week_id: note.weekId,
        type: note.type,
        title: note.title,
        category: note.category,
        content: note.content,
        link: note.link,
        favorite: note.favorite,
        pinned: note.pinned,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase saveKnowledgeNote failed:', e);
    }
  }

  async deleteKnowledgeNote(id: string): Promise<void> {
    await this.fallback.deleteKnowledgeNote(id);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('knowledge_notes').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteKnowledgeNote failed:', e);
    }
  }

  async getLinkedInPosts(userId: string): Promise<DBLinkedInPost[]> {
    if (!this.canUseSupabase()) return this.fallback.getLinkedInPosts(userId);
    try {
      const { data, error } = await supabase!
        .from('linkedin_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return this.fallback.getLinkedInPosts(userId);

      return data.map((d) => ({
        id: d.id,
        userId: d.user_id,
        weekId: d.week_id,
        postTitle: d.post_title,
        draft: d.draft,
        url: d.url,
        publishedDate: d.published_date,
        published: Boolean(d.published),
        createdAt: d.created_at,
      }));
    } catch {
      return this.fallback.getLinkedInPosts(userId);
    }
  }

  async saveLinkedInPost(post: DBLinkedInPost): Promise<void> {
    await this.fallback.saveLinkedInPost(post);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('linkedin_posts').upsert({
        id: post.id,
        user_id: post.userId,
        week_id: post.weekId,
        post_title: post.postTitle,
        draft: post.draft,
        url: post.url,
        published_date: post.publishedDate,
        published: post.published,
        created_at: post.createdAt || new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase saveLinkedInPost failed:', e);
    }
  }

  async getUserSettings(userId: string): Promise<DBUserSettings | null> {
    if (!this.canUseSupabase()) return this.fallback.getUserSettings(userId);
    try {
      const { data, error } = await supabase!
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return this.fallback.getUserSettings(userId);

      return {
        userId: data.user_id,
        hoursLoggedTotal: data.hours_logged_total || 0,
        weeklyGoalDays: data.weekly_goal_days || 5,
        monthlyGoalDays: data.monthly_goal_days || 20,
        sidebarCollapsed: Boolean(data.sidebar_collapsed),
        theme: data.theme || 'light',
        timezone: data.timezone || 'UTC',
        notificationsEnabled: data.notifications_enabled ?? true,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return this.fallback.getUserSettings(userId);
    }
  }

  async saveUserSettings(settings: DBUserSettings): Promise<void> {
    await this.fallback.saveUserSettings(settings);
    if (!this.canUseSupabase()) return;
    try {
      await supabase!.from('settings').upsert({
        user_id: settings.userId,
        hours_logged_total: settings.hoursLoggedTotal,
        weekly_goal_days: settings.weeklyGoalDays,
        monthly_goal_days: settings.monthlyGoalDays,
        sidebar_collapsed: settings.sidebarCollapsed,
        theme: settings.theme,
        timezone: settings.timezone || 'UTC',
        notifications_enabled: settings.notificationsEnabled ?? true,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase saveUserSettings failed:', e);
    }
  }
}
