import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"

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

    // Check if slug already exists
    const existing = await db.query.programs.findFirst({
      where: (programs, { eq }) => eq(programs.slug, slug),
    })

    if (existing) {
      return NextResponse.json(
        { message: "A program with this slug already exists" },
        { status: 400 }
      )
    }

    const now = new Date()
    const [program] = await db
      .insert(programs)
      .values({
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
        createdBy: session.user.id!,
        publishedAt: status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return NextResponse.json(program)
  } catch (error) {
    console.error("Error creating program:", error)
    return NextResponse.json(
      { message: "Failed to create program" },
      { status: 500 }
    )
  }
}

