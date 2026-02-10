import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { usePersonalizedPrograms } from '@/hooks/usePersonalizedPrograms';
import { PersonalizedProgramCard } from '@/components/programs/PersonalizedProgramCard';

export default function MyProgramsScreen() {
  const insets = useSafeAreaInsets();
  const { user, tier } = useUser();
  const { programs, loading, error, refetch } = usePersonalizedPrograms();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Redirect non Pro+ users
  React.useEffect(() => {
    if (tier && tier.level !== 'pro_plus') {
      router.replace('/(tabs)/programs');
    }
  }, [tier]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={SoulworxColors.gold} />
      </View>
    );
  }

  // Separate active and completed programs
  const activePrograms = programs.filter((p) => p.status === 'active');
  const completedPrograms = programs.filter((p) => p.status === 'completed');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SoulworxColors.gold} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Programs</Text>
        <Text style={styles.subtitle}>Your personalized training plans</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={SoulworxColors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : programs.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="fitness-outline" size={64} color={SoulworxColors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>No Programs Yet</Text>
          <Text style={styles.emptyDescription}>
            Your personalized training programs will appear here once your coach creates them for you.
          </Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={20} color={SoulworxColors.gold} />
            <Text style={styles.tipText}>
              Make sure you've completed your Pro+ questionnaire so your coach can create a personalized program for you.
            </Text>
          </View>
        </View>
      ) : (
        <>
          {/* Active Programs */}
          {activePrograms.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flash" size={20} color={SoulworxColors.gold} />
                <Text style={styles.sectionTitle}>Active Programs</Text>
              </View>
              <View style={styles.programsList}>
                {activePrograms.map((program) => (
                  <PersonalizedProgramCard
                    key={program.id}
                    program={program}
                    onPress={() => router.push(`/my-program/${program.id}` as any)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Completed Programs */}
          {completedPrograms.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle" size={20} color={SoulworxColors.success} />
                <Text style={styles.sectionTitle}>Completed Programs</Text>
              </View>
              <View style={styles.programsList}>
                {completedPrograms.map((program) => (
                  <PersonalizedProgramCard
                    key={program.id}
                    program={program}
                    onPress={() => router.push(`/my-program/${program.id}` as any)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{programs.length}</Text>
                <Text style={styles.statLabel}>Total Programs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedPrograms.length}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {programs.reduce((acc, p) => acc + p.checklistItems.filter((i) => i.completed).length, 0)}
                </Text>
                <Text style={styles.statLabel}>Workouts Done</Text>
              </View>
            </View>
          </View>
        </>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  errorText: {
    fontSize: Typography.base,
    color: SoulworxColors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: SoulworxColors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  emptyTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: SoulworxColors.gold,
  },
  tipText: {
    flex: 1,
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  programsList: {
    gap: Spacing.md,
  },
  statsCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
    ...Shadows.medium,
  },
  statsTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.gold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
});
