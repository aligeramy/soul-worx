import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

interface CareerCardProps {
  title: string;
  description: string;
  category?: string;
  onPress?: () => void;
  style?: any;
}

export function CareerCard({ title, description, category, onPress, style }: CareerCardProps) {
  const Content = (
    <View style={[styles.container, style]}>
      {category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
          {description}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="arrow-forward-circle" size={24} color={SoulworxColors.accent} />
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
    backgroundColor: SoulworxColors.white,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    ...Shadows.small,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.brandBrown, // Dark brown text on light accent background
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginRight: Spacing.xl,
    paddingRight: Spacing.sm,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
    lineHeight: Typography.sm * 1.5,
  },
  iconContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
  },
});



