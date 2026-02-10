import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { fetchPersonalizedProgramsFromSupabase } from '@/lib/personalized-programs-supabase';
import type { PersonalizedProgram } from '@/lib/types';

interface UsePersonalizedProgramsResult {
  programs: PersonalizedProgram[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePersonalizedPrograms(): UsePersonalizedProgramsResult {
  const { user } = useUser();
  const [programs, setPrograms] = useState<PersonalizedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const list = await fetchPersonalizedProgramsFromSupabase(user.id);
      setPrograms(list);
    } catch (err) {
      console.warn('Failed to load programs:', err);
      setPrograms([]);
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, error, refetch };
}

// Helper to calculate program progress
export function calculateProgramProgress(program: PersonalizedProgram): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total = program.checklistItems.length;
  const completed = program.checklistItems.filter((item) => item.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

// Helper to get next due date
export function getNextDueDate(program: PersonalizedProgram): Date | null {
  const now = new Date();
  const upcomingItems = program.checklistItems
    .filter((item) => !item.completed && new Date(item.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return upcomingItems.length > 0 ? new Date(upcomingItems[0].dueDate) : null;
}

// Helper to check if program has overdue items
export function hasOverdueItems(program: PersonalizedProgram): boolean {
  const now = new Date();
  return program.checklistItems.some(
    (item) => !item.completed && new Date(item.dueDate) < now
  );
}
