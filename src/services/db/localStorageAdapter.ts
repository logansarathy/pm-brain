/**
 * PURPOSE:
 * LocalStorage Database Adapter for PM OS.
 *
 * RESPONSIBILITY:
 * Implements IDatabaseService using browser local storage for offline / local persistence.
 */

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

const PREFIX = 'pmos_db_v2_';

export class LocalStorageAdapter implements IDatabaseService {
  private getItem<T>(key: string): T | null {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      console.warn(`LocalStorageAdapter read error for key: ${key}`, e);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`LocalStorageAdapter write error for key: ${key}`, e);
    }
  }

  async getProfile(userId: string): Promise<DBProfile | null> {
    return this.getItem<DBProfile>(`profile_${userId}`);
  }

  async saveProfile(profile: DBProfile): Promise<void> {
    this.setItem(`profile_${profile.id}`, profile);
  }

  async getUserProgress(userId: string): Promise<DBUserProgress | null> {
    const prog = this.getItem<DBUserProgress>(`progress_${userId}`);
    if (!prog) return null;
    
    // Merge with lesson_progress
    const lessonProgs = await this.getLessonProgress(userId);
    const completedIds = lessonProgs.filter((lp) => lp.completed).map((lp) => lp.lessonId);
    
    return {
      ...prog,
      completedLessons: Array.from(new Set([...(prog.completedLessons || []), ...completedIds])),
    };
  }

  async saveUserProgress(progress: DBUserProgress): Promise<void> {
    this.setItem(`progress_${progress.userId}`, progress);
  }

  async getLessonProgress(userId: string): Promise<DBLessonProgress[]> {
    return this.getItem<DBLessonProgress[]>(`lesson_progress_${userId}`) || [];
  }

  async saveLessonProgress(progress: DBLessonProgress): Promise<void> {
    const list = await this.getLessonProgress(progress.userId);
    const idx = list.findIndex((l) => l.lessonId === progress.lessonId);
    if (idx >= 0) {
      list[idx] = progress;
    } else {
      list.push(progress);
    }
    this.setItem(`lesson_progress_${progress.userId}`, list);
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
    return this.getItem<DBJournalEntry[]>(`journal_${userId}`) || [];
  }

  async saveJournalEntry(entry: DBJournalEntry): Promise<void> {
    const list = await this.getJournalEntries(entry.userId);
    const idx = list.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      list[idx] = entry;
    } else {
      list.push(entry);
    }
    this.setItem(`journal_${entry.userId}`, list);
  }

  async deleteJournalEntry(id: string): Promise<void> {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(`${PREFIX}journal_`));
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const list: DBJournalEntry[] = JSON.parse(raw);
      const filtered = list.filter((e) => e.id !== id);
      localStorage.setItem(k, JSON.stringify(filtered));
    }
  }

  async getPracticeAnswers(userId: string, weekId?: number): Promise<DBPracticeAnswer[]> {
    const all = this.getItem<DBPracticeAnswer[]>(`practice_${userId}`) || [];
    if (weekId !== undefined) {
      return all.filter((a) => a.weekId === weekId);
    }
    return all;
  }

  async savePracticeAnswer(answer: DBPracticeAnswer): Promise<void> {
    const list = await this.getPracticeAnswers(answer.userId);
    const idx = list.findIndex((a) => a.id === answer.id);
    if (idx >= 0) {
      list[idx] = answer;
    } else {
      list.push(answer);
    }
    this.setItem(`practice_${answer.userId}`, list);
  }

  async getPMLabEntries(userId: string): Promise<DBPMLabEntry[]> {
    const map = this.getItem<Record<number, DBPMLabEntry>>(`pmlab_${userId}`) || {};
    return Object.values(map);
  }

  async getPMLabEntry(userId: string, weekId: number): Promise<DBPMLabEntry | null> {
    const map = this.getItem<Record<number, DBPMLabEntry>>(`pmlab_${userId}`) || {};
    return map[weekId] || null;
  }

  async savePMLabEntry(entry: DBPMLabEntry): Promise<void> {
    const map = this.getItem<Record<number, DBPMLabEntry>>(`pmlab_${entry.userId}`) || {};
    map[entry.weekId] = entry;
    this.setItem(`pmlab_${entry.userId}`, map);
  }

  async getPortfolioItems(userId: string): Promise<DBPortfolioItem[]> {
    return this.getItem<DBPortfolioItem[]>(`portfolio_${userId}`) || [];
  }

  async savePortfolioItem(item: DBPortfolioItem): Promise<void> {
    const list = await this.getPortfolioItems(item.userId);
    const idx = list.findIndex((p) => p.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    this.setItem(`portfolio_${item.userId}`, list);
  }

  async getKnowledgeNotes(userId: string): Promise<DBKnowledgeNote[]> {
    return this.getItem<DBKnowledgeNote[]>(`knowledge_${userId}`) || [];
  }

  async saveKnowledgeNote(note: DBKnowledgeNote): Promise<void> {
    const list = await this.getKnowledgeNotes(note.userId);
    const idx = list.findIndex((k) => k.id === note.id);
    if (idx >= 0) {
      list[idx] = note;
    } else {
      list.push(note);
    }
    this.setItem(`knowledge_${note.userId}`, list);
  }

  async deleteKnowledgeNote(id: string): Promise<void> {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(`${PREFIX}knowledge_`));
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const list: DBKnowledgeNote[] = JSON.parse(raw);
      const filtered = list.filter((e) => e.id !== id);
      localStorage.setItem(k, JSON.stringify(filtered));
    }
  }

  async getLinkedInPosts(userId: string): Promise<DBLinkedInPost[]> {
    return this.getItem<DBLinkedInPost[]>(`linkedin_${userId}`) || [];
  }

  async saveLinkedInPost(post: DBLinkedInPost): Promise<void> {
    const list = await this.getLinkedInPosts(post.userId);
    const idx = list.findIndex((l) => l.id === post.id);
    if (idx >= 0) {
      list[idx] = post;
    } else {
      list.push(post);
    }
    this.setItem(`linkedin_${post.userId}`, list);
  }

  async getUserSettings(userId: string): Promise<DBUserSettings | null> {
    return this.getItem<DBUserSettings>(`settings_${userId}`);
  }

  async saveUserSettings(settings: DBUserSettings): Promise<void> {
    this.setItem(`settings_${settings.userId}`, settings);
  }
}
