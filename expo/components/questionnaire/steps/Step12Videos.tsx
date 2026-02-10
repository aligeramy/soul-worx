import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SoulworxColors, Spacing, Typography } from '@/constants/colors';
import { useQuestionnaire } from '../QuestionnaireContext';
import { StepProgressBar } from '../StepIndicator';
import { VideoUploader, MultiVideoUploader } from '../inputs/VideoUploader';

export function Step12Videos() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />

      <Text style={styles.title}>Video Uploads</Text>
      <Text style={styles.subtitle}>
        Share your game footage with your coach (optional)
      </Text>

      {/* Game Film */}
      <View style={styles.field}>
        <VideoUploader
          label="Game Film"
          placeholder="Upload Game Film"
          value={formData.gameFilmUrl || null}
          onChange={(url) => updateField('gameFilmUrl', url || '')}
        />
        <Text style={styles.hint}>
          Upload a video of you playing in a game or scrimmage
        </Text>
      </View>

      {/* Workout Videos */}
      <View style={styles.field}>
        <MultiVideoUploader
          label="Workout Videos"
          values={formData.workoutVideos}
          onChange={(urls) => updateField('workoutVideos', urls)}
          maxVideos={3}
        />
        <Text style={styles.hint}>
          Upload videos of your training sessions or skill work
        </Text>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Note</Text>
        <Text style={styles.noteText}>
          Video uploads are optional but highly recommended. They help your coach understand your current skill level and create a more effective training program.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  field: {
    marginBottom: Spacing.xl,
  },
  hint: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  noteCard: {
    backgroundColor: `${SoulworxColors.gold}15`,
    borderRadius: Spacing.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: SoulworxColors.gold,
  },
  noteTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  noteText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: 20,
  },
});
