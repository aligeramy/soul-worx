import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getUserTier } from "@/lib/db/queries"
import { listBookedDates } from "@/lib/google-calendar"
import { db } from "@/lib/db"
import { coachCalls } from "@/lib/db/schema"
import { eq, gte, and, sql } from "drizzle-orm"

/**
 * GET /api/coach-calls/availability
 * Get available dates and time slots for coach calls
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is Pro+
    const tier = await getUserTier(session.user.id)
    if (tier !== "pro_plus") {
      return NextResponse.json(
        { error: "Coach calls are only available for Pro+ members" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date().toISOString()
    const endDate = searchParams.get("endDate") || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

    // Get booked dates from database
    const bookedCalls = await db
      .select()
      .from(coachCalls)
      .where(
        and(
          gte(coachCalls.scheduledAt, new Date(startDate)),
          eq(coachCalls.status, "scheduled")
        )
      )

    // Extract unique booked dates (one per day)
    const bookedDates = new Set(
      bookedCalls.map((call) => {
        const date = new Date(call.scheduledAt)
        date.setHours(0, 0, 0, 0)
        return date.toISOString().split("T")[0]
      })
    )

    // Also check Google Calendar if configured
    let googleBookedDates: Date[] = []
    try {
      googleBookedDates = await listBookedDates(new Date(startDate), new Date(endDate))
    } catch (error) {
      console.error("Error checking Google Calendar:", error)
      // Continue without Google Calendar check if not configured
    }

    // Merge booked dates
    googleBookedDates.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0]
      bookedDates.add(dateStr)
    })

    // Generate available time slots (12pm-5pm, hourly)
    const timeSlots = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

    return NextResponse.json({
      bookedDates: Array.from(bookedDates),
      timeSlots,
      availableHours: timeSlots,
    })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}
