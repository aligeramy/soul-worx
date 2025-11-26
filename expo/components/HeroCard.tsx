import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { OptimizedImage } from './OptimizedImage';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '../constants/colors';

interface HeroCardProps {
  image: ImageSourcePropType;
  title: string;
  description?: string;
  onPress?: () => void;
  badge?: string;
  showRsvpBadge?: boolean;
  style?: any;
}

export function HeroCard({ image, title, description, onPress, badge, showRsvpBadge = false, style }: HeroCardProps) {
  const Content = (
    <View style={[styles.container, style]}>
      <OptimizedImage source={image} aspectRatio={5 / 5} overlay />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      {/* RSVP Badge */}
      {showRsvpBadge && (
        <View style={styles.rsvpBadge}>
          <Ionicons name="calendar-check" size={16} color={SoulworxColors.white} />
          <Text style={styles.rsvpText}>RSVP</Text>
        </View>
      )}
      
      <View style={styles.textContainer}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    backgroundColor: SoulworxColors.white,
    overflow: 'hidden',
    ...Shadows.medium,
    minHeight: 320,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    zIndex: 1,
  },
  rsvpBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    zIndex: 2,
    ...Shadows.small,
  },
  rsvpText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: SoulworxColors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.9,
  },
});

