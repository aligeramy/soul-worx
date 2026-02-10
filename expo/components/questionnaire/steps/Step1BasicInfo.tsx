import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
import { useQuestionnaire } from '../QuestionnaireContext';
import { StepProgressBar } from '../StepIndicator';

const SKILL_LEVELS = ['beginner', 'advanced', 'pro'] as const;

export function Step1BasicInfo() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />

      <Text style={styles.title}>Tell us about yourself</Text>
      <Text style={styles.subtitle}>
        This helps us create a personalized training program for you
      </Text>

      {/* Age */}
      <View style={styles.field}>
        <Text style={styles.label}>Age *</Text>
        <View style={styles.ageInputContainer}>
          <TextInput
            style={styles.ageInput}
            value={formData.age}
            onChangeText={(text) => {
              const numericValue = text.replace(/\D/g, '');
              if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 120)) {
                updateField('age', numericValue);
              }
            }}
            placeholder="Enter your age"
            keyboardType="numeric"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
          <Text style={styles.ageSuffix}>years old</Text>
        </View>
      </View>

      {/* Skill Level */}
      <View style={styles.field}>
        <Text style={styles.label}>Skill Level *</Text>
        <View style={styles.optionsGrid}>
          {SKILL_LEVELS.map((level) => (
            <Pressable
              key={level}
              style={({ pressed }) => [
                styles.optionButton,
                formData.skillLevel === level && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('skillLevel', level)}
            >
              <Text style={[
                styles.optionText,
                formData.skillLevel === level && styles.optionTextSelected,
              ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Game Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Describe your game</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.gameDescription}
          onChangeText={(text) => updateField('gameDescription', text)}
          placeholder="Tell us about your playing style, strengths, and what makes you unique..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
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
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    paddingRight: Spacing.md,
  },
  ageInput: {
    flex: 1,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
  },
  ageSuffix: {
    fontSize: Typography.base,
    color: SoulworxColors.textTertiary,
    marginLeft: Spacing.xs,
  },
  textArea: {
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: '30%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  optionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  optionText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: SoulworxColors.textOnLight,
  },
  optionTextSelected: {
    color: SoulworxColors.brandBrown,
    fontWeight: Typography.semibold,
  },
});
