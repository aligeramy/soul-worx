import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChannels } from '@/hooks/useChannels';
import { useUser } from '@/contexts/UserContext';
import { HeroCard } from '@/components/HeroCard';
import { LoadingState } from '@/components/LoadingState';
import { LockOverlay } from '@/components/LockOverlay';
import { SoulworxColors, Spacing, Typography } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { canAccessChannel } from '@/lib/access';

export default function ChannelsScreen() {
  const insets = useSafeAreaInsets();
  const { accessLevel } = useUser();
  const { channels, loading, refetch } = useChannels();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingState message="Loading channels..." />;
  }

  // Separate accessible and locked channels
  const accessibleChannels = channels.filter(c => canAccessChannel(c, accessLevel));
  const lockedChannels = channels.filter(c => !canAccessChannel(c, accessLevel));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SoulworxColors.gold} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Channels</Text>
        <Text style={styles.headerSubtitle}>Video content hub</Text>
      </View>

      {/* Accessible Channels */}
      {accessibleChannels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available</Text>
          <View style={styles.grid}>
            {accessibleChannels.map((channel) => (
              <HeroCard
                key={channel.id}
                image={getImageSource(channel.coverImage, 'channel')}
                title={channel.title}
                description={channel.description}
                badge={`${channel.videoCount} videos`}
                onPress={() => router.push({ pathname: '/channel/[slug]', params: { slug: channel.slug } })}
                style={styles.card}
              />
            ))}
          </View>
        </View>
      )}

      {/* Locked Channels */}
      {lockedChannels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Content</Text>
          <View style={styles.grid}>
            {lockedChannels.map((channel) => (
              <View key={channel.id} style={styles.lockedCard}>
                <HeroCard
                  image={getImageSource(channel.coverImage, 'channel')}
                  title={channel.title}
                  description={channel.description}
                  badge={`${channel.videoCount} videos`}
                  style={styles.card}
                />
                <LockOverlay requiredTier={channel.requiredTierLevel} />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Empty state */}
      {channels.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Channels Available</Text>
          <Text style={styles.emptyDescription}>
            Check back soon for new video content
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  grid: {
    gap: Spacing.sm,
  },
  card: {
    marginBottom: Spacing.sm,
  },
  lockedCard: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
});

