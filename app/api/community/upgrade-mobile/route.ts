import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { membershipTiers, userMemberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { createCheckoutSession, getCustomerByEmail } from "@/lib/stripe"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * POST /api/community/upgrade-mobile
 * Create Stripe checkout session for mobile app upgrade
 * Uses existing Stripe customer if available (Spotify-style)
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin")
  return handleOptions(origin)
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return addCorsHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        origin
      )
    }

    const body = await request.json()
    const { tierSlug } = body

    if (!tierSlug) {
      return addCorsHeaders(
        NextResponse.json({ error: "Tier slug is required" }, { status: 400 }),
        origin
      )
    }

    // Get tier details
    const tier = await db.query.membershipTiers.findFirst({
      where: (tiers, { or, eq }) => or(
        eq(tiers.slug, tierSlug),
        eq(tiers.slug, tierSlug.replace("_", "-"))
      ),
    })

    if (!tier) {
      return addCorsHeaders(
        NextResponse.json({ error: "Tier not found" }, { status: 404 }),
        origin
      )
    }

    if (!tier.stripePriceId) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "Stripe pricing not configured for this tier" },
          { status: 400 }
        ),
        origin
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "Payment system not configured" },
          { status: 500 }
        ),
        origin
      )
    }

    // Get or create Stripe customer (reuse existing)
    const customer = await getCustomerByEmail(session.user.email)
    
    if (!customer) {
      // If no customer exists, redirect to web for first-time signup
      return addCorsHeaders(
        NextResponse.json(
          { 
            error: "No payment method on file",
            redirectToWeb: true,
            webUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://beta.soulworx.ca'}/upgrade?tier=${tierSlug}&mobile=true`
          },
          { status: 400 }
        ),
        origin
      )
    }

    // Create checkout session with existing customer
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beta.soulworx.ca'
    const checkoutSession = await createCheckoutSession({
      customerId: customer.id,
      priceId: tier.stripePriceId,
      successUrl: `${baseUrl}/api/auth/mobile-callback?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `soulworx://upgrade?canceled=true`,
      metadata: {
        userId: session.user.id,
        tierId: tier.id,
        tierSlug: tier.slug,
        mobile: "true",
      },
    })

    return addCorsHeaders(
      NextResponse.json({ 
        sessionId: checkoutSession.id, 
        url: checkoutSession.url,
        customerId: customer.id 
      }),
      origin
    )
  } catch (error) {
    console.error("Error creating upgrade checkout:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session"
    return addCorsHeaders(
      NextResponse.json({ error: errorMessage }, { status: 500 }),
      origin
    )
  }
}
