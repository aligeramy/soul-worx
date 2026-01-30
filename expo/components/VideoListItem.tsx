import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageSourcePropType, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '../constants/colors';
import { formatDuration } from '../lib/format';

interface VideoListItemProps {
  image: ImageSourcePropType;
  title: string;
  duration?: number;
  episodeNumber?: number;
  locked?: boolean;
  requiredTier?: number;
  onPress?: () => void;
  style?: any;
}

export function VideoListItem({
  image,
  title,
  duration,
  episodeNumber,
  locked = false,
  requiredTier = 1,
  onPress,
  style,
}: VideoListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnailImage}>
          <Image
            source={image}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        </View>
        
        {/* Duration badge */}
        {duration !== undefined && duration !== null && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
        )}
        
        {/* Play icon overlay */}
        {!locked && (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={20} color={SoulworxColors.white} />
          </View>
        )}
        
        {/* Lock overlay */}
        {locked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={20} color={SoulworxColors.white} />
          </View>
        )}
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {episodeNumber !== undefined && episodeNumber !== null && (
          <Text style={styles.episode}>Episode {String(episodeNumber)}</Text>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {title || 'Untitled Video'}
        </Text>
        {locked && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={12} color={SoulworxColors.textTertiary} />
            <Text style={styles.lockText}>Tier {String(requiredTier || 1)}</Text>
          </View>
        )}
      </View>
      
      {/* Chevron */}
      <View style={styles.chevronContainer}>
        <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: SoulworxColors.charcoal, // Dark brown background
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    minHeight: 100,
    height: 100,
  },
  thumbnailContainer: {
    width: 140,
    height: 100,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    ...StyleSheet.absoluteFillObject,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  durationText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.md,
    paddingLeft: Spacing.md,
  },
  chevronContainer: {
    paddingRight: Spacing.md,
    justifyContent: 'center',
  },
  episode: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.accent,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: SoulworxColors.textPrimary, // White text on dark background
    lineHeight: Typography.sm * 1.4,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  lockText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
  },
});
