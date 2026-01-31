// Database types matching the root schema

export type ProgramStatus = "draft" | "published" | "archived";
export type ProgramCategory = "youth" | "schools" | "community" | "workshops" | "special";
export type EventStatus = "scheduled" | "cancelled" | "completed" | "postponed";
export type RsvpStatus = "confirmed" | "waitlist" | "cancelled" | "attended" | "no_show";
export type ChannelStatus = "draft" | "published" | "archived";
export type ChannelCategory = "basketball" | "career" | "scholarships" | "life_skills" | "other";
export type VideoStatus = "draft" | "published" | "unlisted" | "archived";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due" | "trialing";
export type UserRole = "user" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  discordId: string | null;
  discordUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string | null;
  category: ProgramCategory;
  status: ProgramStatus;
  coverImage: string | null;
  images: string[];
  videoUrl: string | null;
  duration: string | null;
  ageRange: string | null;
  capacity: number | null;
  price: string | null;
  registrationRequired: boolean;
  requiresParentConsent: boolean;
  tags: string[];
  faqs: { question: string; answer: string }[];
  metaTitle: string | null;
  metaDescription: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Event {
  id: string;
  programId: string;
  title: string;
  description: string | null;
  images: string[];
  status: EventStatus;
  startTime: Date;
  endTime: Date;
  timezone: string;
  locationType: "in_person" | "virtual" | "hybrid";
  venueName: string | null;
  venueAddress: string | null;
  venueCity: string | null;
  venueState: string | null;
  venueZip: string | null;
  venueCountry: string | null;
  latitude: string | null;
  longitude: string | null;
  virtualMeetingUrl: string | null;
  capacity: number | null;
  waitlistEnabled: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rsvp {
  id: string;
  eventId: string;
  userId: string;
  status: RsvpStatus;
  guestCount: number;
  dietaryRestrictions: string | null;
  specialNeeds: string | null;
  parentEmail: string | null;
  parentConsent: boolean | null;
  calendarSyncEnabled: boolean;
  calendarEventId: string | null;
  lastSyncedAt: Date | null;
  reminderSent: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date | null;
}

export interface ChannelSection {
  id: string;
  channelId: string;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityChannel {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string | null;
  category: ChannelCategory;
  status: ChannelStatus;
  coverImage: string | null;
  thumbnailImage: string | null;
  requiredTierLevel: number;
  isFeatured: boolean;
  discordChannelId: string | null;
  tags: string[];
  videoCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  sections?: ChannelSection[];
}

export interface Video {
  id: string;
  channelId: string;
  sectionId: string | null;
  slug: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  isFirstEpisode: boolean;
  episodeNumber: number | null;
  seasonNumber: number;
  requiredTierLevel: number;
  status: VideoStatus;
  viewCount: number;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface MembershipTier {
  id: string;
  name: string;
  slug: string;
  level: "free" | "pro" | "pro_plus";
  description: string;
  features: string[];
  accessLevel: number;
  price: string;
  billingPeriod: "monthly" | "yearly" | "lifetime" | null;
  stripePriceId: string | null;
  discordRoleId: string | null;
  dmAccessEnabled: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMembership {
  id: string;
  userId: string;
  tierId: string;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  discordRoleAssigned: boolean;
  lastSyncedAt: Date | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramReminder {
  id: string;
  programId: string;
  userId: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  isGlobal?: boolean; // True if created by admin (shown to everyone)
}

export interface ChatMessage {
  id: string;
  programId: string;
  userId: string;
  message: string;
  createdAt: Date;
}

export interface ChatMessageWithUser extends ChatMessage {
  userName: string;
  userImage: string | null;
}

// Combined types for queries with relations
export interface ProgramWithEvents extends Program {
  events: Event[];
}

export interface RsvpWithDetails extends Rsvp {
  event: Event;
  program: Program;
}

export interface VideoWithChannel extends Video {
  channel: CommunityChannel;
}

export interface UserWithMembership extends User {
  membership: UserMembership & { tier: MembershipTier };
}

export type PostStatus = "draft" | "published" | "archived";
export type PostCategory = "poetry" | "news" | "blog" | "tutorials" | "announcements";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: PostCategory;
  tags: string[];
  status: PostStatus;
  readTime: number | null;
  viewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface PostWithAuthor extends Post {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  mood: string | null;
  tags: string[];
  isAiGenerated: boolean;
  aiPrompt: string | null;
  createdAt: Date;
  updatedAt: Date;
}export type SectionKey = 'assistant' | 'journal' | 'poetry' | 'blog' | 'news' | 'announcements';

export interface ArchivedSection {
  id: string;
  sectionKey: SectionKey;
  sectionName: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Personalized Programs Types
export type PersonalizedProgramStatus = 'active' | 'completed' | 'paused';

export interface ProgramChecklistItem {
  id: string;
  programId: string;
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
  enjoymentRating: number | null;
  difficultyRating: number | null;
  daysLate: number;
}

export interface PersonalizedProgram {
  id: string;
  userId: string;
  createdBy: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  trainingDays: string[];
  startDate: string;
  endDate: string;
  status: PersonalizedProgramStatus;
  checklistItems: ProgramChecklistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProPlusQuestionnaire {
  id: string;
  userId: string;
  age: number | null;
  skillLevel: 'beginner' | 'advanced' | 'pro' | null;
  gameDescription: string | null;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | null;
  yearsPlaying: string | null;
  currentGoalsYearly: string | null;
  currentGoalsOverall: string | null;
  improvementRankings: {
    ballHandling: number;
    defence: number;
    finishing: number;
    shooting: number;
    passing: number;
    other: { text: string; rank: number };
  } | null;
  weight: number | null;
  height: string | null;
  currentInjuries: string | null;
  seeingPhysiotherapy: boolean;
  weightTrains: boolean;
  stretches: boolean;
  currentTeam: string | null;
  outsideSchoolTeams: string | null;
  inSeason: boolean;
  basketballWatching: string | null;
  equipmentAccess: string | null;
  trainingDays: string[];
  averageSessionLength: number | null;
  biggestStruggle: string | null;
  confidenceLevel: number;
  mentalChallenge: string | null;
  mentalChallengeOther: string | null;
  coachability: number;
  preferredCoachingStyle: string | null;
  coachingStyleOther: string | null;
  gameFilmUrl: string | null;
  workoutVideos: string[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProPlusMember {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  hasQuestionnaire: boolean;
  programCount: number;
  joinedAt: string;
}
