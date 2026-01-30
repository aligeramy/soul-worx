import { pgTable, text, timestamp, primaryKey, integer, boolean, jsonb, decimal, uniqueIndex } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import type { AdapterAccountType } from "next-auth/adapters"

// User roles enum
export type UserRole = "user" | "admin" | "super_admin"

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").$type<UserRole>().notNull().default("user"),
  
  // Authentication
  username: text("username").unique(), // @username format, unique
  password: text("password"), // Hashed password (nullable for OAuth users)
  
  // Onboarding
  onboardingCompleted: boolean("onboardingCompleted").notNull().default(false),
  onboardingData: jsonb("onboardingData").$type<Record<string, unknown>>(), // Stores all onboarding answers
  primaryInterest: text("primaryInterest").$type<"sports_basketball" | "poetry_arts" | "life_coaching">(), // What brought them to app
  age: integer("age"), // User's age
  
  // Push Notifications (Expo)
  pushToken: text("pushToken"), // Expo push notification token
  
  // Discord Integration
  discordId: text("discordId").unique(), // Discord user ID for server management
  discordUsername: text("discordUsername"),
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

// ==================== PROGRAMS ====================
export type ProgramStatus = "draft" | "published" | "archived"
export type ProgramCategory = "youth" | "schools" | "community" | "workshops" | "special"

export const programs = pgTable("program", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("longDescription"), // Rich text/markdown
  category: text("category").$type<ProgramCategory>().notNull(),
  status: text("status").$type<ProgramStatus>().notNull().default("draft"),
  
  // Media
  coverImage: text("coverImage"), // Main cover image
  images: jsonb("images").$type<string[]>().default([]), // Gallery images
  videoUrl: text("videoUrl"),
  
  // Program details
  duration: text("duration"), // "6 weeks", "3 months", etc.
  ageRange: text("ageRange"), // "13-18", "All ages"
  capacity: integer("capacity"), // Max participants
  price: decimal("price", { precision: 10, scale: 2 }), // $0 for free
  
  // Registration
  registrationRequired: boolean("registrationRequired").notNull().default(true),
  requiresParentConsent: boolean("requiresParentConsent").notNull().default(false),
  
  // Metadata
  tags: jsonb("tags").$type<string[]>().default([]),
  faqs: jsonb("faqs").$type<{question: string, answer: string}[]>().default([]),
  requirements: jsonb("requirements").$type<{id: string, text: string, checked: boolean}[]>().default([]),
  
  // SEO
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  
  // Timestamps
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
})

// ==================== EVENTS ====================
export type EventStatus = "scheduled" | "cancelled" | "completed" | "postponed"

export const events = pgTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  programId: text("programId")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  
  // Event details
  title: text("title").notNull(),
  description: text("description"),
  images: jsonb("images").$type<string[]>().default([]), // Event-specific images array
  status: text("status").$type<EventStatus>().notNull().default("scheduled"),
  
  // Date & Time
  startTime: timestamp("startTime", { mode: "date" }).notNull(),
  endTime: timestamp("endTime", { mode: "date" }).notNull(),
  timezone: text("timezone").notNull().default("America/New_York"),
  
  // Location
  locationType: text("locationType").$type<"in_person" | "virtual" | "hybrid">().notNull(),
  venueName: text("venueName"),
  venueAddress: text("venueAddress"),
  venueCity: text("venueCity"),
  venueState: text("venueState"),
  venueZip: text("venueZip"),
  venueCountry: text("venueCountry").default("USA"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  virtualMeetingUrl: text("virtualMeetingUrl"),
  
  // Capacity
  capacity: integer("capacity"),
  waitlistEnabled: boolean("waitlistEnabled").notNull().default(false),
  
  // Metadata
  notes: text("notes"), // Internal notes for organizers
  
  // Timestamps
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== RSVPs ====================
export type RsvpStatus = "confirmed" | "waitlist" | "cancelled" | "attended" | "no_show"

export const rsvps = pgTable("rsvp", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("eventId")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // RSVP details
  status: text("status").$type<RsvpStatus>().notNull().default("confirmed"),
  
  // Additional info
  guestCount: integer("guestCount").notNull().default(0), // Additional guests
  dietaryRestrictions: text("dietaryRestrictions"),
  specialNeeds: text("specialNeeds"),
  parentEmail: text("parentEmail"), // If parental consent required
  parentConsent: boolean("parentConsent").default(false),
  
  // Calendar sync
  calendarSyncEnabled: boolean("calendarSyncEnabled").notNull().default(true),
  calendarEventId: text("calendarEventId"), // For tracking synced calendar events
  lastSyncedAt: timestamp("lastSyncedAt", { mode: "date" }),
  
  // Notifications
  reminderSent: boolean("reminderSent").default(false),
  
  // Timestamps
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  cancelledAt: timestamp("cancelledAt", { mode: "date" }),
})

// ==================== CALENDAR SYNCS ====================
export type CalendarProvider = "google" | "apple" | "outlook" | "other"

export const calendarSyncs = pgTable("calendar_sync", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Calendar provider info
  provider: text("provider").$type<CalendarProvider>().notNull(),
  calendarId: text("calendarId"), // User's calendar ID on the provider
  accessToken: text("accessToken"), // Encrypted token for API access
  refreshToken: text("refreshToken"), // For token refresh
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  
  // Sync settings
  syncEnabled: boolean("syncEnabled").notNull().default(true),
  lastSyncedAt: timestamp("lastSyncedAt", { mode: "date" }),
  
  // Timestamps
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== BLOG POSTS ====================
export type PostStatus = "draft" | "published" | "archived"
export type PostCategory = "poetry" | "news" | "blog" | "tutorials" | "announcements"

export const posts = pgTable("post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  
  // Content
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // Markdown or rich text
  coverImage: text("coverImage"),
  
  // Classification
  category: text("category").$type<PostCategory>().notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: text("status").$type<PostStatus>().notNull().default("draft"),
  
  // Engagement
  readTime: integer("readTime"), // In minutes
  viewCount: integer("viewCount").notNull().default(0),
  
  // SEO
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  ogImage: text("ogImage"),
  
  // Author
  authorId: text("authorId")
    .notNull()
    .references(() => users.id),
  
  // Timestamps
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
})

// ==================== SHOP / PRODUCTS ====================
export type ProductStatus = "draft" | "active" | "archived" | "sold_out"
export type ProductCategory = "apparel" | "accessories" | "books" | "digital" | "other"

export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  
  // Product info
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").$type<ProductCategory>().notNull(),
  status: text("status").$type<ProductStatus>().notNull().default("draft"),
  
  // Media
  images: jsonb("images").$type<string[]>().notNull().default([]),
  
  // Pricing & Inventory
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }), // Original price for sales
  sku: text("sku"),
  stock: integer("stock").notNull().default(0),
  trackInventory: boolean("trackInventory").notNull().default(true),
  
  // Variants (sizes, colors, etc)
  variants: jsonb("variants").$type<{
    id: string
    name: string
    price?: number
    sku?: string
    stock?: number
    attributes: { [key: string]: string } // e.g., { size: "M", color: "Black" }
  }[]>().default([]),
  
  // Details
  tags: jsonb("tags").$type<string[]>().default([]),
  specifications: jsonb("specifications").$type<{[key: string]: string}>().default({}),
  
  // SEO
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  
  // Timestamps
  createdBy: text("createdBy")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== EVENT UPDATES LOG ====================
// For tracking changes to events to trigger calendar re-syncs
export const eventUpdates = pgTable("event_update", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("eventId")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  
  // What changed
  changeType: text("changeType").$type<"time" | "location" | "status" | "details">().notNull(),
  oldValue: jsonb("oldValue"),
  newValue: jsonb("newValue"),
  
  // Who made the change
  updatedBy: text("updatedBy").references(() => users.id),
  
  // Sync status
  syncProcessed: boolean("syncProcessed").notNull().default(false),
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== COMMUNITY / MEMBERSHIP TIERS ====================
export type TierLevel = "free" | "pro" | "pro_plus" // Updated: free, pro ($20), pro_plus ($25)

export const membershipTiers = pgTable("membership_tier", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Tier details
  name: text("name").notNull(), // "Free", "Pro", "Pro+"
  slug: text("slug").notNull().unique(), // "free", "pro", "pro-plus"
  level: text("level").$type<TierLevel>().notNull(),
  description: text("description").notNull(),
  
  // Features (detailed feature list)
  features: jsonb("features").$type<string[]>().notNull().default([]),
  accessLevel: integer("accessLevel").notNull().default(1), // 1=free, 2=pro, 3=pro+
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  billingPeriod: text("billingPeriod").$type<"monthly" | "yearly" | "lifetime">().default("monthly"),
  stripePriceId: text("stripePriceId"), // Stripe Price ID for subscriptions
  
  // Interest Type (null = all interests, or specific to basketball/poetry/etc)
  interestType: text("interestType").$type<"sports_basketball" | "poetry_arts" | "life_coaching">(), // null = applies to all
  
  // Discord Integration
  discordRoleId: text("discordRoleId"), // Discord role ID to assign
  dmAccessEnabled: boolean("dmAccessEnabled").notNull().default(false),
  
  // Status
  isActive: boolean("isActive").notNull().default(true),
  sortOrder: integer("sortOrder").notNull().default(0),
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== COMMUNITY CHANNELS ====================
export type ChannelStatus = "draft" | "published" | "archived"
export type ChannelCategory = "basketball" | "career" | "scholarships" | "life_skills" | "other"

export const communityChannels = pgTable("community_channel", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Channel info
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("longDescription"),
  category: text("category").$type<ChannelCategory>().notNull(),
  status: text("status").$type<ChannelStatus>().notNull().default("draft"),
  
  // Media
  coverImage: text("coverImage"),
  thumbnailImage: text("thumbnailImage"),
  
  // Access Control
  requiredTierLevel: integer("requiredTierLevel").notNull().default(1), // Minimum tier needed
  isFeatured: boolean("isFeatured").notNull().default(false),
  
  // Discord Integration
  discordChannelId: text("discordChannelId"), // Discord channel ID
  
  // Metadata
  tags: jsonb("tags").$type<string[]>().default([]),
  videoCount: integer("videoCount").notNull().default(0),
  
  // SEO
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  
  // Order
  sortOrder: integer("sortOrder").notNull().default(0),
  
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
})

// ==================== CHANNEL SECTIONS ====================
export const channelSections = pgTable("channel_section", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Section info
  channelId: text("channelId")
    .notNull()
    .references(() => communityChannels.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  
  // Order
  sortOrder: integer("sortOrder").notNull().default(0),
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== VIDEOS ====================
export type VideoStatus = "draft" | "published" | "unlisted" | "archived"

export const videos = pgTable("video", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Video details
  channelId: text("channelId")
    .notNull()
    .references(() => communityChannels.id, { onDelete: "cascade" }),
  sectionId: text("sectionId")
    .references(() => channelSections.id, { onDelete: "set null" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  
  // Media
  videoUrl: text("videoUrl").notNull(), // YouTube, Vimeo, or direct URL
  thumbnailUrl: text("thumbnailUrl"),
  duration: integer("duration"), // in seconds
  
  // Access Control
  isFirstEpisode: boolean("isFirstEpisode").notNull().default(false), // Free for tier 1
  episodeNumber: integer("episodeNumber"),
  seasonNumber: integer("seasonNumber").default(1),
  requiredTierLevel: integer("requiredTierLevel").notNull().default(2), // Default: Premium
  
  // Status
  status: text("status").$type<VideoStatus>().notNull().default("draft"),
  
  // Engagement
  viewCount: integer("viewCount").notNull().default(0),
  
  // Metadata
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // SEO
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
})

// ==================== USER MEMBERSHIPS ====================
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due" | "trialing"

export const userMemberships = pgTable("user_membership", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tierId: text("tierId")
    .notNull()
    .references(() => membershipTiers.id),
  
  // Subscription details
  status: text("status").$type<SubscriptionStatus>().notNull().default("active"),
  
  // Stripe Integration
  stripeSubscriptionId: text("stripeSubscriptionId").unique(),
  stripeCustomerId: text("stripeCustomerId"),
  
  // Discord Sync
  discordRoleAssigned: boolean("discordRoleAssigned").notNull().default(false),
  lastSyncedAt: timestamp("lastSyncedAt", { mode: "date" }),
  
  // Billing dates
  currentPeriodStart: timestamp("currentPeriodStart", { mode: "date" }),
  currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }),
  cancelAt: timestamp("cancelAt", { mode: "date" }),
  cancelledAt: timestamp("cancelledAt", { mode: "date" }),
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== VIDEO VIEWS ====================
// Track which users have watched which videos
export const videoViews = pgTable("video_view", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  videoId: text("videoId")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Progress tracking
  watchedSeconds: integer("watchedSeconds").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  
  // Timestamps
  lastWatchedAt: timestamp("lastWatchedAt", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  programs: many(programs),
  posts: many(posts),
  products: many(products),
  rsvps: many(rsvps),
  calendarSyncs: many(calendarSyncs),
  memberships: many(userMemberships),
  communityChannels: many(communityChannels),
  videos: many(videos),
  videoViews: many(videoViews),
}))

export const programsRelations = relations(programs, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [programs.createdBy],
    references: [users.id],
  }),
  events: many(events),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  program: one(programs, {
    fields: [events.programId],
    references: [programs.id],
  }),
  rsvps: many(rsvps),
  updates: many(eventUpdates),
}))

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  event: one(events, {
    fields: [rsvps.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [rsvps.userId],
    references: [users.id],
  }),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

export const productsRelations = relations(products, ({ one }) => ({
  createdBy: one(users, {
    fields: [products.createdBy],
    references: [users.id],
  }),
}))

export const calendarSyncsRelations = relations(calendarSyncs, ({ one }) => ({
  user: one(users, {
    fields: [calendarSyncs.userId],
    references: [users.id],
  }),
}))

export const eventUpdatesRelations = relations(eventUpdates, ({ one }) => ({
  event: one(events, {
    fields: [eventUpdates.eventId],
    references: [events.id],
  }),
  updatedBy: one(users, {
    fields: [eventUpdates.updatedBy],
    references: [users.id],
  }),
}))

export const membershipTiersRelations = relations(membershipTiers, ({ many }) => ({
  memberships: many(userMemberships),
}))

export const communityChannelsRelations = relations(communityChannels, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [communityChannels.createdBy],
    references: [users.id],
  }),
  videos: many(videos),
  sections: many(channelSections),
}))

export const channelSectionsRelations = relations(channelSections, ({ one, many }) => ({
  channel: one(communityChannels, {
    fields: [channelSections.channelId],
    references: [communityChannels.id],
  }),
  videos: many(videos),
}))

export const videosRelations = relations(videos, ({ one, many }) => ({
  channel: one(communityChannels, {
    fields: [videos.channelId],
    references: [communityChannels.id],
  }),
  section: one(channelSections, {
    fields: [videos.sectionId],
    references: [channelSections.id],
  }),
  createdBy: one(users, {
    fields: [videos.createdBy],
    references: [users.id],
  }),
  views: many(videoViews),
}))

export const userMembershipsRelations = relations(userMemberships, ({ one }) => ({
  user: one(users, {
    fields: [userMemberships.userId],
    references: [users.id],
  }),
  tier: one(membershipTiers, {
    fields: [userMemberships.tierId],
    references: [membershipTiers.id],
  }),
}))

export const videoViewsRelations = relations(videoViews, ({ one }) => ({
  video: one(videos, {
    fields: [videoViews.videoId],
    references: [videos.id],
  }),
  user: one(users, {
    fields: [videoViews.userId],
    references: [users.id],
  }),
}))

// ==================== PRO+ QUESTIONNAIRE ====================
export const proPlusQuestionnaires = pgTable("pro_plus_questionnaire", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Basic Info
  age: integer("age"),
  skillLevel: text("skillLevel").$type<"beginner" | "advanced" | "pro">(),
  gameDescription: text("gameDescription"),
  
  // Position & Experience
  position: text("position").$type<"PG" | "SG" | "SF" | "PF" | "C">(),
  yearsPlaying: text("yearsPlaying"),
  
  // Goals
  currentGoalsYearly: text("currentGoalsYearly"),
  currentGoalsOverall: text("currentGoalsOverall"),
  
  // Improvement Rankings (1-5)
  improvementRankings: jsonb("improvementRankings").$type<{
    ballHandling: number
    defence: number
    finishing: number
    shooting: number
    passing: number
    other?: { text: string; rank: number }
  }>(),
  
  // Physical Stats
  weight: decimal("weight", { precision: 6, scale: 2 }), // in lbs or kg
  height: text("height"), // e.g., "6'2" or "188cm"
  currentInjuries: text("currentInjuries"),
  
  // Training & Health
  seeingPhysiotherapy: boolean("seeingPhysiotherapy").default(false),
  weightTrains: boolean("weightTrains").default(false),
  stretches: boolean("stretches").default(false),
  
  // Team & Competition
  currentTeam: text("currentTeam").$type<"No Team" | "Elementary" | "Middle School" | "Highschool" | "College" | "Pro">(),
  outsideSchoolTeams: text("outsideSchoolTeams").$type<"AAU" | "Prep" | "No team">(),
  inSeason: boolean("inSeason").default(false),
  
  // Basketball Watching
  basketballWatching: text("basketballWatching"), // "Your own film", "NBA/Pro/College", "Both", "None"
  
  // Equipment & Availability
  equipmentAccess: text("equipmentAccess").$type<"Full gym" | "Half gym" | "Driveway" | "Park">(),
  trainingDays: jsonb("trainingDays").$type<string[]>(), // ["Monday", "Wednesday", "Friday"]
  averageSessionLength: integer("averageSessionLength"), // 30, 45, or 60 minutes
  
  // Mental & Coaching
  biggestStruggle: text("biggestStruggle"),
  confidenceLevel: integer("confidenceLevel"), // 1-5
  mentalChallenge: text("mentalChallenge").$type<"Fear of failure" | "Consistency" | "Pressure" | "Motivation" | "Other">(),
  mentalChallengeOther: text("mentalChallengeOther"),
  coachability: integer("coachability"), // 1-5
  preferredCoachingStyle: text("preferredCoachingStyle").$type<"Direct" | "Encouraging" | "Accountability" | "Driven" | "Mix" | "Other">(),
  coachingStyleOther: text("coachingStyleOther"),
  
  // Video Uploads
  gameFilmUrl: text("gameFilmUrl"), // Link to uploaded video
  workoutVideos: jsonb("workoutVideos").$type<string[]>(), // Array of video URLs
  
  completedAt: timestamp("completedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== COACH CALLS ====================
export type CoachCallStatus = "scheduled" | "completed" | "cancelled" | "rescheduled"

export const coachCalls = pgTable("coach_call", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  adminId: text("adminId")
    .references(() => users.id, { onDelete: "set null" }), // Assigned admin/coach
  
  scheduledAt: timestamp("scheduledAt", { mode: "date" }).notNull(), // Date and time of call
  duration: integer("duration").notNull().default(60), // Minutes
  
  status: text("status").$type<CoachCallStatus>().notNull().default("scheduled"),
  
  // Google Meet Integration
  googleMeetLink: text("googleMeetLink"), // Generated meeting URL
  meetingId: text("meetingId"), // Google Calendar event ID
  
  // Completion Status
  questionnaireCompleted: boolean("questionnaireCompleted").notNull().default(false),
  videoUploaded: boolean("videoUploaded").notNull().default(false),
  
  // Notes
  notes: text("notes"), // Admin notes after call
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => ({
  // Unique constraint: only 1 appointment per day (based on date part)
  uniqueDateIdx: uniqueIndex("coach_call_unique_date_idx").on(sql`DATE(${table.scheduledAt})`),
}))

// ==================== PERSONALIZED PROGRAMS ====================
export type PersonalizedProgramStatus = "active" | "completed" | "paused"

export const personalizedPrograms = pgTable("personalized_program", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Pro+ user
  
  createdBy: text("createdBy")
    .notNull()
    .references(() => users.id), // Admin who created it
  
  title: text("title").notNull(),
  description: text("description").notNull(),
  
  // Media
  videoUrl: text("videoUrl").notNull(), // Uploaded training video
  thumbnailUrl: text("thumbnailUrl"),
  
  // Schedule
  trainingDays: jsonb("trainingDays").$type<string[]>(), // ["Monday", "Wednesday"]
  startDate: timestamp("startDate", { mode: "date" }).notNull(),
  endDate: timestamp("endDate", { mode: "date" }).notNull(),
  
  status: text("status").$type<PersonalizedProgramStatus>().notNull().default("active"),
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== PROGRAM CHECKLIST ITEMS ====================
export const programChecklistItems = pgTable("program_checklist_item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  programId: text("programId")
    .notNull()
    .references(() => personalizedPrograms.id, { onDelete: "cascade" }),
  
  dueDate: timestamp("dueDate", { mode: "date" }).notNull(), // Specific date this workout is due
  
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completedAt", { mode: "date" }), // When user checked it off
  
  // Ratings (after completion)
  enjoymentRating: integer("enjoymentRating"), // 1-5
  difficultyRating: integer("difficultyRating"), // 1-5
  
  // Late tracking
  daysLate: integer("daysLate").default(0), // Calculated: completedAt - dueDate
  
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => ({
  // Unique constraint: one checklist item per program per date
  uniqueProgramDateIdx: uniqueIndex("program_checklist_unique_program_date_idx").on(
    table.programId,
    sql`DATE(${table.dueDate})`
  ),
}))

// ==================== USER VIDEO UPLOADS ====================
export type VideoUploadType = "questionnaire_game_film" | "questionnaire_workout" | "program_workout"

export const userVideoUploads = pgTable("user_video_upload", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  type: text("type").$type<VideoUploadType>().notNull(),
  relatedId: text("relatedId"), // ID of related questionnaire/program
  
  videoUrl: text("videoUrl").notNull(), // Vercel Blob Storage URL
  thumbnailUrl: text("thumbnailUrl"),
  
  uploadedAt: timestamp("uploadedAt", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
})

// ==================== ADDITIONAL RELATIONS ====================

export const proPlusQuestionnaireRelations = relations(proPlusQuestionnaires, ({ one }) => ({
  user: one(users, {
    fields: [proPlusQuestionnaires.userId],
    references: [users.id],
  }),
}))

export const coachCallRelations = relations(coachCalls, ({ one }) => ({
  user: one(users, {
    fields: [coachCalls.userId],
    references: [users.id],
  }),
  admin: one(users, {
    fields: [coachCalls.adminId],
    references: [users.id],
  }),
}))

export const personalizedProgramRelations = relations(personalizedPrograms, ({ one, many }) => ({
  user: one(users, {
    fields: [personalizedPrograms.userId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [personalizedPrograms.createdBy],
    references: [users.id],
  }),
  checklistItems: many(programChecklistItems),
}))

export const programChecklistItemRelations = relations(programChecklistItems, ({ one }) => ({
  program: one(personalizedPrograms, {
    fields: [programChecklistItems.programId],
    references: [personalizedPrograms.id],
  }),
}))

export const userVideoUploadRelations = relations(userVideoUploads, ({ one }) => ({
  user: one(users, {
    fields: [userVideoUploads.userId],
    references: [users.id],
  }),
}))

