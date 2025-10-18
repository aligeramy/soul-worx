import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { userMemberships, membershipTiers } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * GET /api/community/memberships
 * Get user's current membership
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    return NextResponse.json(membership || null)
  } catch (error) {
    console.error("Error fetching membership:", error)
    return NextResponse.json(
      { error: "Failed to fetch membership" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/community/memberships
 * Create or update user membership
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tierId, stripeSubscriptionId, stripeCustomerId } = body

    // Verify tier exists
    const tier = await db.query.membershipTiers.findFirst({
      where: eq(membershipTiers.id, tierId),
    })

    if (!tier) {
      return NextResponse.json(
        { error: "Tier not found" },
        { status: 404 }
      )
    }

    // Check if user already has an active membership
    const existingMembership = await db.query.userMemberships.findFirst({
      where: and(
        eq(userMemberships.userId, session.user.id),
        eq(userMemberships.status, "active")
      ),
    })

    if (existingMembership) {
      // Update existing membership
      const [updated] = await db
        .update(userMemberships)
        .set({
          tierId,
          stripeSubscriptionId: stripeSubscriptionId || existingMembership.stripeSubscriptionId,
          stripeCustomerId: stripeCustomerId || existingMembership.stripeCustomerId,
          updatedAt: new Date(),
        })
        .where(eq(userMemberships.id, existingMembership.id))
        .returning()

      return NextResponse.json(updated)
    }

    // Create new membership
    const now = new Date()
    const [membership] = await db
      .insert(userMemberships)
      .values({
        userId: session.user.id,
        tierId,
        status: "active",
        stripeSubscriptionId: stripeSubscriptionId || null,
        stripeCustomerId: stripeCustomerId || null,
        discordRoleAssigned: false,
        currentPeriodStart: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return NextResponse.json(membership)
  } catch (error) {
    console.error("Error creating membership:", error)
    return NextResponse.json(
      { error: "Failed to create membership" },
      { status: 500 }
    )
  }
}

