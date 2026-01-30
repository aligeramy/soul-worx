import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getArchivedSections, updateSectionArchiveStatus } from '@/lib/queries';
import type { ArchivedSection, SectionKey } from '@/lib/types';

export default function AdminSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [sections, setSections] = useState<ArchivedSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Check admin access
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unauthorized</Text>
      </View>
    );
  }

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await getArchivedSections();
      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleArchive = async (sectionKey: SectionKey, currentArchived: boolean) => {
    try {
      setUpdating(sectionKey);
      await updateSectionArchiveStatus(sectionKey, !currentArchived);
      // Reload sections to get updated data
      await loadSections();
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Failed to update section. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={SoulworxColors.accent} />
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
        <Text style={styles.headerTitle}>Section Settings</Text>
      </View>

      <Text style={styles.description}>
        Archive sections to hide them from the app menu and resource cards. Archived sections will not be visible to users.
      </Text>

      {/* Sections List */}
      <View style={styles.section}>
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionCardContent}>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionName}>{section.sectionName}</Text>
                <Text style={styles.sectionKey}>{section.sectionKey}</Text>
              </View>
              <View style={styles.switchContainer}>
                {updating === section.sectionKey ? (
                  <ActivityIndicator size="small" color={SoulworxColors.accent} />
                ) : (
                  <Switch
                    value={!section.archived}
                    onValueChange={() => handleToggleArchive(section.sectionKey, section.archived)}
                    trackColor={{
                      false: SoulworxColors.border,
                      true: SoulworxColors.accent,
                    }}
                    thumbColor={SoulworxColors.white}
                  />
                )}
                <Text style={[styles.statusText, section.archived && styles.statusArchived]}>
                  {section.archived ? 'Archived' : 'Active'}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  description: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  section: {
    gap: Spacing.md,
  },
  sectionCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.small,
  },
  sectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: 4,
  },
  sectionKey: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.brandBrown,
    minWidth: 70,
    textAlign: 'right',
  },
  statusArchived: {
    color: SoulworxColors.textOnLight,
    opacity: 0.6,
  },
  errorText: {
    fontSize: Typography.xl,
    color: SoulworxColors.error,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});



