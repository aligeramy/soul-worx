import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeroCard } from '@/components/HeroCard';
import { OptimizedImage } from '@/components/OptimizedImage';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { isSectionArchived } from '@/lib/queries';

const WEB_APP_URL = 'https://beta.soulworx.ca';

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const [archivedSections, setArchivedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadArchivedSections = useCallback(async () => {
    try {
      setLoading(true);
      const sections = ['assistant', 'journal', 'poetry', 'blog', 'news', 'announcements'];
      const archived = new Set<string>();
      
      for (const section of sections) {
        const isArchived = await isSectionArchived(section as any);
        if (isArchived) {
          archived.add(section);
        }
      }
      
      setArchivedSections(archived);
    } catch (error) {
      console.error('Error loading archived sections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadArchivedSections();
    }, [loadArchivedSections])
  );

  
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={SoulworxColors.accent} />
      </View>
    );
  }

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
        {!archivedSections.has('assistant') && (
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
        )}

        {/* Journal Card */}
        {!archivedSections.has('journal') && (
          <TouchableOpacity
            onPress={() => router.push('/journal')}
            activeOpacity={0.9}
            style={[styles.journalCard, styles.card]}
          >
            <View style={styles.journalCardContent}>
              <View style={styles.journalIconContainer}>
                <Ionicons name="journal" size={48} color={SoulworxColors.white} />
              </View>
              <View style={styles.journalTextContainer}>
                <View style={styles.journalBadge}>
                  <Text style={styles.journalBadgeText}>Journal</Text>
                </View>
                <Text style={styles.journalTitle}>My Journal</Text>
                <Text style={styles.journalDescription}>Reflect & grow</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {!archivedSections.has('poetry') && (
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
        )}
        
        {!archivedSections.has('blog') && (
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
        )}
        
        {!archivedSections.has('news') && (
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
        )}
        
        {!archivedSections.has('announcements') && (
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
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: BorderRadius.lg,
    backgroundColor: SoulworxColors.charcoal,
    overflow: 'hidden',
    minHeight: 320,
    position: 'relative',
    ...Shadows.medium,
  },
  journalCard: {
    borderRadius: BorderRadius.lg,
    backgroundColor: SoulworxColors.charcoal,
    overflow: 'hidden',
    minHeight: 320,
    ...Shadows.medium,
  },
  assistantCardContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'relative',
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
  journalCardContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalIconContainer: {
    width: 80,
    height: 80,
    marginBottom: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  journalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: SoulworxColors.white,
  },
  journalBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  journalTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  journalDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
});

