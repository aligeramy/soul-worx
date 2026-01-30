import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { SoulworxColors, BorderRadius, Shadows } from '../constants/colors';

interface OptimizedImageProps {
  source: ImageSourcePropType;
  aspectRatio?: number;
  rounded?: boolean;
  overlay?: boolean;
  style?: any;
}

export function OptimizedImage({
  source,
  aspectRatio = 16 / 9,
  rounded = true,
  overlay = false,
  style,
}: OptimizedImageProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={[
          styles.image,
          { aspectRatio },
          rounded && styles.rounded,
        ]}
        resizeMode="cover"
      />
      {overlay && (
        <View style={[styles.overlay, styles.gradientOverlay]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    backgroundColor: SoulworxColors.darkBeige,
  },
  rounded: {
    borderRadius: BorderRadius.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SoulworxColors.overlay,
  },
  gradientOverlay: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
});

