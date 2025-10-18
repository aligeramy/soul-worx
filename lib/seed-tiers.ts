import "dotenv/config"
import { db } from "../lib/db"
import { membershipTiers } from "../lib/db/schema"

async function seedTiers() {
  console.log("🌱 Seeding membership tiers...")

  try {
    await db.insert(membershipTiers).values([
      {
        name: "Free",
        slug: "free",
        level: "free",
        description: "Get started with first episodes",
        features: [
          "First episode of each channel",
          "Community access",
          "Basic support",
        ],
        accessLevel: 1,
        price: "0",
        billingPeriod: "monthly",
        stripePriceId: null,
        discordRoleId: null, // Replace with your Discord role ID
        dmAccessEnabled: false,
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Premium",
        slug: "premium",
        level: "premium",
        description: "Full access to all video content",
        features: [
          "All videos in all channels",
          "Early access to new content",
          "Priority support",
          "Discord community access",
          "HD streaming quality",
        ],
        accessLevel: 2,
        price: "9.99",
        billingPeriod: "monthly",
        stripePriceId: null, // Replace with your Stripe Price ID
        discordRoleId: null, // Replace with your Discord role ID
        dmAccessEnabled: false,
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "VIP",
        slug: "vip",
        level: "vip",
        description: "Everything + direct admin access",
        features: [
          "Everything in Premium",
          "Direct message access to admin",
          "1-on-1 mentorship opportunities",
          "Exclusive VIP channels",
          "Priority event access",
          "Monthly group calls",
        ],
        accessLevel: 3,
        price: "19.99",
        billingPeriod: "monthly",
        stripePriceId: null, // Replace with your Stripe Price ID
        discordRoleId: null, // Replace with your Discord role ID
        dmAccessEnabled: true,
        isActive: true,
        sortOrder: 3,
      },
    ])

    console.log("✅ Membership tiers seeded successfully!")
    console.log("\n⚠️  IMPORTANT: Update the following in your database:")
    console.log("   1. Add Stripe Price IDs to premium and vip tiers")
    console.log("   2. Add Discord Role IDs to all tiers")
    console.log("\nYou can do this via:")
    console.log("   - Database GUI (pnpm db:studio)")
    console.log("   - Or update this script with your IDs and run again")
  } catch (error) {
    console.error("❌ Error seeding tiers:", error)
    throw error
  }
}

seedTiers()
  .then(() => {
    console.log("\n🎉 Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Failed:", error)
    process.exit(1)
  })

