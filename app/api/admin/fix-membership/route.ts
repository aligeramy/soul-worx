import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { userMemberships, membershipTiers } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { stripe } from "@/lib/stripe"

/**
 * POST /api/admin/fix-membership
 * Fix user's membership tier based on their Stripe subscription
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Get user's active membership
    const membership = await db.query.userMemberships.findFirst({
      where: and(
        eq(userMemberships.userId, userId),
        eq(userMemberships.status, "active")
      ),
      with: {
        tier: true,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "No active membership found" }, { status: 404 })
    }

    // If no Stripe subscription ID, can't check
    if (!membership.stripeSubscriptionId) {
      return NextResponse.json({ 
        error: "No Stripe subscription ID found",
        currentTier: membership.tier?.slug,
      }, { status: 400 })
    }

    // Get subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(membership.stripeSubscriptionId)
    const priceId = stripeSubscription.items.data[0]?.price?.id

    if (!priceId) {
      return NextResponse.json({ error: "No price ID found in Stripe subscription" }, { status: 400 })
    }

    // Find tier by Stripe price ID
    const correctTier = await db.query.membershipTiers.findFirst({
      where: eq(membershipTiers.stripePriceId, priceId),
    })

    if (!correctTier) {
      return NextResponse.json({ 
        error: "Tier not found for Stripe price ID",
        priceId,
        currentTier: membership.tier?.slug,
      }, { status: 404 })
    }

    // Update membership if tier is different
    if (membership.tierId !== correctTier.id) {
      await db
        .update(userMemberships)
        .set({
          tierId: correctTier.id,
          updatedAt: new Date(),
        })
        .where(eq(userMemberships.id, membership.id))

      return NextResponse.json({
        success: true,
        message: "Membership tier updated",
        oldTier: membership.tier?.slug,
        newTier: correctTier.slug,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Membership tier is already correct",
      tier: correctTier.slug,
    })
  } catch (error) {
    console.error("Error fixing membership:", error)
    return NextResponse.json(
      {
        error: "Failed to fix membership",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
