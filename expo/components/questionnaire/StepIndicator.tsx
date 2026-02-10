import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';

interface StepIndicatorProps {
  current: number;
  total: number;
  onStepPress?: (step: number) => void;
  allowNavigation?: boolean;
}

export function StepIndicator({
  current,
  total,
  onStepPress,
  allowNavigation = false,
}: StepIndicatorProps) {
  const progressPercentage = (current / total) * 100;

  const handleStepPress = (step: number) => {
    if (allowNavigation && step <= current && onStepPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onStepPress(step);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {current} of {total}
        </Text>
      </View>

      {/* Step dots */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < current;
          const isCurrent = step === current;
          const isUpcoming = step > current;

          return (
            <Pressable
              key={step}
              style={({ pressed }) => [
                styles.dot,
                isCompleted && styles.dotCompleted,
                isCurrent && styles.dotCurrent,
                isUpcoming && styles.dotUpcoming,
                allowNavigation && isCompleted && pressed && styles.dotPressed,
              ]}
              onPress={() => handleStepPress(step)}
              disabled={!allowNavigation || step > current}
            >
              {isCompleted && (
                <Text style={styles.checkmark}>✓</Text>
              )}
              {isCurrent && (
                <View style={styles.currentDotInner} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface StepProgressBarProps {
  current: number;
  total: number;
}

export function StepProgressBar({ current, total }: StepProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${(current / total) * 100}%`, { duration: 300 }),
    };
  }, [current, total]);

  return (
    <View style={styles.simpleProgressContainer}>
      <View style={styles.simpleProgressBar}>
        <Animated.View style={[styles.simpleProgressFill, animatedStyle]} />
      </View>
      <Text style={styles.simpleProgressText}>
        {current} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  progressContainer: {
    gap: Spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: SoulworxColors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SoulworxColors.gold,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  dotCompleted: {
    backgroundColor: SoulworxColors.success,
    borderColor: SoulworxColors.success,
  },
  dotCurrent: {
    backgroundColor: 'transparent',
    borderColor: SoulworxColors.gold,
  },
  dotUpcoming: {
    backgroundColor: 'transparent',
    borderColor: SoulworxColors.border,
  },
  dotPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
  checkmark: {
    fontSize: 12,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  currentDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SoulworxColors.gold,
  },
  simpleProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  simpleProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: SoulworxColors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  simpleProgressFill: {
    height: '100%',
    backgroundColor: SoulworxColors.gold,
    borderRadius: 3,
  },
  simpleProgressText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
});
