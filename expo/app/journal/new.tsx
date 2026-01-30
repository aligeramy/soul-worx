import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useJournalOperations } from '@/hooks/useJournal';
import { FloatingBackButton } from '@/components/FloatingBackButton';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { enhanceJournalEntry } from '@/lib/ai';

const MOODS = ['😊 Happy', '😌 Calm', '🤔 Reflective', '💪 Motivated', '😴 Tired', '😢 Sad', '😤 Frustrated', '🎉 Excited'];

export default function NewJournalEntryScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { addEntry, loading } = useJournalOperations(user?.id || null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [wasEnhanced, setWasEnhanced] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title for your journal entry.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Required', 'Please write something in your journal entry.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save journal entries.');
      return;
    }

    try {
      await addEntry(content, {
        title: title.trim(),
        mood: selectedMood || null,
        isAiGenerated: wasEnhanced,
        aiPrompt: wasEnhanced ? 'Enhanced entry' : null,
      });
      
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save journal entry.');
    }
  };

  const handleEnhance = async () => {
    if (!content.trim()) {
      Alert.alert('Required', 'Please write something before enhancing.');
      return;
    }

    setIsEnhancing(true);
    
    try {
      const enhanced = await enhanceJournalEntry(content, title, user?.id || '');
      setContent(enhanced);
      setWasEnhanced(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to enhance journal entry.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <FloatingBackButton />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Journal Entry</Text>
          <Text style={styles.headerSubtitle}>Capture your thoughts and reflections</Text>
        </View>

        {/* Title Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Give your entry a title..."
            placeholderTextColor={SoulworxColors.textOnLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputSection}>
          <View style={styles.contentHeader}>
            <Text style={styles.label}>Your Entry</Text>
            <TouchableOpacity
              style={[styles.enhanceButton, (!content.trim() || isEnhancing) && styles.enhanceButtonDisabled]}
              onPress={handleEnhance}
              disabled={!content.trim() || isEnhancing}
            >
              {isEnhancing ? (
                <ActivityIndicator size="small" color={SoulworxColors.accent} />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color={SoulworxColors.accent} />
                  <Text style={styles.enhanceButtonText}>Make More Descriptive</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts here..."
            placeholderTextColor={SoulworxColors.textOnLight}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
          {isEnhancing && (
            <View style={styles.generatingOverlay}>
              <ActivityIndicator size="large" color={SoulworxColors.accent} />
              <Text style={styles.generatingText}>Enhancing your entry...</Text>
            </View>
          )}
        </View>

        {/* Mood Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>How are you feeling? (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton,
                  selectedMood === mood && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(selectedMood === mood ? null : mood)}
              >
                <Text style={[
                  styles.moodText,
                  selectedMood === mood && styles.moodTextSelected,
                ]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={[styles.saveButton, (!title.trim() || !content.trim() || loading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!title.trim() || !content.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={SoulworxColors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={SoulworxColors.white} />
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  inputSection: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    marginBottom: Spacing.sm,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  enhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: SoulworxColors.darkBeige,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: SoulworxColors.accent,
  },
  enhanceButtonDisabled: {
    opacity: 0.5,
  },
  enhanceButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  titleInput: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    ...Shadows.small,
  },
  contentInput: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
    minHeight: 300,
    ...Shadows.small,
  },
  generatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  generatingText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  moodScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  moodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.white,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    marginRight: Spacing.sm,
  },
  moodButtonSelected: {
    backgroundColor: SoulworxColors.accent,
    borderColor: SoulworxColors.accent,
  },
  moodText: {
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
  },
  moodTextSelected: {
    color: SoulworxColors.white,
  },
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: SoulworxColors.beige,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.accent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.large,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
});

