import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiPost, apiGet } from '@/lib/api-client';
import * as ImagePicker from 'expo-image-picker';

const SKILL_LEVELS = ['beginner', 'advanced', 'pro'] as const;
const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'] as const;
const TEAMS = ['No Team', 'Elementary', 'Middle School', 'Highschool', 'College', 'Pro'] as const;
const OUTSIDE_TEAMS = ['AAU', 'Prep', 'No team'] as const;
const EQUIPMENT = ['Full gym', 'Half gym', 'Driveway', 'Park'] as const;
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SESSION_LENGTHS = [30, 45, 60] as const;
const MENTAL_CHALLENGES = ['Fear of failure', 'Consistency', 'Pressure', 'Motivation', 'Other'] as const;
const COACHING_STYLES = ['Direct', 'Encouraging', 'Accountability', 'Driven', 'Mix', 'Other'] as const;
const BASKETBALL_WATCHING = ['Your own film', 'NBA/Pro/College', 'Both', 'None'] as const;

export default function ProPlusQuestionnaireScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const totalSteps = 12;

  const [formData, setFormData] = useState({
    age: '',
    skillLevel: '' as '' | 'beginner' | 'advanced' | 'pro',
    gameDescription: '',
    position: '' as '' | 'PG' | 'SG' | 'SF' | 'PF' | 'C',
    yearsPlaying: '',
    currentGoalsYearly: '',
    currentGoalsOverall: '',
    improvementRankings: {
      ballHandling: 3,
      defence: 3,
      finishing: 3,
      shooting: 3,
      passing: 3,
      other: { text: '', rank: 3 },
    },
    weight: '',
    height: '',
    currentInjuries: '',
    seeingPhysiotherapy: false,
    weightTrains: false,
    stretches: false,
    currentTeam: '' as '' | 'No Team' | 'Elementary' | 'Middle School' | 'Highschool' | 'College' | 'Pro',
    outsideSchoolTeams: '' as '' | 'AAU' | 'Prep' | 'No team',
    inSeason: false,
    basketballWatching: '',
    equipmentAccess: '' as '' | 'Full gym' | 'Half gym' | 'Driveway' | 'Park',
    trainingDays: [] as string[],
    averageSessionLength: null as number | null,
    biggestStruggle: '',
    confidenceLevel: 3,
    mentalChallenge: '' as '' | 'Fear of failure' | 'Consistency' | 'Pressure' | 'Motivation' | 'Other',
    mentalChallengeOther: '',
    coachability: 3,
    preferredCoachingStyle: '' as '' | 'Direct' | 'Encouraging' | 'Accountability' | 'Driven' | 'Mix' | 'Other',
    coachingStyleOther: '',
    gameFilmUrl: '',
    workoutVideos: [] as string[],
  });

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      router.replace('/(tabs)' as any);
      return;
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await apiGet<{ age?: number }>('/api/onboarding/user-data');
        if (data.age) {
          setFormData((prev) => ({ ...prev, age: data.age!.toString() }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleVideoUpload = async (type: 'gameFilm' | 'workout') => {
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
          if (type === 'gameFilm') {
            setFormData((prev) => ({ ...prev, gameFilmUrl: data.url }));
          } else {
            setFormData((prev) => ({ ...prev, workoutVideos: [...prev.workoutVideos, data.url] }));
          }
          Alert.alert('Success', 'Video uploaded successfully');
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'Failed to upload video. You can skip this step.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiPost('/api/onboarding/pro-plus-questionnaire', {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        averageSessionLength: formData.averageSessionLength,
        confidenceLevel: formData.confidenceLevel,
        coachability: formData.coachability,
        improvementRankings: formData.improvementRankings,
      });

      Alert.alert('Success', 'Questionnaire completed successfully!', [
        {
          text: 'Continue',
          onPress: () => router.push('/onboarding/book-call' as any),
        },
      ]);
    } catch (error: any) {
      console.error('Error saving questionnaire:', error);
      Alert.alert('Error', error.message || 'Failed to save questionnaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <View style={styles.ageInputContainer}>
                <TextInput
                  style={styles.ageInput}
                  value={formData.age}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/\D/g, '')
                    if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 120)) {
                      setFormData({ ...formData, age: numericValue })
                    }
                  }}
                  placeholder="Enter your age"
                  keyboardType="numeric"
                  placeholderTextColor={SoulworxColors.textTertiary}
                />
                <Text style={styles.ageSuffix}>years old</Text>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Skill Level</Text>
              <View style={styles.optionsGrid}>
                {SKILL_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.optionButton,
                      formData.skillLevel === level && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, skillLevel: level })}
                  >
                    <Text style={styles.optionText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Describe your game</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.gameDescription}
                onChangeText={(text) => setFormData({ ...formData, gameDescription: text })}
                placeholder="Tell us about your playing style..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Position & Experience</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Position</Text>
              <View style={styles.optionsGrid}>
                {POSITIONS.map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    style={[
                      styles.optionButton,
                      formData.position === pos && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, position: pos })}
                  >
                    <Text style={styles.optionText}>{pos}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Years playing basketball</Text>
              <TextInput
                style={styles.input}
                value={formData.yearsPlaying}
                onChangeText={(text) => setFormData({ ...formData, yearsPlaying: text })}
                placeholder="e.g., 5 years"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Goals</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Current goals - Yearly</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.currentGoalsYearly}
                onChangeText={(text) => setFormData({ ...formData, currentGoalsYearly: text })}
                placeholder="What do you want to achieve this year?"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Current goals - Overall</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.currentGoalsOverall}
                onChangeText={(text) => setFormData({ ...formData, currentGoalsOverall: text })}
                placeholder="What are your long-term goals?"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Improvement Rankings</Text>
            <Text style={styles.stepDescription}>Rate each area from 1 (needs most improvement) to 5 (needs least)</Text>
            {(['ballHandling', 'defence', 'finishing', 'shooting', 'passing'] as const).map((skill) => (
              <View key={skill} style={styles.field}>
                <Text style={styles.label}>{skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1')}</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <TouchableOpacity
                      key={rank}
                      style={[
                        styles.ratingButton,
                        formData.improvementRankings[skill] === rank && styles.ratingButtonSelected,
                      ]}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          improvementRankings: {
                            ...formData.improvementRankings,
                            [skill]: rank,
                          },
                        })
                      }
                    >
                      <Text style={styles.ratingText}>{rank}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Physical Stats</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                placeholder="Enter your weight"
                keyboardType="numeric"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                value={formData.height}
                onChangeText={(text) => setFormData({ ...formData, height: text })}
                placeholder="e.g., 6'2 or 188cm"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Current injuries (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.currentInjuries}
                onChangeText={(text) => setFormData({ ...formData, currentInjuries: text })}
                placeholder="List any current injuries..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Training & Health</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Are you seeing physiotherapy?</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    formData.seeingPhysiotherapy && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, seeingPhysiotherapy: true })}
                >
                  <Text style={styles.toggleText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !formData.seeingPhysiotherapy && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, seeingPhysiotherapy: false })}
                >
                  <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Do you weight train?</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    formData.weightTrains && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, weightTrains: true })}
                >
                  <Text style={styles.toggleText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !formData.weightTrains && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, weightTrains: false })}
                >
                  <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Do you stretch?</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    formData.stretches && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, stretches: true })}
                >
                  <Text style={styles.toggleText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !formData.stretches && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, stretches: false })}
                >
                  <Text style={styles.toggleText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Team & Competition</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Current Team</Text>
              <View style={styles.optionsGrid}>
                {TEAMS.map((team) => (
                  <TouchableOpacity
                    key={team}
                    style={[
                      styles.optionButton,
                      formData.currentTeam === team && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, currentTeam: team as any })}
                  >
                    <Text style={styles.optionText}>{team}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Outside of school teams</Text>
              <View style={styles.optionsGrid}>
                {OUTSIDE_TEAMS.map((team) => (
                  <TouchableOpacity
                    key={team}
                    style={[
                      styles.optionButton,
                      formData.outsideSchoolTeams === team && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, outsideSchoolTeams: team as any })}
                  >
                    <Text style={styles.optionText}>{team}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>In season or off season?</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    formData.inSeason && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, inSeason: true })}
                >
                  <Text style={styles.toggleText}>In Season</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !formData.inSeason && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, inSeason: false })}
                >
                  <Text style={styles.toggleText}>Off Season</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Basketball Watching</Text>
            <View style={styles.field}>
              <Text style={styles.label}>How much basketball do you watch?</Text>
              <View style={styles.optionsGrid}>
                {BASKETBALL_WATCHING.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      formData.basketballWatching === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, basketballWatching: option })}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 9:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Equipment & Availability</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Access to equipment</Text>
              <View style={styles.optionsGrid}>
                {EQUIPMENT.map((eq) => (
                  <TouchableOpacity
                    key={eq}
                    style={[
                      styles.optionButton,
                      formData.equipmentAccess === eq && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, equipmentAccess: eq as any })}
                  >
                    <Text style={styles.optionText}>{eq}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Days you can train</Text>
              <View style={styles.optionsGrid}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.optionButton,
                      formData.trainingDays.includes(day) && styles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      const newDays = formData.trainingDays.includes(day)
                        ? formData.trainingDays.filter((d) => d !== day)
                        : [...formData.trainingDays, day];
                      setFormData({ ...formData, trainingDays: newDays });
                    }}
                  >
                    <Text style={styles.optionText}>{day.slice(0, 3)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Average session length (minutes)</Text>
              <View style={styles.optionsGrid}>
                {SESSION_LENGTHS.map((length) => (
                  <TouchableOpacity
                    key={length}
                    style={[
                      styles.optionButton,
                      formData.averageSessionLength === length && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, averageSessionLength: length })}
                  >
                    <Text style={styles.optionText}>{length}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 10:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Mental & Mindset</Text>
            <View style={styles.field}>
              <Text style={styles.label}>What's your biggest struggle?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.biggestStruggle}
                onChangeText={(text) => setFormData({ ...formData, biggestStruggle: text })}
                placeholder="Tell us about your biggest challenge..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={SoulworxColors.textTertiary}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Confidence Level (1-5)</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.ratingButton,
                      formData.confidenceLevel === level && styles.ratingButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, confidenceLevel: level })}
                  >
                    <Text style={styles.ratingText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Mental Challenge</Text>
              <View style={styles.optionsGrid}>
                {MENTAL_CHALLENGES.map((challenge) => (
                  <TouchableOpacity
                    key={challenge}
                    style={[
                      styles.optionButton,
                      formData.mentalChallenge === challenge && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, mentalChallenge: challenge as any })}
                  >
                    <Text style={styles.optionText}>{challenge}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {formData.mentalChallenge === 'Other' && (
              <View style={styles.field}>
                <Text style={styles.label}>Please specify</Text>
                <TextInput
                  style={styles.input}
                  value={formData.mentalChallengeOther}
                  onChangeText={(text) => setFormData({ ...formData, mentalChallengeOther: text })}
                  placeholder="Describe your mental challenge..."
                  placeholderTextColor={SoulworxColors.textTertiary}
                />
              </View>
            )}
          </View>
        );

      case 11:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Coaching Preferences</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Coachability (1-5)</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.ratingButton,
                      formData.coachability === level && styles.ratingButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, coachability: level })}
                  >
                    <Text style={styles.ratingText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Preferred Coaching Style</Text>
              <View style={styles.optionsGrid}>
                {COACHING_STYLES.map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.optionButton,
                      formData.preferredCoachingStyle === style && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, preferredCoachingStyle: style as any })}
                  >
                    <Text style={styles.optionText}>{style}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {formData.preferredCoachingStyle === 'Other' && (
              <View style={styles.field}>
                <Text style={styles.label}>Please specify</Text>
                <TextInput
                  style={styles.input}
                  value={formData.coachingStyleOther}
                  onChangeText={(text) => setFormData({ ...formData, coachingStyleOther: text })}
                  placeholder="Describe your preferred coaching style..."
                  placeholderTextColor={SoulworxColors.textTertiary}
                />
              </View>
            )}
          </View>
        );

      case 12:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Video Uploads (Optional)</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Game Film</Text>
              {formData.gameFilmUrl ? (
                <View style={styles.uploadedContainer}>
                  <Ionicons name="checkmark-circle" size={20} color={SoulworxColors.success} />
                  <Text style={styles.uploadedText}>Video uploaded</Text>
                  <TouchableOpacity onPress={() => setFormData({ ...formData, gameFilmUrl: '' })}>
                    <Ionicons name="close" size={20} color={SoulworxColors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleVideoUpload('gameFilm')}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator color={SoulworxColors.white} />
                  ) : (
                    <>
                      <Ionicons name="videocam" size={20} color={SoulworxColors.white} />
                      <Text style={styles.uploadButtonText}>Upload Game Film</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Workout Videos (Optional)</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleVideoUpload('workout')}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color={SoulworxColors.white} />
                ) : (
                  <>
                    <Ionicons name="add-circle" size={20} color={SoulworxColors.white} />
                    <Text style={styles.uploadButtonText}>Add Workout Video</Text>
                  </>
                )}
              </TouchableOpacity>
              {formData.workoutVideos.length > 0 && (
                <Text style={styles.uploadedCount}>{formData.workoutVideos.length} video(s) uploaded</Text>
              )}
            </View>
            <Text style={styles.optionalNote}>* Video uploads are optional. You can skip this step.</Text>
          </View>
        );

      default:
        return null;
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pro+ Questionnaire</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      </View>

      {/* Form Content */}
      <View style={styles.formCard}>
        {renderStep()}

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonSecondary]}
            onPress={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1 || isSubmitting}
          >
            <Ionicons name="chevron-back" size={20} color={SoulworxColors.textPrimary} />
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
          {currentStep < totalSteps ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={() => setCurrentStep(currentStep + 1)}
              disabled={isSubmitting}
            >
              <Text style={styles.navButtonPrimaryText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color={SoulworxColors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={SoulworxColors.white} />
              ) : (
                <>
                  <Text style={styles.navButtonPrimaryText}>Complete</Text>
                  <Ionicons name="checkmark" size={20} color={SoulworxColors.white} />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
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
    marginBottom: Spacing.lg,
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
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: SoulworxColors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SoulworxColors.gold,
  },
  formCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  stepContent: {
    gap: Spacing.lg,
  },
  stepTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  stepDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.md,
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
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    paddingRight: Spacing.md,
  },
  ageInput: {
    flex: 1,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
  },
  ageSuffix: {
    fontSize: Typography.base,
    color: SoulworxColors.textTertiary,
    marginLeft: Spacing.xs,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: '30%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  optionText: {
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ratingButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
  },
  ratingButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  ratingText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  toggleButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
  },
  toggleButtonActive: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  toggleText: {
    fontSize: Typography.base,
    color: SoulworxColors.textOnLight,
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
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: `${SoulworxColors.success}20`,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.success,
  },
  uploadedText: {
    flex: 1,
    fontSize: Typography.base,
    color: SoulworxColors.success,
  },
  uploadedCount: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginTop: Spacing.xs,
  },
  optionalNote: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  navigation: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  navButtonSecondary: {
    backgroundColor: SoulworxColors.charcoal,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  navButtonPrimary: {
    backgroundColor: SoulworxColors.gold,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  navButtonPrimaryText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});
