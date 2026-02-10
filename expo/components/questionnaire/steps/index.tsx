import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
import { useQuestionnaire, QuestionnaireFormData } from '../QuestionnaireContext';
import { StepProgressBar } from '../StepIndicator';
import { RatingSlider } from '../inputs/RatingSlider';

// Step 1 - exported from separate file
export { Step1BasicInfo } from './Step1BasicInfo';

// Step 2: Position & Experience
export function Step2Position() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();
  const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'] as const;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Position & Experience</Text>
      <Text style={styles.subtitle}>Tell us about your basketball background</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Position *</Text>
        <View style={styles.optionsGrid}>
          {POSITIONS.map((pos) => (
            <Pressable
              key={pos}
              style={({ pressed }) => [
                styles.optionButton,
                formData.position === pos && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('position', pos)}
            >
              <Text style={[styles.optionText, formData.position === pos && styles.optionTextSelected]}>{pos}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Years playing basketball</Text>
        <TextInput
          style={styles.input}
          value={formData.yearsPlaying}
          onChangeText={(text) => updateField('yearsPlaying', text)}
          placeholder="e.g., 5 years"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
      </View>
    </ScrollView>
  );
}

// Step 3: Goals
export function Step3Goals() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Your Goals</Text>
      <Text style={styles.subtitle}>What do you want to achieve with your training?</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Current goals - This Year</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.currentGoalsYearly}
          onChangeText={(text) => updateField('currentGoalsYearly', text)}
          placeholder="What do you want to achieve this year?"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Long-term Goals</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.currentGoalsOverall}
          onChangeText={(text) => updateField('currentGoalsOverall', text)}
          placeholder="What are your ultimate basketball goals?"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
      </View>
    </ScrollView>
  );
}

// Step 4 - exported from separate file
export { Step4Rankings } from './Step4Rankings';

// Step 5: Physical Stats
export function Step5Physical() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Physical Stats</Text>
      <Text style={styles.subtitle}>Help us understand your physical attributes</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={formData.weight}
          onChangeText={(text) => updateField('weight', text)}
          placeholder="Enter your weight"
          keyboardType="numeric"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Height</Text>
        <TextInput
          style={styles.input}
          value={formData.height}
          onChangeText={(text) => updateField('height', text)}
          placeholder="e.g., 6'2 or 188cm"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Current injuries (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.currentInjuries}
          onChangeText={(text) => updateField('currentInjuries', text)}
          placeholder="List any current injuries or physical limitations..."
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
      </View>
    </ScrollView>
  );
}

// Step 6: Training & Health
export function Step6Training() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();

  const ToggleButton = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.toggleContainer}>
        <Pressable
          style={({ pressed }) => [styles.toggleButton, value && styles.toggleButtonActive, pressed && styles.optionButtonPressed]}
          onPress={() => onChange(true)}
        >
          <Text style={[styles.toggleText, value && styles.toggleTextActive]}>Yes</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.toggleButton, !value && styles.toggleButtonActive, pressed && styles.optionButtonPressed]}
          onPress={() => onChange(false)}
        >
          <Text style={[styles.toggleText, !value && styles.toggleTextActive]}>No</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Training & Health</Text>
      <Text style={styles.subtitle}>Tell us about your current training habits</Text>

      <ToggleButton
        label="Are you seeing physiotherapy?"
        value={formData.seeingPhysiotherapy}
        onChange={(v) => updateField('seeingPhysiotherapy', v)}
      />
      <ToggleButton
        label="Do you weight train?"
        value={formData.weightTrains}
        onChange={(v) => updateField('weightTrains', v)}
      />
      <ToggleButton
        label="Do you stretch regularly?"
        value={formData.stretches}
        onChange={(v) => updateField('stretches', v)}
      />
    </ScrollView>
  );
}

// Step 7: Team & Competition
export function Step7Team() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();
  const TEAMS = ['No Team', 'Elementary', 'Middle School', 'Highschool', 'College', 'Pro'] as const;
  const OUTSIDE_TEAMS = ['AAU', 'Prep', 'No team'] as const;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Team & Competition</Text>
      <Text style={styles.subtitle}>Tell us about your current team situation</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Current Team *</Text>
        <View style={styles.optionsGrid}>
          {TEAMS.map((team) => (
            <Pressable
              key={team}
              style={({ pressed }) => [
                styles.optionButton,
                formData.currentTeam === team && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('currentTeam', team as any)}
            >
              <Text style={[styles.optionText, formData.currentTeam === team && styles.optionTextSelected]}>{team}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Outside school teams</Text>
        <View style={styles.optionsGrid}>
          {OUTSIDE_TEAMS.map((team) => (
            <Pressable
              key={team}
              style={({ pressed }) => [
                styles.optionButton,
                formData.outsideSchoolTeams === team && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('outsideSchoolTeams', team as any)}
            >
              <Text style={[styles.optionText, formData.outsideSchoolTeams === team && styles.optionTextSelected]}>{team}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Season status</Text>
        <View style={styles.toggleContainer}>
          <Pressable
            style={({ pressed }) => [styles.toggleButton, formData.inSeason && styles.toggleButtonActive, pressed && styles.optionButtonPressed]}
            onPress={() => updateField('inSeason', true)}
          >
            <Text style={[styles.toggleText, formData.inSeason && styles.toggleTextActive]}>In Season</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.toggleButton, !formData.inSeason && styles.toggleButtonActive, pressed && styles.optionButtonPressed]}
            onPress={() => updateField('inSeason', false)}
          >
            <Text style={[styles.toggleText, !formData.inSeason && styles.toggleTextActive]}>Off Season</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

// Step 8: Basketball Watching
export function Step8Watching() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();
  const OPTIONS = ['Your own film', 'NBA/Pro/College', 'Both', 'None'] as const;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Basketball Watching</Text>
      <Text style={styles.subtitle}>How do you study the game?</Text>

      <View style={styles.field}>
        <Text style={styles.label}>What type of basketball do you watch?</Text>
        <View style={styles.optionsGrid}>
          {OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.optionButton,
                { minWidth: '45%' },
                formData.basketballWatching === option && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('basketballWatching', option)}
            >
              <Text style={[styles.optionText, formData.basketballWatching === option && styles.optionTextSelected]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Step 9 - exported from separate file
export { Step9Equipment } from './Step9Equipment';

// Step 10: Mental & Mindset
export function Step10Mental() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();
  const CHALLENGES = ['Fear of failure', 'Consistency', 'Pressure', 'Motivation', 'Other'] as const;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Mental & Mindset</Text>
      <Text style={styles.subtitle}>Understanding your mental game</Text>

      <View style={styles.field}>
        <Text style={styles.label}>What's your biggest struggle?</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.biggestStruggle}
          onChangeText={(text) => updateField('biggestStruggle', text)}
          placeholder="Tell us about your biggest challenge..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={SoulworxColors.textTertiary}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confidence Level</Text>
        <RatingSlider
          value={formData.confidenceLevel}
          onChange={(v) => updateField('confidenceLevel', v)}
          labels={['Low', 'High']}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Mental Challenge</Text>
        <View style={styles.optionsGrid}>
          {CHALLENGES.map((challenge) => (
            <Pressable
              key={challenge}
              style={({ pressed }) => [
                styles.optionButton,
                { minWidth: '45%' },
                formData.mentalChallenge === challenge && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('mentalChallenge', challenge as any)}
            >
              <Text style={[styles.optionText, formData.mentalChallenge === challenge && styles.optionTextSelected]}>{challenge}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {formData.mentalChallenge === 'Other' && (
        <View style={styles.field}>
          <Text style={styles.label}>Please specify</Text>
          <TextInput
            style={styles.input}
            value={formData.mentalChallengeOther}
            onChangeText={(text) => updateField('mentalChallengeOther', text)}
            placeholder="Describe your mental challenge..."
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>
      )}
    </ScrollView>
  );
}

// Step 11: Coaching Preferences
export function Step11Coaching() {
  const { formData, updateField, currentStep, totalSteps } = useQuestionnaire();
  const STYLES = ['Direct', 'Encouraging', 'Accountability', 'Driven', 'Mix', 'Other'] as const;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StepProgressBar current={currentStep} total={totalSteps} />
      <Text style={styles.title}>Coaching Preferences</Text>
      <Text style={styles.subtitle}>How do you learn best?</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Coachability</Text>
        <RatingSlider
          value={formData.coachability}
          onChange={(v) => updateField('coachability', v)}
          labels={['Needs work', 'Very coachable']}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Preferred Coaching Style</Text>
        <View style={styles.optionsGrid}>
          {STYLES.map((style) => (
            <Pressable
              key={style}
              style={({ pressed }) => [
                styles.optionButton,
                { minWidth: '30%' },
                formData.preferredCoachingStyle === style && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => updateField('preferredCoachingStyle', style as any)}
            >
              <Text style={[styles.optionText, formData.preferredCoachingStyle === style && styles.optionTextSelected]}>{style}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {formData.preferredCoachingStyle === 'Other' && (
        <View style={styles.field}>
          <Text style={styles.label}>Please specify</Text>
          <TextInput
            style={styles.input}
            value={formData.coachingStyleOther}
            onChangeText={(text) => updateField('coachingStyleOther', text)}
            placeholder="Describe your preferred coaching style..."
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>
      )}
    </ScrollView>
  );
}

// Step 12 - exported from separate file
export { Step12Videos } from './Step12Videos';

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  title: { fontSize: Typography['2xl'], fontWeight: Typography.bold, color: SoulworxColors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.base, color: SoulworxColors.textSecondary, marginBottom: Spacing.xl, lineHeight: 22 },
  field: { marginBottom: Spacing.xl },
  label: { fontSize: Typography.base, fontWeight: Typography.semibold, color: SoulworxColors.textPrimary, marginBottom: Spacing.sm },
  input: { backgroundColor: SoulworxColors.beige, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: Typography.base, color: SoulworxColors.textOnLight, borderWidth: 1, borderColor: SoulworxColors.border },
  textArea: { minHeight: 100, paddingTop: Spacing.md },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  optionButton: { flex: 1, minWidth: '30%', padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 2, borderColor: SoulworxColors.border, backgroundColor: SoulworxColors.beige, alignItems: 'center' },
  optionButtonSelected: { borderColor: SoulworxColors.gold, backgroundColor: `${SoulworxColors.gold}20` },
  optionButtonPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  optionText: { fontSize: Typography.base, fontWeight: Typography.medium, color: SoulworxColors.textOnLight },
  optionTextSelected: { color: SoulworxColors.brandBrown, fontWeight: Typography.semibold },
  toggleContainer: { flexDirection: 'row', gap: Spacing.sm },
  toggleButton: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 2, borderColor: SoulworxColors.border, backgroundColor: SoulworxColors.beige, alignItems: 'center' },
  toggleButtonActive: { borderColor: SoulworxColors.gold, backgroundColor: `${SoulworxColors.gold}20` },
  toggleText: { fontSize: Typography.base, color: SoulworxColors.textOnLight },
  toggleTextActive: { color: SoulworxColors.brandBrown, fontWeight: Typography.semibold },
});
