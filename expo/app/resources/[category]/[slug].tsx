import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePostBySlug } from '@/hooks/usePosts';
import { LoadingState } from '@/components/LoadingState';
import { OptimizedImage } from '@/components/OptimizedImage';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { formatDate } from '@/lib/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ResourceDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category: string; slug: string }>();
  const { post, loading } = usePostBySlug(params.slug);

  if (loading) {
    return <LoadingState message="Loading..." />;
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={64} color={SoulworxColors.textTertiary} />
        <Text style={styles.errorText}>Post not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header with back button */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Cover Image */}
      {post.coverImage && (
        <View style={styles.coverContainer}>
          <OptimizedImage
            source={getImageSource(post.coverImage, 'program')}
            aspectRatio={16 / 9}
            rounded={false}
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.category}>{post.category.toUpperCase()}</Text>
        <Text style={styles.title}>{post.title}</Text>
        
        {post.excerpt && (
          <Text style={styles.excerpt}>{post.excerpt}</Text>
        )}

        <View style={styles.meta}>
          {post.author.name && (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color={SoulworxColors.textSecondary} />
              <Text style={styles.metaText}>{post.author.name}</Text>
            </View>
          )}
          {post.publishedAt && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={SoulworxColors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(post.publishedAt)}</Text>
            </View>
          )}
          {post.readTime && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={SoulworxColors.textSecondary} />
              <Text style={styles.metaText}>{post.readTime} min read</Text>
            </View>
          )}
        </View>

        {/* Content body */}
        {post.category === 'poetry' ? (
          <View style={styles.poetryContainer}>
            <WebView
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                      <style>
                        * {
                          margin: 0;
                          padding: 0;
                          box-sizing: border-box;
                        }
                        body {
                          font-family: Georgia, 'Times New Roman', Times, serif;
                          font-size: 18px;
                          line-height: 1.8;
                          color: #2C2C2C;
                          background-color: #F5F1E8;
                          padding: 24px;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          min-height: 100vh;
                        }
                        .poetry-content {
                          max-width: 600px;
                          width: 100%;
                          text-align: center;
                          padding: 20px 0;
                        }
                        .poetry-content p {
                          margin-bottom: 1.5em;
                          font-size: 1.1em;
                          line-height: 1.9;
                        }
                        .poetry-content br {
                          display: block;
                          margin: 0.5em 0;
                        }
                        .poetry-content strong {
                          font-weight: 600;
                        }
                        .poetry-content em {
                          font-style: italic;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="poetry-content">
                        ${post.content}
                      </div>
                    </body>
                  </html>
                `
              }}
              style={styles.webView}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.htmlContainer}>
            <WebView
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                      <style>
                        * {
                          margin: 0;
                          padding: 0;
                          box-sizing: border-box;
                        }
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                          font-size: 16px;
                          line-height: 1.7;
                          color: #2C2C2C;
                          background-color: #F5F1E8;
                          padding: 20px;
                        }
                        h1, h2, h3, h4, h5, h6 {
                          font-weight: 600;
                          margin-top: 1.5em;
                          margin-bottom: 0.75em;
                          color: #1A1A1A;
                          line-height: 1.3;
                        }
                        h1 { font-size: 2em; }
                        h2 { font-size: 1.75em; }
                        h3 { font-size: 1.5em; }
                        h4 { font-size: 1.25em; }
                        p {
                          margin-bottom: 1.25em;
                        }
                        a {
                          color: #8B7355;
                          text-decoration: underline;
                        }
                        a:hover {
                          color: #6B5A42;
                        }
                        ul, ol {
                          margin-left: 1.5em;
                          margin-bottom: 1.25em;
                        }
                        li {
                          margin-bottom: 0.5em;
                        }
                        blockquote {
                          border-left: 4px solid #8B7355;
                          padding-left: 1.5em;
                          margin: 1.5em 0;
                          font-style: italic;
                          color: #4A4A4A;
                        }
                        strong {
                          font-weight: 600;
                        }
                        em {
                          font-style: italic;
                        }
                        img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 1.5em 0;
                        }
                        code {
                          background-color: rgba(0, 0, 0, 0.05);
                          padding: 2px 6px;
                          border-radius: 4px;
                          font-family: 'Courier New', monospace;
                          font-size: 0.9em;
                        }
                        pre {
                          background-color: rgba(0, 0, 0, 0.05);
                          padding: 1em;
                          border-radius: 8px;
                          overflow-x: auto;
                          margin: 1.5em 0;
                        }
                        pre code {
                          background: none;
                          padding: 0;
                        }
                        hr {
                          border: none;
                          border-top: 1px solid #D4C5B0;
                          margin: 2em 0;
                        }
                      </style>
                    </head>
                    <body>
                      ${post.content}
                    </body>
                  </html>
                `
              }}
              style={styles.webView}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <View style={styles.tags}>
            {post.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  coverContainer: {
    marginTop: 60,
  },
  content: {
    padding: Spacing.lg,
  },
  category: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: Typography['4xl'] * 1.2,
  },
  excerpt: {
    fontSize: Typography.lg,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lg * 1.5,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  htmlContainer: {
    width: SCREEN_WIDTH - (Spacing.lg * 2),
    minHeight: 400,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: SoulworxColors.beige,
  },
  poetryContainer: {
    width: SCREEN_WIDTH - (Spacing.lg * 2),
    height: 600,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: SoulworxColors.beige,
  },
  webView: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: SoulworxColors.darkBeige,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
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
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  retryText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});

