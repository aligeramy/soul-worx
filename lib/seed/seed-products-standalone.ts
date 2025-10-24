// Standalone script to seed only products
// Usage: tsx lib/seed-products-standalone.ts

import "dotenv/config"
import { db } from "../db/index"
import { products, users } from "../db/schema"

async function seedProducts() {
  console.log("🛍️  Seeding products...")

  // Check if products already exist
  const existingProducts = await db.query.products.findMany()
  if (existingProducts.length > 0) {
    console.log(`⚠️  Found ${existingProducts.length} existing products. Skipping seeding.`)
    console.log("If you want to re-seed, delete existing products first.")
    process.exit(0)
  }

  // Get or create a default admin user
  const adminEmail = "Indianarotondo@soulworx.ca"
  let adminUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, adminEmail)
  })

  if (!adminUser) {
    console.log("⚠️  No admin user found. Creating one...")
    const [newAdmin] = await db.insert(users).values({
      email: adminEmail,
      name: "Soulworx Admin",
      role: "admin",
      emailVerified: new Date(),
    }).returning()
    adminUser = newAdmin
    console.log("✅ Created admin user")
  }

  console.log(`Using user ID: ${adminUser.id}`)

  const productsData = [
    {
      name: "SoulWorx Original Tee",
      slug: "soulworx-original-tee",
      description: "Express yourself with our signature SoulWorx t-shirt. Soft, comfortable, and stylish.",
      category: "apparel" as const,
      status: "active" as const,
      price: "29.99",
      compareAtPrice: "39.99",
      images: ["/shop/placeholder.webp"],
      stock: 50,
      sku: "SW-TEE-001",
      trackInventory: true,
      tags: ["tshirt", "apparel", "signature"],
      specifications: {
        Material: "100% Cotton",
        Fit: "Regular",
        Care: "Machine wash cold",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
    {
      name: "Poetry Journal",
      slug: "poetry-journal",
      description: "A beautiful hardcover journal for capturing your thoughts and poetry. 200 pages of premium paper.",
      category: "accessories" as const,
      status: "active" as const,
      price: "24.99",
      images: ["/shop/placeholder.webp"],
      stock: 30,
      sku: "SW-JNL-001",
      trackInventory: true,
      tags: ["journal", "writing", "poetry"],
      specifications: {
        Pages: "200",
        Size: "6x9 inches",
        Cover: "Hardcover",
        Paper: "Premium acid-free",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
    {
      name: "SoulWorx Hoodie",
      slug: "soulworx-hoodie",
      description: "Stay warm and inspired with our premium pullover hoodie. Perfect for creative souls.",
      category: "apparel" as const,
      status: "active" as const,
      price: "54.99",
      compareAtPrice: "69.99",
      images: ["/shop/placeholder.webp"],
      stock: 25,
      sku: "SW-HOD-001",
      trackInventory: true,
      tags: ["hoodie", "apparel", "winter"],
      specifications: {
        Material: "80% Cotton, 20% Polyester",
        Fit: "Regular",
        Features: "Kangaroo pocket, drawstring hood",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
    {
      name: "Words That Walk Tote",
      slug: "words-that-walk-tote",
      description: "Carry your essentials in style with our eco-friendly canvas tote bag.",
      category: "accessories" as const,
      status: "active" as const,
      price: "19.99",
      images: ["/shop/placeholder.webp"],
      stock: 100,
      sku: "SW-TOT-001",
      trackInventory: true,
      tags: ["tote", "bag", "accessories"],
      specifications: {
        Material: "100% Organic Cotton Canvas",
        Size: "15x16 inches",
        Capacity: "Large",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
    {
      name: "Limited Edition Poetry Book",
      slug: "limited-edition-poetry-book",
      description: "A curated collection of poetry from SoulWorx community members. Limited edition, hardcover.",
      category: "books" as const,
      status: "active" as const,
      price: "34.99",
      images: ["/shop/placeholder.webp"],
      stock: 15,
      sku: "SW-BK-001",
      trackInventory: true,
      tags: ["book", "poetry", "limited edition"],
      specifications: {
        Pages: "150",
        Format: "Hardcover",
        ISBN: "978-1-234567-89-0",
        Edition: "Limited First Edition",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
    {
      name: "SoulWorx Sticker Pack",
      slug: "soulworx-sticker-pack",
      description: "Express yourself everywhere with our premium vinyl sticker pack. 10 unique designs.",
      category: "accessories" as const,
      status: "active" as const,
      price: "12.99",
      images: ["/shop/placeholder.webp"],
      stock: 200,
      sku: "SW-STK-001",
      trackInventory: true,
      tags: ["stickers", "accessories", "pack"],
      specifications: {
        Quantity: "10 stickers",
        Material: "Premium vinyl",
        Size: "Various (2-4 inches)",
        Finish: "Glossy, waterproof",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
    {
      name: "Virtual Workshop Pass",
      slug: "virtual-workshop-pass",
      description: "Get access to all virtual poetry workshops for one month. Learn from experienced poets.",
      category: "digital" as const,
      status: "active" as const,
      price: "49.99",
      images: ["/shop/placeholder.webp"],
      stock: 999,
      sku: "SW-DIG-001",
      trackInventory: false,
      tags: ["digital", "workshop", "education"],
      specifications: {
        Duration: "30 days",
        Access: "All virtual workshops",
        Includes: "Recordings and materials",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
    {
      name: "SoulWorx Baseball Cap",
      slug: "soulworx-baseball-cap",
      description: "Classic baseball cap with embroidered SoulWorx logo. Adjustable strap for perfect fit.",
      category: "apparel" as const,
      status: "active" as const,
      price: "24.99",
      images: ["/shop/placeholder.webp"],
      stock: 40,
      sku: "SW-CAP-001",
      trackInventory: true,
      tags: ["cap", "hat", "apparel"],
      specifications: {
        Material: "100% Cotton twill",
        Closure: "Adjustable strap",
        Logo: "Embroidered",
      } as {[key: string]: string},
      createdBy: adminUser.id,
    },
  ]

  try {
    console.log("Creating products...")
    const createdProducts = await db.insert(products).values(productsData).returning()
    console.log(`✅ Successfully seeded ${createdProducts.length} products`)
    
    console.log("\n🎉 Products seeded successfully!")
    console.log("\n📝 Products created:")
    createdProducts.forEach(p => {
      console.log(`   - ${p.name} ($${p.price}) - ${p.category}`)
    })
    console.log("\n📍 Next steps:")
    console.log("   1. Visit /shop to see your products")
    console.log("   2. Visit /dashboard/admin/shop to manage products")
  } catch (error) {
    console.error("❌ Error seeding products:", error)
    throw error
  }

  process.exit(0)
}

seedProducts().catch((error) => {
  console.error("❌ Seeding failed:", error)
  process.exit(1)
})

