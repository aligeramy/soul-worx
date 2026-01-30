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
        programs.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={styles.programCard}
            onPress={() => router.push(`/admin/programs/${program.id}` as any)}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={getImageSource(program.coverImage, 'program')}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            </View>
            <View style={styles.programContent}>
              <View style={styles.programInfo}>
                <Text style={styles.programTitle}>{program.title}</Text>
                <Text style={styles.programSlug}>{program.slug}</Text>
                <Text style={styles.programDescription} numberOfLines={2}>
                  {program.description}
                </Text>
              </View>
              <View style={styles.programMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(program.status) }]}>
                  <Text style={styles.statusText}>{program.status}</Text>
                </View>
                <Text style={styles.programCategory}>{program.category}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
          </TouchableOpacity>
        ))
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
  programCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.md,
    ...Shadows.small,
  },
  thumbnailContainer: {
    width: 100,
    flexShrink: 0,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: SoulworxColors.darkBeige,
    position: 'relative',
  },
  programContent: {
    flex: 1,
  },
  programInfo: {
    marginBottom: Spacing.sm,
  },
  programTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: 4,
  },
  programSlug: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.6,
    marginBottom: Spacing.xs,
  },
  programDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
    textTransform: 'capitalize',
  },
  programCategory: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
    textTransform: 'capitalize',
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
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
