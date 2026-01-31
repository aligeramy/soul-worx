import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiPost } from '@/lib/api-client';

type InterestType = "sports_basketball" | "poetry_arts" | "life_coaching";

const interests: {
  id: InterestType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  {
    id: "sports_basketball",
    title: "Sports / Basketball",
    description: "Training programs, drills, and coaching for basketball players",
    icon: "basketball",
    color: SoulworxColors.accent,
  },
  {
    id: "poetry_arts",
    title: "Poetry / The Arts",
    description: "Creative expression, writing workshops, and artistic community",
    icon: "create",
    color: "#9333EA",
  },
  {
    id: "life_coaching",
    title: "Life Coaching / Assistance",
    description: "Personal development, mentorship, and life guidance",
    icon: "heart",
    color: "#2563EB",
  },
];

export default function OnboardingInterestScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [selectedInterest, setSelectedInterest] = useState<InterestType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedInterest) return;

    setIsSubmitting(true);
    try {
      await apiPost('/api/onboarding/interest', { interest: selectedInterest });
      router.push('/onboarding/questions');
    } catch (error: any) {
      console.error('Error saving interest:', error);
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo-white.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Soulworx</Text>
        <Text style={styles.subtitle}>What brought you here? Select the area that interests you most.</Text>
      </View>

      {/* Interest Cards */}
      <View style={styles.cardsContainer}>
        {interests.map((interest) => {
          const isSelected = selectedInterest === interest.id;
          return (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                { borderColor: isSelected ? interest.color : SoulworxColors.border },
              ]}
              onPress={() => setSelectedInterest(interest.id)}
              disabled={isSubmitting}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${interest.color}20` }]}>
                <Ionicons name={interest.icon} size={32} color={interest.color} />
              </View>
              <Text style={styles.cardTitle}>{interest.title}</Text>
              <Text style={styles.cardDescription}>{interest.description}</Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={interest.color} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, (!selectedInterest || isSubmitting) && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!selectedInterest || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={SoulworxColors.white} />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  cardsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    ...Shadows.medium,
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  button: {
    backgroundColor: SoulworxColors.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SoulworxColors.border,
  },
  progressDotActive: {
    backgroundColor: SoulworxColors.textPrimary,
    width: 24,
  },
});
