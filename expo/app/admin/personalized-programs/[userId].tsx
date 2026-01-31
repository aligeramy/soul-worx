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

      {/* Questionnaire Card - entire row is button */}
      <TouchableOpacity
        style={styles.questionnaireCard}
        onPress={() => router.push(`/admin/personalized-programs/${userId}/questionnaire` as any)}
        activeOpacity={0.7}
      >
        <Ionicons name="document-text-outline" size={20} color={SoulworxColors.brandBrown} />
        <View style={styles.questionnaireCardContent}>
          <Text style={styles.questionnaireCardTitle}>Questionnaire</Text>
        </View>
        {questionnaire ? (
          <Ionicons name="checkmark-circle" size={20} color={SoulworxColors.success} />
        ) : null}
        <Text style={styles.questionnaireDetailsLabel}>Details</Text>
        <Ionicons name="chevron-forward" size={18} color={SoulworxColors.brandBrown} />
      </TouchableOpacity>

      {/* Programs Section */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="fitness-outline" size={20} color={SoulworxColors.brandBrown} />
          <Text style={styles.sectionCardTitle}>Programs ({programs.length})</Text>
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
                    style={styles.programCard}
                    onPress={() => router.push(`/admin/personalized-programs/${userId}/programs/${program.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.programCardContent}>
                      <Text style={styles.programCardTitle} numberOfLines={1}>{program.title}</Text>
                      <Text style={styles.programCardMeta} numberOfLines={1}>
                        {format(new Date(program.startDate), "MMM d")} – {format(new Date(program.endDate), "MMM d")}
                        {program.trainingDays?.length ? ` · ${program.trainingDays.length}d/wk` : ''}
                        {' · '}{completedCount}/{totalCount} done
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textPrimary} />
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
    backgroundColor: SoulworxColors.brandBrownDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  questionnaireCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.18)',
    ...Shadows.small,
  },
  questionnaireCardContent: {
    flex: 1,
    minWidth: 0,
  },
  questionnaireCardTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.brandBrown,
    marginBottom: 2,
  },
  questionnaireDetailsLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.brandBrown,
  },
  sectionCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.18)',
    ...Shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionCardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.brandBrown,
  },
  cardContent: {
    gap: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.success,
  },
  completedDate: {
    fontSize: Typography.xs,
    color: SoulworxColors.brandBrownDark,
    opacity: 0.8,
  },
  noQuestionnaireText: {
    fontSize: Typography.xs,
    color: SoulworxColors.brandBrownDark,
    opacity: 0.8,
  },
  programsList: {
    gap: Spacing.md,
  },
  programCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    ...Shadows.small,
  },
  programCardContent: {
    flex: 1,
    minWidth: 0,
  },
  programCardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: 4,
  },
  programCardMeta: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  emptyPrograms: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyProgramsText: {
    fontSize: Typography.sm,
    color: SoulworxColors.brandBrownDark,
    opacity: 0.9,
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
