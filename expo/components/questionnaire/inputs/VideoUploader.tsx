import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

interface VideoUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  placeholder?: string;
  uploadEndpoint?: string;
}

export function VideoUploader({
  value,
  onChange,
  label = 'Video',
  placeholder = 'Upload a video',
  uploadEndpoint = 'https://beta.soulworx.ca/api/profile/upload-video',
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: 'video/mp4',
          name: 'video.mp4',
        } as any);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onChange(data.url);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('Success', 'Video uploaded successfully');
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(null);
  };

  if (value) {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.uploadedContainer}>
          <View style={styles.uploadedInfo}>
            <Ionicons name="checkmark-circle" size={24} color={SoulworxColors.success} />
            <Text style={styles.uploadedText}>Video uploaded</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.removeButton, pressed && styles.buttonPressed]}
            onPress={handleRemove}
          >
            <Ionicons name="close-circle" size={24} color={SoulworxColors.error} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={({ pressed }) => [
          styles.uploadButton,
          pressed && styles.buttonPressed,
          isUploading && styles.uploadButtonDisabled,
        ]}
        onPress={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color={SoulworxColors.white} />
        ) : (
          <>
            <Ionicons name="videocam" size={24} color={SoulworxColors.white} />
            <Text style={styles.uploadButtonText}>{placeholder}</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

interface MultiVideoUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxVideos?: number;
  uploadEndpoint?: string;
}

export function MultiVideoUploader({
  values,
  onChange,
  label = 'Videos',
  maxVideos = 5,
  uploadEndpoint = 'https://beta.soulworx.ca/api/profile/upload-video',
}: MultiVideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (values.length >= maxVideos) {
      Alert.alert('Limit Reached', `You can upload up to ${maxVideos} videos`);
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: 'video/mp4',
          name: 'video.mp4',
        } as any);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onChange([...values, data.url]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('Success', 'Video uploaded successfully');
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {values.length > 0 && (
        <View style={styles.videosList}>
          {values.map((_, index) => (
            <View key={index} style={styles.videoItem}>
              <View style={styles.videoItemInfo}>
                <Ionicons name="videocam" size={20} color={SoulworxColors.success} />
                <Text style={styles.videoItemText}>Video {index + 1}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.removeButton, pressed && styles.buttonPressed]}
                onPress={() => handleRemove(index)}
              >
                <Ionicons name="close" size={20} color={SoulworxColors.textSecondary} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {values.length < maxVideos && (
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
            isUploading && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color={SoulworxColors.gold} />
          ) : (
            <>
              <Ionicons name="add-circle" size={20} color={SoulworxColors.gold} />
              <Text style={styles.addButtonText}>Add Video</Text>
            </>
          )}
        </Pressable>
      )}

      <Text style={styles.countText}>
        {values.length} / {maxVideos} videos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.gold,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.small,
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  uploadButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${SoulworxColors.success}20`,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.success,
  },
  uploadedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadedText: {
    fontSize: Typography.base,
    color: SoulworxColors.success,
    fontWeight: Typography.semibold,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  videosList: {
    gap: Spacing.sm,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${SoulworxColors.success}15`,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: `${SoulworxColors.success}40`,
  },
  videoItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  videoItemText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.gold,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.gold,
  },
  countText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
});
