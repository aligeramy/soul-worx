import { useState, useEffect } from 'react';
import { getChannels, getChannelBySlug, getVideosByChannel } from '../lib/queries';
import type { CommunityChannel, Video } from '../lib/types';

/**
 * Fetch all published channels
 */
export function useChannels() {
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const data = await getChannels();
      setChannels(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return { channels, loading, error, refetch: fetchChannels };
}

/**
 * Fetch channel by slug
 */
export function useChannel(slug: string | null) {
  const [channel, setChannel] = useState<CommunityChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannel = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getChannelBySlug(slug);
      setChannel(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [slug]);

  return { channel, loading, error, refetch: fetchChannel };
}

/**
 * Fetch videos for a channel
 */
export function useVideos(channelId: string | null) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVideos = async () => {
    if (!channelId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getVideosByChannel(channelId);
      setVideos(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [channelId]);

  return { videos, loading, error, refetch: fetchVideos };
}

