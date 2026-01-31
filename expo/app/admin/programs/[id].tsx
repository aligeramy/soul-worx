import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { supabase } from '@/lib/supabase';
import type { Program } from '@/lib/types';

export default function AdminProgramDetailScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'youth' as const,
    status: 'draft' as const,
    coverImage: '',
    duration: '',
    ageRange: '',
    capacity: '',
    price: '0',
    registrationRequired: true,
    requiresParentConsent: false,
  });

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    if (id && id !== 'new') {
      loadProgram();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('program')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setProgram(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          longDescription: data.longDescription || '',
          category: data.category || 'youth',
          status: data.status || 'draft',
          coverImage: data.coverImage || '',
          duration: data.duration || '',
          ageRange: data.ageRange || '',
          capacity: data.capacity?.toString() || '',
          price: data.price || '0',
          registrationRequired: data.registrationRequired ?? true,
          requiresParentConsent: data.requiresParentConsent ?? false,
        });
      }
    } catch (error) {
      console.error('Error loading program:', error);
      Alert.alert('Error', 'Failed to load program');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      Alert.alert('Validation Error', 'Title is required');
      return;
    }

    setSaving(true);
    try {
      const programData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        price: formData.price || '0',
      };

      if (id && id !== 'new' && program) {
        // Update existing
        const { error } = await supabase
          .from('program')
          .update({
            ...programData,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        Alert.alert('Success', 'Program updated successfully');
      } else {
        // Create new
        const { data, error } = await supabase
          .from('program')
          .insert({
            ...programData,
            createdBy: user?.id || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        Alert.alert('Success', 'Program created successfully');
        router.replace(`/admin/programs/${data.id}` as any);
      }
    } catch (error: any) {
      console.error('Error saving program:', error);
      Alert.alert('Error', error.message || 'Failed to save program');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Program',
      'Are you sure you want to delete this program? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('program')
                .delete()
                .eq('id', id);

              if (error) throw error;
              Alert.alert('Success', 'Program deleted successfully');
              router.back();
            } catch (error: any) {
              console.error('Error deleting program:', error);
              Alert.alert('Error', error.message || 'Failed to delete program');
            }
          },
        },
      ]
    );
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
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {id === 'new' ? 'New Program' : 'Edit Program'}
        </Text>
        {id !== 'new' && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={SoulworxColors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Program title"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Short description"
            placeholderTextColor={SoulworxColors.textTertiary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Long Description</Text>
          <RichTextEditor
            value={formData.longDescription}
            onChange={(html) => setFormData({ ...formData, longDescription: html })}
            placeholder="Detailed description (supports rich text formatting)"
            style={styles.richTextEditor}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.radioGroup}>
            {['youth', 'schools', 'community', 'workshops', 'special'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.radioOption,
                  formData.category === cat && styles.radioOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, category: cat as any })}
              >
                <Text
                  style={[
                    styles.radioText,
                    formData.category === cat && styles.radioTextActive,
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.radioGroup}>
            {['draft', 'published', 'archived'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.radioOption,
                  formData.status === status && styles.radioOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, status: status as any })}
              >
                <Text
                  style={[
                    styles.radioText,
                    formData.status === status && styles.radioTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ImageUploadField
          label="Cover Image"
          value={formData.coverImage}
          onChange={(url) => setFormData({ ...formData, coverImage: url })}
          type="program"
        />

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="6 weeks"
              placeholderTextColor={SoulworxColors.textTertiary}
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Age Range</Text>
            <TextInput
              style={styles.input}
              value={formData.ageRange}
              onChangeText={(text) => setFormData({ ...formData, ageRange: text })}
              placeholder="13-18"
              placeholderTextColor={SoulworxColors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Capacity</Text>
            <TextInput
              style={styles.input}
              value={formData.capacity}
              onChangeText={(text) => setFormData({ ...formData, capacity: text })}
              placeholder="30"
              placeholderTextColor={SoulworxColors.textTertiary}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="0"
              placeholderTextColor={SoulworxColors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.field}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setFormData({ ...formData, registrationRequired: !formData.registrationRequired })}
          >
            <Ionicons
              name={formData.registrationRequired ? 'checkbox' : 'square-outline'}
              size={24}
              color={formData.registrationRequired ? SoulworxColors.accent : SoulworxColors.textSecondary}
            />
            <Text style={styles.checkboxLabel}>Registration Required</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setFormData({ ...formData, requiresParentConsent: !formData.requiresParentConsent })}
          >
            <Ionicons
              name={formData.requiresParentConsent ? 'checkbox' : 'square-outline'}
              size={24}
              color={formData.requiresParentConsent ? SoulworxColors.accent : SoulworxColors.textSecondary}
            />
            <Text style={styles.checkboxLabel}>Requires Parent Consent</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={SoulworxColors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Program</Text>
          )}
        </TouchableOpacity>
      </View>
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
  deleteButton: {
    padding: Spacing.sm,
  },
  form: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  halfField: {
    flex: 1,
    marginRight: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  richTextEditor: {
    minHeight: 250,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  radioOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.white,
  },
  radioOptionActive: {
    backgroundColor: SoulworxColors.accent,
    borderColor: SoulworxColors.accent,
  },
  radioText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  radioTextActive: {
    color: SoulworxColors.white,
    fontWeight: Typography.semibold,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkboxLabel: {
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
  },
  saveButton: {
    backgroundColor: SoulworxColors.accent,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
