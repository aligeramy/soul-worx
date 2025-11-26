import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrograms, useUpcomingRsvps } from '@/hooks/usePrograms';
import { useUser } from '@/contexts/UserContext';
import { HeroCard } from '@/components/HeroCard';
import { ProgramCard } from '@/components/ProgramCard';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { formatDateTime } from '@/lib/format';

export default function ProgramsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { programs, loading: programsLoading, refetch: refetchPrograms } = usePrograms();
  const { rsvps, loading: rsvpsLoading, refetch: refetchRsvps } = useUpcomingRsvps(user?.id || null);
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPrograms(), refetchRsvps()]);
    setRefreshing(false);
  };

  if (programsLoading || rsvpsLoading) {
    return <LoadingState message="Loading programs..." />;
  }

  // Debug: Log program IDs and RSVPs
  console.log('[ProgramsScreen] Programs loaded:', programs.length);
  console.log('[ProgramsScreen] RSVPs loaded:', rsvps.length);
  programs.forEach(p => console.log('Program:', p.title, 'ID:', p.id));
  rsvps.forEach(r => console.log('RSVP for:', r.program.title, 'Event:', r.event.title));

  // Get next upcoming event
  const nextEvent = rsvps[0];
  const nextEventProgramId = nextEvent?.program.id;
  
  // Get joined program IDs (programs user has RSVP'd to)
  const joinedProgramIds = new Set(rsvps.map(r => r.program.id));
  console.log('[ProgramsScreen] Joined program IDs:', Array.from(joinedProgramIds));
  
  // Separate joined and available programs
  // Exclude nextEvent program from joined programs
  const joinedPrograms = programs.filter(p => 
    joinedProgramIds.has(p.id) && p.id !== nextEventProgramId
  );
  const availablePrograms = programs.filter(p => !joinedProgramIds.has(p.id));
  
  console.log('[ProgramsScreen] Joined programs:', joinedPrograms.length);
  console.log('[ProgramsScreen] Available programs:', availablePrograms.length);

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

      {/* Next Upcoming Event Hero - Always at Top */}
      {nextEvent && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Up</Text>
          <HeroCard
            image={getImageSource(nextEvent.program.coverImage, 'program')}
            title={nextEvent.event.title}
            description={formatDateTime(nextEvent.event.startTime)}
            badge="Upcoming"
            showRsvpBadge={true}
            onPress={() => router.push({ pathname: '/program/[id]', params: { id: nextEvent.program.id } })}
          />
        </View>
      )}

      {/* My Programs Section - RSVP'd Programs (excluding Next Up) */}
      {joinedPrograms.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Programs</Text>
          <View style={styles.grid}>
            {joinedPrograms.map((program) => {
              // Find next event for this program
              const programEvent = rsvps.find(r => r.program.id === program.id);
              
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
                  onPress={() => router.push({ pathname: '/program/[id]', params: { id: program.id } })}
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
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
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

