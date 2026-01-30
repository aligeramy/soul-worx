import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { OptimizedImage } from './OptimizedImage';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '../constants/colors';
import { formatDayMonth } from '../lib/format';

interface ProgramCardProps {
  image: ImageSourcePropType;
  title: string;
  category: string;
  date?: Date | string;
  joined?: boolean;
  showRsvpBadge?: boolean;
  description?: string;
  onPress?: () => void;
  style?: any;
}

export function ProgramCard({
  image,
  title,
  category,
  date,
  joined = false,
  showRsvpBadge = false,
  description,
  onPress,
  style,
}: ProgramCardProps) {
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
      
      {/* Joined Badge (fallback if showRsvpBadge is false but joined is true) */}
      {joined && !showRsvpBadge && (
        <View style={styles.joinedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={SoulworxColors.white} />
          <Text style={styles.joinedText}>Joined</Text>
        </View>
      )}
      
      <View style={styles.textContainer}>
        {/* Category Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{category}</Text>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
        
        {date && formatDayMonth(date) && (
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={SoulworxColors.white} />
            <Text style={styles.date}>{formatDayMonth(date)}</Text>
          </View>
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
    borderRadius: BorderRadius.lg,
    backgroundColor: SoulworxColors.charcoal,
    overflow: 'hidden',
    ...Shadows.medium,
    minHeight: 320,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
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
  joinedBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: SoulworxColors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    zIndex: 2,
  },
  joinedText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    zIndex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: SoulworxColors.white,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  date: {
    fontSize: Typography.sm,
    color: SoulworxColors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

