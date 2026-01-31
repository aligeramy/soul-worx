import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePrograms, useUpcomingRsvps } from '@/hooks/usePrograms';
import { useUser } from '@/contexts/UserContext';
import { usePersonalizedPrograms } from '@/hooks/usePersonalizedPrograms';
import { HeroCard } from '@/components/HeroCard';
import { ProgramCard } from '@/components/ProgramCard';
import { PersonalizedProgramCard } from '@/components/programs/PersonalizedProgramCard';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { formatDateTime } from '@/lib/format';

export default function ProgramsScreen() {
  const insets = useSafeAreaInsets();
  const { user, tier } = useUser();
  const isProPlus = tier?.level === 'pro_plus';
  const { programs, loading: programsLoading, refetch: refetchPrograms } = usePrograms();
  const { rsvps, loading: rsvpsLoading, refetch: refetchRsvps } = useUpcomingRsvps(user?.id || null);
  const {
    programs: personalizedPrograms,
    loading: personalizedLoading,
    error: personalizedError,
    refetch: refetchPersonalized,
  } = usePersonalizedPrograms();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchPrograms(),
      refetchRsvps(),
      ...(isProPlus ? [refetchPersonalized()] : []),
    ]);
    setRefreshing(false);
  };

  if (programsLoading || rsvpsLoading) {
    return <LoadingState message="Loading programs..." />;
  }

  // Get next upcoming event
  const nextEvent = rsvps[0];
  const nextEventProgramId = nextEvent?.program.id;

  // Get joined program IDs (programs user has RSVP'd to)
  const joinedProgramIds = new Set(rsvps.map((r) => r.program.id));

  // Separate joined and available programs
  const joinedPrograms = programs.filter(
    (p) => joinedProgramIds.has(p.id) && p.id !== nextEventProgramId
  );
  const availablePrograms = programs.filter((p) => !joinedProgramIds.has(p.id));

  const activePersonalized = personalizedPrograms.filter((p) => p.status === 'active');
  const completedPersonalized = personalizedPrograms.filter((p) => p.status === 'completed');

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
        <Text style={styles.headerTitle}>Programs</Text>
        <Text style={styles.headerSubtitle}>Discover transformative experiences</Text>
      </View>

      {/* My Programs - Pro+ personalized programs at top */}
      {isProPlus && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="star" size={20} color={SoulworxColors.gold} />
            <Text style={styles.sectionTitle}>My Programs</Text>
          </View>
          {personalizedLoading && !refreshing ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={SoulworxColors.gold} />
              <Text style={styles.loadingText}>Loading your programs...</Text>
            </View>
          ) : personalizedError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={SoulworxColors.error} />
              <Text style={styles.errorText}>{personalizedError}</Text>
            </View>
          ) : personalizedPrograms.length === 0 ? (
            <View style={styles.emptyTip}>
              <Text style={styles.emptyTipText}>
                Your personalized programs will appear here once your coach creates them. Complete
                your Pro+ questionnaire to get started.
              </Text>
            </View>
          ) : (
            <>
              {activePersonalized.length > 0 && (
                <View style={styles.programsList}>
                  {activePersonalized.map((program) => (
                    <PersonalizedProgramCard
                      key={program.id}
                      program={program}
                      onPress={() => router.push(`/my-program/${program.id}` as any)}
                    />
                  ))}
                </View>
              )}
              {completedPersonalized.length > 0 && (
                <View style={[styles.programsList, activePersonalized.length > 0 && styles.completedSection]}>
                  <Text style={styles.subsectionTitle}>Completed</Text>
                  {completedPersonalized.map((program) => (
                    <PersonalizedProgramCard
                      key={program.id}
                      program={program}
                      onPress={() => router.push(`/my-program/${program.id}` as any)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* Next Upcoming Event Hero */}
      {nextEvent && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Up</Text>
          <HeroCard
            image={getImageSource(nextEvent.program.coverImage, 'program')}
            title={nextEvent.event.title}
            description={formatDateTime(nextEvent.event.startTime)}
            badge="Upcoming"
            showRsvpBadge={true}
            onPress={() =>
              router.push({ pathname: '/program/[id]', params: { id: nextEvent.program.id } })
            }
          />
        </View>
      )}

      {/* Enrolled Section - RSVP'd Programs (excluding Next Up) */}
      {joinedPrograms.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isProPlus ? 'Enrolled' : 'My Programs'}</Text>
          <View style={styles.grid}>
            {joinedPrograms.map((program) => {
              const programEvent = rsvps.find((r) => r.program.id === program.id);
              return (
                <ProgramCard
                  key={program.id}
                  image={getImageSource(program.coverImage, 'program')}
                  title={program.title}
                  category={program.category}
                  description={program.description}
                  date={programEvent?.event.startTime}
                  joined={true}
                  showRsvpBadge={true}
                  onPress={() =>
                    router.push({ pathname: '/program/[id]', params: { id: program.id } })
                  }
                  style={styles.card}
                />
              );
            })}
          </View>
        </View>
      )}

      {/* All Programs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Programs</Text>
        <View style={styles.grid}>
          {availablePrograms.map((program) => (
            <ProgramCard
              key={program.id}
              image={getImageSource(program.coverImage, 'program')}
              title={program.title}
              category={program.category}
              description={program.description}
              onPress={() => router.push(`/program/${program.id}`)}
              style={styles.card}
            />
          ))}
        </View>
      </View>

      {/* Empty state */}
      {programs.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Programs Available</Text>
          <Text style={styles.emptyDescription}>
            Check back soon for new programs and workshops
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
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  subsectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  programsList: {
    gap: Spacing.md,
  },
  completedSection: {
    marginTop: Spacing.md,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: Spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: Typography.sm,
    color: SoulworxColors.error,
  },
  emptyTip: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  emptyTipText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: 20,
  },
  grid: {
    gap: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
});

