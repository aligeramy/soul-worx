import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { Images } from '@/constants/images';
import { getTierColor } from '@/lib/access';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

function SettingsRow({ icon, title, subtitle, onPress }: SettingsRowProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingsRow}>
      <View style={styles.settingsRowLeft}>
        <Ionicons name={icon} size={24} color={SoulworxColors.textSecondary} />
        <View style={styles.settingsRowText}>
          <Text style={styles.settingsRowTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsRowSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, tier, signOut } = useUser();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <Image
          source={{ uri: user?.image || Images.placeholders.profile }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        {/* Tier Badge */}
        {tier && (
          <View style={[styles.tierBadge, { backgroundColor: getTierColor(tier.accessLevel) }]}>
            <Ionicons name="shield-checkmark" size={16} color={SoulworxColors.white} />
            <Text style={styles.tierText}>{tier.name} Member</Text>
          </View>
        )}
      </View>

      {/* Personalized Programs (Pro+ Only) */}
      {tier && tier.level === 'pro_plus' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Programs</Text>
          <TouchableOpacity 
            style={styles.programsCard}
            onPress={() => router.push('/personalized-programs' as any)}
          >
            <View style={styles.programsContent}>
              <Ionicons name="fitness" size={32} color={SoulworxColors.gold} />
              <Text style={styles.programsTitle}>Personalized Programs</Text>
              <Text style={styles.programsDescription}>
                View your custom training programs and track your progress
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Admin Section */}
      {(user?.role === 'admin' || user?.role === 'super_admin') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin</Text>
          <TouchableOpacity 
            style={styles.adminCard}
            onPress={() => router.push('/admin')}
          >
            <View style={styles.adminContent}>
              <Ionicons name="shield-checkmark" size={32} color={SoulworxColors.accent} />
              <Text style={styles.adminTitle}>Admin Dashboard</Text>
              <Text style={styles.adminDescription}>
                Manage programs, events, stories, shop, and more
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() => router.push('/settings/notifications')}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="lock-closed-outline"
            title="Privacy"
            subtitle="Control your privacy settings"
            onPress={() => router.push('/settings/privacy')}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with the app"
            onPress={() => console.log('Help')}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => console.log('About')}
          />
        </View>
      </View>

      {/* Membership */}
      {tier && tier.accessLevel < 3 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership</Text>
          <TouchableOpacity 
            style={styles.upgradeCard}
            onPress={() => router.push('/upgrade' as any)}
          >
            <View style={styles.upgradeContent}>
              <Ionicons name="star" size={32} color={SoulworxColors.gold} />
              <Text style={styles.upgradeTitle}>Upgrade Your Membership</Text>
              <Text style={styles.upgradeDescription}>
                Unlock premium content and exclusive features
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Ionicons name="log-out-outline" size={20} color={SoulworxColors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
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
  },
  userCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SoulworxColors.darkBeige,
    marginBottom: Spacing.md,
  },
  userName: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.md,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  tierText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
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
  settingsCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  settingsRowText: {
    flex: 1,
  },
  settingsRowTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: SoulworxColors.textPrimary,
  },
  settingsRowSubtitle: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: SoulworxColors.border,
    marginLeft: Spacing.md + 24 + Spacing.md,
  },
  upgradeCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upgradeContent: {
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  upgradeDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: SoulworxColors.error,
    marginTop: Spacing.lg,
  },
  logoutText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.error,
  },
  adminCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  adminContent: {
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  adminDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
  programsCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  programsContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  programsTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  programsDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
});

