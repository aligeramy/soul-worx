import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useJournalEntries } from '@/hooks/useJournal';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { formatDate, formatDayMonth } from '@/lib/format';
import { JournalEntry } from '@/lib/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = Spacing.lg * 2;
const CARD_PADDING = Spacing.lg * 2;
const TIMELINE_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING - CARD_PADDING;
const DOT_SIZE = 20;
const TIMELINE_HEIGHT = 200;

interface TimelineDot {
  entry: JournalEntry;
  x: number;
  date: Date;
}

export default function JournalTimelineScreen() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { user } = useUser();
  const { entries, loading } = useJournalEntries(user?.id || null);

  // Calculate timeline dots
  const timelineData = useMemo(() => {
    if (!entries || entries.length === 0) {
      return { dots: [], minDate: new Date(), maxDate: new Date(), stats: null };
    }

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const minDate = new Date(sortedEntries[0].createdAt);
    const maxDate = new Date(sortedEntries[sortedEntries.length - 1].createdAt);
    
    // Calculate time range with padding
    const timeRange = maxDate.getTime() - minDate.getTime();
    const padding = timeRange > 0 ? timeRange * 0.1 : 7 * 24 * 60 * 60 * 1000; // 10% padding or 7 days
    const extendedMin = new Date(minDate.getTime() - padding);
    const extendedMax = new Date(maxDate.getTime() + padding);
    const totalRange = extendedMax.getTime() - extendedMin.getTime();

    // Calculate stats
    const aiCount = sortedEntries.filter(e => e.isAiGenerated).length;
    const moodCounts: Record<string, number> = {};
    sortedEntries.forEach(e => {
      if (e.mood) {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      }
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const dots: TimelineDot[] = sortedEntries.map((entry) => {
      const entryDate = new Date(entry.createdAt);
      const position = totalRange > 0 
        ? (entryDate.getTime() - extendedMin.getTime()) / totalRange 
        : 0.5;
      const x = position * TIMELINE_WIDTH;

      return {
        entry,
        x: Math.max(DOT_SIZE / 2, Math.min(x, TIMELINE_WIDTH - DOT_SIZE / 2)),
        date: entryDate,
      };
    });

    return { 
      dots, 
      minDate: extendedMin, 
      maxDate: extendedMax,
      stats: {
        total: sortedEntries.length,
        aiCount,
        topMood,
        firstEntry: sortedEntries[0].createdAt,
        lastEntry: sortedEntries[sortedEntries.length - 1].createdAt,
      }
    };
  }, [entries]);

  // Generate smart date markers
  const dateMarkers = useMemo(() => {
    if (!timelineData.dots.length) return [];

    const markers: Array<{ x: number; label: string; isMajor: boolean }> = [];
    const totalRange = timelineData.maxDate.getTime() - timelineData.minDate.getTime();
    
    // Add start and end markers
    markers.push({
      x: 0,
      label: formatDayMonth(timelineData.minDate),
      isMajor: true,
    });

    // Add a few evenly spaced markers in between
    const numMarkers = Math.min(5, timelineData.dots.length + 1);
    for (let i = 1; i < numMarkers; i++) {
      const position = i / numMarkers;
      const date = new Date(timelineData.minDate.getTime() + totalRange * position);
      const x = position * TIMELINE_WIDTH;
      
      markers.push({
        x: Math.max(30, Math.min(x, TIMELINE_WIDTH - 30)),
        label: formatDayMonth(date),
        isMajor: i === Math.floor(numMarkers / 2),
      });
    }

    markers.push({
      x: TIMELINE_WIDTH,
      label: formatDayMonth(timelineData.maxDate),
      isMajor: true,
    });

    return markers.sort((a, b) => a.x - b.x);
  }, [timelineData]);

  if (loading) {
    return <LoadingState message="Loading timeline..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Timeline</Text>
          <Text style={styles.headerSubtitle}>{entries.length} entries</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
      >
        {timelineData.dots.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={64} color={SoulworxColors.textTertiary} />
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first journal entry to see it on the timeline
            </Text>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            {/* Stats Card */}
            {timelineData.stats && (
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{timelineData.stats.total}</Text>
                  <Text style={styles.statLabel}>Entries</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{timelineData.stats.aiCount}</Text>
                  <Text style={styles.statLabel}>AI Enhanced</Text>
                </View>
                {timelineData.stats.topMood && (
                  <>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{timelineData.stats.topMood}</Text>
                      <Text style={styles.statLabel}>Top Mood</Text>
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Timeline Card */}
            <View style={styles.timelineCard}>
              {/* Date Markers */}
              <View style={styles.markersRow}>
                {dateMarkers.map((marker, index) => (
                  <View
                    key={index}
                    style={[styles.markerWrapper, { left: marker.x - 30 }]}
                  >
                    <View style={[styles.markerDot, marker.isMajor && styles.markerDotMajor]} />
                    <Text 
                      style={[styles.markerText, marker.isMajor && styles.markerTextMajor]} 
                      numberOfLines={1}
                    >
                      {marker.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Timeline Line and Dots */}
              <View style={styles.timelineWrapper}>
                {/* Main timeline line */}
                <View style={styles.timelineLine}>
                  <LinearGradient
                    colors={[
                      SoulworxColors.accent + '30',
                      SoulworxColors.gold + '50',
                      SoulworxColors.accent + '30'
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.timelineGradient}
                  />
                </View>

                {/* Dots */}
                {timelineData.dots.map((dot, index) => {
                  const isFirst = index === 0;
                  const isLast = index === timelineData.dots.length - 1;
                  const nextDot = !isLast ? timelineData.dots[index + 1] : null;
                  
                  return (
                    <React.Fragment key={dot.entry.id}>
                      {/* Connecting line to next dot */}
                      {nextDot && (
                        <View
                          style={[
                            styles.connectorLine,
                            {
                              left: dot.x,
                              width: Math.max(0, nextDot.x - dot.x),
                            },
                          ]}
                        />
                      )}
                      
                      {/* Entry dot */}
                      <TouchableOpacity
                        style={[
                          styles.entryDot,
                          {
                            left: dot.x - DOT_SIZE / 2,
                          },
                          dot.entry.isAiGenerated && styles.entryDotAi,
                        ]}
                        onPress={() =>
                          router.push({ pathname: '/journal/[id]', params: { id: dot.entry.id } })
                        }
                        activeOpacity={0.8}
                      >
                        {dot.entry.isAiGenerated ? (
                          <Ionicons name="sparkles" size={14} color={SoulworxColors.white} />
                        ) : (
                          <View style={styles.dotCenter} />
                        )}
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>

            {/* Entry Cards */}
            <View style={styles.entriesList}>
              {timelineData.dots.map((dot) => (
                <TouchableOpacity
                  key={dot.entry.id}
                  style={styles.entryCard}
                  onPress={() =>
                    router.push({ pathname: '/journal/[id]', params: { id: dot.entry.id } })
                  }
                  activeOpacity={0.9}
                >
                  <View style={styles.entryCardHeader}>
                    <Text style={styles.entryCardTitle} numberOfLines={1}>
                      {dot.entry.title || 'Untitled Entry'}
                    </Text>
                    {dot.entry.isAiGenerated && (
                      <View style={styles.aiBadge}>
                        <Ionicons name="sparkles" size={12} color={SoulworxColors.gold} />
                        <Text style={styles.aiBadgeText}>AI</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.entryCardDate}>{formatDate(dot.date)}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
    paddingHorizontal: Spacing.lg,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: SoulworxColors.white,
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
  timelineContainer: {
    marginTop: Spacing.lg,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Shadows.small,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.accent,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: SoulworxColors.border,
  },
  timelineCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    minHeight: TIMELINE_HEIGHT,
    ...Shadows.small,
  },
  markersRow: {
    position: 'relative',
    height: 50,
    marginBottom: Spacing.md,
  },
  markerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: 60,
  },
  markerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: SoulworxColors.border,
    marginBottom: 6,
  },
  markerDotMajor: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SoulworxColors.accent,
  },
  markerText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
    textAlign: 'center',
  },
  markerTextMajor: {
    fontWeight: Typography.bold,
    color: SoulworxColors.textSecondary,
  },
  timelineWrapper: {
    position: 'relative',
    height: 100,
    marginTop: Spacing.md,
  },
  timelineLine: {
    position: 'absolute',
    left: 0,
    top: 50 - 2,
    width: TIMELINE_WIDTH,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  timelineGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  connectorLine: {
    position: 'absolute',
    top: 50 - 1,
    height: 2,
    backgroundColor: SoulworxColors.accent + '50',
  },
  entryDot: {
    position: 'absolute',
    top: 50 - DOT_SIZE / 2,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: SoulworxColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: SoulworxColors.white,
    zIndex: 10,
    ...Shadows.medium,
  },
  dotCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SoulworxColors.white,
  },
  entryDotAi: {
    backgroundColor: SoulworxColors.gold,
  },
  entriesList: {
    gap: Spacing.md,
  },
  entryCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  entryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  entryCardTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
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
  entryCardDate: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
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
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: SoulworxColors.white,
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
