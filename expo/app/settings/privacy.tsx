import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'profile',
      title: 'Public Profile',
      description: 'Allow others to view your profile information',
      enabled: true,
    },
    {
      id: 'activity',
      title: 'Activity Status',
      description: 'Show when you are online or recently active',
      enabled: true,
    },
    {
      id: 'messages',
      title: 'Direct Messages',
      description: 'Allow others to send you direct messages',
      enabled: true,
    },
    {
      id: 'analytics',
      title: 'Analytics & Tracking',
      description: 'Help improve the app by sharing usage data',
      enabled: true,
    },
    {
      id: 'personalization',
      title: 'Personalized Content',
      description: 'Use your data to personalize your experience',
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionDescription}>
          Control your privacy settings and manage how your information is shared and used.
        </Text>

        {/* Privacy Settings */}
        <View style={styles.settingsCard}>
          {settings.map((setting, index) => (
            <View key={setting.id}>
              <View style={styles.settingRow}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{
                    false: SoulworxColors.darkBeige,
                    true: SoulworxColors.accent,
                  }}
                  thumbColor={SoulworxColors.white}
                  ios_backgroundColor={SoulworxColors.darkBeige}
                />
              </View>
              {index < settings.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Data & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Security</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionContent}>
                <Ionicons name="download-outline" size={24} color={SoulworxColors.textSecondary} />
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Download Your Data</Text>
                  <Text style={styles.actionDescription}>
                    Request a copy of all your data
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionContent}>
                <Ionicons name="trash-outline" size={24} color={SoulworxColors.error} />
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: SoulworxColors.error }]}>
                    Delete Account
                  </Text>
                  <Text style={styles.actionDescription}>
                    Permanently delete your account and all data
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy Policy Info */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={24} color={SoulworxColors.accent} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Your Privacy Matters</Text>
            <Text style={styles.infoText}>
              We take your privacy seriously. Your data is encrypted and stored securely. You can review our full privacy policy for more details.
            </Text>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>View Privacy Policy</Text>
              <Ionicons name="open-outline" size={16} color={SoulworxColors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Blocked Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blocked Users</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionContent}>
                <Ionicons name="ban-outline" size={24} color={SoulworxColors.textSecondary} />
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Manage Blocked Users</Text>
                  <Text style={styles.actionDescription}>
                    View and manage users you've blocked
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: SoulworxColors.white,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  sectionDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    lineHeight: Typography.base * 1.5,
    marginBottom: Spacing.lg,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  settingsCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.small,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: Typography.sm * 1.4,
  },
  divider: {
    height: 1,
    backgroundColor: SoulworxColors.border,
    marginLeft: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: Typography.sm * 1.4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: SoulworxColors.darkBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: Typography.sm * 1.4,
    marginBottom: Spacing.sm,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  linkText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.accent,
  },
});

