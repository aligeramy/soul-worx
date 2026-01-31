import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Linking, Share, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { VideoCard } from '@/components/VideoCard';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { formatDuration } from '@/lib/format';
import { getVideoById, getVideosByChannel } from '@/lib/queries';
import { useUser } from '@/contexts/UserContext';
import { canAccessVideo } from '@/lib/access';
import { supabase } from '@/lib/supabase';
import type { Video as VideoType } from '@/lib/types';

const { width } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const userContext = useUser();
  const accessLevel = userContext?.accessLevel || 1;
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);
  
  // Check if running in Expo Go
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const [video, setVideo] = useState<VideoType | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoType[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<VideoType[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingLike, setCheckingLike] = useState(true);
  const [checkingSave, setCheckingSave] = useState(true);

  useEffect(() => {
    async function loadVideo() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const videoData = await getVideoById(id);
        
        if (!videoData) {
          console.error('Video not found:', id);
          setLoading(false);
          return;
        }
        
        setVideo(videoData);
        
        if (videoData.channelId) {
          const allVideos = await getVideosByChannel(videoData.channelId);
          // Sort episodes by episode number
          const sortedEpisodes = [...allVideos].sort((a, b) => {
            const aEp = a.episodeNumber || 0;
            const bEp = b.episodeNumber || 0;
            return aEp - bEp;
          });
          setAllEpisodes(sortedEpisodes);
          
          // Find current episode index
          const currentIndex = sortedEpisodes.findIndex(v => v.id === id);
          setCurrentEpisodeIndex(currentIndex >= 0 ? currentIndex : 0);
          
          // Filter out current video and get others for "Up Next"
          const related = sortedEpisodes.filter(v => v.id !== id);
          setRelatedVideos(related);
        }
      } catch (error) {
        console.error('Error loading video:', error);
        Alert.alert('Error', 'Failed to load video. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadVideo();
  }, [id]);

  // Check if video is liked and saved
  useEffect(() => {
    async function checkLikeAndSave() {
      if (!id || !userContext?.user?.id) {
        setCheckingLike(false);
        setCheckingSave(false);
        return;
      }

      try {
        // Check if liked
        const { data: likeData } = await supabase
          .from('video_like')
          .select('id')
          .eq('videoId', id)
          .eq('userId', userContext.user.id)
          .single();
        
        setIsLiked(!!likeData);
        setCheckingLike(false);

        // Check if saved
        const { data: saveData } = await supabase
          .from('video_save')
          .select('id')
          .eq('videoId', id)
          .eq('userId', userContext.user.id)
          .single();
        
        setIsSaved(!!saveData);
        setCheckingSave(false);
      } catch (error) {
        console.error('Error checking like/save:', error);
        setCheckingLike(false);
        setCheckingSave(false);
      }
    }

    checkLikeAndSave();
  }, [id, userContext?.user?.id]);

  // Log video URL info for debugging (must be before early returns)
  useEffect(() => {
    if (video?.videoUrl) {
      const isVercelBlobCheck = video.videoUrl.includes('vercel-storage.com') || 
                                video.videoUrl.includes('blob.vercel-storage') ||
                                (video.videoUrl.includes('.mp4') && !video.videoUrl.includes('youtube'));
      const isYouTubeCheck = video.videoUrl && !isVercelBlobCheck ? 
                            (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')) : false;
      console.log('[Video] URL:', video.videoUrl);
      console.log('[Video] Is Vercel Blob:', isVercelBlobCheck);
      console.log('[Video] Is YouTube:', isYouTubeCheck);
    }
  }, [video?.videoUrl]);

  if (loading) {
    return <LoadingState message="Loading video..." />;
  }

  if (!video) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={64} color={SoulworxColors.textTertiary} />
        <Text style={styles.errorText}>Video not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasAccess = canAccessVideo(video, accessLevel);

  // Check if video URL is from Vercel Blob storage or is a direct MP4 file
  const isVercelBlob = video?.videoUrl ? (
    video.videoUrl.includes('vercel-storage.com') || 
    video.videoUrl.includes('blob.vercel-storage') ||
    (video.videoUrl.includes('.mp4') && !video.videoUrl.includes('youtube'))
  ) : false;
  
  // Check if video URL is YouTube (fallback for old videos)
  const isYouTube = video?.videoUrl && !isVercelBlob ? (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')) : false;
  
  // Convert YouTube URL to embed format (only used as fallback)
  const getYouTubeEmbedUrl = (url: string): string => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
      return url;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return url;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header - Overlay */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player - Portrait Container */}
        <View style={styles.videoWrapper}>
          <View style={styles.videoContainer}>
            {!hasAccess ? (
              <View style={styles.lockedContainer}>
                <Ionicons name="lock-closed" size={64} color={SoulworxColors.white} />
                <Text style={styles.lockedText}>
                  {`This video requires Tier ${String(video.requiredTierLevel || 1)} access`}
                </Text>
              </View>
            ) : !video.videoUrl ? (
              <View style={styles.lockedContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={SoulworxColors.white} />
                <Text style={styles.lockedText}>Video URL not available</Text>
              </View>
            ) : isVercelBlob || (!isYouTube && video.videoUrl) ? (
              // Use Video component for Vercel Blob storage URLs and other direct video URLs
              <>
                {isExpoGo ? (
                  <View style={styles.expoGoWarning}>
                    <Ionicons name="information-circle" size={20} color={SoulworxColors.accent} />
                    <Text style={styles.expoGoWarningText}>
                      Using Expo Go - video playback may be limited. For best results, build a development build.
                    </Text>
                  </View>
                ) : null}
                {playbackError ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{playbackError}</Text>
                  </View>
                ) : null}
                <Video
                  ref={videoRef}
                  source={{ 
                    uri: video.videoUrl,
                  }}
                  style={styles.video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  onLoadStart={() => {
                    console.log('[Video] Load started:', video.videoUrl);
                    console.log('[Video] Is Vercel Blob:', isVercelBlob);
                    setPlaybackError(null);
                  }}
                  onLoad={(status) => {
                    console.log('[Video] Loaded successfully:', status);
                    console.log('[Video] Status:', JSON.stringify(status, null, 2));
                    if (status.isLoaded && status.durationMillis) {
                      console.log('[Video] Duration:', status.durationMillis / 1000, 'seconds');
                      console.log('[Video] Natural size:', status.naturalSize);
                    }
                    setPlaybackError(null);
                  }}
                  onError={(error) => {
                    console.error('[Video] Error:', error);
                    console.error('[Video] Error details:', JSON.stringify(error, null, 2));
                    console.error('[Video] URL:', video.videoUrl);
                    const errorMsg = `Video playback failed. ${isExpoGo ? 'Expo Go has limited video support. Try building a development build.' : 'Please check your connection and verify the video URL is accessible.'}`;
                    setPlaybackError(errorMsg);
                  }}
                  onPlaybackStatusUpdate={(status) => {
                    setStatus(status);
                    if (status.isLoaded) {
                      if (status.error) {
                        console.error('[Video] Playback error:', status.error);
                        console.error('[Video] Error code:', status.error);
                        console.error('[Video] URL:', video.videoUrl);
                        const errorMsg = `Playback error: ${status.error || 'Unknown'}. ${isExpoGo ? 'Expo Go may have limitations.' : 'Check console for details.'}`;
                        setPlaybackError(errorMsg);
                      } else {
                        setPlaybackError(null);
                      }
                    } else if (status.error) {
                      console.error('[Video] Load error:', status.error);
                      console.error('[Video] Error code:', status.error);
                      console.error('[Video] URL:', video.videoUrl);
                      setPlaybackError(`Load error: ${status.error || 'Unknown'}. Check console for details.`);
                    }
                  }}
                  shouldPlay={true}
                  progressUpdateIntervalMillis={1000}
                  allowsExternalPlayback={false}
                  isLooping={true}
                  usePoster={false}
                />
              </>
            ) : isYouTube ? (
              // Fallback to WebView only for YouTube URLs (legacy support)
              <WebView
                source={{ uri: getYouTubeEmbedUrl(video.videoUrl) }}
                style={styles.webView}
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction={false}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('WebView error: ', nativeEvent);
                  Alert.alert('Playback Error', 'Unable to load video. Please check your connection and try again.');
                }}
              />
            ) : (
              <View style={styles.lockedContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={SoulworxColors.white} />
                <Text style={styles.lockedText}>Unsupported video format</Text>
              </View>
            )}
          </View>

          {/* Episode Navigation */}
          {allEpisodes.length > 1 ? (
          <View style={styles.episodeNavContainer}>
            <TouchableOpacity
              style={[
                styles.episodeNavButton,
                currentEpisodeIndex <= 0 ? styles.episodeNavButtonDisabled : null
              ]}
              onPress={() => {
                if (currentEpisodeIndex > 0) {
                  const prevEpisode = allEpisodes[currentEpisodeIndex - 1];
                  router.replace({ pathname: '/video/[id]', params: { id: prevEpisode.id } });
                }
              }}
              disabled={currentEpisodeIndex <= 0}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={currentEpisodeIndex <= 0 ? SoulworxColors.textTertiary : SoulworxColors.textPrimary} 
              />
              <Text style={[
                styles.episodeNavText,
                currentEpisodeIndex <= 0 ? styles.episodeNavTextDisabled : null,
                { marginLeft: Spacing.xs }
              ]}>
                Previous
              </Text>
            </TouchableOpacity>
            
            <View style={styles.episodeCounter}>
              <Text style={styles.episodeCounterText}>
                Episode {video.episodeNumber || currentEpisodeIndex + 1} of {allEpisodes.length}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.episodeNavButton,
                currentEpisodeIndex >= allEpisodes.length - 1 ? styles.episodeNavButtonDisabled : null
              ]}
              onPress={() => {
                if (currentEpisodeIndex < allEpisodes.length - 1) {
                  const nextEpisode = allEpisodes[currentEpisodeIndex + 1];
                  const hasNextAccess = canAccessVideo(nextEpisode, accessLevel);
                  if (hasNextAccess) {
                    router.replace({ pathname: '/video/[id]', params: { id: nextEpisode.id } });
                  } else {
                    Alert.alert(
                      'Upgrade Required',
                      `Episode ${nextEpisode.episodeNumber} requires Tier ${nextEpisode.requiredTierLevel} access. Please upgrade to continue.`
                    );
                  }
                }
              }}
              disabled={currentEpisodeIndex >= allEpisodes.length - 1}
            >
              <Text style={[
                styles.episodeNavText,
                currentEpisodeIndex >= allEpisodes.length - 1 ? styles.episodeNavTextDisabled : null,
                { marginRight: Spacing.xs }
              ]}>
                Next
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={currentEpisodeIndex >= allEpisodes.length - 1 ? SoulworxColors.textTertiary : SoulworxColors.textPrimary} 
              />
            </TouchableOpacity>
          </View>
          ) : null}

          {/* Video Info - Always Visible */}
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{video.title || 'Untitled Video'}</Text>
            <View style={styles.metaRow}>
              {video.duration && video.duration > 0 ? (
                <Text style={styles.meta}>{formatDuration(video.duration)}</Text>
              ) : null}
              {video.duration && video.duration > 0 && video.episodeNumber ? (
                <Text style={styles.meta}> • </Text>
              ) : null}
              {video.episodeNumber ? (
                <Text style={styles.meta}>{`Episode ${String(video.episodeNumber)}`}</Text>
              ) : null}
            </View>
            {video.description ? (
              <Text style={styles.description}>{String(video.description)}</Text>
            ) : null}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={async () => {
              if (!userContext?.user?.id || !video) return;
              
              try {
                if (isLiked) {
                  // Unlike
                  await supabase
                    .from('video_like')
                    .delete()
                    .eq('videoId', video.id)
                    .eq('userId', userContext.user.id);
                  setIsLiked(false);
                } else {
                  // Like
                  await supabase
                    .from('video_like')
                    .insert({
                      videoId: video.id,
                      userId: userContext.user.id,
                    });
                  setIsLiked(true);
                }
              } catch (error) {
                console.error('Error toggling like:', error);
                Alert.alert('Error', 'Failed to update like. Please try again.');
              }
            }}
            disabled={checkingLike}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? SoulworxColors.error : SoulworxColors.textSecondary} 
            />
            <Text style={[styles.actionText, isLiked ? styles.actionTextActive : null, { marginTop: Spacing.xs }]}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={async () => {
              if (!video) return;
              
              try {
                const shareUrl = video.videoUrl || `https://soulworx.ca/video/${video.id}`;
                const result = await Share.share({
                  message: `Check out this video: ${video.title}\n${shareUrl}`,
                  title: video.title,
                });
              } catch (error) {
                console.error('Error sharing:', error);
              }
            }}
          >
            <Ionicons name="share-outline" size={24} color={SoulworxColors.textSecondary} />
            <Text style={[styles.actionText, { marginTop: Spacing.xs }]}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={async () => {
              if (!userContext?.user?.id || !video) return;
              
              try {
                if (isSaved) {
                  // Unsave
                  await supabase
                    .from('video_save')
                    .delete()
                    .eq('videoId', video.id)
                    .eq('userId', userContext.user.id);
                  setIsSaved(false);
                  Alert.alert('Removed', 'Video removed from saved');
                } else {
                  // Save
                  await supabase
                    .from('video_save')
                    .insert({
                      videoId: video.id,
                      userId: userContext.user.id,
                    });
                  setIsSaved(true);
                  Alert.alert('Saved', 'Video saved to your library');
                }
              } catch (error) {
                console.error('Error toggling save:', error);
                Alert.alert('Error', 'Failed to update save. Please try again.');
              }
            }}
            disabled={checkingSave}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isSaved ? SoulworxColors.accent : SoulworxColors.textSecondary} 
            />
            <Text style={[styles.actionText, isSaved ? styles.actionTextActive : null, { marginTop: Spacing.xs }]}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* All Episodes */}
        {allEpisodes.length > 0 ? (
          <View style={styles.relatedContainer}>
            {allEpisodes.map((episode) => {
              const hasEpisodeAccess = canAccessVideo(episode, accessLevel);
              const isCurrentEpisode = episode.id === video.id;
              return (
                <TouchableOpacity
                  key={episode.id}
                  onPress={() => {
                    if (hasEpisodeAccess) {
                      router.replace({ pathname: '/video/[id]', params: { id: episode.id } });
                    } else {
                      Alert.alert(
                        'Upgrade Required',
                        `Episode ${episode.episodeNumber} requires Tier ${episode.requiredTierLevel} access. Please upgrade to watch this episode.`
                      );
                    }
                  }}
                  style={[
                    styles.episodeItem,
                    isCurrentEpisode ? styles.episodeItemActive : null
                  ]}
                >
                  <View style={styles.episodeItemContent}>
                    <View style={styles.episodeItemLeft}>
                      {isCurrentEpisode ? (
                        <Ionicons name="play-circle" size={24} color={SoulworxColors.accent} />
                      ) : hasEpisodeAccess ? (
                        <Ionicons name="play-circle-outline" size={24} color={SoulworxColors.textSecondary} />
                      ) : (
                        <Ionicons name="lock-closed" size={24} color={SoulworxColors.textTertiary} />
                      )}
                      <View style={[styles.episodeItemText, { marginLeft: Spacing.md }]}>
                        <Text style={[
                          styles.episodeItemTitle,
                          isCurrentEpisode ? styles.episodeItemTitleActive : null,
                          !hasEpisodeAccess ? styles.episodeItemTitleLocked : null
                        ]}>
                          {episode.episodeNumber ? `E${String(episode.episodeNumber)}` : 'E'} • {episode.title || 'Untitled Video'}
                        </Text>
                        {episode.duration && episode.duration > 0 ? (
                          <Text style={styles.episodeItemDuration}>
                            {formatDuration(episode.duration)}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    {!hasEpisodeAccess ? (
                      <View style={styles.tierBadge}>
                        <Text style={styles.tierBadgeText}>Tier {episode.requiredTierLevel}</Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.black,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: SoulworxColors.black,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  videoWrapper: {
    width: '100%',
    backgroundColor: SoulworxColors.black,
    paddingTop: 0,
  },
  videoContainer: {
    width: width,
    aspectRatio: 9 / 16,
    backgroundColor: SoulworxColors.black,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: SoulworxColors.black,
  },
  webView: {
    width: '100%',
    height: '100%',
    backgroundColor: SoulworxColors.black,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SoulworxColors.charcoal,
  },
  lockedText: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    padding: Spacing.lg,
    backgroundColor: SoulworxColors.charcoal,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
    marginTop: 0,
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  channelName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.gold,
  },
  meta: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  description: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    lineHeight: Typography.base * 1.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: SoulworxColors.charcoal,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
  },
  actionButton: {
    alignItems: 'center',
    minWidth: 60,
  },
  actionText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  actionTextActive: {
    color: SoulworxColors.accent,
    fontWeight: Typography.semibold,
  },
  relatedContainer: {
    width: '100%',
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: SoulworxColors.beige,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  relatedVideo: {
    marginBottom: Spacing.md,
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
  episodeNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: SoulworxColors.charcoal,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  episodeNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    maxWidth: 120,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.beige,
  },
  episodeNavButtonDisabled: {
    opacity: 0.5,
  },
  episodeNavText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  episodeNavTextDisabled: {
    color: SoulworxColors.textTertiary,
  },
  episodeCounter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  episodeCounterText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
  },
  episodeItem: {
    backgroundColor: SoulworxColors.charcoal, // Dark brown background
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    ...Shadows.small,
  },
  episodeItemActive: {
    borderColor: SoulworxColors.accent,
    borderWidth: 2,
    backgroundColor: SoulworxColors.charcoal, // Keep dark background for active too
    shadowColor: SoulworxColors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  episodeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  episodeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  episodeItemText: {
    flex: 1,
  },
  episodeItemTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: SoulworxColors.textPrimary, // White text for dark background
    marginBottom: Spacing.xs,
  },
  episodeItemTitleActive: {
    fontWeight: Typography.bold,
    color: SoulworxColors.accent, // Light gold for active
  },
  episodeItemTitleLocked: {
    color: SoulworxColors.textTertiary, // Muted light text for locked
    opacity: 0.7,
  },
  episodeItemDuration: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary, // Light text
  },
  tierBadge: {
    backgroundColor: SoulworxColors.brandBrown, // Darker brown for badge
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: SoulworxColors.accent,
  },
  tierBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.accent, // Light gold text
  },
  expoGoWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  expoGoWarningText: {
    flex: 1,
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
  },
  errorBanner: {
    backgroundColor: SoulworxColors.error,
    padding: Spacing.md,
  },
  errorBannerText: {
    fontSize: Typography.sm,
    color: SoulworxColors.white,
    textAlign: 'center',
  },
});

