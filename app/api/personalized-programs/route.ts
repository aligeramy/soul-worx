import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { personalizedPrograms, programChecklistItems } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { eachDayOfInterval, format, parseISO } from "date-fns"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * OPTIONS /api/personalized-programs
 * Handle CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin")
  return handleOptions(origin)
}

/**
 * POST /api/personalized-programs
 * Create a new personalized program and generate checklist items
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin access
    if (session.user.role !== "admin" && session.user.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      userId,
      createdBy,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      trainingDays,
      startDate,
      endDate,
    } = body

    // Validation
    if (!userId || !title || !description || !trainingDays || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!Array.isArray(trainingDays) || trainingDays.length === 0) {
      return NextResponse.json(
        { error: "At least one training day is required" },
        { status: 400 }
      )
    }

    const start = parseISO(startDate)
    const end = parseISO(endDate)

    if (end <= start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      )
    }

    // Create program
    const [program] = await db
      .insert(personalizedPrograms)
      .values({
        userId,
        createdBy,
        title,
        description,
        videoUrl: videoUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        trainingDays,
        startDate: start,
        endDate: end,
        status: "active",
      })
      .returning()

    // Generate checklist items for all dates between start/end that match training days
    const allDates = eachDayOfInterval({ start, end })
    const checklistItems = allDates
      .filter((date) => {
        const dayName = format(date, "EEEE")
        return trainingDays.includes(dayName)
      })
      .map((date) => ({
        programId: program.id,
        dueDate: date,
        completed: false,
        daysLate: 0,
      }))

    // Insert all checklist items
    if (checklistItems.length > 0) {
      await db.insert(programChecklistItems).values(checklistItems)
    }

    return addCorsHeaders(
      NextResponse.json({
        success: true,
        program: {
          id: program.id,
          title: program.title,
          checklistItemsCount: checklistItems.length,
        },
      }),
      origin
    )
  } catch (error) {
    console.error("Error creating personalized program:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to create program" },
        { status: 500 }
      ),
      origin
    )
  }
}

/**
 * GET /api/personalized-programs?userId=xxx
 * Get personalized programs for a user
 */
export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin")
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions(origin)
  }
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Users can only see their own programs, admins can see any
    if (session.user.id !== userId && session.user.role !== "admin" && session.user.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const programs = await db.query.personalizedPrograms.findMany({
      where: eq(personalizedPrograms.userId, userId),
      orderBy: asc(personalizedPrograms.startDate),
      with: {
        checklistItems: true,
      },
    })

    return addCorsHeaders(
      NextResponse.json({ programs }),
      origin
    )
  } catch (error) {
    console.error("Error fetching personalized programs:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to fetch programs" },
        { status: 500 }
      ),
      origin
    )
  }
}
