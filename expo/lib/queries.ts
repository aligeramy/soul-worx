import { supabase } from './supabase';
import type {
  Program,
  ProgramWithEvents,
  Event,
  Rsvp,
  RsvpWithDetails,
  CommunityChannel,
  Video,
  VideoWithChannel,
  UserMembership,
  MembershipTier,
  ProgramReminder,
  Post,
  PostWithAuthor,
  PostCategory,
} from './types';

/**
 * Get all published programs
 */
export async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('program')
    .select('*')
    .eq('status', 'published')
    .neq('slug', 'special-events')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get program by ID with events
 */
export async function getProgramById(id: string): Promise<ProgramWithEvents | null> {
  console.log('[getProgramById] Querying program with ID:', id);
  
  const { data: program, error: programError } = await supabase
    .from('program')
    .select('*')
    .eq('id', id)
    .single();

  if (programError) {
    console.error('[getProgramById] Program query error:', programError);
    // If no rows found, return null instead of throwing
    if (programError.code === 'PGRST116') {
      return null;
    }
    throw programError;
  }
  
  if (!program) {
    console.log('[getProgramById] No program found');
    return null;
  }

  console.log('[getProgramById] Program found:', program.title);

  const { data: events, error: eventsError } = await supabase
    .from('event')
    .select('*')
    .eq('programId', id)
    .order('startTime', { ascending: true });

  if (eventsError) {
    console.error('[getProgramById] Events query error:', eventsError);
    throw eventsError;
  }

  console.log('[getProgramById] Found', events?.length || 0, 'events');

  return {
    ...program,
    events: events || [],
  };
}

/**
 * Get user's RSVPs with event and program details
 */
export async function getUserRsvps(userId: string): Promise<RsvpWithDetails[]> {
  const { data: rsvps, error: rsvpsError } = await supabase
    .from('rsvp')
    .select('*')
    .eq('userId', userId)
    .eq('status', 'confirmed')
    .order('createdAt', { ascending: false });

  if (rsvpsError) throw rsvpsError;
  if (!rsvps || rsvps.length === 0) return [];

  // Get event details for each RSVP
  const eventIds = rsvps.map(r => r.eventId);
  const { data: events, error: eventsError } = await supabase
    .from('event')
    .select('*')
    .in('id', eventIds);

  if (eventsError) throw eventsError;
  if (!events) return [];

  // Get program details for each event
  const programIds = events.map(e => e.programId);
  const { data: programs, error: programsError } = await supabase
    .from('program')
    .select('*')
    .in('id', programIds);

  if (programsError) throw programsError;

  // Combine data
  const eventsMap = new Map(events.map(e => [e.id, e]));
  const programsMap = new Map(programs?.map(p => [p.id, p]) || []);

  return rsvps.map(rsvp => {
    const event = eventsMap.get(rsvp.eventId)!;
    const program = programsMap.get(event.programId)!;
    return {
      ...rsvp,
      event,
      program,
    };
  });
}

/**
 * Get upcoming user RSVPs
 */
export async function getUpcomingUserRsvps(userId: string): Promise<RsvpWithDetails[]> {
  const allRsvps = await getUserRsvps(userId);
  const now = new Date();
  
  return allRsvps
    .filter(rsvp => new Date(rsvp.event.startTime) >= now)
    .sort((a, b) => new Date(a.event.startTime).getTime() - new Date(b.event.startTime).getTime());
}

/**
 * Check if user has RSVP for event
 */
export async function hasUserRsvp(userId: string, eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('rsvp')
    .select('id')
    .eq('userId', userId)
    .eq('eventId', eventId)
    .eq('status', 'confirmed')
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return !!data;
}

/**
 * Get all published community channels
 */
export async function getChannels(): Promise<CommunityChannel[]> {
  const { data, error } = await supabase
    .from('community_channel')
    .select('*')
    .eq('status', 'published')
    .order('sortOrder', { ascending: false })
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get channel by slug
 */
export async function getChannelBySlug(slug: string): Promise<CommunityChannel | null> {
  const { data, error } = await supabase
    .from('community_channel')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

/**
 * Get videos by channel ID
 */
export async function getVideosByChannel(channelId: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('video')
    .select('*')
    .eq('channelId', channelId)
    .eq('status', 'published')
    .order('episodeNumber', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get video by ID
 */
export async function getVideoById(id: string): Promise<Video | null> {
  const { data, error } = await supabase
    .from('video')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

/**
 * Get user's membership tier
 */
export async function getUserMembership(userId: string): Promise<MembershipTier | null> {
  // Get user's active membership
  const { data: membership, error: membershipError } = await supabase
    .from('user_membership')
    .select('tierId')
    .eq('userId', userId)
    .eq('status', 'active')
    .single();

  if (membershipError && membershipError.code !== 'PGRST116') throw membershipError;
  if (!membership) {
    // Return free tier if no active membership
    const { data: freeTier } = await supabase
      .from('membership_tier')
      .select('*')
      .eq('level', 'free')
      .single();
    return freeTier || null;
  }

  // Get tier details
  const { data: tier, error: tierError } = await supabase
    .from('membership_tier')
    .select('*')
    .eq('id', membership.tierId)
    .single();

  if (tierError) throw tierError;
  return tier || null;
}

/**
 * Get all membership tiers
 */
export async function getMembershipTiers(): Promise<MembershipTier[]> {
  const { data, error } = await supabase
    .from('membership_tier')
    .select('*')
    .eq('isActive', true)
    .order('sortOrder', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get program reminders for user (includes global admin reminders + personal reminders)
 */
export async function getProgramReminders(
  programId: string,
  userId: string
): Promise<ProgramReminder[]> {
  // Get all reminders for this program with user role info
  const { data, error } = await supabase
    .from('program_reminder')
    .select(`
      *,
      creator:userId (
        id,
        role
      )
    `)
    .eq('programId', programId)
    .order('createdAt', { ascending: true });

  if (error) throw error;
  if (!data) return [];

  // Filter reminders:
  // - Include if creator is admin (global reminder)
  // - Include if userId matches current user (personal reminder)
  const filtered = data.filter((reminder: any) => {
    const isAdmin = reminder.creator?.role === 'admin' || reminder.creator?.role === 'super_admin';
    const isOwnReminder = reminder.userId === userId;
    return isAdmin || isOwnReminder;
  });

  // Map to proper type with isGlobal flag
  return filtered.map((reminder: any) => ({
    id: reminder.id,
    programId: reminder.programId,
    userId: reminder.userId,
    task: reminder.task,
    completed: reminder.completed,
    createdAt: reminder.createdAt,
    isGlobal: reminder.creator?.role === 'admin' || reminder.creator?.role === 'super_admin',
  }));
}

/**
 * Create program reminder
 */
export async function createProgramReminder(
  programId: string,
  userId: string,
  task: string
): Promise<ProgramReminder> {
  const { data, error } = await supabase
    .from('program_reminder')
    .insert({
      programId,
      userId,
      task,
      completed: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Toggle program reminder completion
 */
export async function toggleReminderCompletion(
  reminderId: string,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from('program_reminder')
    .update({ completed })
    .eq('id', reminderId);

  if (error) throw error;
}

/**
 * Delete program reminder
 */
export async function deleteProgramReminder(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('program_reminder')
    .delete()
    .eq('id', reminderId);

  if (error) throw error;
}

/**
 * Get chat messages for a program with user details
 */
export async function getChatMessages(programId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('chat_message')
    .select(`
      *,
      user:userId (
        id,
        name,
        image
      )
    `)
    .eq('programId', programId)
    .order('createdAt', { ascending: true })
    .limit(limit);

  if (error) throw error;
  
  // Format the data
  return (data || []).map((msg: any) => ({
    id: msg.id,
    programId: msg.programId,
    userId: msg.userId,
    message: msg.message,
    createdAt: msg.createdAt,
    userName: msg.user?.name || 'Unknown User',
    userImage: msg.user?.image || null,
  }));
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  programId: string,
  userId: string,
  message: string
) {
  const { data, error } = await supabase
    .from('chat_message')
    .insert({
      programId,
      userId,
      message,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers/Node)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create an RSVP for an event
 */
export async function createRsvp(
  eventId: string,
  userId: string
): Promise<Rsvp> {
  // Generate UUID for the RSVP
  const rsvpId = generateUUID();
  
  const { data, error } = await supabase
    .from('rsvp')
    .insert({
      id: rsvpId,
      eventId,
      userId,
      status: 'confirmed',
      guestCount: 0,
      calendarSyncEnabled: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cancel an RSVP
 */
export async function cancelRsvp(rsvpId: string): Promise<void> {
  const { error } = await supabase
    .from('rsvp')
    .update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    })
    .eq('id', rsvpId);

  if (error) throw error;
}

/**
 * Get all published posts
 */
export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('post')
    .select('*')
    .eq('status', 'published')
    .order('publishedAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: PostCategory): Promise<Post[]> {
  const { data, error } = await supabase
    .from('post')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('publishedAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get post by slug with author
 */
export async function getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
  const { data: post, error } = await supabase
    .from('post')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!post) return null;

  // Get author separately
  const { data: author } = await supabase
    .from('user')
    .select('id, name, image')
    .eq('id', post.authorId)
    .single();

  return {
    ...post,
    author: author || { id: post.authorId, name: null, image: null },
  } as PostWithAuthor;
}
