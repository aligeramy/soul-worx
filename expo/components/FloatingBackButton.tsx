import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoulworxColors, Spacing, BorderRadius, Shadows } from '@/constants/colors';

interface FloatingBackButtonProps {
  onPress?: () => void;
}

export function FloatingBackButton({ onPress }: FloatingBackButtonProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, { top: insets.top + Spacing.md }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
});

