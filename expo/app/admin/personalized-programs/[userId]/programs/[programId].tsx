import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { format, isPast, differenceInDays } from 'date-fns';
import { Video, ResizeMode } from 'expo-av';

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
          <Text style={styles.headerTitle}>{program.title}</Text>
          <Text style={styles.headerSubtitle}>Program for {program.user?.name || program.user?.email}</Text>
        </View>
      </View>

      {/* Program Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Program Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description</Text>
          <Text style={styles.detailValue}>{program.description}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date Range</Text>
          <Text style={styles.detailValue}>
            {format(new Date(program.startDate), "MMM d")} - {format(new Date(program.endDate), "MMM d, yyyy")}
          </Text>
        </View>

        {program.trainingDays && program.trainingDays.length > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Training Days</Text>
            <View style={styles.trainingDaysContainer}>
              {program.trainingDays.map((day, index) => (
                <View key={index} style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {completedCount} / {totalCount}
              </Text>
              <Text style={styles.progressPercent}>{completionRate}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
            </View>
          </View>
        </View>

        {program.videoUrl && (
          <View style={styles.videoContainer}>
            <Text style={styles.detailLabel}>Training Video</Text>
            <Video
              source={{ uri: program.videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
          </View>
        )}
      </View>

      {/* Checklist */}
      <View style={styles.checklistCard}>
        <Text style={styles.sectionTitle}>Workout Checklist</Text>
        
        {program.checklistItems.length > 0 ? (
          <View style={styles.checklistContainer}>
            {program.checklistItems.map((item) => {
              const dueDate = new Date(item.dueDate);
              const isOverdue = isPast(dueDate) && !item.completed;
              const daysLate = item.completed && item.completedAt
                ? Math.max(0, differenceInDays(new Date(item.completedAt), dueDate))
                : 0;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.checklistItem,
                    item.completed && styles.checklistItemCompleted,
                    isOverdue && !item.completed && styles.checklistItemOverdue,
                  ]}
                >
                  <View style={styles.checklistItemContent}>
                    <Ionicons
                      name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={item.completed ? SoulworxColors.success : SoulworxColors.textTertiary}
                    />
                    <View style={styles.checklistItemText}>
                      <Text style={styles.checklistItemDate}>
                        {format(dueDate, "EEEE, MMMM d, yyyy")}
                      </Text>
                      {item.completed && item.completedAt && (
                        <Text style={styles.completedDate}>
                          Completed {format(new Date(item.completedAt), "MMM d")}
                        </Text>
                      )}
                      {item.completed && (
                        <View style={styles.ratingsContainer}>
                          {item.enjoymentRating && (
                            <View style={styles.rating}>
                              <Ionicons name="star" size={14} color="#FBBF24" />
                              <Text style={styles.ratingText}>Enjoyment: {item.enjoymentRating}/5</Text>
                            </View>
                          )}
                          {item.difficultyRating && (
                            <View style={styles.rating}>
                              <Ionicons name="time-outline" size={14} color={SoulworxColors.textSecondary} />
                              <Text style={styles.ratingText}>Difficulty: {item.difficultyRating}/5</Text>
                            </View>
                          )}
                        </View>
                      )}
                      {daysLate > 0 && (
                        <View style={styles.lateBadge}>
                          <Text style={styles.lateBadgeText}>
                            {daysLate} day{daysLate !== 1 ? 's' : ''} late
                          </Text>
                        </View>
                      )}
                      {!item.completed && !isOverdue && (
                        <View style={styles.upcomingBadge}>
                          <Text style={styles.upcomingBadgeText}>Upcoming</Text>
                        </View>
                      )}
                    </View>
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
  },
  headerTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  detailsCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    marginBottom: Spacing.lg,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
  },
  trainingDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
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
  progressContainer: {
    marginTop: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  progressPercent: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: SoulworxColors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SoulworxColors.success,
  },
  videoContainer: {
    marginTop: Spacing.lg,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  checklistCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  checklistContainer: {
    gap: Spacing.sm,
  },
  checklistItem: {
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  checklistItemCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  checklistItemOverdue: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  checklistItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  checklistItemText: {
    flex: 1,
  },
  checklistItemDate: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: Spacing.xs,
  },
  completedDate: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
    marginTop: Spacing.xs,
  },
  ratingsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  lateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  lateBadgeText: {
    fontSize: Typography.xs,
    color: '#EF4444',
    fontWeight: Typography.semibold,
  },
  upcomingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  upcomingBadgeText: {
    fontSize: Typography.xs,
    color: '#3B82F6',
    fontWeight: Typography.semibold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
});
