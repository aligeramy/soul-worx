import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

interface AdminCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  count?: number;
  onPress: () => void;
}

function AdminCard({ icon, title, subtitle, count, onPress }: AdminCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <Ionicons name={icon} size={32} color={SoulworxColors.accent} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        {count !== undefined && (
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>{count}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textOnLight} style={{ opacity: 0.5 }} />
      </View>
    </TouchableOpacity>
  );
}

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  // Check admin access
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unauthorized</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      {/* Pro+ Members / Personalized Programs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pro+ Members</Text>
        <AdminCard
          icon="person-add"
          title="Personalized Programs"
          subtitle="View Pro+ members, questionnaires & add programs"
          onPress={() => router.push('/admin/personalized-programs')}
        />
      </View>

      {/* Programs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Programs</Text>
        <AdminCard
          icon="sparkles"
          title="All Programs"
          subtitle="Manage programs and workshops"
          onPress={() => router.push('/admin/programs')}
        />
        <View style={styles.cardSpacing} />
        <AdminCard
          icon="tv"
          title="Channels"
          subtitle="Manage online program channels"
          onPress={() => router.push('/admin/channels')}
        />
        <View style={styles.cardSpacing} />
        <AdminCard
          icon="videocam"
          title="Videos"
          subtitle="Manage video content"
          onPress={() => router.push('/admin/videos')}
        />
      </View>

      {/* Content Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content</Text>
        <AdminCard
          icon="calendar"
          title="Events"
          subtitle="Manage events and RSVPs"
          onPress={() => router.push('/admin/events')}
        />
        <View style={styles.cardSpacing} />
        <AdminCard
          icon="document-text"
          title="Stories"
          subtitle="Manage blog posts and stories"
          onPress={() => router.push('/admin/stories')}
        />
        <View style={styles.cardSpacing} />
        <AdminCard
          icon="bag"
          title="Shop"
          subtitle="Manage products and inventory"
          onPress={() => router.push('/admin/shop')}
        />
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <AdminCard
          icon="settings"
          title="Section Settings"
          subtitle="Show or hide sections in the app"
          onPress={() => router.push('/admin/settings')}
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.small,
  },
  cardSpacing: {
    height: Spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.darkBeige,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  cardBadge: {
    backgroundColor: SoulworxColors.accent,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginRight: Spacing.sm,
  },
  cardBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  errorText: {
    fontSize: Typography.xl,
    color: SoulworxColors.error,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
