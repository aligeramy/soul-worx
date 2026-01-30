import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';

// Import expo-image-picker - will gracefully handle if native module isn't available
let ImagePicker: any;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  ImagePicker = null;
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'program' | 'channel' | 'video';
}

export function ImageUploadField({ label, value, onChange, type = 'program' }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    if (!ImagePicker) {
      Alert.alert(
        'Image Picker Unavailable',
        'Image picker requires a development build. Please enter the image URL manually below.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your photos to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      // Check if it's the native module error
      if (error?.message?.includes('native module') || error?.message?.includes('ExponentImagePicker')) {
        Alert.alert(
          'Image Picker Unavailable',
          'Image picker requires a development build (run: npx expo run:ios or npx expo run:android). Please enter the image URL manually below.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Could not open image picker. Please enter the image URL manually.');
      }
    }
  };

  const uploadImage = async (imageUri: string) => {
    setUploading(true);
    try {
      // Create FormData for React Native
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'image.jpg';
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: filename,
      } as any);

      // Upload to API endpoint
      const uploadResponse = await fetch('https://beta.soulworx.ca/api/profile/upload-image', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let fetch set it with boundary
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed. You can enter the URL manually below.');
      }

      const data = await uploadResponse.json();
      onChange(data.url);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      Alert.alert(
        'Upload Failed', 
        error.message || 'Could not upload image automatically. Please enter the image URL manually in the field below.',
        [{ text: 'OK' }]
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource(value, type)}
          style={styles.image}
          resizeMode="cover"
        />
        {ImagePicker && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color={SoulworxColors.white} size="small" />
            ) : (
              <Ionicons name="camera" size={20} color={SoulworxColors.white} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Or enter image URL manually"
        placeholderTextColor={SoulworxColors.textTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: SoulworxColors.darkBeige,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: SoulworxColors.accent,
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  input: {
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
});
