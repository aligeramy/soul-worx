import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiPost } from '@/lib/api-client';
import * as ImagePicker from 'expo-image-picker';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminCreateProgramScreen() {
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useUser();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    trainingDays: [] as string[],
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!currentUser) return;
    
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      router.replace('/admin');
    }
  }, [currentUser]);

  const handleVideoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', {
          uri: result.assets[0].uri,
          type: 'video/mp4',
          name: 'video.mp4',
        } as any);

        const uploadResponse = await fetch('https://beta.soulworx.ca/api/profile/upload-video', {
          method: 'POST',
          body: formDataUpload,
        });

        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          setFormData({ ...formData, videoUrl: data.url });
          Alert.alert('Success', 'Video uploaded successfully');
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.videoUrl || formData.trainingDays.length === 0 || !formData.startDate || !formData.endDate) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiPost('/api/personalized-programs', {
        userId,
        createdBy: currentUser?.id,
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        trainingDays: formData.trainingDays,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      Alert.alert('Success', 'Program created successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating program:', error);
      Alert.alert('Error', error.message || 'Failed to create program');
    } finally {
      setIsSubmitting(false);
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
        <Text style={styles.headerTitle}>Create Program</Text>
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <View style={styles.field}>
          <Text style={styles.label}>Program Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="e.g., Ball Handling Mastery"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Describe the program..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Training Video *</Text>
          {formData.videoUrl ? (
            <View style={styles.videoUploaded}>
              <Ionicons name="checkmark-circle" size={20} color={SoulworxColors.success} />
              <Text style={styles.videoUploadedText}>Video uploaded</Text>
              <TouchableOpacity onPress={() => setFormData({ ...formData, videoUrl: '' })}>
                <Ionicons name="close" size={20} color={SoulworxColors.textSecondary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleVideoUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={SoulworxColors.white} />
              ) : (
                <>
                  <Ionicons name="videocam" size={20} color={SoulworxColors.white} />
                  <Text style={styles.uploadButtonText}>Upload Video</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Training Days *</Text>
          <View style={styles.daysContainer}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  formData.trainingDays.includes(day) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleTrainingDay(day)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    formData.trainingDays.includes(day) && styles.dayButtonTextSelected,
                  ]}
                >
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Start Date *</Text>
          <TextInput
            style={styles.input}
            value={formData.startDate}
            onChangeText={(text) => setFormData({ ...formData, startDate: text })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>End Date *</Text>
          <TextInput
            style={styles.input}
            value={formData.endDate}
            onChangeText={(text) => setFormData({ ...formData, endDate: text })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={SoulworxColors.textTertiary}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={SoulworxColors.white} />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={SoulworxColors.white} />
              <Text style={styles.submitButtonText}>Create Program</Text>
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
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  formCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
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
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.gold,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  uploadButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  videoUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: `${SoulworxColors.success}20`,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.success,
  },
  videoUploadedText: {
    flex: 1,
    fontSize: Typography.base,
    color: SoulworxColors.success,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dayButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
  },
  dayButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  dayButtonText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
  },
  dayButtonTextSelected: {
    color: SoulworxColors.gold,
    fontWeight: Typography.bold,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.gold,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    ...Shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
});
