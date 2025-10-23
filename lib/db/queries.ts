import { db } from "./index"
import { programs, events, rsvps, posts, products, users, eventUpdates, type UserRole } from "./schema"
import { eq, and, gte, desc, asc, count } from "drizzle-orm"

// ==================== USER QUERIES ====================

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  })
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: { name?: string; image?: string }
) {
  return await db.update(users).set(data).where(eq(users.id, userId))
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: UserRole) {
  return await db.update(users).set({ role }).where(eq(users.id, userId))
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(userId: string) {
  const user = await getUserById(userId)
  return user?.role === "admin" || user?.role === "super_admin"
}

// ==================== PROGRAMS ====================
export async function getPrograms() {
  const allPrograms = await db.query.programs.findMany({
    where: eq(programs.status, "published"),
    orderBy: [desc(programs.createdAt)],
  })
  
  // Filter out special-events program
  return allPrograms.filter(p => p.slug !== "special-events")
}

export async function getProgramBySlug(slug: string) {
  return db.query.programs.findFirst({
    where: eq(programs.slug, slug),
    with: {
      events: {
        orderBy: [asc(events.startTime)],
      },
    },
  })
}

export async function getProgramEvents(programId: string) {
  return db.query.events.findMany({
    where: eq(events.programId, programId),
    orderBy: [asc(events.startTime)],
  })
}

// ==================== EVENTS ====================
export async function getUpcomingEvents() {
  const now = new Date()
  return db.query.events.findMany({
    where: gte(events.startTime, now),
    with: {
      program: true,
    },
    orderBy: [asc(events.startTime)],
  })
}

export async function getEventById(eventId: string) {
  return db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      program: true,
    },
  })
}

// ==================== RSVPs ====================
export async function getUserRsvps(userId: string) {
  return db.query.rsvps.findMany({
    where: eq(rsvps.userId, userId),
    with: {
      event: {
        with: {
          program: true,
        },
      },
    },
    orderBy: [desc(rsvps.createdAt)],
  })
}

export async function getEventRsvps(eventId: string) {
  return db.query.rsvps.findMany({
    where: eq(rsvps.eventId, eventId),
    with: {
      user: true,
    },
  })
}

export async function checkExistingRsvp(eventId: string, userId: string) {
  return db.query.rsvps.findFirst({
    where: and(
      eq(rsvps.eventId, eventId),
      eq(rsvps.userId, userId)
    ),
  })
}

// ==================== POSTS ====================
export async function getPosts() {
  return db.query.posts.findMany({
    where: eq(posts.status, "published"),
    with: {
      author: true,
    },
    orderBy: [desc(posts.publishedAt)],
  })
}

export async function getPostBySlug(slug: string) {
  return db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      author: true,
    },
  })
}

export async function getPostsByCategory(category: string) {
  return db.query.posts.findMany({
    where: and(
      eq(posts.status, "published"),
      eq(posts.category, category as "poetry" | "news" | "blog" | "tutorials" | "announcements")
    ),
    with: {
      author: true,
    },
    orderBy: [desc(posts.publishedAt)],
  })
}

// ==================== PRODUCTS ====================
export async function getProducts() {
  return db.query.products.findMany({
    where: eq(products.status, "active"),
    orderBy: [desc(products.createdAt)],
  })
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
  })
}

export async function getProductsByCategory(category: string) {
  return db.query.products.findMany({
    where: and(
      eq(products.status, "active"),
      eq(products.category, category as "apparel" | "accessories" | "books" | "digital" | "other")
    ),
    orderBy: [desc(products.createdAt)],
  })
}

export async function getAllProductsForAdmin() {
  return db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    with: {
      createdBy: true,
    },
  })
}

export async function getProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
  })
}

// ==================== ADMIN ====================
export async function getAllPrograms() {
  return db.query.programs.findMany({
    orderBy: [desc(programs.createdAt)],
    with: {
      createdBy: true,
    },
  })
}

export async function getAllPosts() {
  return db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
    with: {
      author: true,
    },
  })
}

// ==================== COMPREHENSIVE QUERIES ====================

/**
 * Get all published programs (excluding special events)
 */
export async function getPublishedPrograms() {
  const allPrograms = await db.query.programs.findMany({
    where: eq(programs.status, "published"),
    orderBy: desc(programs.publishedAt),
  })
  
  // Filter out special-events program
  return allPrograms.filter(p => p.slug !== "special-events")
}

/**
 * Get program with events
 */
export async function getProgramWithEvents(programId: string) {
  return await db.query.programs.findFirst({
    where: eq(programs.id, programId),
    with: {
      events: {
        orderBy: [events.startTime],
      },
    },
  })
}

/**
 * Create program (admin)
 */
export async function createProgram(data: typeof programs.$inferInsert) {
  return await db.insert(programs).values(data).returning()
}

/**
 * Update program (admin)
 */
export async function updateProgram(programId: string, data: Partial<typeof programs.$inferInsert>) {
  return await db.update(programs)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(programs.id, programId))
    .returning()
}

/**
 * Delete program (admin)
 */
export async function deleteProgram(programId: string) {
  return await db.delete(programs).where(eq(programs.id, programId))
}

/**
 * Get all programs for admin
 */
export async function getAllProgramsAdmin() {
  return await db.query.programs.findMany({
    orderBy: desc(programs.createdAt),
    with: {
      createdBy: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Get events by program
 */
export async function getEventsByProgram(programId: string) {
  return await db.query.events.findMany({
    where: eq(events.programId, programId),
    orderBy: [events.startTime],
  })
}

/**
 * Create event (admin)
 */
export async function createEvent(data: typeof events.$inferInsert) {
  return await db.insert(events).values(data).returning()
}

/**
 * Update event (admin) - with change tracking
 */
export async function updateEvent(
  eventId: string, 
  data: Partial<typeof events.$inferInsert>,
  updatedBy: string
) {
  // Get old event data for tracking
  const oldEvent = await getEventById(eventId)
  
  // Update the event
  const result = await db.update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, eventId))
    .returning()

  // Track changes for calendar sync
  if (oldEvent && result[0]) {
    const changes: Array<{
      changeType: "time" | "location" | "status" | "details"
      oldValue: unknown
      newValue: unknown
    }> = []

    if (data.startTime || data.endTime) {
      changes.push({
        changeType: "time",
        oldValue: { startTime: oldEvent.startTime, endTime: oldEvent.endTime },
        newValue: { startTime: result[0].startTime, endTime: result[0].endTime },
      })
    }

    if (data.venueName || data.venueAddress || data.virtualMeetingUrl) {
      changes.push({
        changeType: "location",
        oldValue: {
          venueName: oldEvent.venueName,
          venueAddress: oldEvent.venueAddress,
          virtualMeetingUrl: oldEvent.virtualMeetingUrl,
        },
        newValue: {
          venueName: result[0].venueName,
          venueAddress: result[0].venueAddress,
          virtualMeetingUrl: result[0].virtualMeetingUrl,
        },
      })
    }

    if (data.status) {
      changes.push({
        changeType: "status",
        oldValue: oldEvent.status,
        newValue: result[0].status,
      })
    }

    // Log all changes
    for (const change of changes) {
      await db.insert(eventUpdates).values({
        eventId,
        changeType: change.changeType,
        oldValue: change.oldValue,
        newValue: change.newValue,
        updatedBy,
      })
    }
  }

  return result
}

/**
 * Delete event (admin)
 */
export async function deleteEvent(eventId: string) {
  return await db.delete(events).where(eq(events.id, eventId))
}

/**
 * Get event RSVP count and capacity
 */
export async function getEventRsvpStats(eventId: string) {
  const event = await getEventById(eventId)
  const confirmedCount = await db
    .select({ count: count() })
    .from(rsvps)
    .where(and(
      eq(rsvps.eventId, eventId),
      eq(rsvps.status, "confirmed")
    ))

  return {
    event,
    confirmedCount: confirmedCount[0]?.count || 0,
    capacity: event?.capacity || 0,
    spotsAvailable: event?.capacity ? event.capacity - (confirmedCount[0]?.count || 0) : null,
  }
}

/**
 * Create RSVP
 */
export async function createRsvp(data: typeof rsvps.$inferInsert) {
  return await db.insert(rsvps).values(data).returning()
}

/**
 * Get upcoming user RSVPs
 */
export async function getUpcomingUserRsvps(userId: string) {
  return await db
    .select({
      rsvp: rsvps,
      event: events,
      program: programs,
    })
    .from(rsvps)
    .innerJoin(events, eq(rsvps.eventId, events.id))
    .innerJoin(programs, eq(events.programId, programs.id))
    .where(and(
      eq(rsvps.userId, userId),
      eq(rsvps.status, "confirmed"),
      gte(events.startTime, new Date())
    ))
    .orderBy(events.startTime)
}

/**
 * Check if user has RSVP'd to event
 */
export async function getUserRsvpForEvent(userId: string, eventId: string) {
  return await db.query.rsvps.findFirst({
    where: and(
      eq(rsvps.userId, userId),
      eq(rsvps.eventId, eventId)
    ),
  })
}

/**
 * Update RSVP
 */
export async function updateRsvp(rsvpId: string, data: Partial<typeof rsvps.$inferInsert>) {
  return await db.update(rsvps)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(rsvps.id, rsvpId))
    .returning()
}

/**
 * Cancel RSVP
 */
export async function cancelRsvp(rsvpId: string) {
  return await db.update(rsvps)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(rsvps.id, rsvpId))
    .returning()
}

/**
 * Get published posts
 */
export async function getPublishedPosts() {
  return await db.query.posts.findMany({
    where: eq(posts.status, "published"),
    orderBy: desc(posts.publishedAt),
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })
}

/**
 * Create post (admin)
 */
export async function createPost(data: typeof posts.$inferInsert) {
  return await db.insert(posts).values(data).returning()
}

/**
 * Update post (admin)
 */
export async function updatePost(postId: string, data: Partial<typeof posts.$inferInsert>) {
  return await db.update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, postId))
    .returning()
}

/**
 * Delete post (admin)
 */
export async function deletePost(postId: string) {
  return await db.delete(posts).where(eq(posts.id, postId))
}

/**
 * Get all posts for admin
 */
export async function getAllPostsAdmin() {
  return await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Increment post view count
 */
export async function incrementPostViews(postId: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  })

  if (post) {
    return await db.update(posts)
      .set({ viewCount: post.viewCount + 1 })
      .where(eq(posts.id, postId))
  }
}

// ==================== EVENT UPDATES ====================

/**
 * Get unprocessed event updates for calendar sync
 */
export async function getUnprocessedEventUpdates() {
  return await db.query.eventUpdates.findMany({
    where: eq(eventUpdates.syncProcessed, false),
    with: {
      event: {
        with: {
          rsvps: {
            where: eq(rsvps.status, "confirmed"),
            with: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: [asc(eventUpdates.createdAt)],
  })
}

/**
 * Mark event update as processed
 */
export async function markEventUpdateProcessed(updateId: string) {
  return await db.update(eventUpdates)
    .set({ syncProcessed: true })
    .where(eq(eventUpdates.id, updateId))
}

/**
 * Create product (admin)
 */
export async function createProduct(data: typeof products.$inferInsert) {
  return await db.insert(products).values(data).returning()
}

/**
 * Update product (admin)
 */
export async function updateProduct(productId: string, data: Partial<typeof products.$inferInsert>) {
  return await db.update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning()
}

/**
 * Delete product (admin)
 */
export async function deleteProduct(productId: string) {
  return await db.delete(products).where(eq(products.id, productId))
}
