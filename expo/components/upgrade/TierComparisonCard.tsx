import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

interface TierFeature {
  name: string;
  free: boolean;
  pro: boolean;
  proPlus: boolean;
}

const TIER_FEATURES: TierFeature[] = [
  { name: 'Community Channel Access', free: true, pro: true, proPlus: true },
  { name: 'Program Resources', free: true, pro: true, proPlus: true },
  { name: 'Premium Content', free: false, pro: true, proPlus: true },
  { name: 'Exclusive Videos', free: false, pro: true, proPlus: true },
  { name: 'Discord Access', free: false, pro: true, proPlus: true },
  { name: 'Personalized Programs', free: false, pro: false, proPlus: true },
  { name: '1-on-1 Coaching', free: false, pro: false, proPlus: true },
  { name: 'Custom Training Plans', free: false, pro: false, proPlus: true },
  { name: 'Video Analysis', free: false, pro: false, proPlus: true },
];

interface TierComparisonCardProps {
  currentTier: 'free' | 'pro' | 'pro_plus';
  highlightTier?: 'pro' | 'pro_plus';
}

export function TierComparisonCard({ currentTier, highlightTier = 'pro_plus' }: TierComparisonCardProps) {
  const getTierName = (tier: 'free' | 'pro' | 'pro_plus') => {
    switch (tier) {
      case 'free': return 'Free';
      case 'pro': return 'Pro';
      case 'pro_plus': return 'Pro+';
    }
  };

  const isCurrentTier = (tier: 'free' | 'pro' | 'pro_plus') => currentTier === tier;
  const isHighlighted = (tier: 'free' | 'pro' | 'pro_plus') => tier === highlightTier;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        {(['free', 'pro', 'pro_plus'] as const).map((tier) => (
          <View
            key={tier}
            style={[
              styles.tierHeader,
              isHighlighted(tier) && styles.tierHeaderHighlighted,
            ]}
          >
            <Text style={[styles.tierName, isHighlighted(tier) && styles.tierNameHighlighted]}>
              {getTierName(tier)}
            </Text>
            {isCurrentTier(tier) && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Features */}
      {TIER_FEATURES.map((feature, index) => (
        <View
          key={feature.name}
          style={[styles.featureRow, index % 2 === 0 && styles.featureRowAlt]}
        >
          <View style={styles.featureName}>
            <Text style={styles.featureNameText}>{feature.name}</Text>
          </View>
          {(['free', 'pro', 'proPlus'] as const).map((tier) => {
            const hasFeature = feature[tier];
            const tierKey = tier === 'proPlus' ? 'pro_plus' : tier;
            return (
              <View
                key={tier}
                style={[
                  styles.featureCell,
                  isHighlighted(tierKey) && styles.featureCellHighlighted,
                ]}
              >
                <Ionicons
                  name={hasFeature ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={hasFeature ? SoulworxColors.success : SoulworxColors.textTertiary}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

interface TierBenefitsCardProps {
  tier: 'pro' | 'pro_plus';
}

export function TierBenefitsCard({ tier }: TierBenefitsCardProps) {
  const benefits = tier === 'pro_plus'
    ? [
        { icon: 'fitness' as const, title: 'Personalized Programs', description: 'Custom training plans built just for you' },
        { icon: 'person' as const, title: '1-on-1 Coaching', description: 'Direct access to professional coaches' },
        { icon: 'videocam' as const, title: 'Video Analysis', description: 'Get feedback on your game footage' },
        { icon: 'calendar' as const, title: 'Weekly Check-ins', description: 'Regular progress reviews and adjustments' },
        { icon: 'chatbubbles' as const, title: 'Priority Support', description: 'Fast responses to all your questions' },
      ]
    : [
        { icon: 'play-circle' as const, title: 'Premium Content', description: 'Access exclusive training videos' },
        { icon: 'logo-discord' as const, title: 'Discord Access', description: 'Join our private community' },
        { icon: 'library' as const, title: 'Full Video Library', description: 'Unlimited access to all content' },
        { icon: 'notifications' as const, title: 'Early Access', description: 'Be first to see new content' },
      ];

  return (
    <View style={styles.benefitsContainer}>
      <Text style={styles.benefitsTitle}>
        {tier === 'pro_plus' ? 'Pro+ Benefits' : 'Pro Benefits'}
      </Text>
      {benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            <Ionicons name={benefit.icon} size={24} color={SoulworxColors.gold} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitDescription}>{benefit.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  headerSpacer: {
    flex: 2,
    padding: Spacing.md,
  },
  tierHeader: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: SoulworxColors.border,
  },
  tierHeaderHighlighted: {
    backgroundColor: 'rgba(232, 213, 183, 0.1)',
  },
  tierName: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  tierNameHighlighted: {
    color: SoulworxColors.gold,
  },
  currentBadge: {
    marginTop: 4,
    backgroundColor: SoulworxColors.gold,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: Typography.semibold,
    color: SoulworxColors.charcoal,
  },
  featureRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  featureRowAlt: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  featureName: {
    flex: 2,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  featureNameText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  featureCell: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: SoulworxColors.border,
  },
  featureCellHighlighted: {
    backgroundColor: 'rgba(232, 213, 183, 0.05)',
  },
  benefitsContainer: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  benefitsTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(232, 213, 183, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
});
