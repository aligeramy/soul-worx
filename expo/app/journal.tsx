import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useJournalEntries } from '@/hooks/useJournal';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { formatDateTime } from '@/lib/format';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { user } = useUser();
  const { entries, loading, refetch } = useJournalEntries(user?.id || null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Refetch when screen comes into focus (only once per focus)
  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetch();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingState message="Loading journal..." />;
  }

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.createdAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Journal</Text>
          <Text style={styles.headerSubtitle}>Reflect on your journey</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Spacing.lg, paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SoulworxColors.gold} />
        }
      >

        {/* New Entry Button */}
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => router.push('/journal/new')}
          activeOpacity={0.9}
        >
          <Ionicons name="add-circle" size={24} color={SoulworxColors.white} />
          <Text style={styles.newEntryButtonText}>New Entry</Text>
        </TouchableOpacity>

        {/* Entries List */}
        {sortedDates.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="journal-outline" size={64} color={SoulworxColors.textTertiary} />
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptyDescription}>
              Start your journaling journey by creating your first entry
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/journal/new')}
            >
              <Text style={styles.emptyButtonText}>Create First Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.entriesContainer}>
            {sortedDates.map((date) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{date}</Text>
                {groupedEntries[date].map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    style={styles.entryCard}
                    onPress={() => router.push({ pathname: '/journal/[id]', params: { id: entry.id } })}
                    activeOpacity={0.9}
                  >
                    <View style={styles.entryHeader}>
                      {entry.title ? (
                        <Text style={styles.entryTitle} numberOfLines={1}>
                          {entry.title}
                        </Text>
                      ) : (
                        <Text style={styles.entryTitlePlaceholder} numberOfLines={1}>
                          Untitled Entry
                        </Text>
                      )}
                      {entry.isAiGenerated && (
                        <View style={styles.aiBadge}>
                          <Ionicons name="sparkles" size={12} color={SoulworxColors.gold} />
                          <Text style={styles.aiBadgeText}>AI</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.entryPreview} numberOfLines={3}>
                      {entry.content}
                    </Text>
                    <View style={styles.entryFooter}>
                      <Text style={styles.entryTime}>
                        {formatDateTime(entry.createdAt)}
                      </Text>
                      {entry.mood && (
                        <View style={styles.moodBadge}>
                          <Text style={styles.moodText}>{entry.mood}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.bottomBarButton, pathname === '/journal' && styles.bottomBarButtonActive]}
          onPress={() => router.push('/journal')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="list"
            size={24}
            color={pathname === '/journal' ? SoulworxColors.gold : SoulworxColors.textTertiary}
          />
          <Text
            style={[
              styles.bottomBarLabel,
              pathname === '/journal' && styles.bottomBarLabelActive,
            ]}
          >
            Entries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomBarButton, pathname === '/journal/timeline' && styles.bottomBarButtonActive]}
          onPress={() => router.push('/journal/timeline')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="stats-chart"
            size={24}
            color={pathname === '/journal/timeline' ? SoulworxColors.gold : SoulworxColors.textTertiary}
          />
          <Text
            style={[
              styles.bottomBarLabel,
              pathname === '/journal/timeline' && styles.bottomBarLabelActive,
            ]}
          >
            Timeline
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  headerBar: {
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginTop: 2,
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.adminDarkBrown,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  newEntryButtonText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  entriesContainer: {
    gap: Spacing.xl,
  },
  dateGroup: {
    marginBottom: Spacing.lg,
  },
  dateHeader: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  entryCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  entryTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    flex: 1,
  },
  entryTitlePlaceholder: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textTertiary,
    fontStyle: 'italic',
    flex: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: SoulworxColors.darkBeige,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  aiBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  entryPreview: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    lineHeight: Typography.base * 1.5,
    marginBottom: Spacing.md,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryTime: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
  },
  moodBadge: {
    backgroundColor: SoulworxColors.darkBeige,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  moodText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
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
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: SoulworxColors.charcoal,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
    paddingTop: Spacing.sm,
    ...Shadows.medium,
  },
  bottomBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  bottomBarButtonActive: {
    // Active state styling handled by icon/label colors
  },
  bottomBarLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textTertiary,
  },
  bottomBarLabelActive: {
    color: SoulworxColors.gold,
  },
});

