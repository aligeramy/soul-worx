import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/types';

export default function AdminStoriesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [stories, setStories] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadStories();
  }, [user]);

  const loadStories = async () => {
    try {
      const { data, error } = await supabase
        .from('post')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStories();
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'poetry':
        return SoulworxColors.accent;
      case 'news':
        return SoulworxColors.info;
      case 'blog':
        return SoulworxColors.success;
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
        <Text style={styles.headerTitle}>Stories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/admin/stories/new' as any)}
        >
          <Ionicons name="add" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      {/* Stories List */}
      {stories.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyText}>No stories yet</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/admin/stories/new' as any)}
          >
            <Text style={styles.emptyButtonText}>Create First Story</Text>
          </TouchableOpacity>
        </View>
      ) : (
        stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyCard}
            onPress={() => router.push(`/admin/stories/${story.id}` as any)}
          >
            <View style={styles.storyContent}>
              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                {story.excerpt && (
                  <Text style={styles.storyExcerpt} numberOfLines={2}>
                    {story.excerpt}
                  </Text>
                )}
              </View>
              <View style={styles.storyMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(story.status) }]}>
                  <Text style={styles.statusText}>{story.status}</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(story.category) }]}>
                  <Text style={styles.categoryText}>{story.category}</Text>
                </View>
                <View style={styles.stats}>
                  <Ionicons name="eye" size={14} color={SoulworxColors.textSecondary} />
                  <Text style={styles.statsText}>{story.viewCount}</Text>
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
  storyCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.small,
  },
  storyContent: {
    flex: 1,
  },
  storyInfo: {
    marginBottom: Spacing.sm,
  },
  storyTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: 4,
  },
  storyExcerpt: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  storyMeta: {
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
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
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
