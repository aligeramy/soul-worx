import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  labels?: string[];
  showValue?: boolean;
}

export function RatingSlider({
  value,
  onChange,
  min = 1,
  max = 5,
  labels,
  showValue = true,
}: RatingSliderProps) {
  const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const handlePress = (rating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(rating);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        {ratings.map((rating) => (
          <Pressable
            key={rating}
            style={({ pressed }) => [
              styles.ratingButton,
              value === rating && styles.ratingButtonSelected,
              pressed && styles.ratingButtonPressed,
            ]}
            onPress={() => handlePress(rating)}
          >
            <Text
              style={[
                styles.ratingText,
                value === rating && styles.ratingTextSelected,
              ]}
            >
              {rating}
            </Text>
          </Pressable>
        ))}
      </View>
      {labels && labels.length === 2 && (
        <View style={styles.labelsContainer}>
          <Text style={styles.labelText}>{labels[0]}</Text>
          <Text style={styles.labelText}>{labels[1]}</Text>
        </View>
      )}
      {showValue && (
        <Text style={styles.valueText}>
          Selected: {value}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ratingButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
  },
  ratingButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  ratingButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  ratingText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
  },
  ratingTextSelected: {
    color: SoulworxColors.brandBrown,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  labelText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
  },
  valueText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
});
