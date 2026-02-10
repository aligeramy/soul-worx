import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import type { MembershipTier } from '@/lib/types';
// TODO: When integrating real upgrade flow, uncomment:
// import * as WebBrowser from 'expo-web-browser';
// import { apiPost } from '@/lib/api-client';

interface UpgradeButtonProps {
  targetTier: 'pro' | 'pro_plus';
  variant?: 'primary' | 'secondary';
  onUpgradeComplete?: () => void;
}

const createLocalTier = (level: 'pro' | 'pro_plus'): MembershipTier => ({
  id: `${level}-tier`,
  name: level === 'pro_plus' ? 'Pro+' : 'Pro',
  slug: level,
  level,
  description: level === 'pro_plus' ? 'Pro+ tier' : 'Pro tier',
  features: [],
  accessLevel: level === 'pro_plus' ? 3 : 2,
  price: level === 'pro_plus' ? '25' : '9.99',
  billingPeriod: 'monthly',
  stripePriceId: null,
  discordRoleId: null,
  dmAccessEnabled: false,
  isActive: true,
  sortOrder: level === 'pro_plus' ? 3 : 2,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export function UpgradeButton({
  targetTier,
  variant = 'primary',
  onUpgradeComplete,
}: UpgradeButtonProps) {
  const { user, setTierLocally } = useUser();
  const [loading, setLoading] = useState(false);

  const tierLabel = targetTier === 'pro_plus' ? 'Pro+' : 'Pro';
  const price = targetTier === 'pro_plus' ? '$25.00/mo' : '$9.99/mo';

  const handleUpgrade = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Please sign in to upgrade');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      // LOCAL/TEST: Upgrade without Stripe or API. Tier updates immediately in app.
      // TODO: Replace with real flow when ready:
      // 1. POST to /api/community/upgrade-mobile with tierSlug
      // 2. Open Stripe checkout URL in WebBrowser (or redirect to web if no payment method)
      // 3. On return, call refreshSession() to sync tier from backend
      /*
      const response = await apiPost<{ url: string; redirectToWeb?: boolean; webUrl?: string }>(
        '/api/community/upgrade-mobile',
        { tierSlug: targetTier }
      );
      if (response.url) {
        const result = await WebBrowser.openBrowserAsync(response.url, { ... });
        if (result.type === 'dismiss' || result.type === 'cancel') {
          await refreshSession();
          onUpgradeComplete?.();
        }
      }
      */
      const newTier = createLocalTier(targetTier);
      setTierLocally(newTier);
      // Don't call onUpgradeComplete here - it triggers refreshSession() which would overwrite
      // our local tier with DB. The upgrade-tab's useEffect will redirect Pro+ users to my-programs.
      // When integrating real flow: call onUpgradeComplete after Stripe return so parent can refreshSession.
    } catch (error) {
      console.error('Error starting upgrade:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Upgrade Failed',
        error instanceof Error ? error.message : 'Failed to start upgrade process. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
        pressed && styles.buttonPressed,
        loading && styles.buttonDisabled,
      ]}
      onPress={handleUpgrade}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? SoulworxColors.charcoal : SoulworxColors.gold} />
      ) : (
        <>
          <View style={styles.buttonContent}>
            <Ionicons
              name="arrow-up-circle"
              size={24}
              color={variant === 'primary' ? SoulworxColors.charcoal : SoulworxColors.gold}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.buttonText, variant === 'secondary' && styles.buttonTextSecondary]}>
                Upgrade to {tierLabel}
              </Text>
              <Text style={[styles.priceText, variant === 'secondary' && styles.priceTextSecondary]}>
                {price}
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={variant === 'primary' ? SoulworxColors.charcoal : SoulworxColors.gold}
          />
        </>
      )}
    </Pressable>
  );
}

interface UpgradeCardProps {
  currentTier: 'free' | 'pro' | 'pro_plus';
  onUpgradeComplete?: () => void;
}

export function UpgradeCard({ currentTier, onUpgradeComplete }: UpgradeCardProps) {
  if (currentTier === 'pro_plus') {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="star" size={24} color={SoulworxColors.gold} />
        <Text style={styles.cardTitle}>
          {currentTier === 'free' ? 'Unlock Premium Features' : 'Go Pro+'}
        </Text>
      </View>
      <Text style={styles.cardDescription}>
        {currentTier === 'free'
          ? 'Get access to exclusive content, personalized training, and more.'
          : 'Take your training to the next level with personalized coaching and custom programs.'}
      </Text>
      <View style={styles.buttonsContainer}>
        {currentTier === 'free' && (
          <UpgradeButton
            targetTier="pro"
            variant="secondary"
            onUpgradeComplete={onUpgradeComplete}
          />
        )}
        <UpgradeButton
          targetTier="pro_plus"
          variant="primary"
          onUpgradeComplete={onUpgradeComplete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  buttonPrimary: {
    backgroundColor: SoulworxColors.gold,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: SoulworxColors.gold,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textContainer: {
    gap: 2,
  },
  buttonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.charcoal,
  },
  buttonTextSecondary: {
    color: SoulworxColors.gold,
  },
  priceText: {
    fontSize: Typography.sm,
    color: SoulworxColors.charcoal,
    opacity: 0.8,
  },
  priceTextSecondary: {
    color: SoulworxColors.textSecondary,
  },
  card: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  cardDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  buttonsContainer: {
    gap: Spacing.md,
  },
});
