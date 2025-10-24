/**
 * Automatically create Stripe products and sync to database
 * Run: pnpm setup-stripe
 */

import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { membershipTiers } from "../../lib/db/schema"
import { eq } from "drizzle-orm"
import * as schema from "../../lib/db/schema"
import Stripe from "stripe"

async function setupStripeProducts() {
  console.log("🚀 Setting up Stripe products...\n")

  // Check Stripe key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY not found in .env")
    console.log("Add your Stripe secret key to .env:")
    console.log("STRIPE_SECRET_KEY=sk_test_...")
    process.exit(1)
  }

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
  })

  // Initialize database
  const connectionString = process.env.DATABASE_URL!
  const client = postgres(connectionString)
  const db = drizzle(client, { schema })

  try {
    // Get tiers from database
    const tiers = await db.query.membershipTiers.findMany()
    
    console.log(`Found ${tiers.length} tiers in database\n`)

    for (const tier of tiers) {
      const price = parseFloat(tier.price?.toString() || "0")
      
      // Skip free tier
      if (price === 0) {
        console.log(`⏭️  Skipping ${tier.name} (free tier)`)
        continue
      }

      console.log(`📦 Creating product for: ${tier.name} ($${price}/${tier.billingPeriod})`)

      // Check if product already exists
      if (tier.stripePriceId) {
        console.log(`   ✅ Already has Price ID: ${tier.stripePriceId}`)
        
        // Verify it exists in Stripe
        try {
          await stripe.prices.retrieve(tier.stripePriceId)
          console.log(`   ✓ Verified in Stripe\n`)
          continue
        } catch {
          console.log(`   ⚠️  Price ID not found in Stripe, creating new one...\n`)
        }
      }

      // Create Stripe product
      const product = await stripe.products.create({
        name: `${tier.name} - Soulworx Community`,
        description: tier.description,
        metadata: {
          tierId: tier.id,
          tierSlug: tier.slug,
          tierLevel: tier.level,
        },
      })

      console.log(`   ✓ Created product: ${product.id}`)

      // Create Stripe price
      const stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(price * 100), // Convert to cents
        currency: 'usd',
        recurring: {
          interval: tier.billingPeriod === 'yearly' ? 'year' : 'month',
        },
        metadata: {
          tierId: tier.id,
          tierSlug: tier.slug,
        },
      })

      console.log(`   ✓ Created price: ${stripePrice.id}`)

      // Update database with Price ID
      await db
        .update(membershipTiers)
        .set({ stripePriceId: stripePrice.id })
        .where(eq(membershipTiers.id, tier.id))

      console.log(`   ✓ Updated database with Price ID`)
      console.log(`   ✅ ${tier.name} setup complete!\n`)
    }

    console.log("✨ Stripe products setup complete!")
    console.log("\n📝 Next steps:")
    console.log("1. Go to https://dashboard.stripe.com/test/products")
    console.log("2. Verify your products are there")
    console.log("3. Test subscribing at /programs/community")
    console.log("\n🎉 You're ready to accept payments!")

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : String(error))
    console.error(error)
    await client.end()
    process.exit(1)
  }
}

setupStripeProducts()

