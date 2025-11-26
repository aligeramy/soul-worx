/**
 * Soulworx Theme Configuration
 * Luxury beige palette matching the web experience
 */

import { Platform } from 'react-native';
import { SoulworxColors, Shadows, Spacing, BorderRadius, Typography } from './colors';

// Export Soulworx design tokens
export { SoulworxColors, Shadows, Spacing, BorderRadius, Typography };

export const Colors = {
  light: {
    text: SoulworxColors.textPrimary,
    background: SoulworxColors.beige,
    tint: SoulworxColors.gold,
    icon: SoulworxColors.textSecondary,
    tabIconDefault: SoulworxColors.textTertiary,
    tabIconSelected: SoulworxColors.gold,
    card: SoulworxColors.white,
    border: SoulworxColors.border,
  },
  dark: {
    text: SoulworxColors.textOnDark,
    background: SoulworxColors.charcoal,
    tint: SoulworxColors.gold,
    icon: SoulworxColors.textTertiary,
    tabIconDefault: SoulworxColors.textTertiary,
    tabIconSelected: SoulworxColors.gold,
    card: '#1F1F1F',
    border: '#3F3F3F',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'System',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'Georgia',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'System',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'Roboto',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
