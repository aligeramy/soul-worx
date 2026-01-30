import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OptimizedImage } from './OptimizedImage';
import { LockOverlay } from './LockOverlay';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '../constants/colors';
import { formatDuration } from '../lib/format';
import { getTierColor } from '../lib/access';

interface VideoCardProps {
  image: ImageSourcePropType;
  title: string;
  duration?: number;
  episodeNumber?: number;
  locked?: boolean;
  requiredTier?: number;
  onPress?: () => void;
  style?: any;
}

export function VideoCard({
  image,
  title,
  duration,
  episodeNumber,
  locked = false,
  requiredTier = 1,
  onPress,
  style,
}: VideoCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <View style={styles.imageContainer}>
        <OptimizedImage source={image} aspectRatio={16 / 9} rounded={false} />
        
        {/* Duration badge */}
        {duration !== undefined && duration !== null && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
        )}
        
        {/* Play icon */}
        {!locked && (
          <View style={styles.playIcon}>
            <Ionicons name="play-circle" size={48} color={SoulworxColors.white} />
          </View>
        )}
        
        {/* Lock overlay */}
        {locked && <LockOverlay requiredTier={requiredTier} />}
      </View>
      
      <View style={styles.content}>
        {episodeNumber !== undefined && episodeNumber !== null && (
          <Text style={styles.episode}>Episode {String(episodeNumber)}</Text>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {title || 'Untitled Video'}
        </Text>
        
        {/* Tier badge */}
        <View style={[styles.tierBadge, { backgroundColor: getTierColor(requiredTier || 1) }]}>
          <Ionicons
            name={locked ? 'lock-closed' : 'lock-open'}
            size={12}
            color={SoulworxColors.white}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    backgroundColor: SoulworxColors.charcoal,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  durationBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  durationText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  content: {
    padding: Spacing.md,
  },
  episode: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary, // Light text on dark background
  },
  tierBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

