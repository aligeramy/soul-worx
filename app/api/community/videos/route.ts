import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { videos, communityChannels } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

/**
 * GET /api/community/videos
 * Get videos (filtered by channel or all)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId')
    const includeAll = searchParams.get('all') === 'true'

    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin"
    
    let videosList
    if (channelId) {
      // Get videos for specific channel
      videosList = await db.query.videos.findMany({
        where: eq(videos.channelId, channelId),
        orderBy: [desc(videos.episodeNumber)],
      })
    } else if (isAdmin && includeAll) {
      // Admin: get all videos
      videosList = await db.query.videos.findMany({
        orderBy: [desc(videos.createdAt)],
        with: {
          channel: true,
        },
      })
    } else {
      // Public: only published videos
      videosList = await db.query.videos.findMany({
        where: eq(videos.status, "published"),
        orderBy: [desc(videos.createdAt)],
        with: {
          channel: true,
        },
      })
    }

    return NextResponse.json(videosList)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/community/videos
 * Create a new video (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      channelId,
      slug,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      isFirstEpisode,
      episodeNumber,
      seasonNumber,
      requiredTierLevel,
      status,
      tags,
      metaTitle,
      metaDescription,
    } = body

    // Verify channel exists
    const channel = await db.query.communityChannels.findFirst({
      where: eq(communityChannels.id, channelId),
    })

    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      )
    }

    // Check if slug already exists
    const existing = await db.query.videos.findFirst({
      where: eq(videos.slug, slug),
    })

    if (existing) {
      return NextResponse.json(
        { error: "A video with this slug already exists" },
        { status: 400 }
      )
    }

    const now = new Date()
    const [video] = await db
      .insert(videos)
      .values({
        channelId,
        slug,
        title,
        description: description || null,
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        duration: duration || null,
        isFirstEpisode: isFirstEpisode || false,
        episodeNumber: episodeNumber || null,
        seasonNumber: seasonNumber || 1,
        requiredTierLevel: requiredTierLevel || 2,
        status: status || "draft",
        viewCount: 0,
        tags: tags || [],
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        createdBy: session.user.id!,
        publishedAt: status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    // Update channel video count
    await db
      .update(communityChannels)
      .set({
        videoCount: channel.videoCount + 1,
        updatedAt: now,
      })
      .where(eq(communityChannels.id, channelId))

    return NextResponse.json(video)
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    )
  }
}

