import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
import { useQuestionnaire } from '../QuestionnaireContext';
import { StepProgressBar } from '../StepIndicator';
import { RatingSlider } from '../inputs/RatingSlider';

const SKILL_AREAS = [
  { key: 'ballHandling', label: 'Ball Handling' },
  { key: 'defence', label: 'Defence' },
  { key: 'finishing', label: 'Finishing' },
  { key: 'shooting', label: 'Shooting' },
  { key: 'passing', label: 'Passing' },
] as const;

export function Step4Rankings() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();

  const updateRanking = (skill: keyof typeof formData.improvementRankings, value: number | { text: string; rank: number }) => {
    updateField('improvementRankings', {
      ...formData.improvementRankings,
      [skill]: value,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />

      <Text style={styles.title}>Improvement Rankings</Text>
      <Text style={styles.subtitle}>
        Rate each area from 1 (needs most improvement) to 5 (needs least improvement)
      </Text>

      {SKILL_AREAS.map(({ key, label }) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <RatingSlider
            value={formData.improvementRankings[key] as number}
            onChange={(value) => updateRanking(key, value)}
            labels={['Needs work', 'Strong']}
          />
        </View>
      ))}

      {/* Other skill */}
      <View style={styles.field}>
        <Text style={styles.label}>Other (optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.improvementRankings.other.text}
          onChangeText={(text) =>
            updateRanking('other', {
              ...formData.improvementRankings.other,
              text,
            })
          }
          placeholder="Any other skill you want to improve?"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
        {formData.improvementRankings.other.text && (
          <View style={styles.otherRating}>
            <RatingSlider
              value={formData.improvementRankings.other.rank}
              onChange={(value) =>
                updateRanking('other', {
                  ...formData.improvementRankings.other,
                  rank: value,
                })
              }
              labels={['Needs work', 'Strong']}
            />
          </View>
        )}
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
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    marginBottom: Spacing.sm,
  },
  otherRating: {
    marginTop: Spacing.sm,
  },
});
