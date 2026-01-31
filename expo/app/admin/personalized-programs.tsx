import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiGet } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';

interface ProPlusUser {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  questionnaire: any | null;
  programCount: number;
}

export default function AdminPersonalizedProgramsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [proPlusUsers, setProPlusUsers] = useState<ProPlusUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      // Get Pro+ tier
      const { data: proPlusTier } = await supabase
        .from('membership_tier')
        .select('id')
        .or('slug.eq.pro_plus,slug.eq.pro-plus')
        .single();

      if (!proPlusTier) {
        setLoading(false);
        return;
      }

      // Get Pro+ memberships
      const { data: memberships } = await supabase
        .from('user_membership')
        .select('userId, user:userId (id, name, email, image)')
        .eq('tierId', proPlusTier.id)
        .eq('status', 'active');

      if (!memberships) {
        setLoading(false);
        return;
      }

      // Get questionnaire and program counts for each user
      const usersWithData = await Promise.all(
        memberships.map(async (membership: any) => {
          const userId = membership.userId;
          const [questionnaireResult, programsResult] = await Promise.all([
            supabase.from('pro_plus_questionnaire').select('id').eq('userId', userId).single(),
            supabase.from('personalized_program').select('id', { count: 'exact' }).eq('userId', userId),
          ]);

          return {
            user: membership.user,
            questionnaire: questionnaireResult.data,
            programCount: programsResult.data?.length || 0,
          };
        })
      );

      setProPlusUsers(usersWithData.filter((u) => u.user));
    } catch (error) {
      console.error('Error loading Pro+ users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.gold} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SoulworxColors.gold} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalized Programs</Text>
      </View>

      {/* Users List */}
      {proPlusUsers.length > 0 ? (
        <View style={styles.listContainer}>
          {proPlusUsers.map(({ user: proUser, questionnaire, programCount }, index) => (
            <TouchableOpacity
              key={proUser.id}
              style={[styles.listRow, index === proPlusUsers.length - 1 && styles.listRowLast]}
              onPress={() => router.push(`/admin/personalized-programs/${proUser.id}` as any)}
              activeOpacity={0.6}
            >
              {proUser.image ? (
                <Image source={{ uri: proUser.image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={18} color={SoulworxColors.white} />
              </View>
              )}
              <View style={styles.rowContent}>
                <Text style={styles.userName} numberOfLines={1}>{proUser.name || 'User'}</Text>
                <Text style={styles.userEmail} numberOfLines={1}>{proUser.email}</Text>
              </View>
              <View style={styles.rowMeta}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name={questionnaire ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={questionnaire ? SoulworxColors.accent : SoulworxColors.textSecondary}
                  />
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={16} color={SoulworxColors.textSecondary} />
                  <Text style={styles.metaText}>{programCount}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={SoulworxColors.white} style={{ opacity: 0.6 }} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyTitle}>No Pro+ Users Yet</Text>
          <Text style={styles.emptyDescription}>
            Pro+ users who have completed their questionnaire will appear here
          </Text>
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
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  listContainer: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.small,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SoulworxColors.border,
  },
  listRowLast: {
    borderBottomWidth: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SoulworxColors.darkBeige,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SoulworxColors.darkBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: 1,
  },
  userEmail: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
