import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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

    // Check if slug is taken by another story
    const existing = await db.query.posts.findFirst({
      where: (posts, { eq, and, not }) =>
        and(eq(posts.slug, slug), not(eq(posts.id, id))),
    })

    if (existing) {
      return NextResponse.json(
        { message: "A story with this slug already exists" },
        { status: 400 }
      )
    }

    // Get current story to check if status changed to published
    const currentStory = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    })

    const now = new Date()
    const publishedAt =
      status === "published" && currentStory?.status !== "published"
        ? now
        : currentStory?.publishedAt

    const [story] = await db
      .update(posts)
      .set({
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
        publishedAt,
        updatedAt: now,
      })
      .where(eq(posts.id, id))
      .returning()

    return NextResponse.json(story)
  } catch (error) {
    console.error("Error updating story:", error)
    return NextResponse.json(
      { message: "Failed to update story" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await db.delete(posts).where(eq(posts.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting story:", error)
    return NextResponse.json(
      { message: "Failed to delete story" },
      { status: 500 }
    )
  }
}

