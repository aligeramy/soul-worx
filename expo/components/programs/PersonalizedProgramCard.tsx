import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isAfter, startOfDay } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import type { PersonalizedProgram } from '@/lib/types';
import { calculateProgramProgress, getNextDueDate, hasOverdueItems } from '@/hooks/usePersonalizedPrograms';
import { ProgressCircle } from './ProgressCircle';

interface PersonalizedProgramCardProps {
  program: PersonalizedProgram;
  onPress: () => void;
}

export function PersonalizedProgramCard({ program, onPress }: PersonalizedProgramCardProps) {
  const { completed, total, percentage } = calculateProgramProgress(program);
  const nextDueDate = getNextDueDate(program);
  const isOverdue = hasOverdueItems(program);
  const isCompleted = program.status === 'completed' || percentage === 100;
  const isPaused = program.status === 'paused';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={handlePress}
    >
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>{program.title}</Text>
              {(isCompleted || isPaused) && (
                <View style={[styles.statusBadge, isCompleted ? styles.completedBadge : styles.pausedBadge]}>
                  <Text style={styles.statusBadgeText}>
                    {isCompleted ? 'Completed' : 'Paused'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.description} numberOfLines={2}>{program.description}</Text>
          </View>
          <ProgressCircle percentage={percentage} size={50} strokeWidth={4} />
        </View>

        {/* Training Days */}
        {program.trainingDays && program.trainingDays.length > 0 && (
          <View style={styles.trainingDays}>
            {program.trainingDays.slice(0, 4).map((day, index) => (
              <View key={index} style={styles.dayChip}>
                <Text style={styles.dayChipText}>{day.slice(0, 3)}</Text>
              </View>
            ))}
            {program.trainingDays.length > 4 && (
              <View style={styles.dayChip}>
                <Text style={styles.dayChipText}>+{program.trainingDays.length - 4}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.progressInfo}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={percentage === 100 ? SoulworxColors.success : SoulworxColors.textSecondary}
            />
            <Text style={styles.progressText}>
              {completed} / {total} workouts
            </Text>
          </View>

          {/* Next due date or overdue indicator */}
          {isOverdue ? (
            <View style={styles.overdueBadge}>
              <Ionicons name="alert-circle" size={14} color={SoulworxColors.error} />
              <Text style={styles.overdueText}>Overdue</Text>
            </View>
          ) : nextDueDate ? (
            <View style={styles.dueDateContainer}>
              <Ionicons name="calendar-outline" size={14} color={SoulworxColors.textSecondary} />
              <Text style={styles.dueDateText}>
                Next: {format(nextDueDate, 'MMM d')}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Date range */}
        <View style={styles.dateRange}>
          <Text style={styles.dateRangeText}>
            {format(new Date(program.startDate), 'MMM d')} - {format(new Date(program.endDate), 'MMM d, yyyy')}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.medium,
  },
  containerPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  completedBadge: {
    backgroundColor: SoulworxColors.success,
  },
  pausedBadge: {
    backgroundColor: SoulworxColors.warning,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  content: {
    flex: 1,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: 2,
  },
  description: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: 18,
  },
  trainingDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dayChip: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: SoulworxColors.beige,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  dayChipText: {
    fontSize: 10,
    fontWeight: Typography.medium,
    color: SoulworxColors.textOnLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  overdueText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.error,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  dateRange: {
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
    paddingTop: Spacing.xs,
    marginTop: 2,
  },
  dateRangeText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
  },
});
