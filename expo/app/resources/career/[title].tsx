import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import Constants from 'expo-constants';

interface CareerResource {
  type: 'school' | 'link' | 'program';
  title: string;
  description: string;
  url?: string;
  location?: string;
}

interface CareerDetails {
  description: string;
  resources: CareerResource[];
}

export default function CareerDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ title: string; description?: string; category?: string }>();
  const [details, setDetails] = useState<CareerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
  
  // Decode the title if it's URL encoded
  const careerTitle = params.title ? decodeURIComponent(params.title) : 'Career';

  useEffect(() => {
    fetchCareerDetails();
  }, [careerTitle]);

  const fetchCareerDetails = async () => {
    setLoading(true);
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
              content: `You are a career guidance assistant. Provide detailed information about the career "${params.title}".

Return a JSON object with this exact structure:
{
  "description": "A detailed 2-3 paragraph description of this career, what it involves, typical day-to-day work, and why it might be a good fit.",
  "resources": [
    {
      "type": "school",
      "title": "University Name",
      "description": "Brief description of the program",
      "url": "https://university-website.edu/program",
      "location": "City, Province/State"
    },
    {
      "type": "link",
      "title": "Resource Name",
      "description": "What this resource provides",
      "url": "https://resource-url.com"
    },
    {
      "type": "program",
      "title": "Program Name",
      "description": "Description of the program",
      "url": "https://program-url.com"
    }
  ]
}

Provide 5-8 resources including:
- 3-4 schools/universities in Canada (and some in the US) with relevant programs
- 2-3 helpful links (professional associations, job boards, career guides)
- 1-2 specific programs or certifications

Make sure all URLs are real and valid. Focus on Canadian institutions first.`,
            },
            {
              role: 'user',
              content: `Provide detailed information and resources for the career: ${careerTitle}${params.description ? `. Context: ${params.description}` : ''}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0]?.message?.content || '';

      // Parse JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*"resources"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          setDetails(parsed);
        } catch (e) {
          console.log('Failed to parse career details JSON:', e);
          // Fallback
          setDetails({
            description: params.description || `Learn more about a career in ${careerTitle}.`,
            resources: [],
          });
        }
      } else {
        // Fallback if no JSON found
        setDetails({
          description: params.description || `Learn more about a career in ${careerTitle}.`,
          resources: [],
        });
      }
    } catch (error) {
      console.error('Error fetching career details:', error);
      setDetails({
        description: params.description || `Learn more about a career in ${careerTitle}.`,
        resources: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={SoulworxColors.accent} />
          <Text style={styles.loadingText}>Loading career resources...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {careerTitle}
          </Text>
          {params.category && (
            <Text style={styles.headerSubtitle}>{params.category}</Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Description */}
        {details?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Career</Text>
            <Text style={styles.description}>{details.description}</Text>
          </View>
        )}

        {/* Resources */}
        {details?.resources && details.resources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources & Programs</Text>
            {details.resources.map((resource, index) => (
              <TouchableOpacity
                key={index}
                style={styles.resourceCard}
                onPress={() => resource.url && openLink(resource.url)}
                disabled={!resource.url}
              >
                <View style={styles.resourceHeader}>
                  <View style={styles.resourceIcon}>
                    <Ionicons
                      name={
                        resource.type === 'school'
                          ? 'school'
                          : resource.type === 'program'
                          ? 'book'
                          : 'link'
                      }
                      size={20}
                      color={SoulworxColors.accent}
                    />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    {resource.location && (
                      <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color={SoulworxColors.textSecondary} />
                        <Text style={styles.locationText}>{resource.location}</Text>
                      </View>
                    )}
                    <Text style={styles.resourceDescription}>{resource.description}</Text>
                  </View>
                  {resource.url && (
                    <Ionicons name="chevron-forward" size={20} color={SoulworxColors.textTertiary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {(!details?.resources || details.resources.length === 0) && (
          <View style={styles.emptyState}>
            <Ionicons name="information-circle-outline" size={64} color={SoulworxColors.textTertiary} />
            <Text style={styles.emptyText}>No resources available at this time</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
    lineHeight: Typography.base * 1.6,
  },
  resourceCard: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    ...Shadows.small,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  locationText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  resourceDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    lineHeight: Typography.sm * 1.5,
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

