import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { supabase } from '@/lib/supabase';
import type { Video, CommunityChannel } from '@/lib/types';

interface VideoWithChannel extends Video {
  channel: CommunityChannel;
}

export default function AdminVideosScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [videos, setVideos] = useState<VideoWithChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadVideos();
  }, [user]);

  const loadVideos = async () => {
    try {
      const { data: videosData, error: videosError } = await supabase
        .from('video')
        .select('*')
        .order('channelId', { ascending: true })
        .order('seasonNumber', { ascending: true })
        .order('episodeNumber', { ascending: true });

      if (videosError) throw videosError;

      // Load channel info for each video
      const videosWithChannels = await Promise.all(
        (videosData || []).map(async (video) => {
          const { data: channelData } = await supabase
            .from('community_channel')
            .select('*')
            .eq('id', video.channelId)
            .single();

          return {
            ...video,
            channel: channelData || null,
          } as VideoWithChannel;
        })
      );

      setVideos(videosWithChannels);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return SoulworxColors.success;
      case 'unlisted':
        return SoulworxColors.info;
      case 'draft':
        return SoulworxColors.warning;
      case 'archived':
        return SoulworxColors.textTertiary;
      default:
        return SoulworxColors.textSecondary;
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Videos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/admin/videos/new' as any)}
        >
          <Ionicons name="add" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      {/* Videos List */}
      {videos.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="videocam-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyText}>No videos yet</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/admin/videos/new' as any)}
          >
            <Text style={styles.emptyButtonText}>Create First Video</Text>
          </TouchableOpacity>
        </View>
      ) : (
        videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => router.push(`/admin/videos/${video.id}` as any)}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={getImageSource(video.thumbnailUrl, 'video')}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            </View>
            <View style={styles.videoContent}>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoChannel}>
                  {video.channel?.title || 'Unknown Channel'}
                </Text>
                {video.episodeNumber && (
                  <Text style={styles.videoEpisode}>
                    S{video.seasonNumber}E{video.episodeNumber}
                  </Text>
                )}
              </View>
              <View style={styles.videoMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(video.status) }]}>
                  <Text style={styles.statusText}>{video.status}</Text>
                </View>
                <View style={styles.stats}>
                  <Ionicons name="eye" size={14} color={SoulworxColors.textSecondary} />
                  <Text style={styles.statsText}>{video.viewCount}</Text>
                  {video.duration ? (
                    <>
                      <Text style={styles.statsSeparator}>•</Text>
                      <Text style={styles.statsText}>{formatDuration(video.duration)}</Text>
                    </>
                  ) : null}
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  videoCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.md,
    ...Shadows.small,
  },
  thumbnailContainer: {
    width: 100,
    flexShrink: 0,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: SoulworxColors.darkBeige,
    position: 'relative',
  },
  videoContent: {
    flex: 1,
  },
  videoInfo: {
    marginBottom: Spacing.sm,
  },
  videoTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: 4,
  },
  videoChannel: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
    marginBottom: 2,
  },
  videoEpisode: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    opacity: 0.6,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  statsSeparator: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    opacity: 0.5,
    marginHorizontal: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: Typography.xl,
    color: SoulworxColors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
