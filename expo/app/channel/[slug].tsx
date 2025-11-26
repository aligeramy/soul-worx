import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useChannel, useVideos } from '@/hooks/useChannels';
import { useUser } from '@/contexts/UserContext';
import { OptimizedImage } from '@/components/OptimizedImage';
import { VideoListItem } from '@/components/VideoListItem';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { canAccessVideo } from '@/lib/access';

export default function ChannelDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = params.slug;
  const { accessLevel } = useUser();
  const { channel, loading: channelLoading } = useChannel(slug);
  const { videos, loading: videosLoading } = useVideos(channel?.id || null);

  if (channelLoading || videosLoading) {
    return <LoadingState message="Loading channel..." />;
  }

  if (!channel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Channel not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <OptimizedImage
            source={getImageSource(channel.coverImage, 'channel')}
            aspectRatio={5 / 5}
            rounded={false}
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButtonFloat, { top: insets.top + Spacing.sm }]}
          >
            <Ionicons name="arrow-back" size={24} color={SoulworxColors.white} />
          </TouchableOpacity>
          
          {/* Title Overlay */}
          <View style={styles.heroOverlay}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{channel.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{channel.title}</Text>
            <Text style={styles.heroDescription} numberOfLines={2}>
              {channel.description}
            </Text>
            <View style={styles.heroBadge}>
              <Ionicons name="play-circle" size={14} color={SoulworxColors.white} />
              <Text style={styles.heroBadgeText}>{channel.videoCount} videos</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Videos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Videos</Text>
            {videos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="videocam-outline" size={48} color={SoulworxColors.textTertiary} />
                <Text style={styles.emptyText}>No videos available yet</Text>
              </View>
            ) : (
              <View style={styles.videosList}>
                {videos.map((video) => {
                  const hasAccess = canAccessVideo(video, accessLevel);
                  
                  return (
                    <VideoListItem
                      key={video.id}
                      image={getImageSource(video.thumbnailUrl, 'video')}
                      title={video.title || 'Untitled Video'}
                      duration={video.duration || undefined}
                      episodeNumber={video.episodeNumber || undefined}
                      locked={!hasAccess}
                      requiredTier={video.requiredTierLevel || 1}
                      onPress={() => hasAccess && router.push({ pathname: '/video/[id]', params: { id: video.id } })}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  heroContainer: {
    position: 'relative',
    minHeight: 400,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButtonFloat: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    lineHeight: Typography['4xl'] * 1.2,
  },
  heroDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.95,
    marginBottom: Spacing.sm,
    lineHeight: Typography.base * 1.5,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  videosList: {
    gap: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.lg,
    color: SoulworxColors.textSecondary,
  },
  retryButton: {
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  retryText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
