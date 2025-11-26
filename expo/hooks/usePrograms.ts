import { useState, useEffect } from 'react';
import { getPrograms, getProgramById, getUserRsvps, getUpcomingUserRsvps } from '../lib/queries';
import type { Program, ProgramWithEvents, RsvpWithDetails } from '../lib/types';

/**
 * Fetch all published programs
 */
export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await getPrograms();
      setPrograms(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return { programs, loading, error, refetch: fetchPrograms };
}

/**
 * Fetch program details by ID
 */
export function useProgramDetails(id: string | null | undefined) {
  const [program, setProgram] = useState<ProgramWithEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgram = async () => {
    if (!id) {
      console.log('[useProgramDetails] No ID provided');
      setLoading(false);
      return;
    }

    try {
      console.log('[useProgramDetails] Fetching program:', id);
      setLoading(true);
      const data = await getProgramById(id);
      console.log('[useProgramDetails] Received data:', data ? 'Found' : 'Not found');
      setProgram(data);
      setError(null);
    } catch (err) {
      console.error('[useProgramDetails] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgram();
  }, [id]);

  return { program, loading, error, refetch: fetchProgram };
}

/**
 * Fetch user's RSVPs
 */
export function useUserRsvps(userId: string | null) {
  const [rsvps, setRsvps] = useState<RsvpWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRsvps = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserRsvps(userId);
      setRsvps(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, [userId]);

  return { rsvps, loading, error, refetch: fetchRsvps };
}

/**
 * Fetch user's upcoming RSVPs
 */
export function useUpcomingRsvps(userId: string | null) {
  const [rsvps, setRsvps] = useState<RsvpWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRsvps = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUpcomingUserRsvps(userId);
      setRsvps(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, [userId]);

  return { rsvps, loading, error, refetch: fetchRsvps };
}

