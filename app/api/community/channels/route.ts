import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { communityChannels } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

/**
 * GET /api/community/channels
 * Get all published community channels
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('all') === 'true'

    // If user is admin and 'all' param is set, return all channels
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin"
    
    let channels
    if (isAdmin && includeAll) {
      channels = await db.query.communityChannels.findMany({
        orderBy: [desc(communityChannels.sortOrder), desc(communityChannels.createdAt)],
        with: {
          createdBy: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })
    } else {
      // Public: only published channels
      channels = await db.query.communityChannels.findMany({
        where: eq(communityChannels.status, "published"),
        orderBy: [desc(communityChannels.sortOrder), desc(communityChannels.createdAt)],
      })
    }

    return NextResponse.json(channels)
  } catch (error) {
    console.error("Error fetching channels:", error)
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/community/channels
 * Create a new community channel (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      slug,
      title,
      description,
      longDescription,
      category,
      status,
      coverImage,
      thumbnailImage,
      requiredTierLevel,
      isFeatured,
      tags,
      metaTitle,
      metaDescription,
      sortOrder,
      createDiscordChannel,
    } = body

    // Check if slug already exists
    const existing = await db.query.communityChannels.findFirst({
      where: eq(communityChannels.slug, slug),
    })

    if (existing) {
      return NextResponse.json(
        { error: "A channel with this slug already exists" },
        { status: 400 }
      )
    }

    // Create Discord channel if requested
    let discordChannelId = null
    if (createDiscordChannel) {
      try {
        const { createChannel, getOrCreateCommunityCategory } = await import('@/lib/discord/bot')
        const categoryId = await getOrCreateCommunityCategory()
        discordChannelId = await createChannel(
          slug,
          categoryId || undefined,
          requiredTierLevel > 1 // Make private if not free tier
        )
      } catch (error) {
        console.error('Error creating Discord channel:', error)
        // Continue anyway - Discord integration is optional
      }
    }

    const now = new Date()
    const [channel] = await db
      .insert(communityChannels)
      .values({
        slug,
        title,
        description,
        longDescription: longDescription || null,
        category,
        status: status || "draft",
        coverImage: coverImage || null,
        thumbnailImage: thumbnailImage || null,
        requiredTierLevel: requiredTierLevel || 1,
        isFeatured: isFeatured || false,
        discordChannelId,
        tags: tags || [],
        videoCount: 0,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        sortOrder: sortOrder || 0,
        createdBy: session.user.id!,
        publishedAt: status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return NextResponse.json(channel)
  } catch (error) {
    console.error("Error creating channel:", error)
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    )
  }
}

