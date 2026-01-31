import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgramDetails } from '@/hooks/usePrograms';
import { useReminders } from '@/hooks/useReminders';
import { useUser } from '@/contexts/UserContext';
import { OptimizedImage } from '@/components/OptimizedImage';
import { VideoListItem } from '@/components/VideoListItem';
import { LoadingState } from '@/components/LoadingState';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { getImageSource } from '@/constants/images';
import { formatDateTime, formatTime } from '@/lib/format';
import { canAccessVideo } from '@/lib/access';
import { getChatMessages } from '@/lib/queries';
import { useChannel, useVideos } from '@/hooks/useChannels';

type TabName = 'overview' | 'videos' | 'reminders' | 'chat';

export default function ProgramDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const { user, accessLevel } = useUser();
  const [activeTab, setActiveTab] = useState<TabName>('overview');
  
  const { program, loading } = useProgramDetails(id);
  const { reminders, addReminder, toggleReminder, deleteReminder } = useReminders(id, user?.id || null);
  const [hasRsvp, setHasRsvp] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [checkingRsvp, setCheckingRsvp] = useState(true);
  
  // Fetch channel and videos for community programs
  const isOnlineProgram = program?.category === 'community';
  const { channel } = useChannel(isOnlineProgram ? program?.slug || null : null);
  const { videos } = useVideos(channel?.id || null);
  
  // Local state for global reminder checkmarks (non-admin users)
  const [localChecks, setLocalChecks] = useState<Record<string, boolean>>({});
  
  // Chat state
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newTask, setNewTask] = React.useState('');
  const [chatMessage, setChatMessage] = React.useState('');
  const chatScrollRef = React.useRef<ScrollView>(null);
  
  // Check if user has RSVP
  React.useEffect(() => {
    async function checkRsvp() {
      if (!id || !user?.id) {
        setCheckingRsvp(false);
        return;
      }

      try {
        const { hasUserRsvp } = await import('@/lib/queries');
        const userRsvps = await import('@/lib/queries').then(m => m.getUserRsvps(user.id));
        const programRsvp = userRsvps.find(r => r.program.id === id);
        setHasRsvp(!!programRsvp);
      } catch (error) {
        console.error('Error checking RSVP:', error);
      } finally {
        setCheckingRsvp(false);
      }
    }

    checkRsvp();
  }, [id, user?.id]);

  // Load chat messages and subscribe to updates
  React.useEffect(() => {
    if (!id || activeTab !== 'chat') return;

    let channel: any;

    async function loadChat() {
      try {
        const data = await getChatMessages(id);
        setMessages(data);

        // Subscribe to new messages via Realtime
        const { subscribeToProgramChat, unsubscribe } = await import('@/lib/realtime');
        channel = subscribeToProgramChat(id, async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Refetch messages to get user details
            const updated = await getChatMessages(id);
            setMessages(updated);
            
            // Scroll to bottom
            setTimeout(() => {
              chatScrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        });
      } catch (error) {
        console.error('Error loading chat:', error);
      }
    }

    loadChat();

    return () => {
      if (channel) {
        import('@/lib/realtime').then(({ unsubscribe }) => unsubscribe(channel));
      }
    };
  }, [id, activeTab]);

  // Helper to send chat message
  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !user || !id) return;

    try {
      const { sendChatMessage } = await import('@/lib/queries');
      await sendChatMessage(id, user.id, chatMessage.trim());
      setChatMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Helper to handle reminder toggle
  const handleReminderToggle = async (reminderId: string, currentCompleted: boolean, isGlobal?: boolean) => {
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    
    // If it's a global reminder and user is not admin, only update locally
    if (isGlobal && !isAdmin) {
      setLocalChecks(prev => ({
        ...prev,
        [reminderId]: !prev[reminderId],
      }));
    } else {
      // Update in database for personal reminders or if user is admin
      await toggleReminder(reminderId, currentCompleted);
    }
  };
  
  // Helper to get effective completion status
  const isReminderCompleted = (reminderId: string, dbCompleted: boolean, isGlobal?: boolean) => {
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    
    // For global reminders, non-admins use local state
    if (isGlobal && !isAdmin) {
      return localChecks[reminderId] || false;
    }
    
    // For personal reminders or admins, use database value
    return dbCompleted;
  };

  // Load chat messages when chat tab is active
  React.useEffect(() => {
    if (activeTab === 'chat' && id) {
      getChatMessages(id).then(setMessages);
    }
  }, [activeTab, id]);

  if (loading) {
    return <LoadingState message="Loading program..." />;
  }

  if (!program) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={64} color={SoulworxColors.textTertiary} />
        <Text style={styles.errorText}>Program not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const upcomingEvents = program.events.filter(e => new Date(e.startTime) >= new Date());
  const hasVideos = isOnlineProgram;

  return (
    <View style={styles.container}>
      {/* Hero Image with Title Overlay */}
      <View style={styles.heroContainer}>
        <OptimizedImage
          source={getImageSource(program.coverImage, 'program')}
          aspectRatio={5/5}
          rounded={false}
        />
        
        {/* Gradient Overlay - Dark at bottom for text readability */}
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
        
        {/* Title Overlay */}
        <View style={styles.heroOverlay}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{program.category}</Text>
          </View>
          <Text style={styles.heroTitle}>{program.title}</Text>
          <Text style={styles.heroDescription} numberOfLines={2}>
            {program.description}
          </Text>
          <View style={styles.heroBadgeRow}>
            {program.duration && (
              <View style={styles.heroBadge}>
                <Ionicons name="time-outline" size={14} color={SoulworxColors.white} />
                <Text style={styles.heroBadgeText}>{program.duration}</Text>
              </View>
            )}
            {program.ageRange && (
              <View style={styles.heroBadge}>
                <Ionicons name="people-outline" size={14} color={SoulworxColors.white} />
                <Text style={styles.heroBadgeText}>{program.ageRange}</Text>
              </View>
            )}
            {program.capacity && (
              <View style={styles.heroBadge}>
                <Ionicons name="person-outline" size={14} color={SoulworxColors.white} />
                <Text style={styles.heroBadgeText}>{program.capacity} spots</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        {hasVideos && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'videos' && styles.tabActive]}
            onPress={() => setActiveTab('videos')}
          >
            <Text style={[styles.tabText, activeTab === 'videos' && styles.tabTextActive]}>
              Videos
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reminders' && styles.tabActive]}
          onPress={() => setActiveTab('reminders')}
        >
          <Text style={[styles.tabText, activeTab === 'reminders' && styles.tabTextActive]}>
            Reminders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.tabActive]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content with RSVP Button */}
      <View style={{ flex: 1 }}>
        {activeTab === 'chat' ? (
          /* Chat Tab - Not scrollable, uses flex layout */
          <View style={styles.chatContainer}>
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <Ionicons name="chatbubbles" size={20} color={SoulworxColors.textSecondary} />
            <Text style={styles.chatHeaderText}>Program Chat</Text>
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Live</Text>
            </View>
          </View>

          {/* Messages */}
          <ScrollView 
            ref={chatScrollRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyStateBox}>
                <Ionicons name="chatbubbles-outline" size={48} color={SoulworxColors.textTertiary} />
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptyText}>Be the first to start the conversation!</Text>
              </View>
            ) : (
              messages.map(msg => {
                const isOwnMessage = msg.userId === user?.id;
                
                return (
                  <View key={msg.id} style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
                    <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
                      {!isOwnMessage && <Text style={styles.senderName}>{msg.userName}</Text>}
                      <Text style={[styles.messageTextBubble, isOwnMessage && styles.ownMessageTextBubble]}>
                        {msg.message}
                      </Text>
                      <Text style={[styles.messageTime, isOwnMessage && styles.ownMessageTime]}>
                        {formatTime(msg.createdAt)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Message Input */}
          <View style={[styles.chatInputContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type a message..."
              placeholderTextColor={SoulworxColors.textTertiary}
              value={chatMessage}
              onChangeText={setChatMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.chatSendButton, !chatMessage.trim() && styles.chatSendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!chatMessage.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={chatMessage.trim() ? SoulworxColors.white : SoulworxColors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
        ) : (
          <ScrollView 
            style={styles.content}
            contentContainerStyle={activeTab === 'overview' && upcomingEvents.length > 0 ? { paddingBottom: 100 } : undefined}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.description}>{program.description}</Text>
            </View>
            
            {upcomingEvents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                {upcomingEvents.map(event => (
                  <View key={event.id} style={styles.eventCard}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>{formatDateTime(event.startTime)}</Text>
                  </View>
                ))}
              </View>
              )}
          </View>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <View style={styles.section}>
            <Text style={styles.tabTitle}>Program Videos</Text>
            {videos.length === 0 ? (
              <View style={styles.emptyStateBox}>
                <Ionicons name="videocam-outline" size={48} color={SoulworxColors.textTertiary} />
                <Text style={styles.emptyTitle}>No videos available</Text>
                <Text style={styles.emptyText}>Check back soon for new content</Text>
              </View>
            ) : (
              <View style={styles.videosList}>
                {videos.map((video) => {
                  const hasAccess = canAccessVideo(video, accessLevel);
                  
                  return (
                    <VideoListItem
                      key={video.id}
                      image={getImageSource(video.thumbnailUrl, 'video')}
                      title={video.title}
                      duration={video.duration || undefined}
                      episodeNumber={video.episodeNumber || undefined}
                      locked={!hasAccess}
                      requiredTier={video.requiredTierLevel}
                      onPress={() => hasAccess && router.push({ pathname: '/video/[id]', params: { id: video.id } })}
                    />
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <View style={styles.section}>
            <Text style={styles.tabTitle}>Reminders & To-Dos</Text>
            
            {/* Add reminder input */}
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="Add your personal reminder..."
                placeholderTextColor={SoulworxColors.textTertiary}
                value={newTask}
                onChangeText={setNewTask}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (newTask.trim()) {
                    addReminder(newTask.trim());
                    setNewTask('');
                  }
                }}
              >
                <Ionicons name="add" size={24} color={SoulworxColors.white} />
              </TouchableOpacity>
            </View>

            {/* Global Reminders Section (from admins) */}
            {reminders.filter(r => r.isGlobal).length > 0 && (
              <View style={styles.reminderSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={SoulworxColors.accent} />
                  <Text style={styles.sectionLabel}>Program Requirements</Text>
                </View>
                {reminders.filter(r => r.isGlobal).map(reminder => {
                  const completed = isReminderCompleted(reminder.id, reminder.completed, true);
                  
                  return (
                    <View key={reminder.id} style={styles.reminderCard}>
                      <TouchableOpacity
                        style={styles.reminderLeft}
                        onPress={() => handleReminderToggle(reminder.id, reminder.completed, true)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.checkboxContainer, completed && styles.checkboxCompleted]}>
                          <Ionicons
                            name={completed ? 'checkmark' : undefined}
                            size={14}
                            color={completed ? SoulworxColors.white : 'transparent'}
                          />
                        </View>
                        <Text style={[styles.reminderText, completed && styles.reminderCompleted]}>
                          {reminder.task}
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.globalBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={SoulworxColors.accent} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Personal Reminders Section (user's own) */}
            {reminders.filter(r => !r.isGlobal).length > 0 && (
              <View style={styles.reminderSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person-outline" size={18} color={SoulworxColors.textSecondary} />
                  <Text style={styles.sectionLabel}>My Personal Reminders</Text>
                </View>
                {reminders.filter(r => !r.isGlobal).map(reminder => {
                  const completed = isReminderCompleted(reminder.id, reminder.completed, false);
                  
                  return (
                    <View key={reminder.id} style={styles.reminderCard}>
                      <TouchableOpacity
                        style={styles.reminderLeft}
                        onPress={() => handleReminderToggle(reminder.id, reminder.completed, false)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.checkboxContainer, completed && styles.checkboxCompleted]}>
                          <Ionicons
                            name={completed ? 'checkmark' : undefined}
                            size={14}
                            color={completed ? SoulworxColors.white : 'transparent'}
                          />
                        </View>
                        <Text style={[styles.reminderText, completed && styles.reminderCompleted]}>
                          {reminder.task}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => deleteReminder(reminder.id)}
                        style={styles.deleteButton}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close" size={18} color={SoulworxColors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            
            {reminders.length === 0 && (
              <View style={styles.emptyStateBox}>
                <Ionicons name="checkbox-outline" size={48} color={SoulworxColors.textTertiary} />
                <Text style={styles.emptyTitle}>No reminders yet</Text>
                <Text style={styles.emptyText}>Add your first reminder above to get started</Text>
              </View>
            )}
          </View>
         )}
           </ScrollView>
         )}
        
        {/* Sticky RSVP Button at Bottom */}
        {upcomingEvents.length > 0 && activeTab === 'overview' && (
          <View style={[styles.rsvpButtonContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
            <TouchableOpacity 
              style={[styles.rsvpButton, hasRsvp && styles.rsvpButtonConfirmed]}
              onPress={async () => {
                if (hasRsvp || !user?.id || upcomingEvents.length === 0) return;
                
                setRsvpLoading(true);
                try {
                  console.log('[RSVP] Creating RSVP for event:', upcomingEvents[0].id);
                  const { createRsvp } = await import('@/lib/queries');
                  const rsvp = await createRsvp(upcomingEvents[0].id, user.id);
                  console.log('[RSVP] Success:', rsvp);
                  setHasRsvp(true);
                  
                  // Show success message
                  setTimeout(() => {
                    alert('RSVP confirmed! Check your Programs tab.');
                  }, 300);
                } catch (error: any) {
                  console.error('[RSVP] Error:', error);
                  alert(error.message || 'Failed to RSVP. Please try again.');
                } finally {
                  setRsvpLoading(false);
                }
              }}
              disabled={hasRsvp || rsvpLoading || checkingRsvp}
            >
              {hasRsvp ? (
                <>
                  <Ionicons name="checkmark-circle" size={24} color={SoulworxColors.white} />
                  <Text style={styles.rsvpButtonText}>RSVP Confirmed</Text>
                </>
              ) : (
                <>
                  <Ionicons name="calendar" size={24} color={SoulworxColors.white} />
                  <Text style={styles.rsvpButtonText}>
                    {rsvpLoading ? 'Confirming...' : 'RSVP to Event'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    ...Shadows.medium,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
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
    marginBottom: Spacing.md,
    lineHeight: Typography.base * 1.5,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  heroBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: SoulworxColors.charcoal,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: SoulworxColors.accent,
  },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textSecondary, // Light text for inactive tabs on dark background
  },
  tabTextActive: {
    color: SoulworxColors.accent, // Light gold for active tab - visible on dark background
    fontWeight: Typography.bold,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.lg,
  },
  tabTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
    lineHeight: Typography.base * 1.5,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  eventCard: {
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  eventTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary, // Light text
    marginBottom: Spacing.xs,
  },
  eventDate: {
    fontSize: Typography.sm,
    color: SoulworxColors.textSecondary, // Light text
  },
  rsvpButtonContainer: {
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
  rsvpButton: {
    flexDirection: 'row',
    backgroundColor: SoulworxColors.accent,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.large,
  },
  rsvpButtonConfirmed: {
    backgroundColor: SoulworxColors.success,
  },
  rsvpButtonText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  inputCard: {
    flexDirection: 'row',
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
    padding: Spacing.sm,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: SoulworxColors.accent,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    ...Shadows.small,
  },
  reminderSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  reminderText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: SoulworxColors.textPrimary,
    flex: 1,
    lineHeight: Typography.sm * 1.4,
  },
  reminderCompleted: {
    textDecorationLine: 'line-through',
    color: SoulworxColors.textTertiary,
    opacity: 0.6,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: SoulworxColors.textTertiary,
    backgroundColor: SoulworxColors.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: SoulworxColors.success,
    borderColor: SoulworxColors.success,
  },
  globalBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    backgroundColor: SoulworxColors.darkBeige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  videosList: {
    gap: Spacing.xs,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: SoulworxColors.charcoal,
    borderBottomWidth: 1,
    borderBottomColor: SoulworxColors.border,
  },
  chatHeaderText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
    flex: 1,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SoulworxColors.success,
  },
  onlineText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesList: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  messageContainer: {
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: SoulworxColors.charcoal,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.small,
  },
  ownMessageBubble: {
    backgroundColor: SoulworxColors.accent,
  },
  senderName: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textSecondary, // Light text
    marginBottom: Spacing.xs,
  },
  messageTextBubble: {
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary, // Light text for dark background
    marginBottom: Spacing.xs,
    lineHeight: Typography.base * 1.4,
  },
  ownMessageTextBubble: {
    color: SoulworxColors.white, // White text on accent background
  },
  messageTime: {
    fontSize: Typography.xs,
    color: SoulworxColors.textTertiary, // Light muted text
  },
  ownMessageTime: {
    color: SoulworxColors.white, // White text on accent background
    opacity: 0.8,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: SoulworxColors.charcoal,
    borderTopWidth: 1,
    borderTopColor: SoulworxColors.border,
  },
  chatInput: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
    maxHeight: 100,
  },
  chatSendButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: SoulworxColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButtonDisabled: {
    backgroundColor: SoulworxColors.darkBeige,
  },
  emptyText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
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

