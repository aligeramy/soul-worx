import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      metaTitle,
      metaDescription,
      ogImage,
    } = body

    // Check if slug already exists
    const existing = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.slug, slug),
    })

    if (existing) {
      return NextResponse.json(
        { message: "A story with this slug already exists" },
        { status: 400 }
      )
    }

    const now = new Date()
    const [story] = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        category,
        tags: tags || [],
        status,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        authorId: session.user.id!,
        publishedAt: status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return NextResponse.json(story)
  } catch (error) {
    console.error("Error creating story:", error)
    return NextResponse.json(
      { message: "Failed to create story" },
      { status: 500 }
    )
  }
}

