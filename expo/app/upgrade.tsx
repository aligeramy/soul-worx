import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiPost } from '@/lib/api-client';
import * as WebBrowser from 'expo-web-browser';

const tiers = [
  {
    id: "pro" as const,
    name: "Pro",
    price: "$20",
    priceNote: "per month",
    icon: "star" as keyof typeof Ionicons.glyphMap,
    features: [
      "Access to all videos right away",
      "1-2 specific programs per month",
      "Soulworx AI assistant",
      "Journal",
      "Discord Community (VIP + public)",
    ],
  },
  {
    id: "pro_plus" as const,
    name: "Pro+",
    price: "$25",
    priceNote: "per month",
    icon: "sparkles" as keyof typeof Ionicons.glyphMap,
    features: [
      "Everything in Pro",
      "Ability to upload videos for review",
      "Personalized programs",
      "1-2 specific per month",
      "Private Discord channel + VIP + public",
    ],
    popular: true,
  },
];

export default function UpgradeScreen() {
  const insets = useSafeAreaInsets();
  const { user, tier } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async (tierSlug: "pro" | "pro_plus") => {
    setIsProcessing(true);

    try {
      const response = await apiPost<{ url?: string; redirectToWeb?: boolean; webUrl?: string }>(
        '/api/community/upgrade-mobile',
        { tierSlug }
      );

      if (response.redirectToWeb && response.webUrl) {
        // No payment method on file - redirect to web
        Alert.alert(
          'Complete Payment Setup',
          'Please complete your payment setup on our website. You\'ll be redirected back to the app.',
          [
            {
              text: 'Continue',
              onPress: () => {
                WebBrowser.openBrowserAsync(response.webUrl!);
              },
            },
          ]
        );
      } else if (response.url) {
        // Open Stripe checkout in browser
        const result = await WebBrowser.openBrowserAsync(response.url);
        
        if (result.type === 'cancel') {
          Alert.alert('Cancelled', 'Upgrade was cancelled');
        } else {
          // Success - webhook will handle the rest
          Alert.alert('Success', 'Your upgrade is being processed. Please refresh the app.');
          router.back();
        }
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error upgrading:', error);
      Alert.alert('Error', error.message || 'Failed to start upgrade. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentTierLevel = tier?.level || 'free';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Upgrade Membership</Text>
      </View>

      <View style={styles.headerContent}>
        <Image
          source={require('@/assets/images/logo-white.png')}
          style={styles.logo}
          contentFit="contain"
          transition={200}
        />
        <Text style={styles.title}>
          {currentTierLevel === "free"
            ? "Choose Your Plan"
            : currentTierLevel === "pro"
            ? "Upgrade to Pro+"
            : "You're All Set!"}
        </Text>
        <Text style={styles.subtitle}>
          {currentTierLevel === "free"
            ? "Unlock premium features and personalized training"
            : currentTierLevel === "pro"
            ? "Get personalized programs, video reviews, and private coaching"
            : "You're already on the highest tier!"}
        </Text>
      </View>

      {/* Tier Cards */}
      <View style={styles.cardsContainer}>
        {tiers.map((tierOption) => {
          const isCurrentTier =
            (tierOption.id === "pro" && currentTierLevel === "pro") ||
            (tierOption.id === "pro_plus" && currentTierLevel === "pro_plus");

          return (
            <View
              key={tierOption.id}
              style={[
                styles.card,
                tierOption.popular && styles.cardPopular,
                isCurrentTier && styles.cardCurrent,
              ]}
            >
              {tierOption.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <Ionicons name={tierOption.icon} size={32} color={SoulworxColors.gold} />
                </View>
              </View>
              <Text style={styles.cardTitle}>{tierOption.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.cardPrice}>{tierOption.price}</Text>
                <Text style={styles.priceNote}>{tierOption.priceNote}</Text>
              </View>
              <View style={styles.featuresContainer}>
                {tierOption.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Ionicons name="checkmark-circle" size={16} color={SoulworxColors.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              {isCurrentTier ? (
                <View style={styles.currentButton}>
                  <Text style={styles.currentButtonText}>Current Plan</Text>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.upgradeButton,
                    isProcessing && styles.buttonDisabled,
                    pressed && styles.upgradeButtonPressed,
                  ]}
                  onPress={() => handleUpgrade(tierOption.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={SoulworxColors.white} />
                  ) : (
                    <Text style={styles.upgradeButtonText}>
                      {currentTierLevel === "free" ? "Upgrade to " : "Switch to "}
                      {tierOption.name}
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
          );
        })}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  headerContent: {
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
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 22,
  },
  cardsContainer: {
    gap: Spacing.md,
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
  cardPopular: {
    borderColor: '#9333EA',
  },
  cardCurrent: {
    borderColor: SoulworxColors.gold,
    opacity: 0.8,
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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  cardTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardPrice: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.gold,
    textAlign: 'center',
  },
  priceNote: {
    fontSize: Typography.sm,
    fontWeight: '400' as const,
    color: SoulworxColors.textSecondary,
    marginTop: 2,
  },
  featuresContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  featureText: {
    flex: 1,
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  upgradeButton: {
    backgroundColor: SoulworxColors.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.medium,
  },
  upgradeButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  upgradeButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  currentButton: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  currentButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textSecondary,
  },
});
