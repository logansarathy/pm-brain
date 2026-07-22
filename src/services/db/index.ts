/**
 * PURPOSE:
 * Database Service Entrypoint for PM OS.
 *
 * RESPONSIBILITY:
 * Exports the default database driver instance (`dbService`).
 * Automatically selects `LocalStorageAdapter` unless Supabase environment variables are provided.
 *
 * WHEN TO EDIT THIS FILE:
 * - When changing the default adapter selection strategy.
 *
 * WHEN NOT TO EDIT THIS FILE:
 * - When modifying data models or UI components.
 */

import { LocalStorageAdapter } from './localStorageAdapter';
import { SupabaseAdapter } from './supabaseAdapter';
import { IDatabaseService } from './types';

const useSupabase = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export const dbService: IDatabaseService = useSupabase
  ? new SupabaseAdapter()
  : new LocalStorageAdapter();

export * from './types';
