import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { videos, videoViews } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * POST /api/community/videos/[id]/view
 * Track a video view and increment view count
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    // Get the video
    const video = await db.query.videos.findFirst({
      where: eq(videos.id, id),
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const watchedSeconds = body.watchedSeconds || 0
    const completed = body.completed || false
    const isInitialView = watchedSeconds === 0 && !completed

    // Check if user already has a view record (for logged-in users)
    let existingView = null
    if (session?.user?.id) {
      existingView = await db.query.videoViews.findFirst({
        where: and(
          eq(videoViews.videoId, id),
          eq(videoViews.userId, session.user.id)
        ),
      })
    }

    // Only increment view count on initial view (not on progress updates)
    // For logged-in users, only increment if they haven't viewed before
    // For anonymous users, increment on every initial view call
    let newViewCount = video.viewCount
    if (isInitialView) {
      if (session?.user?.id) {
        // Logged-in user: only increment if this is their first view
        if (!existingView) {
          newViewCount = video.viewCount + 1
          await db
            .update(videos)
            .set({ 
              viewCount: newViewCount,
              updatedAt: new Date()
            })
            .where(eq(videos.id, id))
        }
      } else {
        // Anonymous user: increment view count
        newViewCount = video.viewCount + 1
        await db
          .update(videos)
          .set({ 
            viewCount: newViewCount,
            updatedAt: new Date()
          })
          .where(eq(videos.id, id))
      }
    }

    // If user is logged in, track their individual view progress
    if (session?.user?.id) {
      if (existingView) {
        // Update existing view record
        await db
          .update(videoViews)
          .set({
            watchedSeconds: Math.max(existingView.watchedSeconds, watchedSeconds),
            completed: existingView.completed || completed,
            lastWatchedAt: new Date(),
          })
          .where(eq(videoViews.id, existingView.id))
      } else {
        // Create new view record
        await db.insert(videoViews).values({
          videoId: id,
          userId: session.user.id,
          watchedSeconds,
          completed,
          lastWatchedAt: new Date(),
        })
      }
    }

    return NextResponse.json({ 
      success: true,
      viewCount: newViewCount 
    })
  } catch (error) {
    console.error("Error tracking video view:", error)
    return NextResponse.json(
      { error: "Failed to track video view" },
      { status: 500 }
    )
  }
}
