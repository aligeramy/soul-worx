import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { communityChannels, type ChannelStatus } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * GET /api/community/channels/[id]
 * Get a specific channel
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const channel = await db.query.communityChannels.findFirst({
      where: eq(communityChannels.id, id),
      with: {
        videos: {
          orderBy: (videos, { asc }) => [asc(videos.episodeNumber)],
        },
      },
    })

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 })
    }

    return NextResponse.json(channel)
  } catch (error) {
    console.error("Error fetching channel:", error)
    return NextResponse.json(
      { error: "Failed to fetch channel" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/community/channels/[id]
 * Update a channel (admin only)
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

    const existing = await db.query.communityChannels.findFirst({
      where: eq(communityChannels.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 })
    }

    // Update published date if status changes to published
    const updates: { status?: ChannelStatus; name?: string; description?: string; publishedAt?: Date; updatedAt: Date } = { ...body }
    if (body.status === "published" && existing.status !== "published") {
      updates.publishedAt = new Date()
    }
    updates.updatedAt = new Date()

    const [updated] = await db
      .update(communityChannels)
      .set(updates)
      .where(eq(communityChannels.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating channel:", error)
    return NextResponse.json(
      { error: "Failed to update channel" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/community/channels/[id]
 * Delete a channel (admin only)
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

    await db.delete(communityChannels).where(eq(communityChannels.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting channel:", error)
    return NextResponse.json(
      { error: "Failed to delete channel" },
      { status: 500 }
    )
  }
}

