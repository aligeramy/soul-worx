import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = db.query.products.findMany({
      where: eq(products.status, "active"),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    })

    if (category && category !== "all") {
      query = db.query.products.findMany({
        where: (products, { and, eq }) => and(
          eq(products.status, "active"),
          eq(products.category, category as "apparel" | "accessories" | "books" | "digital" | "other")
        ),
        orderBy: (products, { desc }) => [desc(products.createdAt)],
      })
    }

    const data = await query
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      category,
      price,
      compareAtPrice,
      images,
      stock,
      sku,
      trackInventory,
      status,
      tags,
      specifications,
      variants,
    } = body

    const [product] = await db.insert(products).values({
      name,
      slug,
      description,
      category,
      price,
      compareAtPrice,
      images: images || [],
      stock: stock || 0,
      sku,
      trackInventory: trackInventory !== undefined ? trackInventory : true,
      status: status || "draft",
      tags: tags || [],
      specifications: specifications || {},
      variants: variants || [],
      createdBy: session.user.id!,
    }).returning()

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

