import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { CareerCard } from '@/components/CareerCard';
import Constants from 'expo-constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  careers?: CareerOption[];
}

interface CareerOption {
  title: string;
  description: string;
  category?: string;
}

interface SelectedInfo {
  grade?: string;
  interests: string[];
  skills: string[];
  weaknesses: string[];
  hobbies: string[];
}

const QUICK_OPTIONS = {
  grades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University', 'Graduate', 'Career Change'],
  interests: ['Science', 'Math', 'English', 'Social Studies', 'Arts', 'Music', 'Sports', 'Technology', 'Business', 'Psychology', 'Sociology', 'History', 'Literature', 'Philosophy'],
  skills: ['Writing', 'Communication', 'Creative Thinking', 'Problem Solving', 'Leadership', 'Teamwork', 'Artistic', 'Analytical', 'Research', 'Public Speaking', 'Organization'],
  weaknesses: ['Math', 'Science', 'Public Speaking', 'Writing', 'Time Management', 'Organization'],
  hobbies: ['Painting', 'Drawing', 'Reading', 'Writing', 'Music', 'Sports', 'Gaming', 'Photography', 'Cooking', 'Volunteering', 'Travel'],
};

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your career coach at Soulworx. I\'m here to help you explore career paths that align with your interests, skills, and goals.\n\nYou can tell me about yourself by typing, or use the quick-select buttons below to add information quickly!',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>({
    interests: [],
    skills: [],
    weaknesses: [],
    hobbies: [],
  });
  const [showQuickSelect, setShowQuickSelect] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const API_KEY = Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

  useEffect(() => {
    // Scroll to bottom when new messages are added
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const toggleSelection = (category: keyof SelectedInfo, value: string) => {
    setSelectedInfo((prev) => {
      if (category === 'grade') {
        return { ...prev, grade: prev.grade === value ? undefined : value };
      }
      const currentArray = prev[category] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [category]: newArray };
    });
  };

  const buildSummaryMessage = (): string => {
    const parts: string[] = [];
    
    if (selectedInfo.grade) {
      parts.push(`I'm a ${selectedInfo.grade.toLowerCase()} student`);
    }
    
    if (selectedInfo.interests.length > 0) {
      parts.push(`I'm interested in ${selectedInfo.interests.join(', ')}`);
    }
    
    if (selectedInfo.skills.length > 0) {
      parts.push(`I excel in ${selectedInfo.skills.join(', ')}`);
    }
    
    if (selectedInfo.weaknesses.length > 0) {
      parts.push(`I'm not particularly skilled in ${selectedInfo.weaknesses.join(', ')}`);
    }
    
    if (selectedInfo.hobbies.length > 0) {
      parts.push(`Outside of school, I enjoy ${selectedInfo.hobbies.join(', ')}`);
    }
    
    if (parts.length === 0) {
      return 'I\'m unsure about my career path and what I should major in.';
    }
    
    return parts.join('. ') + '. I\'m unsure about my career path and what I should major in.';
  };

  const sendQuickSelect = async () => {
    const summary = buildSummaryMessage();
    if (summary && !isLoading) {
      await sendMessage(summary);
    }
  };

  const sendMessage = async (customText?: string) => {
    const messageText = customText || inputText.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setShowQuickSelect(false); // Hide quick select after first message
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a career coach at Soulworx, helping students and young professionals discover career paths that align with their interests, skills, and goals. 

Your approach:
1. Ask thoughtful follow-up questions to understand the person's interests, strengths, weaknesses, hobbies, and concerns
2. Be encouraging and supportive - help them see possibilities they might not have considered
3. When you have enough information (after 2-3 exchanges), provide 3-5 specific career recommendations

When providing career recommendations, format them as JSON in this exact structure:
{
  "text": "Your encouraging response text here",
  "careers": [
    {
      "title": "Career Name",
      "description": "Brief description of why this career fits them and what it involves",
      "category": "Category (e.g., Arts, Social Sciences, Education, etc.)"
    }
  ]
}

If you don't have enough information yet, just respond conversationally without JSON. Be warm, empathetic, and help guide the conversation.`,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg),
            })),
            {
              role: 'user',
              content: userMessage.content,
            },
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
      
      // Try to parse JSON from the response
      let careers: CareerOption[] | undefined;
      let content = responseText;
      
      // Look for JSON in the response (could be wrapped in markdown code blocks or standalone)
      const jsonMatch = responseText.match(/\{[\s\S]*"careers"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.careers && Array.isArray(parsed.careers)) {
            careers = parsed.careers;
            content = parsed.text || responseText.replace(jsonMatch[0], '').trim();
          }
        } catch (e) {
          // If JSON parsing fails, just use the text response
          console.log('Failed to parse careers JSON:', e);
        }
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content,
        careers: careers,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Soulworx Assistant</Text>
          <Text style={styles.headerSubtitle}>Career Coach</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id}>
            <View
              style={[
                styles.messageWrapper,
                message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
            {/* Career Cards */}
            {message.careers && message.careers.length > 0 && (
              <View style={styles.careersContainer}>
                <Text style={styles.careersTitle}>Career Recommendations</Text>
                {message.careers.map((career, index) => (
                  <CareerCard
                    key={index}
                    title={career.title}
                    description={career.description}
                    category={career.category}
                    style={styles.careerCard}
                    onPress={() => {
                      router.push({
                        pathname: '/resources/career/[title]',
                        params: {
                          title: encodeURIComponent(career.title),
                          description: career.description,
                          category: career.category || '',
                        },
                      });
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingWrapper}>
            <View style={styles.assistantMessage}>
              <ActivityIndicator size="small" color={SoulworxColors.textPrimary} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Select Section */}
      {showQuickSelect && (
        <View style={styles.quickSelectContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.quickSelectScroll}
            contentContainerStyle={styles.quickSelectContent}
          >
            {/* Grade Selection */}
            <View style={styles.quickSelectSection}>
              <Text style={styles.quickSelectLabel}>Grade:</Text>
              <View style={styles.chipRow}>
                {QUICK_OPTIONS.grades.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    onPress={() => toggleSelection('grade', grade)}
                    style={[
                      styles.chip,
                      selectedInfo.grade === grade && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedInfo.grade === grade && styles.chipTextSelected,
                      ]}
                    >
                      {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Interests */}
            <View style={styles.quickSelectSection}>
              <Text style={styles.quickSelectLabel}>Interests:</Text>
              <View style={styles.chipRow}>
                {QUICK_OPTIONS.interests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleSelection('interests', interest)}
                    style={[
                      styles.chip,
                      selectedInfo.interests.includes(interest) && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedInfo.interests.includes(interest) && styles.chipTextSelected,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Skills */}
            <View style={styles.quickSelectSection}>
              <Text style={styles.quickSelectLabel}>I Excel In:</Text>
              <View style={styles.chipRow}>
                {QUICK_OPTIONS.skills.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    onPress={() => toggleSelection('skills', skill)}
                    style={[
                      styles.chip,
                      selectedInfo.skills.includes(skill) && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedInfo.skills.includes(skill) && styles.chipTextSelected,
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Weaknesses */}
            <View style={styles.quickSelectSection}>
              <Text style={styles.quickSelectLabel}>Not Skilled In:</Text>
              <View style={styles.chipRow}>
                {QUICK_OPTIONS.weaknesses.map((weakness) => (
                  <TouchableOpacity
                    key={weakness}
                    onPress={() => toggleSelection('weaknesses', weakness)}
                    style={[
                      styles.chip,
                      selectedInfo.weaknesses.includes(weakness) && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedInfo.weaknesses.includes(weakness) && styles.chipTextSelected,
                      ]}
                    >
                      {weakness}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Hobbies */}
            <View style={styles.quickSelectSection}>
              <Text style={styles.quickSelectLabel}>Hobbies:</Text>
              <View style={styles.chipRow}>
                {QUICK_OPTIONS.hobbies.map((hobby) => (
                  <TouchableOpacity
                    key={hobby}
                    onPress={() => toggleSelection('hobbies', hobby)}
                    style={[
                      styles.chip,
                      selectedInfo.hobbies.includes(hobby) && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedInfo.hobbies.includes(hobby) && styles.chipTextSelected,
                      ]}
                    >
                      {hobby}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          {/* Get Recommendations Button */}
          {(selectedInfo.grade || 
            selectedInfo.interests.length > 0 || 
            selectedInfo.skills.length > 0 || 
            selectedInfo.weaknesses.length > 0 || 
            selectedInfo.hobbies.length > 0) && (
            <TouchableOpacity
              onPress={sendQuickSelect}
              style={styles.getRecommendationsButton}
              disabled={isLoading}
            >
              <Text style={styles.getRecommendationsText}>Get Career Recommendations</Text>
              <Ionicons name="arrow-forward" size={20} color={SoulworxColors.white} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={SoulworxColors.textTertiary}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isLoading}
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={SoulworxColors.white} />
            ) : (
              <Ionicons name="send" size={20} color={SoulworxColors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  header: {
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
    color: SoulworxColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginTop: 2,
  },
  careersContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  careersTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  careerCard: {
    marginBottom: Spacing.sm,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  messageWrapper: {
    marginBottom: Spacing.md,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  assistantMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  userMessage: {
    backgroundColor: SoulworxColors.accent,
  },
  assistantMessage: {
    backgroundColor: SoulworxColors.white,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  messageText: {
    fontSize: Typography.base,
    lineHeight: Typography.base * 1.5,
  },
  userMessageText: {
    color: SoulworxColors.white,
  },
  assistantMessageText: {
    color: SoulworxColors.textPrimary,
  },
  loadingWrapper: {
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  inputContainer: {
    backgroundColor: SoulworxColors.white,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
    maxHeight: 100,
    paddingVertical: Spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  quickSelectContainer: {
    backgroundColor: SoulworxColors.white,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
    paddingTop: Spacing.md,
    maxHeight: 300,
  },
  quickSelectScroll: {
    maxHeight: 250,
  },
  quickSelectContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  quickSelectSection: {
    marginBottom: Spacing.md,
    marginRight: Spacing.lg,
  },
  quickSelectLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.beige,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  chipSelected: {
    backgroundColor: SoulworxColors.accent,
    borderColor: SoulworxColors.accent,
  },
  chipText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textPrimary,
  },
  chipTextSelected: {
    color: SoulworxColors.white,
    fontWeight: Typography.semibold,
  },
  getRecommendationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SoulworxColors.accent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  getRecommendationsText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
});

