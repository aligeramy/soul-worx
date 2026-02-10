import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
import { useQuestionnaire } from '../QuestionnaireContext';
import { StepProgressBar } from '../StepIndicator';
import { DayPicker } from '../inputs/DayPicker';

const EQUIPMENT_OPTIONS = ['Full gym', 'Half gym', 'Driveway', 'Park'] as const;
const SESSION_LENGTHS = [30, 45, 60] as const;

export function Step9Equipment() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />

      <Text style={styles.title}>Equipment & Availability</Text>
      <Text style={styles.subtitle}>
        Tell us about your training environment and schedule
      </Text>

      {/* Equipment Access */}
      <View style={styles.field}>
        <Text style={styles.label}>Access to equipment *</Text>
        <View style={styles.optionsGrid}>
          {EQUIPMENT_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.optionButton,
                formData.equipmentAccess === option && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('equipmentAccess', option)}
            >
              <Text style={[
                styles.optionText,
                formData.equipmentAccess === option && styles.optionTextSelected,
              ]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Training Days */}
      <View style={styles.field}>
        <Text style={styles.label}>Days you can train *</Text>
        <DayPicker
          selectedDays={formData.trainingDays}
          onChange={(days) => updateField('trainingDays', days)}
        />
      </View>

      {/* Session Length */}
      <View style={styles.field}>
        <Text style={styles.label}>Average session length (minutes)</Text>
        <View style={styles.optionsGrid}>
          {SESSION_LENGTHS.map((length) => (
            <Pressable
              key={length}
              style={({ pressed }) => [
                styles.optionButton,
                formData.averageSessionLength === length && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('averageSessionLength', length)}
            >
              <Text style={[
                styles.optionText,
                formData.averageSessionLength === length && styles.optionTextSelected,
              ]}>
                {length} min
              </Text>
            </Pressable>
          ))}
        </View>
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
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
