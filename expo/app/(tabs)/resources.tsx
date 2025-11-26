import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeroCard } from '@/components/HeroCard';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

const WEB_APP_URL = 'https://beta.soulworx.ca';

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <Text style={styles.headerSubtitle}>Explore stories and content</Text>
      </View>

      {/* Resources Grid */}
      <View style={styles.grid}>
        {/* Soulworx Assistant Card */}
        <TouchableOpacity
          onPress={() => router.push('/resources/assistant')}
          activeOpacity={0.9}
          style={[styles.assistantCard, styles.card]}
        >
          <View style={styles.assistantCardContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/logo-white.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.assistantTextContainer}>
              <View style={styles.assistantBadge}>
                <Text style={styles.assistantBadgeText}>Assistant</Text>
              </View>
              <Text style={styles.assistantTitle}>Soulworx Assistant</Text>
              <Text style={styles.assistantDescription}>AI-powered help and guidance</Text>
            </View>
          </View>
        </TouchableOpacity>

        <HeroCard
          image={{ uri: `${WEB_APP_URL}/optimized/0K0A2885.jpg` }}
          title="Poetry"
          description="Raw verses, spoken truths, and the art of expression"
          badge="Poetry"
          onPress={() => {
            router.push({ pathname: '/resources/[category]', params: { category: 'poetry' } });
          }}
          style={styles.card}
        />
        
        <HeroCard
          image={{ uri: `${WEB_APP_URL}/optimized/0K0A3966 (2).jpg` }}
          title="Blog"
          description="Stories, thoughts, and reflections from our journey"
          badge="Blog"
          onPress={() => {
            router.push({ pathname: '/resources/[category]', params: { category: 'blog' } });
          }}
          style={styles.card}
        />
        
        <HeroCard
          image={{ uri: `${WEB_APP_URL}/optimized/0K0A0798.jpg` }}
          title="Event Recaps"
          description="Highlights and moments from our events"
          badge="Events"
          onPress={() => {
            router.push({ pathname: '/resources/[category]', params: { category: 'news' } });
          }}
          style={styles.card}
        />
        
        <HeroCard
          image={{ uri: `${WEB_APP_URL}/optimized/0K0A4102.jpg` }}
          title="Press & Media"
          description="News, announcements, and media coverage"
          badge="Press"
          onPress={() => {
            router.push({ pathname: '/resources/[category]', params: { category: 'announcements' } });
          }}
          style={styles.card}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  grid: {
    gap: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  assistantCard: {
    borderRadius: BorderRadius.xl,
    backgroundColor: SoulworxColors.accent,
    overflow: 'hidden',
    minHeight: 320,
    ...Shadows.medium,
  },
  assistantCardContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    tintColor: SoulworxColors.white,
  },
  assistantTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  assistantBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: SoulworxColors.white,
  },
  assistantBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  assistantTitle: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  assistantDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
});

