import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { membershipTiers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createProduct, createPrice } from "@/lib/stripe"

/**
 * POST /api/admin/setup-stripe-prices
 * Create Stripe products and prices for Pro and Pro+ tiers, then update database
 */
export async function POST(_request: NextRequest) {
  try {
    const session = await auth()
    
    // Only allow admins
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is not set in environment variables" },
        { status: 500 }
      )
    }

    const results: Record<string, { productId?: string; priceId?: string; status?: string; error?: string }> = {}

    // Setup Pro tier
    try {
      // Check if Pro tier exists
      let proTier = await db.query.membershipTiers.findFirst({
        where: eq(membershipTiers.slug, "pro"),
      })

      if (!proTier) {
        // Create Pro tier first
        const [newProTier] = await db
          .insert(membershipTiers)
          .values({
            name: "Pro",
            slug: "pro",
            level: "pro",
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
            billingPeriod: "monthly",
            isActive: true,
            sortOrder: 2,
          })
          .returning()
        proTier = newProTier
      }

      // Create Stripe product and price for Pro
      const proProduct = await createProduct({
        name: "Soulworx Pro Membership",
        description: "Access to all videos, programs, AI assistant, and VIP Discord community",
        metadata: {
          tier: "pro",
          tierSlug: "pro",
        },
      })

      const proPrice = await createPrice({
        productId: proProduct.id,
        amount: 2000, // $20.00 in cents
        currency: "usd",
        interval: "month",
        metadata: {
          tier: "pro",
          tierSlug: "pro",
        },
      })

      // Update database
      await db
        .update(membershipTiers)
        .set({
          stripePriceId: proPrice.id,
          updatedAt: new Date(),
        })
        .where(eq(membershipTiers.id, proTier.id))

      results.pro = {
        productId: proProduct.id,
        priceId: proPrice.id,
        status: "created",
      }
    } catch (error) {
      results.pro = {
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // Setup Pro+ tier
    try {
      // Check if Pro+ tier exists
      let proPlusTier = await db.query.membershipTiers.findFirst({
        where: eq(membershipTiers.slug, "pro-plus"),
      })

      if (!proPlusTier) {
        // Create Pro+ tier first
        const [newProPlusTier] = await db
          .insert(membershipTiers)
          .values({
            name: "Pro+",
            slug: "pro-plus",
            level: "pro_plus",
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
            billingPeriod: "monthly",
            dmAccessEnabled: true,
            isActive: true,
            sortOrder: 3,
          })
          .returning()
        proPlusTier = newProPlusTier
      }

      // Create Stripe product and price for Pro+
      const proPlusProduct = await createProduct({
        name: "Soulworx Pro+ Membership",
        description: "Everything in Pro plus personalized programs, video review, and private Discord channel",
        metadata: {
          tier: "pro_plus",
          tierSlug: "pro-plus",
        },
      })

      const proPlusPrice = await createPrice({
        productId: proPlusProduct.id,
        amount: 2500, // $25.00 in cents
        currency: "usd",
        interval: "month",
        metadata: {
          tier: "pro_plus",
          tierSlug: "pro-plus",
        },
      })

      // Update database
      await db
        .update(membershipTiers)
        .set({
          stripePriceId: proPlusPrice.id,
          updatedAt: new Date(),
        })
        .where(eq(membershipTiers.id, proPlusTier.id))

      results.proPlus = {
        productId: proPlusProduct.id,
        priceId: proPlusPrice.id,
        status: "created",
      }
    } catch (error) {
      results.proPlus = {
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    return NextResponse.json({
      success: true,
      message: "Stripe prices setup completed",
      results,
    })
  } catch (error) {
    console.error("Error setting up Stripe prices:", error)
    return NextResponse.json(
      {
        error: "Failed to setup Stripe prices",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
