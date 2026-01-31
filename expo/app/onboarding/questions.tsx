import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiPost, apiGet } from '@/lib/api-client';

export default function OnboardingQuestionsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [primaryInterest, setPrimaryInterest] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    goals: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await apiGet<{ primaryInterest: string; age?: number }>('/api/onboarding/user-data');
        if (data.primaryInterest) {
          setPrimaryInterest(data.primaryInterest);
          if (data.age) {
            setFormData(prev => ({ ...prev, age: data.age!.toString() }));
          }
        } else {
          router.replace('/onboarding/interest');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.replace('/onboarding/interest');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiPost('/api/onboarding/questions', {
        age: formData.age ? parseInt(formData.age) : null,
        goals: formData.goals || null,
      });

      if (primaryInterest === 'sports_basketball') {
        router.push('/onboarding/tiers');
      } else {
        router.replace('/(tabs)/programs');
      }
    } catch (error: any) {
      console.error('Error saving questions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.gold} />
      </View>
    );
  }

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
        <Text style={styles.title}>Tell Us About Yourself</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter your age"
            keyboardType="numeric"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
          <Text style={styles.helperText}>This helps us provide age-appropriate content</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>What do you hope to accomplish?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.goals}
            onChangeText={(text) => setFormData({ ...formData, goals: text })}
            placeholder="Share your goals and aspirations..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
          <Text style={styles.helperText}>Optional - Tell us what you're looking to achieve</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonSecondaryText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={SoulworxColors.white} />
            ) : (
              <Text style={styles.buttonPrimaryText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
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
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  field: {
    marginBottom: Spacing.lg,
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
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  helperText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
    marginTop: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: SoulworxColors.gold,
    ...Shadows.small,
  },
  buttonSecondary: {
    backgroundColor: SoulworxColors.charcoal,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimaryText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  buttonSecondaryText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
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
