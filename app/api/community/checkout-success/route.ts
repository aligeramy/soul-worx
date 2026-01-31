import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { userMemberships, membershipTiers } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { stripe } from "@/lib/stripe"

/**
 * POST /api/community/checkout-success
 * Handle successful Stripe checkout immediately (don't wait for webhook)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    if (!checkoutSession || checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const tierId = checkoutSession.metadata?.tierId
    const subscriptionId = typeof checkoutSession.subscription === 'string' 
      ? checkoutSession.subscription 
      : checkoutSession.subscription?.id

    if (!tierId) {
      return NextResponse.json({ error: "Invalid session metadata" }, { status: 400 })
    }

    // Check if membership already exists
    const existingMembership = await db.query.userMemberships.findFirst({
      where: and(
        eq(userMemberships.userId, session.user.id),
        eq(userMemberships.status, "active")
      ),
    })

    const now = new Date()

    if (existingMembership) {
      // Update existing membership
      await db
        .update(userMemberships)
        .set({
          tierId,
          stripeSubscriptionId: subscriptionId || existingMembership.stripeSubscriptionId,
          stripeCustomerId: checkoutSession.customer as string,
          status: "active",
          currentPeriodStart: now,
          updatedAt: now,
        })
        .where(eq(userMemberships.id, existingMembership.id))
    } else {
      // Create new membership
      await db.insert(userMemberships).values({
        userId: session.user.id,
        tierId,
        status: "active",
        stripeSubscriptionId: subscriptionId || null,
        stripeCustomerId: checkoutSession.customer as string,
        discordRoleAssigned: false,
        currentPeriodStart: now,
        createdAt: now,
        updatedAt: now,
      })
    }

    // Get tier info to return
    const tier = await db.query.membershipTiers.findFirst({
      where: eq(membershipTiers.id, tierId),
    })

    return NextResponse.json({
      success: true,
      tierSlug: tier?.slug,
    })
  } catch (error: unknown) {
    console.error("Error processing checkout success:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to process checkout"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

