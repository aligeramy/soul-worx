import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useChannel, useVideos } from '@/hooks/useChannels';
import { useUser } from '@/contexts/UserContext';
import { OptimizedImage } from '@/components/OptimizedImage';
import { VideoListItem } from '@/components/VideoListItem';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { canAccessVideo } from '@/lib/access';
import { getVideosBySection, getVideosByChannel } from '@/lib/queries';
import type { Video } from '@/lib/types';

export default function ChannelDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = params.slug;
  const { accessLevel } = useUser();
  const { channel, loading: channelLoading } = useChannel(slug);
  const { videos: allVideos, loading: videosLoading } = useVideos(channel?.id || null);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [showSectionSelect, setShowSectionSelect] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [sectionVideos, setSectionVideos] = useState<Video[]>([]);
  const [loadingSectionVideos, setLoadingSectionVideos] = useState(false);

  // Load videos for selected section
  useEffect(() => {
    async function loadSectionVideos() {
      if (!selectedSectionId || !channel?.id) {
        setSectionVideos([]);
        return;
      }

      try {
        setLoadingSectionVideos(true);
        const videos = await getVideosBySection(selectedSectionId);
        setSectionVideos(videos);
      } catch (error) {
        console.error('Error loading section videos:', error);
        setSectionVideos([]);
      } finally {
        setLoadingSectionVideos(false);
      }
    }

    loadSectionVideos();
  }, [selectedSectionId, channel?.id]);

  // Default to "All Episodes" (null means all videos)
  useEffect(() => {
    if (channel?.sections && channel.sections.length > 0 && selectedSectionId === undefined) {
      setSelectedSectionId(null); // null = all episodes
    }
  }, [channel?.sections]);

  const sections = channel?.sections || [];
  const currentVideos = selectedSectionId === null ? allVideos : (selectedSectionId ? sectionVideos : allVideos);
  const isLoadingVideos = selectedSectionId === null ? videosLoading : (selectedSectionId ? loadingSectionVideos : videosLoading);

  // Group videos by section for "All Episodes" view
  const groupedVideos = selectedSectionId === null && sections.length > 0
    ? sections.map((section: any) => ({
        section,
        videos: allVideos.filter((v: Video) => v.sectionId === section.id)
      })).filter(group => group.videos.length > 0)
        .concat(
          allVideos.filter((v: Video) => !v.sectionId).length > 0
            ? [{ section: null, videos: allVideos.filter((v: Video) => !v.sectionId) }]
            : []
        )
    : null;

  if (channelLoading || isLoadingVideos) {
    return <LoadingState message="Loading channel..." />;
  }

  if (!channel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Channel not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <OptimizedImage
            source={getImageSource(channel.coverImage, 'channel')}
            aspectRatio={5 / 5}
            rounded={false}
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButtonFloat, { top: insets.top + Spacing.sm }]}
          >
            <Ionicons name="arrow-back" size={24} color={SoulworxColors.white} />
          </TouchableOpacity>
          
          {/* View Videos Button */}
          {allVideos.length > 0 && (
            <TouchableOpacity 
              onPress={() => setShowVideosModal(true)} 
              style={[styles.viewVideosButton, { top: insets.top + Spacing.sm }]}
            >
              <Ionicons name="list" size={20} color={SoulworxColors.white} />
              <Text style={styles.viewVideosText}>View Videos</Text>
            </TouchableOpacity>
          )}
          
          {/* Title Overlay */}
          <View style={styles.heroOverlay}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{channel.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{channel.title}</Text>
            <Text style={styles.heroDescription} numberOfLines={2}>
              {channel.description}
            </Text>
            <View style={styles.heroBadge}>
              <Ionicons name="play-circle" size={14} color={SoulworxColors.white} />
              <Text style={styles.heroBadgeText}>{channel.videoCount} videos</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Sections Select */}
          {sections.length > 0 && (
            <View style={styles.sectionsContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowSectionSelect(true)}
              >
                <Text style={styles.selectButtonText}>
                  {selectedSectionId === null 
                    ? `All Episodes (${allVideos.length})`
                    : sections.find((s: any) => s.id === selectedSectionId)?.title || 'Select Section'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={SoulworxColors.textPrimary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Videos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedSectionId === null 
                ? 'All Episodes'
                : selectedSectionId 
                  ? sections.find((s: any) => s.id === selectedSectionId)?.title || 'Videos'
                  : 'Videos'}
            </Text>
            {selectedSectionId && sections.find((s: any) => s.id === selectedSectionId)?.description && (
              <Text style={styles.sectionDescription}>
                {sections.find((s: any) => s.id === selectedSectionId)?.description}
              </Text>
            )}
            {currentVideos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="videocam-outline" size={48} color={SoulworxColors.textTertiary} />
                <Text style={styles.emptyText}>No videos available yet</Text>
              </View>
            ) : groupedVideos ? (
              // Grouped view for "All Episodes"
              <View>
                {groupedVideos.map((group, groupIndex) => (
                  <View key={group.section?.id || 'no-section'} style={styles.videoGroup}>
                    {group.section && (
                      <>
                        <Text style={[
                          styles.groupSectionTitle,
                          groupIndex === 0 && styles.groupSectionTitleFirst
                        ]}>
                          {group.section.title}
                        </Text>
                        {group.section.description && (
                          <Text style={styles.groupSectionDescription}>{group.section.description}</Text>
                        )}
                      </>
                    )}
                    <View style={styles.videosList}>
                      {group.videos.map((video) => {
                        const hasAccess = canAccessVideo(video, accessLevel);
                        
                        return (
                          <VideoListItem
                            key={video.id}
                            image={getImageSource(video.thumbnailUrl, 'video')}
                            title={video.title || 'Untitled Video'}
                            duration={video.duration || undefined}
                            episodeNumber={video.episodeNumber || undefined}
                            locked={!hasAccess}
                            requiredTier={video.requiredTierLevel || 1}
                            onPress={() => hasAccess && router.push({ pathname: '/video/[id]', params: { id: video.id } })}
                          />
                        );
                      })}
                    </View>
                    {groupIndex < groupedVideos.length - 1 && <View style={styles.groupSeparator} />}
                  </View>
                ))}
              </View>
            ) : (
              // Single section view
              <View style={styles.videosList}>
                {currentVideos.map((video) => {
                  const hasAccess = canAccessVideo(video, accessLevel);
                  
                  return (
                    <VideoListItem
                      key={video.id}
                      image={getImageSource(video.thumbnailUrl, 'video')}
                      title={video.title || 'Untitled Video'}
                      duration={video.duration || undefined}
                      episodeNumber={video.episodeNumber || undefined}
                      locked={!hasAccess}
                      requiredTier={video.requiredTierLevel || 1}
                      onPress={() => hasAccess && router.push({ pathname: '/video/[id]', params: { id: video.id } })}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Section Select Modal */}
      <Modal
        visible={showSectionSelect}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSectionSelect(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSectionSelect(false)}
        >
          <View style={styles.selectModalContent}>
            <View style={styles.selectModalHeader}>
              <Text style={styles.selectModalTitle}>Select Section</Text>
              <TouchableOpacity 
                onPress={() => setShowSectionSelect(false)}
                style={styles.selectModalClose}
              >
                <Ionicons name="close" size={24} color={SoulworxColors.textOnLight} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.selectModalList}>
              <TouchableOpacity
                style={[
                  styles.selectOption,
                  selectedSectionId === null && styles.selectOptionActive
                ]}
                onPress={() => {
                  setSelectedSectionId(null);
                  setShowSectionSelect(false);
                }}
              >
                <Text style={[
                  styles.selectOptionText,
                  selectedSectionId === null && styles.selectOptionTextActive
                ]}>
                  All Episodes ({allVideos.length})
                </Text>
                {selectedSectionId === null && (
                  <Ionicons name="checkmark" size={20} color={SoulworxColors.brandBrown} />
                )}
              </TouchableOpacity>
              {sections.map((section: any) => {
                const sectionVideoCount = allVideos.filter((v: Video) => v.sectionId === section.id).length;
                return (
                  <TouchableOpacity
                    key={section.id}
                    style={[
                      styles.selectOption,
                      selectedSectionId === section.id && styles.selectOptionActive
                    ]}
                    onPress={() => {
                      setSelectedSectionId(section.id);
                      setShowSectionSelect(false);
                    }}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      selectedSectionId === section.id && styles.selectOptionTextActive
                    ]}>
                      {section.title} ({sectionVideoCount})
                    </Text>
                    {selectedSectionId === section.id && (
                      <Ionicons name="checkmark" size={20} color={SoulworxColors.brandBrown} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Videos Modal */}
      <Modal
        visible={showVideosModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVideosModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + Spacing.md }]}>
            <TouchableOpacity 
              onPress={() => setShowVideosModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={SoulworxColors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Videos</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Sections Select in Modal */}
            {sections.length > 0 && (
              <View style={styles.sectionsContainer}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setShowVideosModal(false);
                    setShowSectionSelect(true);
                  }}
                >
                  <Text style={styles.selectButtonText}>
                    {selectedSectionId === null 
                      ? `All Episodes (${allVideos.length})`
                      : sections.find((s: any) => s.id === selectedSectionId)?.title || 'Select Section'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={SoulworxColors.textPrimary} />
                </TouchableOpacity>
              </View>
            )}

            {currentVideos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="videocam-outline" size={48} color={SoulworxColors.textTertiary} />
                <Text style={styles.emptyText}>No videos available yet</Text>
              </View>
            ) : groupedVideos ? (
              // Grouped view for "All Episodes" in modal
              <View>
                {groupedVideos.map((group, groupIndex) => (
                  <View key={group.section?.id || 'no-section'} style={styles.videoGroup}>
                    {group.section && (
                      <>
                        <Text style={[
                          styles.groupSectionTitle,
                          groupIndex === 0 && styles.groupSectionTitleFirst
                        ]}>
                          {group.section.title}
                        </Text>
                        {group.section.description && (
                          <Text style={styles.groupSectionDescription}>{group.section.description}</Text>
                        )}
                      </>
                    )}
                    <View style={styles.videosList}>
                      {group.videos.map((video) => {
                        const hasAccess = canAccessVideo(video, accessLevel);
                        
                        return (
                          <VideoListItem
                            key={video.id}
                            image={getImageSource(video.thumbnailUrl, 'video')}
                            title={video.title || 'Untitled Video'}
                            duration={video.duration || undefined}
                            episodeNumber={video.episodeNumber || undefined}
                            locked={!hasAccess}
                            requiredTier={video.requiredTierLevel || 1}
                            onPress={() => {
                              if (hasAccess) {
                                setShowVideosModal(false);
                                router.push({ pathname: '/video/[id]', params: { id: video.id } });
                              }
                            }}
                          />
                        );
                      })}
                    </View>
                    {groupIndex < groupedVideos.length - 1 && <View style={styles.groupSeparator} />}
                  </View>
                ))}
              </View>
            ) : (
              // Single section view in modal
              <View style={styles.videosList}>
                {currentVideos.map((video) => {
                  const hasAccess = canAccessVideo(video, accessLevel);
                  
                  return (
                    <VideoListItem
                      key={video.id}
                      image={getImageSource(video.thumbnailUrl, 'video')}
                      title={video.title || 'Untitled Video'}
                      duration={video.duration || undefined}
                      episodeNumber={video.episodeNumber || undefined}
                      locked={!hasAccess}
                      requiredTier={video.requiredTierLevel || 1}
                      onPress={() => {
                        if (hasAccess) {
                          setShowVideosModal(false);
                          router.push({ pathname: '/video/[id]', params: { id: video.id } });
                        }
                      }}
                    />
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  heroContainer: {
    position: 'relative',
    minHeight: 400,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButtonFloat: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: SoulworxColors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: SoulworxColors.brandBrown, // Dark brown text on light accent background
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    lineHeight: Typography['4xl'] * 1.2,
  },
  heroDescription: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.95,
    marginBottom: Spacing.sm,
    lineHeight: Typography.base * 1.5,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.sm * 1.5,
  },
  videosList: {
    gap: Spacing.sm,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.lg,
    color: SoulworxColors.textSecondary,
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
  viewVideosButton: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  viewVideosText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
    backgroundColor: SoulworxColors.charcoal,
  },
  modalCloseButton: {
    padding: Spacing.sm,
  },
  modalTitle: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    textAlign: 'center',
  },
  modalHeaderSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionsContainer: {
    marginBottom: Spacing.lg,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.charcoal,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
  },
  selectButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: SoulworxColors.textPrimary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectModalContent: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.lg,
    width: '90%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  selectModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.borderLight,
  },
  selectModalTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.textOnLight,
  },
  selectModalClose: {
    padding: Spacing.xs,
  },
  selectModalList: {
    maxHeight: 400,
  },
  selectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.borderLight,
  },
  selectOptionActive: {
    backgroundColor: SoulworxColors.accent,
  },
  selectOptionText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: SoulworxColors.textOnLight,
    flex: 1,
  },
  selectOptionTextActive: {
    color: SoulworxColors.brandBrown,
    fontWeight: Typography.semibold,
  },
  videoGroup: {
    marginBottom: Spacing.xl,
  },
  groupSectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  groupSectionTitleFirst: {
    marginTop: 0,
  },
  groupSectionDescription: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: 0,
    lineHeight: Typography.sm * 1.5,
  },
  groupSeparator: {
    height: 1,
    backgroundColor: SoulworxColors.border,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
