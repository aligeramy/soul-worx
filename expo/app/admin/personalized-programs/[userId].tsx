import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
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
  status: string;
  checklistItems: any[];
}

export default function AdminUserDetailScreen() {
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useUser();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [programs, setPrograms] = useState<PersonalizedProgram[]>([]);
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
      const [userResult, questionnaireResult, programsResult] = await Promise.all([
        supabase.from('user').select('*').eq('id', userId).single(),
        supabase.from('pro_plus_questionnaire').select('*').eq('userId', userId).single(),
        supabase.from('personalized_program').select('*').eq('userId', userId).order('createdAt', { ascending: false }),
      ]);

      if (userResult.data) setUser(userResult.data);
      if (questionnaireResult.data) setQuestionnaire(questionnaireResult.data);
      if (programsResult.data) {
        // Get checklist items for each program
        const programsWithChecklist = await Promise.all(
          programsResult.data.map(async (program) => {
            const { data: checklistItems } = await supabase
              .from('program_checklist_item')
              .select('*')
              .eq('programId', program.id);
            return { ...program, checklistItems: checklistItems || [] };
          })
        );
        setPrograms(programsWithChecklist);
      }
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

  if (!user) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SoulworxColors.gold} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{user.name || 'User'}</Text>
          <Text style={styles.headerSubtitle}>{user.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push(`/admin/personalized-programs/${userId}/new` as any)}
        >
          <Ionicons name="add" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      {/* Questionnaire Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={24} color={SoulworxColors.textPrimary} />
          <Text style={styles.cardTitle}>Questionnaire</Text>
        </View>
        <View style={styles.cardContent}>
          {questionnaire ? (
            <View style={styles.questionnaireStatus}>
              <View style={styles.statusRow}>
                <Ionicons name="checkmark-circle" size={20} color={SoulworxColors.success} />
                <Text style={styles.statusText}>Completed</Text>
              </View>
              {questionnaire.completedAt && (
                <Text style={styles.completedDate}>
                  Completed: {format(new Date(questionnaire.completedAt), "MMM d, yyyy")}
                </Text>
              )}
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => router.push(`/admin/personalized-programs/${userId}/questionnaire` as any)}
              >
                <Text style={styles.viewButtonText}>View Answers</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noQuestionnaireText}>Questionnaire not completed</Text>
          )}
        </View>
      </View>

      {/* Programs Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="fitness-outline" size={24} color={SoulworxColors.textPrimary} />
          <Text style={styles.cardTitle}>Programs ({programs.length})</Text>
        </View>
        <View style={styles.cardContent}>
          {programs.length > 0 ? (
            <View style={styles.programsList}>
              {programs.map((program) => {
                const completedCount = program.checklistItems.filter((item: any) => item.completed).length;
                const totalCount = program.checklistItems.length;
                return (
                  <TouchableOpacity
                    key={program.id}
                    style={styles.programItem}
                    onPress={() => router.push(`/admin/personalized-programs/${userId}/programs/${program.id}` as any)}
                  >
                    <View style={styles.programContent}>
                      <Text style={styles.programTitle}>{program.title}</Text>
                      <Text style={styles.programDescription} numberOfLines={2}>
                        {program.description}
                      </Text>
                      <View style={styles.programMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="calendar-outline" size={14} color={SoulworxColors.textSecondary} />
                          <Text style={styles.metaText}>
                            {format(new Date(program.startDate), "MMM d")} - {format(new Date(program.endDate), "MMM d, yyyy")}
                          </Text>
                        </View>
                        {program.trainingDays && program.trainingDays.length > 0 && (
                          <Text style={styles.metaText}>
                            {program.trainingDays.length} day{program.trainingDays.length !== 1 ? 's' : ''}/week
                          </Text>
                        )}
                        <Text style={styles.metaText}>{program.status}</Text>
                      </View>
                      <View style={styles.progressRow}>
                        <Text style={styles.progressText}>
                          {completedCount} / {totalCount} completed
                        </Text>
                      </View>
                    </View>
                    {program.videoUrl && (
                      <View style={styles.videoThumbnail}>
                        <Ionicons name="play-circle" size={24} color={SoulworxColors.textSecondary} />
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyPrograms}>
              <Text style={styles.emptyProgramsText}>No programs created yet</Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => router.push(`/admin/personalized-programs/${userId}/new` as any)}
              >
                <Ionicons name="add" size={20} color={SoulworxColors.white} />
                <Text style={styles.createFirstButtonText}>Create First Program</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  createButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  card: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  cardContent: {
    gap: Spacing.md,
  },
  questionnaireStatus: {
    gap: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.success,
  },
  completedDate: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  viewButton: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textPrimary,
  },
  noQuestionnaireText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  programsList: {
    gap: Spacing.md,
  },
  programItem: {
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  programContent: {
    flex: 1,
  },
  programTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: Spacing.xs,
  },
  programDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
    marginBottom: Spacing.sm,
  },
  programMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    opacity: 0.6,
  },
  progressRow: {
    marginTop: Spacing.xs,
  },
  progressText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  videoThumbnail: {
    width: 60,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: SoulworxColors.darkBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPrograms: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyProgramsText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.md,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  createFirstButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
