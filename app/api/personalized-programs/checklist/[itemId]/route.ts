import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { programChecklistItems, personalizedPrograms } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { differenceInDays } from "date-fns"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * OPTIONS /api/personalized-programs/checklist/[itemId]
 * Handle CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin")
  return handleOptions(origin)
}

/**
 * POST /api/personalized-programs/checklist/[itemId]
 * Check off a workout and submit ratings
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const origin = request.headers.get("origin")
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params
    const body = await request.json()
    const { enjoymentRating, difficultyRating } = body

    // Get checklist item
    const item = await db.query.programChecklistItems.findFirst({
      where: eq(programChecklistItems.id, itemId),
      with: {
        program: true,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 })
    }

    // Verify user owns this program
    if (item.program.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if already completed
    if (item.completed) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 })
    }

    // Calculate days late
    const dueDate = new Date(item.dueDate)
    const completedAt = new Date()
    const daysLate = Math.max(0, differenceInDays(completedAt, dueDate))

    // Update checklist item
    await db
      .update(programChecklistItems)
      .set({
        completed: true,
        completedAt,
        enjoymentRating: enjoymentRating || null,
        difficultyRating: difficultyRating || null,
        daysLate,
        updatedAt: new Date(),
      })
      .where(eq(programChecklistItems.id, itemId))

    return addCorsHeaders(
      NextResponse.json({ success: true }),
      origin
    )
  } catch (error) {
    console.error("Error checking off workout:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to check off workout" },
        { status: 500 }
      ),
      origin
    )
  }
}

/**
 * DELETE /api/personalized-programs/checklist/[itemId]
 * Uncheck a workout
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const origin = request.headers.get("origin")
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params

    // Get checklist item
    const item = await db.query.programChecklistItems.findFirst({
      where: eq(programChecklistItems.id, itemId),
      with: {
        program: true,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 })
    }

    // Verify user owns this program
    if (item.program.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Uncheck the item
    await db
      .update(programChecklistItems)
      .set({
        completed: false,
        completedAt: null,
        enjoymentRating: null,
        difficultyRating: null,
        daysLate: 0,
        updatedAt: new Date(),
      })
      .where(eq(programChecklistItems.id, itemId))

    return addCorsHeaders(
      NextResponse.json({ success: true }),
      origin
    )
  } catch (error) {
    console.error("Error unchecking workout:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to uncheck workout" },
        { status: 500 }
      ),
      origin
    )
  }
}
