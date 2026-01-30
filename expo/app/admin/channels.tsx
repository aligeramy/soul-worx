import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { supabase } from '@/lib/supabase';
import type { CommunityChannel } from '@/lib/types';

export default function AdminChannelsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadChannels();
  }, [user]);

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('community_channel')
        .select('*')
        .order('sortOrder', { ascending: true })
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChannels();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return SoulworxColors.success;
      case 'draft':
        return SoulworxColors.warning;
      case 'archived':
        return SoulworxColors.textTertiary;
      default:
        return SoulworxColors.textSecondary;
    }
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
        <Text style={styles.headerTitle}>Channels</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/admin/channels/new' as any)}
        >
          <Ionicons name="add" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      {/* Channels List */}
      {channels.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="tv-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyText}>No channels yet</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/admin/channels/new' as any)}
          >
            <Text style={styles.emptyButtonText}>Create First Channel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        channels.map((channel) => (
          <TouchableOpacity
            key={channel.id}
            style={styles.channelCard}
            onPress={() => router.push(`/admin/channels/${channel.id}` as any)}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={getImageSource(channel.thumbnailImage, 'channel')}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            </View>
            <View style={styles.channelContent}>
              <View style={styles.channelInfo}>
                <Text style={styles.channelTitle}>{channel.title}</Text>
                <Text style={styles.channelSlug}>{channel.slug}</Text>
                <Text style={styles.channelDescription} numberOfLines={2}>
                  {channel.description}
                </Text>
              </View>
              <View style={styles.channelMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(channel.status) }]}>
                  <Text style={styles.statusText}>{channel.status}</Text>
                </View>
                <View style={styles.videoCount}>
                  <Ionicons name="videocam" size={14} color={SoulworxColors.textSecondary} />
                  <Text style={styles.videoCountText}>{channel.videoCount}</Text>
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
  channelCard: {
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
  channelContent: {
    flex: 1,
  },
  channelInfo: {
    marginBottom: Spacing.sm,
  },
  channelTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: 4,
  },
  channelSlug: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.6,
    marginBottom: Spacing.xs,
  },
  channelDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  channelMeta: {
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
  videoCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoCountText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
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
