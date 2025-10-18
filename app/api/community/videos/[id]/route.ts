import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { videos, videoViews, type VideoStatus } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * GET /api/community/videos/[id]
 * Get a specific video
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    const video = await db.query.videos.findFirst({
      where: eq(videos.id, id),
      with: {
        channel: true,
      },
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Get user's watch progress if logged in
    let watchProgress = null
    if (session?.user?.id) {
      watchProgress = await db.query.videoViews.findFirst({
        where: and(
          eq(videoViews.videoId, id),
          eq(videoViews.userId, session.user.id)
        ),
      })
    }

    return NextResponse.json({ ...video, watchProgress })
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/community/videos/[id]
 * Update a video (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await db.query.videos.findFirst({
      where: eq(videos.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const updates: { status?: VideoStatus; title?: string; description?: string; publishedAt?: Date; updatedAt: Date } = { ...body }
    if (body.status === "published" && existing.status !== "published") {
      updates.publishedAt = new Date()
    }
    updates.updatedAt = new Date()

    const [updated] = await db
      .update(videos)
      .set(updates)
      .where(eq(videos.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/community/videos/[id]
 * Delete a video (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await db.delete(videos).where(eq(videos.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    )
  }
}

