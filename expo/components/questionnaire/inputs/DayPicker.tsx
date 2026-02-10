import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';

const DAYS_OF_WEEK = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' },
];

interface DayPickerProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  showShortLabels?: boolean;
}

export function DayPicker({
  selectedDays,
  onChange,
  showShortLabels = true,
}: DayPickerProps) {
  const toggleDay = (day: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map(({ short, full }) => {
          const isSelected = selectedDays.includes(full);
          return (
            <Pressable
              key={full}
              style={({ pressed }) => [
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
                pressed && styles.dayButtonPressed,
              ]}
              onPress={() => toggleDay(full)}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {showShortLabels ? short : full}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.selectedCount}>
        {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dayButton: {
    flex: 1,
    minWidth: '13%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
  },
  dayButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  dayButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  dayText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
  },
  dayTextSelected: {
    color: SoulworxColors.brandBrown,
  },
  selectedCount: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
});
