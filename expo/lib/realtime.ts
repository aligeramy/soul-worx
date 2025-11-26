import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to program reminders in real-time
 */
export function subscribeToProgramReminders(
  programId: string,
  userId: string,
  onUpdate: (payload: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`program-reminders:${programId}:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'program_reminder',
        filter: `programId=eq.${programId}`,
      },
      (payload) => {
        console.log('Reminder update:', payload);
        onUpdate(payload);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to program chat messages in real-time
 */
export function subscribeToProgramChat(
  programId: string,
  onMessage: (payload: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`program-chat:${programId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_message',
        filter: `programId=eq.${programId}`,
      },
      (payload) => {
        console.log('New message:', payload);
        onMessage(payload);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  programId: string,
  userId: string,
  message: string
) {
  const { data, error } = await supabase
    .from('chat_message')
    .insert({
      programId,
      userId,
      message,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get chat messages for a program
 */
export async function getChatMessages(programId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('chat_message')
    .select(`
      *,
      user:userId (
        id,
        name,
        image
      )
    `)
    .eq('programId', programId)
    .order('createdAt', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Unsubscribe from a channel
 */
export function unsubscribe(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}

