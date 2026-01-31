import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { supabase } from '@/lib/supabase';
import type { Program } from '@/lib/types';

export default function AdminProgramsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadPrograms();
  }, [user]);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('program')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPrograms();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return SoulworxColors.success;
      case 'draft':
        return SoulworxColors.warning;
      case 'archived':
        return SoulworxColors.textTertiary;
      default:
        return SoulworxColors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Programs</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/admin/programs/new' as any)}
        >
          <Ionicons name="add" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      {/* Programs List */}
      {programs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="sparkles-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyText}>No programs yet</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/admin/programs/new' as any)}
          >
            <Text style={styles.emptyButtonText}>Create First Program</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.programList}>
          {programs.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
              onPress={() => router.push(`/admin/programs/${program.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.programCardThumb}>
                <Image
                  source={getImageSource(program.coverImage, 'program')}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.programCardContent}>
                <Text style={styles.programCardTitle} numberOfLines={1}>{program.title}</Text>
                <Text style={styles.programCardMeta} numberOfLines={1}>
                  {program.slug} · {program.status}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={SoulworxColors.brandBrown} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
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
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  programList: {
    gap: Spacing.md,
  },
  programCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.2)',
    ...Shadows.small,
  },
  programCardThumb: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: SoulworxColors.accent,
    position: 'relative',
  },
  programCardContent: {
    flex: 1,
    minWidth: 0,
  },
  programCardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.brandBrown,
    marginBottom: 4,
  },
  programCardMeta: {
    fontSize: Typography.sm,
    color: SoulworxColors.brandBrownDark,
    opacity: 0.9,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: Typography.xl,
    color: SoulworxColors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  emptyButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
