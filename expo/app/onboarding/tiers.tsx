import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiPost, apiGet } from '@/lib/api-client';
import * as WebBrowser from 'expo-web-browser';

type TierLevel = "free" | "pro" | "pro_plus";

const tiers: {
  id: TierLevel;
  name: string;
  price: string;
  icon: keyof typeof Ionicons.glyphMap;
  features: string[];
  popular?: boolean;
}[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    icon: "lock-open",
    features: [
      "First 2 videos",
      "Rotate per month",
      "Journal",
      "Public Discord channel",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$20/month",
    icon: "star",
    features: [
      "Access to all videos right away",
      "1-2 specific programs per month",
      "Soulworx AI assistant",
      "Journal",
      "Discord Community (VIP + public)",
    ],
  },
  {
    id: "pro_plus",
    name: "Pro+",
    price: "$25/month",
    icon: "sparkles",
    features: [
      "Access to all videos right away",
      "Ability to upload videos for review",
      "Personalized programs",
      "1-2 specific programs per month",
      "Soulworx AI assistant",
      "Journal",
      "Discord Community (private + VIP + public)",
    ],
    popular: true,
  },
];

export default function OnboardingTiersScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<TierLevel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      router.replace('/(tabs)' as any);
      return;
    }
  }, [user?.role]);

  useEffect(() => {
    const checkInterest = async () => {
      try {
        const data = await apiGet<{ primaryInterest: string }>('/api/onboarding/user-data');
        if (data.primaryInterest !== 'sports_basketball') {
          router.replace('/(tabs)/programs');
        }
      } catch (error) {
        console.error('Error checking interest:', error);
      } finally {
        setLoading(false);
      }
    };
    checkInterest();
  }, []);

  const handleContinue = async () => {
    if (!selectedTier) return;

    setIsSubmitting(true);
    try {
      await apiPost('/api/onboarding/tier', { tier: selectedTier });

      // If Pro or Pro+, redirect to web for payment setup
      if (selectedTier === 'pro' || selectedTier === 'pro_plus') {
        const baseUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://beta.soulworx.ca';
        const upgradeUrl = `${baseUrl}/upgrade?tier=${selectedTier}&mobile=true&onboarding=true`;
        await WebBrowser.openBrowserAsync(upgradeUrl);
        // After payment, user will be redirected back via deep link
        // For Pro+, webhook will redirect to questionnaire
        router.replace('/(tabs)/programs');
      } else {
        // Free tier - complete onboarding
        router.replace('/(tabs)/programs');
      }
    } catch (error: any) {
      console.error('Error saving tier:', error);
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
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Select the membership tier that works best for you</Text>
      </View>

      {/* Tier Cards */}
      <View style={styles.cardsContainer}>
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                tier.popular && styles.cardPopular,
              ]}
              onPress={() => setSelectedTier(tier.id)}
              disabled={isSubmitting}
            >
              {tier.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              <View style={styles.iconContainer}>
                <Ionicons name={tier.icon} size={40} color={SoulworxColors.gold} />
              </View>
              <Text style={styles.cardTitle}>{tier.name}</Text>
              <Text style={styles.cardPrice}>{tier.price}</Text>
              <View style={styles.featuresContainer}>
                {tier.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Ionicons name="checkmark-circle" size={16} color={SoulworxColors.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={SoulworxColors.gold} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, (!selectedTier || isSubmitting) && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!selectedTier || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={SoulworxColors.white} />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
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
    borderColor: SoulworxColors.gold,
    borderWidth: 3,
  },
  cardPopular: {
    borderColor: '#9333EA',
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: '#9333EA',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  popularText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  cardPrice: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.gold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  featuresContainer: {
    gap: Spacing.sm,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    flex: 1,
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
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
