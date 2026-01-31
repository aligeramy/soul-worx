import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users, membershipTiers, userMemberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { addCorsHeaders } from "@/lib/cors"

/**
 * POST /api/onboarding/tier
 * Save user's tier selection and create membership
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return addCorsHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        origin
      )
    }

    const body = await request.json()
    const { tier } = body

    // Validate tier
    const validTiers = ["free", "pro", "pro_plus"]
    if (!tier || !validTiers.includes(tier)) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "Invalid tier selection" },
          { status: 400 }
        ),
        origin
      )
    }

    // Normalize tier slug: convert "pro_plus" to "pro-plus" for database lookup
    const tierSlug = tier === "pro_plus" ? "pro-plus" : tier

    // Find the tier in database
    let tierRecord = await db.query.membershipTiers.findFirst({
      where: eq(membershipTiers.slug, tierSlug),
    })

    // If tier doesn't exist, create it
    if (!tierRecord) {
      const tierConfig = {
        free: {
          name: "Free",
          slug: "free",
          level: "free" as const,
          description: "Access to first 2 videos, rotate per month",
          features: [
            "First 2 videos",
            "Rotate per month",
            "Journal",
            "Public Discord channel",
          ],
          accessLevel: 1,
          price: "0",
          billingPeriod: "monthly" as const,
        },
        pro: {
          name: "Pro",
          slug: "pro",
          level: "pro" as const,
          description: "Access to all videos and programs",
          features: [
            "Access to all videos right away",
            "1-2 specific programs per month",
            "Soulworx AI assistant",
            "Journal",
            "Discord Community (VIP + public)",
          ],
          accessLevel: 2,
          price: "20",
          billingPeriod: "monthly" as const,
        },
        "pro-plus": {
          name: "Pro+",
          slug: "pro-plus",
          level: "pro_plus" as const,
          description: "Full access with personalized coaching",
          features: [
            "Access to all videos right away",
            "Ability to upload videos for review and coaching",
            "Personalized programs",
            "1-2 specific per month (Not tailored to player)",
            "Soulworx AI assistant",
            "Journal",
            "Discord Community (private channel + VIP + public)",
          ],
          accessLevel: 3,
          price: "25",
          billingPeriod: "monthly" as const,
        },
      }

      const config = tierConfig[tierSlug as keyof typeof tierConfig]
      if (!config) {
        return addCorsHeaders(
          NextResponse.json(
            { error: "Invalid tier selection" },
            { status: 400 }
          ),
          origin
        )
      }

      // Create the tier
      const [newTier] = await db
        .insert(membershipTiers)
        .values({
          name: config.name,
          slug: config.slug,
          level: config.level,
          description: config.description,
          features: config.features,
          accessLevel: config.accessLevel,
          price: config.price,
          billingPeriod: config.billingPeriod,
          stripePriceId: null, // Will need to be set up later
          discordRoleId: null, // Will need to be set up later
          dmAccessEnabled: tierSlug === "pro-plus",
          isActive: true,
          sortOrder: config.accessLevel,
        })
        .returning()

      tierRecord = newTier
    }

    // Get current user data
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    })

    if (!user) {
      return addCorsHeaders(
        NextResponse.json({ error: "User not found" }, { status: 404 }),
        origin
      )
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

    return addCorsHeaders(
      NextResponse.json({ 
        success: true,
        tier,
        needsSubscription: tier !== "free",
      }),
      origin
    )
  } catch (error) {
    console.error("Error saving tier:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to save tier selection" },
        { status: 500 }
      ),
      origin
    )
  }
}
