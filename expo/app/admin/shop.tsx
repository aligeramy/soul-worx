import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  status: string;
  price: string;
  stock: number;
  trackInventory: boolean;
  createdAt: Date;
}

export default function AdminShopScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return SoulworxColors.success;
      case 'draft':
        return SoulworxColors.warning;
      case 'sold_out':
        return SoulworxColors.error;
      case 'archived':
        return SoulworxColors.textTertiary;
      default:
        return SoulworxColors.textSecondary;
    }
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
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
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/admin/shop/new' as any)}
        >
          <Ionicons name="add" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      {/* Products List */}
      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={64} color={SoulworxColors.textTertiary} />
          <Text style={styles.emptyText}>No products yet</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/admin/shop/new' as any)}
          >
            <Text style={styles.emptyButtonText}>Create First Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => router.push(`/admin/shop/${product.id}` as any)}
          >
            <View style={styles.productContent}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSlug}>{product.slug}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description}
                </Text>
              </View>
              <View style={styles.productMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(product.status) }]}>
                  <Text style={styles.statusText}>{product.status}</Text>
                </View>
                <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                {product.trackInventory && (
                  <View style={styles.stock}>
                    <Ionicons name="cube-outline" size={14} color={SoulworxColors.textSecondary} />
                    <Text style={styles.stockText}>{product.stock}</Text>
                  </View>
                )}
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
  productCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.small,
  },
  productContent: {
    flex: 1,
  },
  productInfo: {
    marginBottom: Spacing.sm,
  },
  productName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: 4,
  },
  productSlug: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.6,
    marginBottom: Spacing.xs,
  },
  productDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  productMeta: {
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
  productPrice: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.accent,
  },
  stock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
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
