import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Linking, Share, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoCard } from '@/components/VideoCard';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
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
  const [status, setStatus] = useState({});
  const videoRef = useRef<Video>(null);
  const [video, setVideo] = useState<VideoType | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoType[]>([]);
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
        setVideo(videoData);
        
        if (videoData?.channelId) {
          const allVideos = await getVideosByChannel(videoData.channelId);
          // Filter out current video and get others
          const related = allVideos.filter(v => v.id !== id);
          setRelatedVideos(related);
        }
      } catch (error) {
        console.error('Error loading video:', error);
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

  // Check if video URL is YouTube
  const isYouTube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');
  
  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    return url;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          {hasAccess && video.videoUrl ? (
            isYouTube ? (
              <WebView
                source={{ uri: getYouTubeEmbedUrl(video.videoUrl) }}
                style={styles.webView}
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction={false}
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: video.videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={setStatus}
                shouldPlay={false}
              />
            )
          ) : (
            <View style={styles.lockedContainer}>
              <Ionicons name="lock-closed" size={64} color={SoulworxColors.white} />
              <Text style={styles.lockedText}>
                {`This video requires Tier ${String(video.requiredTierLevel || 1)} access`}
              </Text>
            </View>
          )}
        </View>

        {/* Video Info */}
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
              <Text style={styles.meta}>Episode {String(video.episodeNumber)}</Text>
            ) : null}
          </View>
          {video.description ? (
            <Text style={styles.description}>{String(video.description)}</Text>
          ) : null}
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
            <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>Like</Text>
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
            <Text style={styles.actionText}>Share</Text>
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
            <Text style={[styles.actionText, isSaved && styles.actionTextActive]}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <View style={styles.relatedContainer}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            {relatedVideos.map((relatedVideo) => {
              const hasRelatedAccess = canAccessVideo(relatedVideo, accessLevel);
              return (
                <VideoCard
                  key={relatedVideo.id}
                  image={getImageSource(relatedVideo.thumbnailUrl, 'video')}
                  title={relatedVideo.title || 'Untitled Video'}
                  duration={relatedVideo.duration || undefined}
                  episodeNumber={relatedVideo.episodeNumber || undefined}
                  locked={!hasRelatedAccess}
                  requiredTier={relatedVideo.requiredTierLevel || 1}
                  onPress={() => hasRelatedAccess && router.push({ pathname: '/video/[id]', params: { id: relatedVideo.id } })}
                  style={styles.relatedVideo}
                />
              );
            })}
          </View>
        )}
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
    zIndex: 10,
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
    backgroundColor: SoulworxColors.beige,
  },
  videoContainer: {
    width: width,
    aspectRatio: 16 / 9,
    backgroundColor: SoulworxColors.black,
  },
  video: {
    width: '100%',
    height: '100%',
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
    padding: Spacing.lg,
    backgroundColor: SoulworxColors.white,
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
    gap: Spacing.sm,
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
    backgroundColor: SoulworxColors.white,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.xs,
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
    padding: Spacing.lg,
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
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  retryText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
});

