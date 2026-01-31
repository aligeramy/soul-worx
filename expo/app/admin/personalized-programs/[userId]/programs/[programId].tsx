import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { format, isPast, differenceInDays } from 'date-fns';

interface ChecklistItem {
  id: string;
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
  enjoymentRating: number | null;
  difficultyRating: number | null;
  daysLate: number | null;
}

interface PersonalizedProgram {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  trainingDays: string[];
  startDate: string;
  endDate: string;
  status: string;
  checklistItems: ChecklistItem[];
  user: {
    name: string | null;
    email: string;
  };
}

export default function AdminProgramDetailScreen() {
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useUser();
  const { userId, programId } = useLocalSearchParams<{ userId: string; programId: string }>();
  const [program, setProgram] = useState<PersonalizedProgram | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProgram = useCallback(async () => {
    if (!programId || !userId) return;
    
    try {
      const { data: programData } = await supabase
        .from('personalized_program')
        .select('*')
        .eq('id', programId)
        .eq('userId', userId)
        .single();

      if (programData) {
        const { data: checklistItems } = await supabase
          .from('program_checklist_item')
          .select('*')
          .eq('programId', programId)
          .order('dueDate', { ascending: true });

        const { data: userData } = await supabase
          .from('user')
          .select('name, email')
          .eq('id', userId)
          .single();

        setProgram({
          ...programData,
          checklistItems: checklistItems || [],
          user: userData || { name: null, email: '' },
        });
      }
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  }, [programId, userId]);

  useEffect(() => {
    if (!currentUser) return;
    
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    
    loadProgram();
  }, [currentUser, loadProgram]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.gold} />
      </View>
    );
  }

  if (!program) {
    return null;
  }

  const completedCount = program.checklistItems.filter((item) => item.completed).length;
  const totalCount = program.checklistItems.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Analytics calculations
  const overdueCount = program.checklistItems.filter((item) => !item.completed && isPast(new Date(item.dueDate))).length;
  const completedItems = program.checklistItems.filter((item) => item.completed);
  const avgEnjoyment = completedItems.length > 0
    ? (completedItems.reduce((sum, item) => sum + (item.enjoymentRating || 0), 0) / completedItems.filter(i => i.enjoymentRating).length).toFixed(1)
    : 'N/A';
  const avgDifficulty = completedItems.length > 0
    ? (completedItems.reduce((sum, item) => sum + (item.difficultyRating || 0), 0) / completedItems.filter(i => i.difficultyRating).length).toFixed(1)
    : 'N/A';
  const totalDaysLate = completedItems.reduce((sum, item) => sum + (item.daysLate || 0), 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{program.title}</Text>
          <Text style={styles.headerSubtitle}>Program for {program.user?.name || program.user?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => router.push(`/admin/personalized-programs/${userId}/programs/${programId}/details` as any)}
        >
          <Ionicons name="pencil" size={20} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Checklist - at top */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Workout Checklist</Text>
        
        {program.checklistItems.length > 0 ? (
          <View style={styles.checklistList}>
            {program.checklistItems.map((item, index) => {
              const dueDate = new Date(item.dueDate);
              const isOverdue = isPast(dueDate) && !item.completed;
              const daysLate = item.completed && item.completedAt
                ? Math.max(0, differenceInDays(new Date(item.completedAt), dueDate))
                : 0;
              const isLast = index === program.checklistItems.length - 1;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.checklistRow,
                    isLast && styles.checklistRowLast,
                    item.completed && styles.checklistRowCompleted,
                    isOverdue && !item.completed && styles.checklistRowOverdue,
                  ]}
                >
                  <Ionicons
                    name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={item.completed ? SoulworxColors.success : SoulworxColors.textSecondary}
                  />
                  <View style={styles.checklistRowContent}>
                    <Text style={styles.checklistRowDate} numberOfLines={1}>
                      {format(dueDate, "EEE, MMM d")}
                    </Text>
                    {item.completed && item.completedAt && (
                      <Text style={styles.checklistRowMeta}>
                        Done {format(new Date(item.completedAt), "MMM d")}
                        {item.enjoymentRating != null && ` · ${item.enjoymentRating}/5 ★`}
                        {item.difficultyRating != null && ` · ${item.difficultyRating}/5 diff`}
                      </Text>
                    )}
                    {daysLate > 0 && (
                      <Text style={styles.checklistRowLate}>
                        {daysLate} day{daysLate !== 1 ? 's' : ''} late
                      </Text>
                    )}
                    {!item.completed && !isOverdue && (
                      <Text style={styles.checklistRowMeta}>Upcoming</Text>
                    )}
                    {!item.completed && isOverdue && (
                      <Text style={styles.checklistRowOverdueText}>Overdue</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No checklist items found</Text>
          </View>
        )}
      </View>

      {/* Analytics Summary */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Analytics</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{completionRate}%</Text>
            <Text style={styles.analyticsLabel}>Completion</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{avgEnjoyment}</Text>
            <Text style={styles.analyticsLabel}>Avg Enjoyment</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{avgDifficulty}</Text>
            <Text style={styles.analyticsLabel}>Avg Difficulty</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={[styles.analyticsValue, overdueCount > 0 && styles.analyticsValueWarning]}>{overdueCount}</Text>
            <Text style={styles.analyticsLabel}>Overdue</Text>
          </View>
        </View>
        {totalDaysLate > 0 && (
          <View style={styles.analyticsNote}>
            <Ionicons name="information-circle" size={16} color={SoulworxColors.warning} />
            <Text style={styles.analyticsNoteText}>
              Total days late: {totalDaysLate}
            </Text>
          </View>
        )}
      </View>
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
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  viewDetailsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: SoulworxColors.textPrimary,
    borderRadius: BorderRadius.full,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  sectionCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.18)',
    ...Shadows.small,
  },
  sectionCardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.brandBrown,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: SoulworxColors.brandBrownDark,
    opacity: 0.7,
    flex: 1,
  },
  detailValue: {
    fontSize: Typography.sm,
    color: SoulworxColors.brandBrown,
    flexShrink: 0,
    maxWidth: '65%',
    textAlign: 'right',
  },
  trainingDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    flexShrink: 0,
  },
  dayBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(121, 79, 65, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.2)',
  },
  dayBadgeText: {
    fontSize: Typography.xs,
    color: SoulworxColors.brandBrown,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressPercent: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.brandBrown,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(121, 79, 65, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SoulworxColors.brandBrown,
  },
  checklistList: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  checklistRowLast: {
    borderBottomWidth: 0,
  },
  checklistRowCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  checklistRowOverdue: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  checklistRowContent: {
    flex: 1,
    minWidth: 0,
  },
  checklistRowDate: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  checklistRowMeta: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
    marginTop: 2,
  },
  checklistRowLate: {
    fontSize: Typography.xs,
    color: SoulworxColors.error,
    marginTop: 2,
    fontWeight: Typography.semibold,
  },
  checklistRowOverdueText: {
    fontSize: Typography.xs,
    color: SoulworxColors.error,
    marginTop: 2,
    fontWeight: Typography.semibold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.sm,
    color: SoulworxColors.brandBrownDark,
    opacity: 0.8,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  analyticsItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(121, 79, 65, 0.06)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.brandBrown,
    marginBottom: 2,
  },
  analyticsValueWarning: {
    color: SoulworxColors.error,
  },
  analyticsLabel: {
    fontSize: Typography.xs,
    color: SoulworxColors.brandBrownDark,
    opacity: 0.8,
  },
  analyticsNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(121, 79, 65, 0.15)',
  },
  analyticsNoteText: {
    fontSize: Typography.xs,
    color: SoulworxColors.warning,
  },
});
