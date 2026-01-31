import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePostsByCategory } from '@/hooks/usePosts';
import { LoadingState } from '@/components/LoadingState';
import { OptimizedImage } from '@/components/OptimizedImage';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { formatDate } from '@/lib/format';
import type { PostCategory } from '@/lib/types';

const categoryTitles: Record<PostCategory, string> = {
  poetry: 'Poetry',
  blog: 'Blog',
  news: 'Event Recaps',
  announcements: 'Press & Media',
  tutorials: 'Tutorials',
};

export default function ResourceCategoryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category: string }>();
  const category = params.category as PostCategory;
  const { posts, loading } = usePostsByCategory(category);

  if (loading) {
    return <LoadingState message="Loading..." />;
  }

  const title = categoryTitles[category] || category;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color={SoulworxColors.textTertiary} />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>Check back soon for new content</Text>
          </View>
        ) : (
          <View style={styles.postsList}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postCard}
                onPress={() => router.push({ pathname: '/resources/[category]/[slug]', params: { category, slug: post.slug } })}
                activeOpacity={0.9}
              >
                {post.coverImage ? (
                  <OptimizedImage
                    source={getImageSource(post.coverImage, 'program')}
                    aspectRatio={5 / 5}
                    overlay
                    style={styles.postImage}
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                  style={styles.gradient}
                />
                <View style={styles.postContent}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{title}</Text>
                  </View>
                  <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
                  {post.excerpt && (
                    <Text style={styles.postExcerpt} numberOfLines={2}>
                      {post.excerpt}
                    </Text>
                  )}
                  <View style={styles.postMeta}>
                    {post.publishedAt && (
                      <View style={styles.metaRow}>
                        <Ionicons name="calendar-outline" size={14} color={SoulworxColors.white} />
                      <Text style={styles.postDate}>{formatDate(post.publishedAt)}</Text>
                      </View>
                    )}
                    {post.readTime && (
                      <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={14} color={SoulworxColors.white} />
                      <Text style={styles.postReadTime}>{post.readTime} min read</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: SoulworxColors.charcoal,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  postsList: {
    gap: Spacing.md,
  },
  postCard: {
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.charcoal,
    overflow: 'hidden',
    ...Shadows.medium,
    minHeight: 320,
  },
  postImage: {
    width: '100%',
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 5 / 5,
    backgroundColor: SoulworxColors.darkBeige,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  postContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    zIndex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: SoulworxColors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  categoryBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  postTitle: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  postExcerpt: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
    lineHeight: Typography.base * 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  postDate: {
    fontSize: Typography.sm,
    color: SoulworxColors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  postReadTime: {
    fontSize: Typography.sm,
    color: SoulworxColors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
});

