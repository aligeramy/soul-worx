import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive push notifications on your device',
      enabled: true,
    },
    {
      id: 'programs',
      title: 'Program Updates',
      description: 'Get notified about new programs and schedule changes',
      enabled: true,
    },
    {
      id: 'events',
      title: 'Event Reminders',
      description: 'Reminders for upcoming events and sessions',
      enabled: true,
    },
    {
      id: 'messages',
      title: 'Chat Messages',
      description: 'Notifications when you receive new messages',
      enabled: true,
    },
    {
      id: 'community',
      title: 'Community Updates',
      description: 'Updates from community channels and discussions',
      enabled: false,
    },
    {
      id: 'marketing',
      title: 'Marketing & Promotions',
      description: 'Receive updates about special offers and promotions',
      enabled: false,
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
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionDescription}>
          Manage how you receive notifications and stay updated with your programs and community.
        </Text>

        {/* Notification Settings */}
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

        {/* Notification Preferences Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={SoulworxColors.accent} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Notification Preferences</Text>
            <Text style={styles.infoText}>
              You can also manage notification permissions in your device settings. Some notifications may be required for important program updates.
            </Text>
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Enable Quiet Hours</Text>
                <Text style={styles.settingDescription}>
                  Pause notifications during specific hours
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{
                  false: SoulworxColors.darkBeige,
                  true: SoulworxColors.accent,
                }}
                thumbColor={SoulworxColors.white}
                ios_backgroundColor={SoulworxColors.darkBeige}
              />
            </View>
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
    backgroundColor: SoulworxColors.charcoal,
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
    backgroundColor: SoulworxColors.charcoal,
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
  },
});

