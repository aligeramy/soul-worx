import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { membershipTiers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createCheckoutSession, createStripeCustomer, getCustomerByEmail } from "@/lib/stripe"

/**
 * POST /api/community/subscribe
 * Create a Stripe checkout session for subscription
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 })
    }

    const body = await request.json()
    const { tierId, tierSlug } = body

    // Support both tierId and tierSlug
    let tier
    if (tierId) {
      tier = await db.query.membershipTiers.findFirst({
        where: eq(membershipTiers.id, tierId),
      })
    } else if (tierSlug) {
      tier = await db.query.membershipTiers.findFirst({
        where: (tiers, { or, eq }) => or(
          eq(tiers.slug, tierSlug),
          eq(tiers.slug, tierSlug.replace("_", "-"))
        ),
      })
    }

    if (!tierId && !tierSlug) {
      return NextResponse.json({ error: "Tier ID or slug is required" }, { status: 400 })
    }

    if (!tier) {
      return NextResponse.json(
        { error: "Tier not found" },
        { status: 404 }
      )
    }

    if (!tier.stripePriceId) {
      return NextResponse.json(
        { error: "Stripe pricing not configured for this tier. Please contact support." },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 500 }
      )
    }

    // Get or create Stripe customer
    let customer = await getCustomerByEmail(session.user.email)
    
    if (!customer) {
      customer = await createStripeCustomer(
        session.user.email,
        session.user.name || undefined,
        {
          userId: session.user.id,
        }
      )
    }

    // Check if mobile/onboarding request
    const isMobile = body.mobile === true || body.mobile === "true"
    const isOnboarding = body.onboarding === true || body.onboarding === "true"
    
    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const successUrl = isMobile
      ? `${baseUrl}/api/auth/mobile-callback?success=true&session_id={CHECKOUT_SESSION_ID}${isOnboarding ? `&onboarding=true&tier=${tier.slug}` : ''}`
      : `${baseUrl}/programs/community?success=true&session_id={CHECKOUT_SESSION_ID}`
    
    const checkoutSession = await createCheckoutSession({
      customerId: customer.id,
      priceId: tier.stripePriceId,
      successUrl,
      cancelUrl: isMobile ? `soulworx://upgrade?canceled=true` : `${baseUrl}/programs/community?canceled=true`,
      metadata: {
        userId: session.user.id,
        tierId: tier.id,
        tierSlug: tier.slug,
        mobile: isMobile ? "true" : "false",
        onboarding: isOnboarding ? "true" : "false",
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

