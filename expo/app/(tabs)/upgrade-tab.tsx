import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { TierBenefitsCard } from '@/components/upgrade/TierComparisonCard';
import { UpgradeButton } from '@/components/upgrade/UpgradeButton';

export default function UpgradeTabScreen() {
  const insets = useSafeAreaInsets();
  const { tier, refreshSession } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  const currentTierLevel = tier?.level || 'free';
  const isFree = currentTierLevel === 'free';
  const isPro = currentTierLevel === 'pro';

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshSession();
    setRefreshing(false);
  };

  const handleUpgradeComplete = async () => {
    await refreshSession();
    // If user upgraded to Pro+, redirect to programs (My Programs is at top there)
    if (tier?.level === 'pro_plus') {
      router.replace('/(tabs)/programs');
    }
  };

  // Redirect Pro+ users to programs tab
  React.useEffect(() => {
    if (tier?.level === 'pro_plus') {
      router.replace('/(tabs)/programs');
    }
  }, [tier]);

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
        <View style={styles.iconContainer}>
          <Ionicons name="star" size={32} color={SoulworxColors.gold} />
        </View>
        <Text style={styles.title}>
          {isFree ? 'Unlock Your Potential' : 'Go Pro+'}
        </Text>
        <Text style={styles.subtitle}>
          {isFree
            ? 'Take your game to the next level with premium training content and personalized coaching'
            : 'Get personalized training programs and 1-on-1 coaching'}
        </Text>
      </View>

      {/* Current Tier */}
      <View style={styles.currentTierCard}>
        <View style={styles.currentTierHeader}>
          <Text style={styles.currentTierLabel}>Current Plan</Text>
          <View style={styles.currentTierBadge}>
            <Text style={styles.currentTierBadgeText}>
              {tier?.name || 'Free'}
            </Text>
          </View>
        </View>
        {isFree && (
          <Text style={styles.currentTierDescription}>
            You&apos;re on the free plan. Upgrade to unlock exclusive content and features.
          </Text>
        )}
        {isPro && (
          <Text style={styles.currentTierDescription}>
            You have Pro access. Upgrade to Pro+ for personalized coaching and training programs.
          </Text>
        )}
      </View>

      {/* Pro+ Benefits (always show for non Pro+ users) */}
      <TierBenefitsCard tier="pro_plus" />

      {/* Pro Benefits (only for free users) */}
      {isFree && (
        <View style={styles.proBenefitsSection}>
          <TierBenefitsCard tier="pro" />
        </View>
      )}

      {/* Upgrade Buttons */}
      <View style={styles.upgradeSection}>
        <Text style={styles.upgradeSectionTitle}>Choose Your Plan</Text>

        {/* Pro+ Option */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planBadge}>
              <Ionicons name="star" size={16} color={SoulworxColors.charcoal} />
              <Text style={styles.planBadgeText}>Most Popular</Text>
            </View>
          </View>
          <View style={styles.planContent}>
            <Text style={styles.planName}>Pro+</Text>
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>$25.00</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
            <Text style={styles.planDescription}>
              Personalized training, 1-on-1 coaching, and everything in Pro
            </Text>
          </View>
          <UpgradeButton
            targetTier="pro_plus"
            variant="primary"
            onUpgradeComplete={handleUpgradeComplete}
          />
        </View>

        {/* Pro Option (only for free users) */}
        {isFree && (
          <View style={[styles.planCard, styles.planCardSecondary]}>
            <View style={styles.planContent}>
              <Text style={styles.planName}>Pro</Text>
              <View style={styles.planPricing}>
                <Text style={styles.planPrice}>$9.99</Text>
                <Text style={styles.planPeriod}>/month</Text>
              </View>
              <Text style={styles.planDescription}>
                Premium content, Discord access, and exclusive videos
              </Text>
            </View>
            <UpgradeButton
              targetTier="pro"
              variant="secondary"
              onUpgradeComplete={handleUpgradeComplete}
            />
          </View>
        )}
      </View>

      {/* FAQ */}
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
          <Text style={styles.faqAnswer}>
            Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>What&apos;s included in personalized programs?</Text>
          <Text style={styles.faqAnswer}>
            Pro+ members get custom training programs created by professional coaches based on your skill level, goals, and schedule.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I get my personalized program?</Text>
          <Text style={styles.faqAnswer}>
            After upgrading to Pro+, complete the questionnaire about your skills and goals. Your coach will create a custom program within 48 hours.
          </Text>
        </View>
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
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SoulworxColors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
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
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  currentTierCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  currentTierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  currentTierLabel: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  currentTierBadge: {
    backgroundColor: SoulworxColors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  currentTierBadgeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: SoulworxColors.charcoal,
  },
  currentTierDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: 20,
  },
  proBenefitsSection: {
    marginTop: Spacing.lg,
  },
  upgradeSection: {
    marginTop: Spacing.xl,
  },
  upgradeSectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  planCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: SoulworxColors.gold,
    ...Shadows.medium,
  },
  planCardSecondary: {
    borderColor: SoulworxColors.border,
  },
  planHeader: {
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: SoulworxColors.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  planBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.charcoal,
  },
  planContent: {
    marginBottom: Spacing.lg,
  },
  planName: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  planPrice: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.gold,
  },
  planPeriod: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginLeft: Spacing.xs,
  },
  planDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: 20,
  },
  faqSection: {
    marginTop: Spacing.xxl,
  },
  faqTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  faqItem: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  faqQuestion: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  faqAnswer: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: 20,
  },
});
