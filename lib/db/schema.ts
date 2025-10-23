import { pgTable, text, timestamp, primaryKey, integer, boolean, jsonb, decimal } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
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
export type TierLevel = "free" | "premium" | "vip"

export const membershipTiers = pgTable("membership_tier", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  
  // Tier details
  name: text("name").notNull(), // "Free", "Premium", "VIP"
  slug: text("slug").notNull().unique(), // "free", "premium", "vip"
  level: text("level").$type<TierLevel>().notNull(),
  description: text("description").notNull(),
  
  // Features
  features: jsonb("features").$type<string[]>().notNull().default([]),
  accessLevel: integer("accessLevel").notNull().default(1), // 1=first episode, 2=all videos, 3=all+dm
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  billingPeriod: text("billingPeriod").$type<"monthly" | "yearly" | "lifetime">().default("monthly"),
  stripePriceId: text("stripePriceId"), // Stripe Price ID for subscriptions
  
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
}))

export const videosRelations = relations(videos, ({ one, many }) => ({
  channel: one(communityChannels, {
    fields: [videos.channelId],
    references: [communityChannels.id],
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

