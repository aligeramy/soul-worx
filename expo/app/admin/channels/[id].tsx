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
import type { CommunityChannel, Video } from '@/lib/types';

export default function AdminChannelDetailScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [channel, setChannel] = useState<CommunityChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEpisodesModal, setShowEpisodesModal] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'basketball' as const,
    status: 'draft' as const,
    coverImage: '',
    thumbnailImage: '',
    requiredTierLevel: '1',
    isFeatured: false,
  });

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.replace('/admin');
      return;
    }
    if (id && id !== 'new') {
      loadChannel();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const loadChannel = async () => {
    try {
      const { data, error } = await supabase
        .from('community_channel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setChannel(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          longDescription: data.longDescription || '',
          category: data.category || 'basketball',
          status: data.status || 'draft',
          coverImage: data.coverImage || '',
          thumbnailImage: data.thumbnailImage || '',
          requiredTierLevel: data.requiredTierLevel?.toString() || '1',
          isFeatured: data.isFeatured || false,
        });
      }
    } catch (error) {
      console.error('Error loading channel:', error);
      Alert.alert('Error', 'Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    if (!channel?.id) return;
    
    setLoadingVideos(true);
    try {
      const { data, error } = await supabase
        .from('video')
        .select('*')
        .eq('channelId', channel.id)
        .order('episodeNumber', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      Alert.alert('Error', 'Failed to load episodes');
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      Alert.alert('Validation Error', 'Title is required');
      return;
    }

    setSaving(true);
    try {
      const channelData = {
        ...formData,
        requiredTierLevel: parseInt(formData.requiredTierLevel) || 1,
      };

      if (id && id !== 'new' && channel) {
        const { error } = await supabase
          .from('community_channel')
          .update({
            ...channelData,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        Alert.alert('Success', 'Channel updated successfully');
      } else {
        const { data, error } = await supabase
          .from('community_channel')
          .insert({
            ...channelData,
            createdBy: user?.id || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        Alert.alert('Success', 'Channel created successfully');
        router.replace(`/admin/channels/${data.id}` as any);
      }
    } catch (error: any) {
      console.error('Error saving channel:', error);
      Alert.alert('Error', error.message || 'Failed to save channel');
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
          {id === 'new' ? 'New Channel' : 'Edit Channel'}
        </Text>
        {id !== 'new' && channel && (
          <TouchableOpacity
            onPress={() => {
              setShowEpisodesModal(true);
              loadVideos();
            }}
            style={styles.viewEpisodesButton}
          >
            <Ionicons name="list" size={20} color={SoulworxColors.accent} />
            <Text style={styles.viewEpisodesText}>View Episodes</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Channel title"
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

        <ImageUploadField
          label="Cover Image"
          value={formData.coverImage}
          onChange={(url) => setFormData({ ...formData, coverImage: url })}
          type="channel"
        />

        <ImageUploadField
          label="Thumbnail Image"
          value={formData.thumbnailImage}
          onChange={(url) => setFormData({ ...formData, thumbnailImage: url })}
          type="channel"
        />

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

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={SoulworxColors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Channel</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Episodes Modal */}
      <Modal
        visible={showEpisodesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEpisodesModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + Spacing.md }]}>
            <TouchableOpacity 
              onPress={() => setShowEpisodesModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={SoulworxColors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Episodes</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>
          
          {loadingVideos ? (
            <View style={styles.modalLoadingContainer}>
              <ActivityIndicator size="large" color={SoulworxColors.accent} />
            </View>
          ) : (
            <ScrollView style={styles.modalContent}>
              {videos.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="videocam-outline" size={48} color={SoulworxColors.textTertiary} />
                  <Text style={styles.emptyText}>No episodes available yet</Text>
                </View>
              ) : (
                <View style={styles.episodesList}>
                  {videos.map((video) => (
                    <TouchableOpacity
                      key={video.id}
                      style={styles.episodeItem}
                      onPress={() => {
                        setShowEpisodesModal(false);
                        router.push({ pathname: '/admin/videos/[id]', params: { id: video.id } });
                      }}
                    >
                      <View style={styles.episodeInfo}>
                        <Text style={styles.episodeTitle}>
                          {video.episodeNumber ? `Episode ${video.episodeNumber}` : 'Episode'} - {video.title || 'Untitled'}
                        </Text>
                        {video.description && (
                          <Text style={styles.episodeDescription} numberOfLines={2}>
                            {video.description}
                          </Text>
                        )}
                        <View style={styles.episodeMeta}>
                          <View style={styles.episodeBadge}>
                            <Text style={styles.episodeBadgeText}>{video.status || 'draft'}</Text>
                          </View>
                          {video.duration && (
                            <Text style={styles.episodeDuration}>
                              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
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
    gap: Spacing.sm,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  viewEpisodesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.beige,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  viewEpisodesText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.accent,
  },
  form: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  field: {
    marginBottom: Spacing.lg,
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
  saveButton: {
    backgroundColor: SoulworxColors.accent,
    borderRadius: BorderRadius.lg,
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
  modalContainer: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.white,
  },
  modalCloseButton: {
    padding: Spacing.sm,
  },
  modalTitle: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
    textAlign: 'center',
  },
  modalHeaderSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodesList: {
    gap: Spacing.sm,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    ...Shadows.small,
  },
  episodeInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  episodeTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  episodeDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  episodeBadge: {
    backgroundColor: SoulworxColors.beige,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  episodeBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textSecondary,
    textTransform: 'capitalize',
  },
  episodeDuration: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
