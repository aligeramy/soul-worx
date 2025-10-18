import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
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
      description,
      longDescription,
      category,
      status,
      coverImage,
      images,
      videoUrl,
      duration,
      ageRange,
      capacity,
      price,
      registrationRequired,
      requiresParentConsent,
      tags,
      faqs,
      metaTitle,
      metaDescription,
    } = body

    // Check if slug is taken by another program
    const existing = await db.query.programs.findFirst({
      where: (programs, { eq, and, not }) =>
        and(eq(programs.slug, slug), not(eq(programs.id, id))),
    })

    if (existing) {
      return NextResponse.json(
        { message: "A program with this slug already exists" },
        { status: 400 }
      )
    }

    // Get current program to check if status changed to published
    const currentProgram = await db.query.programs.findFirst({
      where: (programs, { eq }) => eq(programs.id, id),
    })

    const now = new Date()
    const publishedAt =
      status === "published" && currentProgram?.status !== "published"
        ? now
        : currentProgram?.publishedAt

    const [program] = await db
      .update(programs)
      .set({
        title,
        slug,
        description,
        longDescription: longDescription || null,
        category,
        status,
        coverImage: coverImage || null,
        images: images || [],
        videoUrl: videoUrl || null,
        duration: duration || null,
        ageRange: ageRange || null,
        capacity: capacity || null,
        price: price || "0",
        registrationRequired: registrationRequired !== false,
        requiresParentConsent: requiresParentConsent || false,
        tags: tags || [],
        faqs: faqs || [],
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        publishedAt,
        updatedAt: now,
      })
      .where(eq(programs.id, id))
      .returning()

    return NextResponse.json(program)
  } catch (error) {
    console.error("Error updating program:", error)
    return NextResponse.json(
      { message: "Failed to update program" },
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
    await db.delete(programs).where(eq(programs.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting program:", error)
    return NextResponse.json(
      { message: "Failed to delete program" },
      { status: 500 }
    )
  }
}

