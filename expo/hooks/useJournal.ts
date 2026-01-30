import { useState, useEffect, useCallback } from 'react';
import {
  getJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../lib/queries';
import type { JournalEntry } from '../lib/types';

/**
 * Fetch user's journal entries
 */
export function useJournalEntries(userId: string | null) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getJournalEntries(userId);
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, error, refetch: fetchEntries };
}

/**
 * Fetch single journal entry
 */
export function useJournalEntry(id: string | null) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntry = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getJournalEntryById(id);
      setEntry(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, [id]);

  return { entry, loading, error, refetch: fetchEntry };
}

/**
 * Hook for journal entry operations
 */
export function useJournalOperations(userId: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addEntry = async (
    content: string,
    options: {
      title: string;
      mood?: string;
      tags?: string[];
      isAiGenerated?: boolean;
      aiPrompt?: string;
    }
  ): Promise<JournalEntry | null> => {
    if (!userId) return null;

    try {
      setLoading(true);
      setError(null);
      const entry = await createJournalEntry(userId, content, options);
      return entry;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (
    id: string,
    updates: {
      title: string;
      content: string;
      mood?: string;
      tags?: string[];
    }
  ): Promise<JournalEntry | null> => {
    try {
      setLoading(true);
      setError(null);
      const entry = await updateJournalEntry(id, updates);
      return entry;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeEntry = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteJournalEntry(id);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addEntry, updateEntry, removeEntry, loading, error };
}

