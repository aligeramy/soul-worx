import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Modal, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import { Video, ResizeMode } from 'expo-av';
import { format, isPast, differenceInDays, isToday, startOfDay } from 'date-fns';

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
}

export default function PersonalizedProgramDetailScreen() {
  const insets = useSafeAreaInsets();
  const { user, tier } = useUser();
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const [program, setProgram] = useState<PersonalizedProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [enjoymentRating, setEnjoymentRating] = useState<number | null>(null);
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null);

  const loadProgram = useCallback(async () => {
    if (!user?.id || !programId) return;
    
    try {
      const data = await apiGet<{ programs: PersonalizedProgram[] }>(`/api/personalized-programs?userId=${user.id}`);
      const foundProgram = data.programs?.find((p) => p.id === programId);
      if (foundProgram) {
        setProgram(foundProgram);
      } else {
        Alert.alert('Not Found', 'Program not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading program:', error);
      Alert.alert('Error', 'Failed to load program');
    } finally {
      setLoading(false);
    }
  }, [user?.id, programId]);

  useEffect(() => {
    if (tier?.level !== 'pro_plus') {
      router.replace('/(tabs)/programs');
      return;
    }
    loadProgram();
  }, [programId, tier, loadProgram]);

  useEffect(() => {
    if (tier?.level !== 'pro_plus') {
      router.replace('/(tabs)/programs');
      return;
    }
    loadProgram();
  }, [programId, tier, loadProgram]);

  const handleCheckOff = useCallback(async (itemId: string) => {
    const item = program?.checklistItems.find((i) => i.id === itemId);
    if (!item) return;

    const dueDate = new Date(item.dueDate);
    const today = startOfDay(new Date());

    if (startOfDay(dueDate) > today) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Not Due Yet', "This workout isn't due yet");
      return;
    }

    if (item.completed) {
      setIsSubmitting(itemId);
      try {
        await apiDelete(`/api/personalized-programs/checklist/${itemId}`);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await loadProgram();
      } catch (error) {
        console.error('Error unchecking workout:', error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', 'Failed to uncheck workout');
      } finally {
        setIsSubmitting(null);
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedItemId(itemId);
    setRatingModalOpen(true);
  }, [program, loadProgram]);

  const handleRatingSubmit = useCallback(async () => {
    if (!selectedItemId || enjoymentRating === null || difficultyRating === null) return;

    setIsSubmitting(selectedItemId);
    try {
      await apiPost(`/api/personalized-programs/checklist/${selectedItemId}`, {
        enjoymentRating,
        difficultyRating,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRatingModalOpen(false);
      setSelectedItemId(null);
      setEnjoymentRating(null);
      setDifficultyRating(null);
      await loadProgram();
    } catch (error) {
      console.error('Error checking off workout:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to check off workout');
    } finally {
      setIsSubmitting(null);
    }
  }, [selectedItemId, enjoymentRating, difficultyRating, loadProgram]);

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
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{program.title}</Text>
            <Text style={styles.headerSubtitle}>Personalized training program</Text>
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
                const today = startOfDay(new Date());
                const dueDateStart = startOfDay(dueDate);
                const isOverdue = isPast(dueDateStart) && !item.completed && dueDateStart < today;
                const isDueToday = isToday(dueDate);
                const canCheckOff = dueDateStart <= today;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.checklistItem,
                      item.completed && styles.checklistItemCompleted,
                      isOverdue && !item.completed && styles.checklistItemOverdue,
                      isDueToday && !item.completed && styles.checklistItemDueToday,
                    ]}
                  >
                    <View style={styles.checklistItemContent}>
                      <View style={styles.checklistItemLeft}>
                        <Ionicons
                          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                          size={24}
                          color={item.completed ? SoulworxColors.success : SoulworxColors.textTertiary}
                        />
                        <View style={styles.checklistItemText}>
                          <View style={styles.dateRow}>
                            <Text style={styles.checklistItemDate}>
                              {format(dueDate, "EEEE, MMMM d, yyyy")}
                            </Text>
                            {isDueToday && !item.completed && (
                              <View style={styles.badge}>
                                <Ionicons name="time" size={12} color={SoulworxColors.white} />
                                <Text style={styles.badgeText}>Due Today</Text>
                              </View>
                            )}
                            {isOverdue && (
                              <View style={[styles.badge, styles.badgeOverdue]}>
                                <Ionicons name="alert-circle" size={12} color={SoulworxColors.white} />
                                <Text style={styles.badgeText}>
                                  {differenceInDays(today, dueDateStart)} day{differenceInDays(today, dueDateStart) !== 1 ? 's' : ''} late
                                </Text>
                              </View>
                            )}
                          </View>
                          {item.completed && item.completedAt && (
                            <View style={styles.completedRow}>
                              <Ionicons name="checkmark-circle" size={14} color={SoulworxColors.success} />
                              <Text style={styles.completedDate}>
                                Completed {format(new Date(item.completedAt), "MMM d")}
                              </Text>
                            </View>
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
                        </View>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          styles.checkButton,
                          item.completed && styles.checkButtonCompleted,
                          (!canCheckOff && !item.completed) && styles.checkButtonDisabled,
                          pressed && styles.checkButtonPressed,
                        ]}
                        onPress={() => handleCheckOff(item.id)}
                        disabled={isSubmitting === item.id || (!canCheckOff && !item.completed)}
                      >
                        {isSubmitting === item.id ? (
                          <ActivityIndicator size="small" color={SoulworxColors.white} />
                        ) : (
                          <Text style={styles.checkButtonText}>
                            {item.completed ? 'Uncheck' : canCheckOff ? 'Check Off' : 'Not Due'}
                          </Text>
                        )}
                      </Pressable>
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

      {/* Rating Modal */}
      <Modal
        visible={ratingModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setRatingModalOpen(false);
          setSelectedItemId(null);
          setEnjoymentRating(null);
          setDifficultyRating(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Your Workout</Text>
            <Text style={styles.modalSubtitle}>Help us improve your training experience</Text>

            {/* Enjoyment Rating */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>How much did you enjoy it?</Text>
              <View style={styles.emojiContainer}>
                {['😞', '😕', '😐', '😊', '😄'].map((emoji, index) => {
                  const rating = index + 1;
                  return (
                    <Pressable
                      key={rating}
                      style={({ pressed }) => [
                        styles.emojiButton,
                        enjoymentRating === rating && styles.emojiButtonSelected,
                        pressed && styles.emojiButtonPressed,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setEnjoymentRating(rating);
                      }}
                    >
                      <Text style={styles.emoji}>{emoji}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Difficulty Rating */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>How difficult was it?</Text>
              <View style={styles.difficultyContainer}>
                {['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'].map((label, index) => {
                  const rating = index + 1;
                  return (
                    <Pressable
                      key={rating}
                      style={({ pressed }) => [
                        styles.difficultyButton,
                        difficultyRating === rating && styles.difficultyButtonSelected,
                        pressed && styles.difficultyButtonPressed,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setDifficultyRating(rating);
                      }}
                    >
                      <Text style={styles.difficultyButtonText}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalButtonCancel,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRatingModalOpen(false);
                  setSelectedItemId(null);
                  setEnjoymentRating(null);
                  setDifficultyRating(null);
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalButtonSubmit,
                  (enjoymentRating === null || difficultyRating === null) && styles.modalButtonDisabled,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={handleRatingSubmit}
                disabled={enjoymentRating === null || difficultyRating === null || isSubmitting !== null}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={SoulworxColors.white} />
                ) : (
                  <Text style={styles.modalButtonSubmitText}>Submit</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  checklistItemDueToday: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  checklistItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    flex: 1,
  },
  checklistItemText: {
    flex: 1,
  },
  checklistItemDate: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeOverdue: {
    backgroundColor: '#EF4444',
  },
  badgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  completedDate: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
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
  checkButton: {
    backgroundColor: SoulworxColors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  checkButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  checkButtonCompleted: {
    backgroundColor: SoulworxColors.charcoal,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  checkButtonDisabled: {
    opacity: 0.5,
  },
  checkButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Shadows.large,
  },
  modalTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  ratingSection: {
    marginBottom: Spacing.xl,
  },
  ratingLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  emojiButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SoulworxColors.beige,
  },
  emojiButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  emojiButtonSelected: {
    borderColor: '#FBBF24',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  emoji: {
    fontSize: 32,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  difficultyButton: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
  },
  difficultyButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  difficultyButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  difficultyButtonText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  modalButtonCancel: {
    backgroundColor: SoulworxColors.charcoal,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    marginRight: Spacing.sm,
  },
  modalButtonSubmit: {
    backgroundColor: SoulworxColors.gold,
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonCancelText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  modalButtonSubmitText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
