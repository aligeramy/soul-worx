import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users, userMemberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { syncUserRoles, getDiscordUser } from "@/lib/discord/bot"

/**
 * POST /api/community/sync-discord
 * Manually sync user's Discord roles based on their membership
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { discordUserId } = body

    if (!discordUserId) {
      return NextResponse.json(
        { error: "Discord user ID required" },
        { status: 400 }
      )
    }

    // Get Discord user info
    const discordUser = await getDiscordUser(discordUserId)
    if (!discordUser) {
      return NextResponse.json(
        { error: "Discord user not found" },
        { status: 404 }
      )
    }

    // Update user's Discord ID in database
    await db
      .update(users)
      .set({
        discordId: discordUserId,
        discordUsername: discordUser.username,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    // Get user's active membership
    const membership = await db.query.userMemberships.findFirst({
      where: and(
        eq(userMemberships.userId, session.user.id),
        eq(userMemberships.status, "active")
      ),
      with: {
        tier: true,
      },
    })

    if (!membership?.tier?.discordRoleId) {
      return NextResponse.json({
        success: true,
        message: "Discord linked but no role to assign",
      })
    }

    // Sync roles
    const success = await syncUserRoles(
      discordUserId,
      membership.tier.discordRoleId
    )

    if (success) {
      // Update membership record
      await db
        .update(userMemberships)
        .set({
          discordRoleAssigned: true,
          lastSyncedAt: new Date(),
        })
        .where(eq(userMemberships.id, membership.id))
    }

    return NextResponse.json({
      success,
      message: success
        ? "Discord roles synced successfully"
        : "Failed to sync Discord roles",
    })
  } catch (error) {
    console.error("Error syncing Discord:", error)
    return NextResponse.json(
      { error: "Failed to sync Discord" },
      { status: 500 }
    )
  }
}

