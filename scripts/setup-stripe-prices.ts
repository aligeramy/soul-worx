/**
 * Setup Stripe Prices for Membership Tiers
 * 
 * This script:
 * 1. Creates Stripe products for Pro and Pro+ tiers
 * 2. Creates Stripe prices ($20/month for Pro, $25/month for Pro+)
 * 3. Updates the database with the Stripe price IDs
 */

import "dotenv/config"
import { createProduct, createPrice } from "@/lib/stripe"
import { db } from "@/lib/db"
import { membershipTiers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

async function setupStripePrices() {
  console.log("🚀 Setting up Stripe prices for membership tiers...\n")

  try {
    // Create Pro Product and Price
    console.log("Creating Pro tier product and price...")
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

    console.log(`✅ Pro Product: ${proProduct.id}`)
    console.log(`✅ Pro Price: ${proPrice.id}\n`)

    // Create Pro+ Product and Price
    console.log("Creating Pro+ tier product and price...")
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

    console.log(`✅ Pro+ Product: ${proPlusProduct.id}`)
    console.log(`✅ Pro+ Price: ${proPlusPrice.id}\n`)

    // Update database with Stripe price IDs
    console.log("Updating database with Stripe price IDs...")

    // Update Pro tier
    const proTier = await db.query.membershipTiers.findFirst({
      where: eq(membershipTiers.slug, "pro"),
    })

    if (proTier) {
      await db
        .update(membershipTiers)
        .set({
          stripePriceId: proPrice.id,
          updatedAt: new Date(),
        })
        .where(eq(membershipTiers.id, proTier.id))
      console.log(`✅ Updated Pro tier with Stripe price ID: ${proPrice.id}`)
    } else {
      console.log("⚠️  Pro tier not found in database. Creating it...")
      await db.insert(membershipTiers).values({
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
        stripePriceId: proPrice.id,
        isActive: true,
        sortOrder: 2,
      })
      console.log(`✅ Created Pro tier with Stripe price ID: ${proPrice.id}`)
    }

    // Update Pro+ tier
    const proPlusTier = await db.query.membershipTiers.findFirst({
      where: eq(membershipTiers.slug, "pro-plus"),
    })

    if (proPlusTier) {
      await db
        .update(membershipTiers)
        .set({
          stripePriceId: proPlusPrice.id,
          updatedAt: new Date(),
        })
        .where(eq(membershipTiers.id, proPlusTier.id))
      console.log(`✅ Updated Pro+ tier with Stripe price ID: ${proPlusPrice.id}`)
    } else {
      console.log("⚠️  Pro+ tier not found in database. Creating it...")
      await db.insert(membershipTiers).values({
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
        stripePriceId: proPlusPrice.id,
        dmAccessEnabled: true,
        isActive: true,
        sortOrder: 3,
      })
      console.log(`✅ Created Pro+ tier with Stripe price ID: ${proPlusPrice.id}`)
    }

    console.log("\n🎉 Stripe prices setup complete!")
    console.log("\nSummary:")
    console.log(`- Pro: $20/month - Price ID: ${proPrice.id}`)
    console.log(`- Pro+: $25/month - Price ID: ${proPlusPrice.id}`)
  } catch (error) {
    console.error("❌ Error setting up Stripe prices:", error)
    throw error
  }
}

// Run the script
setupStripePrices()
  .then(() => {
    console.log("\n✅ Setup completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Setup failed:", error)
    process.exit(1)
  })
