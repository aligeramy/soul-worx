import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { supabase } from '@/lib/supabase';
import type { Video } from '@/lib/types';

export default function AdminVideoDetailScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [formData, setFormData] = useState({
    channelId: '',
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    episodeNumber: '',
    seasonNumber: '1',
    isFirstEpisode: false,
    requiredTierLevel: '2',
    status: 'draft' as const,
  });

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    loadChannels();
    if (id && id !== 'new') {
      loadVideo();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('community_channel')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error('Error loading channels:', error);
    }
  };

  const loadVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('video')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setVideo(data);
        setFormData({
          channelId: data.channelId || '',
          title: data.title || '',
          description: data.description || '',
          videoUrl: data.videoUrl || '',
          thumbnailUrl: data.thumbnailUrl || '',
          duration: data.duration?.toString() || '',
          episodeNumber: data.episodeNumber?.toString() || '',
          seasonNumber: data.seasonNumber?.toString() || '1',
          isFirstEpisode: data.isFirstEpisode || false,
          requiredTierLevel: data.requiredTierLevel?.toString() || '2',
          status: data.status || 'draft',
        });
      }
    } catch (error) {
      console.error('Error loading video:', error);
      Alert.alert('Error', 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.channelId) {
      Alert.alert('Validation Error', 'Title and channel are required');
      return;
    }

    setSaving(true);
    try {
      const videoData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        episodeNumber: formData.episodeNumber ? parseInt(formData.episodeNumber) : null,
        seasonNumber: parseInt(formData.seasonNumber) || 1,
        requiredTierLevel: parseInt(formData.requiredTierLevel) || 2,
      };

      if (id && id !== 'new' && video) {
        const { error } = await supabase
          .from('video')
          .update({
            ...videoData,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        Alert.alert('Success', 'Video updated successfully');
      } else {
        const { data, error } = await supabase
          .from('video')
          .insert({
            ...videoData,
            createdBy: user?.id || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        Alert.alert('Success', 'Video created successfully');
        router.replace(`/admin/videos/${data.id}` as any);
      }
    } catch (error: any) {
      console.error('Error saving video:', error);
      Alert.alert('Error', error.message || 'Failed to save video');
    } finally {
      setSaving(false);
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
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {id === 'new' ? 'New Video' : 'Edit Video'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Channel *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowChannelPicker(true)}
          >
            <Text style={[
              styles.selectButtonText,
              !formData.channelId && styles.selectButtonTextPlaceholder
            ]}>
              {formData.channelId 
                ? channels.find(c => c.id === formData.channelId)?.title || 'Select channel'
                : 'Select channel'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={SoulworxColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Channel Picker Modal */}
        <Modal
          visible={showChannelPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowChannelPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowChannelPicker(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Channel</Text>
                <TouchableOpacity
                  onPress={() => setShowChannelPicker(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color={SoulworxColors.textPrimary} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {channels.map((channel) => (
                  <TouchableOpacity
                    key={channel.id}
                    style={[
                      styles.modalOption,
                      formData.channelId === channel.id && styles.modalOptionActive,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, channelId: channel.id });
                      setShowChannelPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        formData.channelId === channel.id && styles.modalOptionTextActive,
                      ]}
                    >
                      {channel.title}
                    </Text>
                    {formData.channelId === channel.id && (
                      <Ionicons name="checkmark" size={20} color={SoulworxColors.white} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Video title"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <RichTextEditor
            value={formData.description}
            onChange={(html) => setFormData({ ...formData, description: html })}
            placeholder="Video description (supports rich text formatting)"
            style={styles.richTextEditor}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Video URL *</Text>
          <TextInput
            style={styles.input}
            value={formData.videoUrl}
            onChangeText={(text) => setFormData({ ...formData, videoUrl: text })}
            placeholder="https://..."
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>

        <ImageUploadField
          label="Thumbnail Image"
          value={formData.thumbnailUrl}
          onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
          type="video"
        />

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="300"
              placeholderTextColor={SoulworxColors.textTertiary}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Episode Number</Text>
            <TextInput
              style={styles.input}
              value={formData.episodeNumber}
              onChangeText={(text) => setFormData({ ...formData, episodeNumber: text })}
              placeholder="1"
              placeholderTextColor={SoulworxColors.textTertiary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Season Number</Text>
            <TextInput
              style={styles.input}
              value={formData.seasonNumber}
              onChangeText={(text) => setFormData({ ...formData, seasonNumber: text })}
              placeholder="1"
              placeholderTextColor={SoulworxColors.textTertiary}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Required Tier Level</Text>
            <TextInput
              style={styles.input}
              value={formData.requiredTierLevel}
              onChangeText={(text) => setFormData({ ...formData, requiredTierLevel: text })}
              placeholder="2"
              placeholderTextColor={SoulworxColors.textTertiary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.radioGroup}>
            {['draft', 'published', 'unlisted', 'archived'].map((status) => (
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

        <View style={styles.field}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setFormData({ ...formData, isFirstEpisode: !formData.isFirstEpisode })}
          >
            <Ionicons
              name={formData.isFirstEpisode ? 'checkbox' : 'square-outline'}
              size={24}
              color={formData.isFirstEpisode ? SoulworxColors.accent : SoulworxColors.textSecondary}
            />
            <Text style={styles.checkboxLabel}>First Episode (Free)</Text>
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
            <Text style={styles.saveButtonText}>Save Video</Text>
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
    flex: 1,
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
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
  },
  richTextEditor: {
    minHeight: 200,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  selectButtonText: {
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
    flex: 1,
  },
  selectButtonTextPlaceholder: {
    color: SoulworxColors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: SoulworxColors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  modalTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
  },
  modalCloseButton: {
    padding: Spacing.sm,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  modalOptionActive: {
    backgroundColor: SoulworxColors.accent,
  },
  modalOptionText: {
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
  },
  modalOptionTextActive: {
    color: SoulworxColors.white,
    fontWeight: Typography.semibold,
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
