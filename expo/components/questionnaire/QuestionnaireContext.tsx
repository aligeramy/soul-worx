import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { apiPost, apiGet } from '@/lib/api-client';
import { useUser } from '@/contexts/UserContext';

const STORAGE_KEY = '@questionnaire_draft';

export interface QuestionnaireFormData {
  // Step 1: Basic Info
  age: string;
  skillLevel: '' | 'beginner' | 'advanced' | 'pro';
  gameDescription: string;

  // Step 2: Position & Experience
  position: '' | 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  yearsPlaying: string;

  // Step 3: Goals
  currentGoalsYearly: string;
  currentGoalsOverall: string;

  // Step 4: Improvement Rankings
  improvementRankings: {
    ballHandling: number;
    defence: number;
    finishing: number;
    shooting: number;
    passing: number;
    other: { text: string; rank: number };
  };

  // Step 5: Physical Stats
  weight: string;
  height: string;
  currentInjuries: string;

  // Step 6: Training & Health
  seeingPhysiotherapy: boolean;
  weightTrains: boolean;
  stretches: boolean;

  // Step 7: Team & Competition
  currentTeam: '' | 'No Team' | 'Elementary' | 'Middle School' | 'Highschool' | 'College' | 'Pro';
  outsideSchoolTeams: '' | 'AAU' | 'Prep' | 'No team';
  inSeason: boolean;

  // Step 8: Basketball Watching
  basketballWatching: string;

  // Step 9: Equipment & Availability
  equipmentAccess: '' | 'Full gym' | 'Half gym' | 'Driveway' | 'Park';
  trainingDays: string[];
  averageSessionLength: number | null;

  // Step 10: Mental & Mindset
  biggestStruggle: string;
  confidenceLevel: number;
  mentalChallenge: '' | 'Fear of failure' | 'Consistency' | 'Pressure' | 'Motivation' | 'Other';
  mentalChallengeOther: string;

  // Step 11: Coaching Preferences
  coachability: number;
  preferredCoachingStyle: '' | 'Direct' | 'Encouraging' | 'Accountability' | 'Driven' | 'Mix' | 'Other';
  coachingStyleOther: string;

  // Step 12: Video Uploads
  gameFilmUrl: string;
  workoutVideos: string[];
}

interface QuestionnaireContextType {
  formData: QuestionnaireFormData;
  updateField: <K extends keyof QuestionnaireFormData>(field: K, value: QuestionnaireFormData[K]) => void;
  currentStep: number;
  totalSteps: number;
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: number) => void;
  canProceed: boolean;
  submit: () => Promise<void>;
  isSubmitting: boolean;
  saveDraft: () => Promise<void>;
  clearDraft: () => Promise<void>;
  resetForm: () => void;
}

const defaultFormData: QuestionnaireFormData = {
  age: '',
  skillLevel: '',
  gameDescription: '',
  position: '',
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
  currentTeam: '',
  outsideSchoolTeams: '',
  inSeason: false,
  basketballWatching: '',
  equipmentAccess: '',
  trainingDays: [],
  averageSessionLength: null,
  biggestStruggle: '',
  confidenceLevel: 3,
  mentalChallenge: '',
  mentalChallengeOther: '',
  coachability: 3,
  preferredCoachingStyle: '',
  coachingStyleOther: '',
  gameFilmUrl: '',
  workoutVideos: [],
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [formData, setFormData] = useState<QuestionnaireFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 12;

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem(STORAGE_KEY);
        if (draft) {
          const parsed = JSON.parse(draft);
          setFormData({ ...defaultFormData, ...parsed.formData });
          if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    };

    loadDraft();
  }, []);

  // Load user data (age) from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await apiGet<{ age?: number }>('/api/onboarding/user-data');
        if (data.age) {
          setFormData((prev) => ({ ...prev, age: data.age!.toString() }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const updateField = useCallback(<K extends keyof QuestionnaireFormData>(
    field: K,
    value: QuestionnaireFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const saveDraft = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ formData, currentStep })
      );
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [formData, currentStep]);

  const clearDraft = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    clearDraft();
  }, [clearDraft]);

  // Validate current step
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.age !== '' && formData.skillLevel !== '';
      case 2:
        return formData.position !== '';
      case 3:
        return true; // Goals are optional
      case 4:
        return true; // Rankings have defaults
      case 5:
        return true; // Physical stats are optional
      case 6:
        return true; // Training questions have defaults
      case 7:
        return formData.currentTeam !== '';
      case 8:
        return formData.basketballWatching !== '';
      case 9:
        return formData.equipmentAccess !== '' && formData.trainingDays.length > 0;
      case 10:
        return formData.mentalChallenge !== '' || true; // Optional
      case 11:
        return formData.preferredCoachingStyle !== '' || true; // Optional
      case 12:
        return true; // Videos are optional
      default:
        return true;
    }
  }, [currentStep, formData]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      saveDraft();
    }
  }, [currentStep, totalSteps, saveDraft]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      saveDraft();
    }
  }, [currentStep, saveDraft]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      saveDraft();
    }
  }, [totalSteps, saveDraft]);

  const submit = useCallback(async () => {
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

      await clearDraft();

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
  }, [formData, clearDraft]);

  return (
    <QuestionnaireContext.Provider
      value={{
        formData,
        updateField,
        currentStep,
        totalSteps,
        goNext,
        goBack,
        goToStep,
        canProceed: canProceed(),
        submit,
        isSubmitting,
        saveDraft,
        clearDraft,
        resetForm,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
}
