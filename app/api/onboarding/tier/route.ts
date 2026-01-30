import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users, membershipTiers, userMemberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * POST /api/onboarding/tier
 * Save user's tier selection and create membership
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tier } = body

    // Validate tier
    const validTiers = ["free", "pro", "pro_plus"]
    if (!tier || !validTiers.includes(tier)) {
      return NextResponse.json(
        { error: "Invalid tier selection" },
        { status: 400 }
      )
    }

    // Find the tier in database
    const tierRecord = await db.query.membershipTiers.findFirst({
      where: eq(membershipTiers.slug, tier),
    })

    if (!tierRecord) {
      return NextResponse.json(
        { error: "Tier not found in database" },
        { status: 404 }
      )
    }

    // Get current user data
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update onboarding data
    const currentOnboardingData = (user.onboardingData as Record<string, unknown>) || {}
    const updatedOnboardingData = {
      ...currentOnboardingData,
      tier,
      step: "tier",
      tierSelectedAt: new Date().toISOString(),
    }

    // Update user
    await db
      .update(users)
      .set({
        onboardingData: updatedOnboardingData,
        // Mark onboarding as completed if not Pro+ (Pro+ needs questionnaire)
        onboardingCompleted: tier !== "pro_plus",
      })
      .where(eq(users.id, session.user.id))

    // Check if user already has a membership
    const existingMembership = await db.query.userMemberships.findFirst({
      where: and(
        eq(userMemberships.userId, session.user.id),
        eq(userMemberships.status, "active")
      ),
    })

    // If free tier, create membership immediately
    // If paid tier (pro/pro_plus), they'll need to subscribe via Stripe
    if (tier === "free" && !existingMembership) {
      await db.insert(userMemberships).values({
        userId: session.user.id,
        tierId: tierRecord.id,
        status: "active",
      })
    }

    return NextResponse.json({ 
      success: true,
      tier,
      needsSubscription: tier !== "free",
    })
  } catch (error) {
    console.error("Error saving tier:", error)
    return NextResponse.json(
      { error: "Failed to save tier selection" },
      { status: 500 }
    )
  }
}
