import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminProgramDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useUser();
  const { userId, programId } = useLocalSearchParams<{ userId: string; programId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    trainingDays: [] as string[],
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadProgram();
  }, [currentUser, programId, userId]);

  const loadProgram = async () => {
    if (!programId || !userId) return;
    try {
      const { data, error } = await supabase
        .from('personalized_program')
        .select('*')
        .eq('id', programId)
        .eq('userId', userId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          videoUrl: data.videoUrl || '',
          trainingDays: Array.isArray(data.trainingDays) ? data.trainingDays : [],
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
        });
      }
    } catch (e) {
      console.error('Error loading program:', e);
      Alert.alert('Error', 'Failed to load program');
    } finally {
      setLoading(false);
    }
  };

  const toggleTrainingDay = (day: string) => {
    setFormData({
      ...formData,
      trainingDays: formData.trainingDays.includes(day)
        ? formData.trainingDays.filter((d) => d !== day)
        : [...formData.trainingDays, day],
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim() || formData.trainingDays.length === 0 || !formData.startDate || !formData.endDate) {
      Alert.alert('Missing fields', 'Title, description, training days, and dates are required.');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('personalized_program')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          videoUrl: formData.videoUrl || null,
          trainingDays: formData.trainingDays,
          startDate: formData.startDate,
          endDate: formData.endDate,
        })
        .eq('id', programId)
        .eq('userId', userId);

      if (error) throw error;
      Alert.alert('Saved', 'Program details updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      console.error('Error saving program:', e);
      Alert.alert('Error', e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
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
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Program Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Program title"
            placeholderTextColor={SoulworxColors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={SoulworxColors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Video URL</Text>
          <TextInput
            style={styles.input}
            value={formData.videoUrl}
            onChangeText={(text) => setFormData({ ...formData, videoUrl: text })}
            placeholder="https://..."
            placeholderTextColor={SoulworxColors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Training Days</Text>
          <View style={styles.daysRow}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayChip, formData.trainingDays.includes(day) && styles.dayChipSelected]}
                onPress={() => toggleTrainingDay(day)}
              >
                <Text style={[styles.dayChipText, formData.trainingDays.includes(day) && styles.dayChipTextSelected]}>
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            value={formData.startDate}
            onChangeText={(text) => setFormData({ ...formData, startDate: text })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={SoulworxColors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>End Date</Text>
          <TextInput
            style={styles.input}
            value={formData.endDate}
            onChangeText={(text) => setFormData({ ...formData, endDate: text })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={SoulworxColors.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={SoulworxColors.white} />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={SoulworxColors.white} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
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
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  card: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.2)',
    ...Shadows.small,
  },
  field: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.brandBrown,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: 'rgba(121, 79, 65, 0.06)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    fontSize: Typography.sm,
    color: SoulworxColors.brandBrown,
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.2)',
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.sm,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  dayChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(121, 79, 65, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(121, 79, 65, 0.2)',
  },
  dayChipSelected: {
    backgroundColor: SoulworxColors.brandBrown,
    borderColor: SoulworxColors.brandBrown,
  },
  dayChipText: {
    fontSize: Typography.xs,
    color: SoulworxColors.brandBrown,
  },
  dayChipTextSelected: {
    color: SoulworxColors.white,
    fontWeight: Typography.semibold,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.brandBrown,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
