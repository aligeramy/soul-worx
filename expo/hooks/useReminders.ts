import { useState, useEffect } from 'react';
import { getProgramReminders, createProgramReminder, toggleReminderCompletion, deleteProgramReminder } from '../lib/queries';
import type { ProgramReminder } from '../lib/types';

/**
 * Fetch and manage program reminders
 */
export function useReminders(programId: string | null, userId: string | null) {
  const [reminders, setReminders] = useState<ProgramReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReminders = async () => {
    if (!programId || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getProgramReminders(programId, userId);
      setReminders(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [programId, userId]);

  const addReminder = async (task: string) => {
    if (!programId || !userId) return;

    try {
      const newReminder = await createProgramReminder(programId, userId, task);
      setReminders([...reminders, newReminder]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const toggleReminder = async (reminderId: string, completed: boolean) => {
    try {
      await toggleReminderCompletion(reminderId, completed);
      setReminders(
        reminders.map((r) =>
          r.id === reminderId ? { ...r, completed } : r
        )
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      await deleteProgramReminder(reminderId);
      setReminders(reminders.filter((r) => r.id !== reminderId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    reminders,
    loading,
    error,
    refetch: fetchReminders,
    addReminder,
    toggleReminder,
    deleteReminder,
  };
}

