import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '../constants/colors';
import { getTierName } from '../lib/access';

interface LockOverlayProps {
  requiredTier: number;
  style?: any;
}

export function LockOverlay({ requiredTier, style }: LockOverlayProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={32} color={SoulworxColors.white} />
        <Text style={styles.title}>{getTierName(requiredTier)} Required</Text>
        <Text style={styles.subtitle}>Upgrade to unlock</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SoulworxColors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: SoulworxColors.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
});

