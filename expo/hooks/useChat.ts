import { useState, useEffect } from 'react';
import { getChatMessages, sendChatMessage } from '../lib/queries';
import { subscribeToProgramChat, unsubscribe } from '../lib/realtime';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  message: string;
  createdAt: Date;
}

/**
 * Hook for managing program chat with real-time updates
 */
export function useChat(programId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [channelRef, setChannelRef] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!programId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    async function loadAndSubscribe() {
      try {
        // Load existing messages
        const data = await getChatMessages(programId);
        setMessages(data);
        setLoading(false);

        // Subscribe to new messages
        channel = subscribeToProgramChat(programId, async (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            // Refetch to get user details
            const updatedMessages = await getChatMessages(programId);
            setMessages(updatedMessages);
          }
        });

        setChannelRef(channel);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    loadAndSubscribe();

    return () => {
      if (channel) {
        unsubscribe(channel);
      }
    };
  }, [programId]);

  const sendMessage = async (message: string) => {
    if (!programId || !userId || !message.trim()) return;

    try {
      await sendChatMessage(programId, userId, message.trim());
      // Message will appear via Realtime subscription
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}

