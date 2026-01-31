import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useJournalEntry } from '@/hooks/useJournal';
import { useJournalOperations } from '@/hooks/useJournal';
import { FloatingBackButton } from '@/components/FloatingBackButton';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { formatDateTime } from '@/lib/format';

const MOODS = ['😊 Happy', '😌 Calm', '🤔 Reflective', '💪 Motivated', '😴 Tired', '😢 Sad', '😤 Frustrated', '🎉 Excited'];

export default function JournalEntryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const { entry, loading: entryLoading, refetch } = useJournalEntry(params.id);
  const { updateEntry, removeEntry, loading } = useJournalOperations(user?.id || null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  React.useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content);
      setSelectedMood(entry.mood);
    }
  }, [entry]);

  if (entryLoading) {
    return <LoadingState message="Loading entry..." />;
  }

  if (!entry) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={64} color={SoulworxColors.textTertiary} />
        <Text style={styles.errorText}>Entry not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title for your journal entry.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Required', 'Please write something in your journal entry.');
      return;
    }

    try {
      await updateEntry(entry.id, {
        title: title.trim(),
        content: content.trim(),
        mood: selectedMood || undefined,
      });
      
      setIsEditing(false);
      await refetch();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update journal entry.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeEntry(entry.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete entry.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textOnLight} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Entry' : 'Journal Entry'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {formatDateTime(entry.createdAt)}
          </Text>
        </View>
        {!isEditing && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={24} color={SoulworxColors.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={24} color={SoulworxColors.error} />
            </TouchableOpacity>
          </View>
        )}
        {entry.isAiGenerated && (
          <View style={styles.aiBadgeHeader}>
            <Ionicons name="sparkles" size={16} color={SoulworxColors.gold} />
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Spacing.lg, paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >

        {/* Title and Content Card */}
        {isEditing ? (
          <>
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
            <View style={styles.inputSection}>
              <Text style={styles.label}>Your Entry</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Write your thoughts here..."
                placeholderTextColor={SoulworxColors.textOnLight}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>
          </>
        ) : (
          <View style={styles.entryCard}>
            <Text style={styles.title}>{entry.title || 'Untitled Entry'}</Text>
            <Text style={styles.content}>{entry.content}</Text>
          </View>
        )}

        {/* Mood */}
        {isEditing ? (
          <View style={styles.inputSection}>
            <Text style={styles.label}>How are you feeling?</Text>
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
        ) : (
          entry.mood && (
            <View style={styles.moodSection}>
              <Text style={styles.moodLabel}>Mood:</Text>
              <View style={styles.moodBadge}>
                <Text style={styles.moodBadgeText}>{entry.mood}</Text>
              </View>
            </View>
          )
        )}
      </ScrollView>

      {/* Action Buttons */}
      {isEditing && (
        <View style={[styles.actionContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsEditing(false);
              setTitle(entry.title || '');
              setContent(entry.content);
              setSelectedMood(entry.mood);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, (!content.trim() || loading) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!content.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={SoulworxColors.white} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={SoulworxColors.white} />
                <Text style={styles.saveButtonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: SoulworxColors.white,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
  },
  headerSubtitle: {
    fontSize: Typography.sm,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginLeft: Spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: SoulworxColors.darkBeige,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.md,
  },
  aiBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
  },
  entryCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
    marginBottom: Spacing.md,
  },
  content: {
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
    lineHeight: Typography.base * 1.6,
  },
  moodSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignSelf: 'flex-start',
    ...Shadows.small,
  },
  moodLabel: {
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
    opacity: 0.7,
  },
  moodBadge: {
    backgroundColor: SoulworxColors.darkBeige,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  moodBadgeText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  moodText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
  },
  moodTextSelected: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
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
  titleInput: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
    ...Shadows.small,
  },
  contentInput: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
    minHeight: 300,
    ...Shadows.small,
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
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: SoulworxColors.beige,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
  },
  cancelButtonText: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textOnLight,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.accent,
    borderRadius: BorderRadius.md,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.md,
  },
  retryButton: {
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  retryText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});

