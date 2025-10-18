-- Add role column to user table if it doesn't exist
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" text NOT NULL DEFAULT 'user';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT NOW();
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT NOW();

-- Create new tables for programs
CREATE TABLE IF NOT EXISTS "program" (
  "id" text PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "longDescription" text,
  "category" text NOT NULL,
  "status" text NOT NULL DEFAULT 'draft',
  "coverImage" text,
  "images" jsonb DEFAULT '[]'::jsonb,
  "videoUrl" text,
  "duration" text,
  "ageRange" text,
  "capacity" integer,
  "price" numeric(10, 2),
  "registrationRequired" boolean NOT NULL DEFAULT true,
  "requiresParentConsent" boolean NOT NULL DEFAULT false,
  "tags" jsonb DEFAULT '[]'::jsonb,
  "faqs" jsonb DEFAULT '[]'::jsonb,
  "metaTitle" text,
  "metaDescription" text,
  "createdBy" text NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW(),
  "publishedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "event" (
  "id" text PRIMARY KEY,
  "programId" text NOT NULL REFERENCES "program"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text,
  "status" text NOT NULL DEFAULT 'scheduled',
  "startTime" timestamp NOT NULL,
  "endTime" timestamp NOT NULL,
  "timezone" text NOT NULL DEFAULT 'America/New_York',
  "locationType" text NOT NULL,
  "venueName" text,
  "venueAddress" text,
  "venueCity" text,
  "venueState" text,
  "venueZip" text,
  "venueCountry" text DEFAULT 'USA',
  "latitude" numeric(10, 8),
  "longitude" numeric(11, 8),
  "virtualMeetingUrl" text,
  "capacity" integer,
  "waitlistEnabled" boolean NOT NULL DEFAULT false,
  "notes" text,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "rsvp" (
  "id" text PRIMARY KEY,
  "eventId" text NOT NULL REFERENCES "event"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "status" text NOT NULL DEFAULT 'confirmed',
  "guestCount" integer NOT NULL DEFAULT 0,
  "dietaryRestrictions" text,
  "specialNeeds" text,
  "parentEmail" text,
  "parentConsent" boolean DEFAULT false,
  "calendarSyncEnabled" boolean NOT NULL DEFAULT true,
  "calendarEventId" text,
  "lastSyncedAt" timestamp,
  "reminderSent" boolean DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW(),
  "cancelledAt" timestamp
);

CREATE TABLE IF NOT EXISTS "calendar_sync" (
  "id" text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "provider" text NOT NULL,
  "calendarId" text,
  "accessToken" text,
  "refreshToken" text,
  "tokenExpiresAt" timestamp,
  "syncEnabled" boolean NOT NULL DEFAULT true,
  "lastSyncedAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "post" (
  "id" text PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "excerpt" text,
  "content" text NOT NULL,
  "coverImage" text,
  "category" text NOT NULL,
  "tags" jsonb DEFAULT '[]'::jsonb,
  "status" text NOT NULL DEFAULT 'draft',
  "readTime" integer,
  "viewCount" integer NOT NULL DEFAULT 0,
  "metaTitle" text,
  "metaDescription" text,
  "ogImage" text,
  "authorId" text NOT NULL REFERENCES "user"("id"),
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW(),
  "publishedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "product" (
  "id" text PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "status" text NOT NULL DEFAULT 'draft',
  "images" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "price" numeric(10, 2) NOT NULL,
  "compareAtPrice" numeric(10, 2),
  "sku" text,
  "stock" integer NOT NULL DEFAULT 0,
  "trackInventory" boolean NOT NULL DEFAULT true,
  "variants" jsonb DEFAULT '[]'::jsonb,
  "tags" jsonb DEFAULT '[]'::jsonb,
  "specifications" jsonb DEFAULT '{}'::jsonb,
  "metaTitle" text,
  "metaDescription" text,
  "createdBy" text NOT NULL REFERENCES "user"("id"),
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "event_update" (
  "id" text PRIMARY KEY,
  "eventId" text NOT NULL REFERENCES "event"("id") ON DELETE CASCADE,
  "changeType" text NOT NULL,
  "oldValue" jsonb,
  "newValue" jsonb,
  "updatedBy" text REFERENCES "user"("id"),
  "syncProcessed" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT NOW()
);

