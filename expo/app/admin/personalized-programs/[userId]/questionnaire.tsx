import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import type { ProPlusQuestionnaire } from '@/lib/types';

const SKILL_LABELS: Record<string, string> = {
  ballHandling: 'Ball Handling',
  defence: 'Defence',
  finishing: 'Finishing',
  shooting: 'Shooting',
  passing: 'Passing',
};

export default function AdminQuestionnaireViewerScreen() {
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useUser();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<ProPlusQuestionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadData();
  }, [userId, currentUser]);

  const loadData = async () => {
    try {
      const [userResult, questionnaireResult] = await Promise.all([
        supabase.from('user').select('*').eq('id', userId).single(),
        supabase.from('pro_plus_questionnaire').select('*').eq('userId', userId).single(),
      ]);

      if (userResult.data) setUser(userResult.data);
      if (questionnaireResult.data) setQuestionnaire(questionnaireResult.data as ProPlusQuestionnaire);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.gold} />
      </View>
    );
  }

  if (!questionnaire) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Questionnaire</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyTitle}>No Questionnaire</Text>
          <Text style={styles.emptyDescription}>
            This user hasn't completed their Pro+ questionnaire yet.
          </Text>
        </View>
      </View>
    );
  }

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const renderField = (label: string, value: string | number | null | undefined) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue} numberOfLines={2} ellipsizeMode="tail">
        {value || 'Not provided'}
      </Text>
    </View>
  );

  const renderBooleanField = (label: string, value: boolean) => (
    <View style={styles.booleanField}>
      <Text style={styles.booleanFieldLabel}>{label}</Text>
      <View style={[styles.booleanBadge, value ? styles.booleanYes : styles.booleanNo]}>
        <Text style={styles.booleanText}>{value ? 'Yes' : 'No'}</Text>
      </View>
    </View>
  );

  const renderRating = (label: string, value: number) => (
    <View style={styles.ratingField}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= value ? 'star' : 'star-outline'}
            size={16}
            color={star <= value ? '#FBBF24' : SoulworxColors.textTertiary}
          />
        ))}
        <Text style={styles.ratingValue}>{value}/5</Text>
      </View>
    </View>
  );

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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{user?.name || 'User'}</Text>
          <Text style={styles.headerSubtitle}>Pro+ Questionnaire</Text>
        </View>
      </View>

      {/* Completed Date */}
      {questionnaire.completedAt && (
        <View style={styles.completedCard}>
          <Ionicons name="checkmark-circle" size={20} color={SoulworxColors.success} />
          <Text style={styles.completedText}>
            Completed on {format(new Date(questionnaire.completedAt), 'MMMM d, yyyy')}
          </Text>
        </View>
      )}

      {/* Basic Info */}
      {renderSection('Basic Information', (
        <>
          {renderField('Age', questionnaire.age?.toString())}
          {renderField('Skill Level', questionnaire.skillLevel)}
          {renderField('Game Description', questionnaire.gameDescription)}
        </>
      ))}

      {/* Position & Experience */}
      {renderSection('Position & Experience', (
        <>
          {renderField('Position', questionnaire.position)}
          {renderField('Years Playing', questionnaire.yearsPlaying)}
        </>
      ))}

      {/* Goals */}
      {renderSection('Goals', (
        <>
          {renderField('Yearly Goals', questionnaire.currentGoalsYearly)}
          {renderField('Overall Goals', questionnaire.currentGoalsOverall)}
        </>
      ))}

      {/* Improvement Rankings */}
      {questionnaire.improvementRankings && renderSection('Improvement Rankings', (
        <View style={styles.ratingsGrid}>
          {Object.entries(questionnaire.improvementRankings)
            .filter(([key]) => key !== 'other')
            .map(([key, value]) => (
              <React.Fragment key={key}>
                {renderRating(SKILL_LABELS[key] || key, value as number)}
              </React.Fragment>
            ))}
          {questionnaire.improvementRankings.other?.text && (
            <React.Fragment key="other">
              {renderField('Other Area', questionnaire.improvementRankings.other.text)}
              {renderRating('Other Rating', questionnaire.improvementRankings.other.rank)}
            </React.Fragment>
          )}
        </View>
      ))}

      {/* Physical Stats */}
      {renderSection('Physical Stats', (
        <>
          {renderField('Weight', questionnaire.weight ? `${questionnaire.weight} lbs` : null)}
          {renderField('Height', questionnaire.height)}
          {renderField('Current Injuries', questionnaire.currentInjuries)}
        </>
      ))}

      {/* Training & Health */}
      {renderSection('Training & Health', (
        <>
          {renderBooleanField('Seeing Physiotherapy', questionnaire.seeingPhysiotherapy)}
          {renderBooleanField('Weight Trains', questionnaire.weightTrains)}
          {renderBooleanField('Stretches', questionnaire.stretches)}
        </>
      ))}

      {/* Team & Competition */}
      {renderSection('Team & Competition', (
        <>
          {renderField('Current Team', questionnaire.currentTeam)}
          {renderField('Outside School Teams', questionnaire.outsideSchoolTeams)}
          {renderBooleanField('In Season', questionnaire.inSeason)}
        </>
      ))}

      {/* Basketball Watching */}
      {renderSection('Basketball Watching', (
        renderField('Type of Basketball Watched', questionnaire.basketballWatching)
      ))}

      {/* Equipment & Availability */}
      {renderSection('Equipment & Availability', (
        <>
          {renderField('Equipment Access', questionnaire.equipmentAccess)}
          {renderField('Training Days', questionnaire.trainingDays?.join(', '))}
          {renderField('Average Session Length', questionnaire.averageSessionLength ? `${questionnaire.averageSessionLength} min` : null)}
        </>
      ))}

      {/* Mental & Mindset */}
      {renderSection('Mental & Mindset', (
        <>
          {renderField('Biggest Struggle', questionnaire.biggestStruggle)}
          {renderRating('Confidence Level', questionnaire.confidenceLevel)}
          {renderField('Mental Challenge', questionnaire.mentalChallenge)}
          {questionnaire.mentalChallengeOther && renderField('Other Challenge', questionnaire.mentalChallengeOther)}
        </>
      ))}

      {/* Coaching Preferences */}
      {renderSection('Coaching Preferences', (
        <>
          {renderRating('Coachability', questionnaire.coachability)}
          {renderField('Preferred Coaching Style', questionnaire.preferredCoachingStyle)}
          {questionnaire.coachingStyleOther && renderField('Other Style', questionnaire.coachingStyleOther)}
        </>
      ))}

      {/* Videos */}
      {renderSection('Videos', (
        <>
          {questionnaire.gameFilmUrl ? (
            <View style={styles.videoItem}>
              <Ionicons name="videocam" size={20} color={SoulworxColors.success} />
              <Text style={styles.videoText}>Game Film Uploaded</Text>
            </View>
          ) : (
            <Text style={styles.noVideoText}>No game film uploaded</Text>
          )}
          {questionnaire.workoutVideos && questionnaire.workoutVideos.length > 0 ? (
            <View style={styles.videoItem}>
              <Ionicons name="videocam" size={20} color={SoulworxColors.success} />
              <Text style={styles.videoText}>{questionnaire.workoutVideos.length} Workout Video(s)</Text>
            </View>
          ) : (
            <Text style={styles.noVideoText}>No workout videos uploaded</Text>
          )}
        </>
      ))}
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
    paddingBottom: Spacing.xxxl,
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
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: `${SoulworxColors.success}20`,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  completedText: {
    fontSize: Typography.sm,
    color: SoulworxColors.success,
    fontWeight: Typography.semibold,
  },
  section: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
    paddingBottom: Spacing.xs,
  },
  sectionContent: {
    gap: Spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  fieldLabel: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    opacity: 0.6,
    flex: 1,
    marginRight: Spacing.sm,
  },
  booleanField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  booleanFieldLabel: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    opacity: 0.6,
    flex: 1,
    marginRight: Spacing.sm,
  },
  fieldValue: {
    fontSize: Typography.sm,
    color: SoulworxColors.textPrimary,
    flexShrink: 0,
    maxWidth: '60%',
    textAlign: 'right',
  },
  booleanBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  booleanYes: {
    backgroundColor: `${SoulworxColors.success}20`,
  },
  booleanNo: {
    backgroundColor: `${SoulworxColors.textTertiary}20`,
  },
  booleanText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  ratingsGrid: {
    gap: Spacing.md,
  },
  ratingField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    opacity: 0.6,
    flex: 1,
    marginRight: Spacing.sm,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
    marginLeft: Spacing.sm,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: `${SoulworxColors.success}15`,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  videoText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textPrimary,
  },
  noVideoText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textTertiary,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
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
