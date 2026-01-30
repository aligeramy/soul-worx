import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SoulworxColors, Spacing, Typography } from '../constants/colors';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export function LoadingState({ message, size = 'large' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={SoulworxColors.gold} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
    padding: Spacing.xl,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
});

