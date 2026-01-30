import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getUserTier } from "@/lib/db/queries"
import { createCalendarEvent, checkAvailability } from "@/lib/google-calendar"
import { db } from "@/lib/db"
import { coachCalls, users } from "@/lib/db/schema"
import { eq, and, gte, lte } from "drizzle-orm"

/**
 * POST /api/coach-calls/book
 * Book a coach call
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { scheduledAt, duration = 60 } = body

    if (!scheduledAt) {
      return NextResponse.json(
        { error: "scheduledAt is required" },
        { status: 400 }
      )
    }

    const scheduledDate = new Date(scheduledAt)
    const endDate = new Date(scheduledDate.getTime() + duration * 60 * 1000)

    // Validate time is between 12pm-5pm
    const hour = scheduledDate.getHours()
    if (hour < 12 || hour >= 18) {
      return NextResponse.json(
        { error: "Coach calls are only available between 12pm-5pm" },
        { status: 400 }
      )
    }

    // Check if date is already booked (one appointment per day)
    // Check by date (not exact time) since only one appointment per day
    const startOfDay = new Date(scheduledDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(scheduledDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingCalls = await db
      .select()
      .from(coachCalls)
      .where(
        and(
          gte(coachCalls.scheduledAt, startOfDay),
          lte(coachCalls.scheduledAt, endOfDay),
          eq(coachCalls.status, "scheduled")
        )
      )

    const existingCall = existingCalls.length > 0 ? existingCalls[0] : null

    if (existingCall) {
      return NextResponse.json(
        { error: "This date is already booked" },
        { status: 409 }
      )
    }

    // Check Google Calendar availability
    try {
      const isAvailable = await checkAvailability(scheduledDate)
      if (!isAvailable) {
        return NextResponse.json(
          { error: "This date is already booked in calendar" },
          { status: 409 }
        )
      }
    } catch (error) {
      console.error("Error checking Google Calendar:", error)
      // Continue if Google Calendar is not configured
    }

    // Get user email for calendar invite
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    })

    // Create Google Calendar event with Meet link
    let calendarEventId: string | null = null
    let meetLink: string | null = null

    try {
      const calendarResult = await createCalendarEvent({
        summary: "Coach Call - Soulworx",
        description: `Coach call with ${user?.name || user?.email || "User"}`,
        startTime: scheduledDate,
        endTime: endDate,
        attendeeEmail: user?.email || undefined,
        attendeeName: user?.name || undefined,
      })

      calendarEventId = calendarResult.eventId
      meetLink = calendarResult.meetLink
    } catch (error) {
      console.error("Error creating calendar event:", error)
      // Continue without calendar event if Google Calendar is not configured
      // This allows the booking to work even without Google Calendar setup
    }

    // Create coach call record
    const [coachCall] = await db
      .insert(coachCalls)
      .values({
        userId: session.user.id,
        scheduledAt: scheduledDate,
        duration,
        status: "scheduled",
        googleMeetLink: meetLink,
        meetingId: calendarEventId,
        questionnaireCompleted: false,
        videoUploaded: false,
      })
      .returning()

    return NextResponse.json({
      success: true,
      coachCall: {
        id: coachCall.id,
        scheduledAt: coachCall.scheduledAt,
        duration: coachCall.duration,
        googleMeetLink: coachCall.googleMeetLink,
      },
    })
  } catch (error) {
    console.error("Error booking coach call:", error)
    return NextResponse.json(
      { error: "Failed to book coach call" },
      { status: 500 }
    )
  }
}
