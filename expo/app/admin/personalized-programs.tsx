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
        <View style={styles.usersContainer}>
          {proPlusUsers.map(({ user: proUser, questionnaire, programCount }) => (
            <TouchableOpacity
              key={proUser.id}
              style={styles.userCard}
              onPress={() => router.push(`/admin/personalized-programs/${proUser.id}` as any)}
            >
              <View style={styles.userInfo}>
                {proUser.image ? (
                  <Image source={{ uri: proUser.image }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={24} color={SoulworxColors.textSecondary} />
                  </View>
                )}
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{proUser.name || 'User'}</Text>
                  <Text style={styles.userEmail}>{proUser.email}</Text>
                </View>
              </View>
              <View style={styles.userMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="document-text-outline" size={16} color={SoulworxColors.textSecondary} />
                  <Text style={styles.metaText}>
                    {questionnaire ? 'Questionnaire Complete' : 'No Questionnaire'}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={16} color={SoulworxColors.textSecondary} />
                  <Text style={styles.metaText}>
                    {programCount} Program{programCount !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
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
  usersContainer: {
    gap: Spacing.md,
  },
  userCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.medium,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: SoulworxColors.darkBeige,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: SoulworxColors.darkBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  userMeta: {
    gap: Spacing.xs,
    alignItems: 'flex-end',
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
