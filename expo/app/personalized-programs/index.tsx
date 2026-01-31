import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiGet } from '@/lib/api-client';
import { format } from 'date-fns';

interface PersonalizedProgram {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  trainingDays: string[];
  startDate: string;
  endDate: string;
  checklistItems: {
    id: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export default function PersonalizedProgramsListScreen() {
  const insets = useSafeAreaInsets();
  const { user, tier } = useUser();
  const [programs, setPrograms] = useState<PersonalizedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPrograms = useCallback(async () => {
    try {
      const data = await apiGet<{ programs: PersonalizedProgram[] }>(`/api/personalized-programs?userId=${user?.id}`);
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (tier?.level !== 'pro_plus') {
      router.replace('/(tabs)/programs');
      return;
    }
    loadPrograms();
  }, [tier, loadPrograms]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPrograms();
  }, [loadPrograms]);

  const handleProgramPress = useCallback((programId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/personalized-programs/${programId}` as any);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.gold} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SoulworxColors.gold} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Your Personal Programs</Text>
      </View>

      {/* Programs List */}
      {programs.length > 0 ? (
        <View style={styles.programsContainer}>
          {programs.map((program) => {
            const completedCount = program.checklistItems.filter((item) => item.completed).length;
            const totalCount = program.checklistItems.length;
            const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            // Find next due date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextDue = program.checklistItems.find((item) => {
              if (item.completed) return false;
              const dueDate = new Date(item.dueDate);
              dueDate.setHours(0, 0, 0, 0);
              return dueDate >= today;
            });

            return (
              <Pressable
                key={program.id}
                style={styles.programCard}
                onPress={() => router.push(`/personalized-programs/${program.id}` as any)}
              >
                {program.thumbnailUrl && (
                  <Image
                    source={{ uri: program.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.programContent}>
                  <Text style={styles.programTitle}>{program.title}</Text>
                  <Text style={styles.programDescription} numberOfLines={2}>
                    {program.description}
                  </Text>

                  {/* Progress */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressText}>
                        {completedCount} / {totalCount}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
                    </View>
                  </View>

                  {/* Training Days */}
                  {program.trainingDays && program.trainingDays.length > 0 && (
                    <View style={styles.trainingDaysContainer}>
                      {program.trainingDays.slice(0, 3).map((day, index) => (
                        <View key={index} style={styles.dayBadge}>
                          <Text style={styles.dayBadgeText}>{day.slice(0, 3)}</Text>
                        </View>
                      ))}
                      {program.trainingDays.length > 3 && (
                        <View style={styles.dayBadge}>
                          <Text style={styles.dayBadgeText}>+{program.trainingDays.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Next Due Date */}
                  {nextDue ? (
                    <View style={styles.nextDueContainer}>
                      <View style={styles.nextDueBadge}>
                        <Ionicons name="time" size={14} color={SoulworxColors.white} />
                        <Text style={styles.nextDueText}>
                          Next: {format(new Date(nextDue.dueDate), "MMM d")}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.completedContainer}>
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={SoulworxColors.white} />
                        <Text style={styles.completedText}>All workouts completed!</Text>
                      </View>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="basketball-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyTitle}>No Programs Yet</Text>
          <Text style={styles.emptyDescription}>
            Your personalized training programs will appear here once they're created
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
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  programsContainer: {
    gap: Spacing.md,
  },
  programCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  programCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  thumbnail: {
    width: 120,
    height: '100%',
    backgroundColor: SoulworxColors.darkBeige,
  },
  programContent: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  programTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  programDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  progressText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  progressBar: {
    height: 4,
    backgroundColor: SoulworxColors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SoulworxColors.success,
  },
  trainingDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  dayBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: SoulworxColors.beige,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  dayBadgeText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  nextDueContainer: {
    marginTop: Spacing.sm,
  },
  nextDueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  nextDueText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  completedContainer: {
    marginTop: Spacing.sm,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: SoulworxColors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
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
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
