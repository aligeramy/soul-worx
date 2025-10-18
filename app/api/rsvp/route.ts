import { auth } from "@/auth"
import { createRsvp, getEventById, getEventRsvpStats } from "@/lib/db/queries"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      eventId,
      guestCount,
      dietaryRestrictions,
      specialNeeds,
      parentEmail,
      parentConsent,
      calendarSync,
    } = body

    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    // Get event and check capacity
    const event = await getEventById(eventId)
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Check if event is full
    if (event.capacity) {
      const stats = await getEventRsvpStats(eventId)
      const totalNeeded = 1 + (guestCount || 0)
      
      if (stats.spotsAvailable !== null && stats.spotsAvailable < totalNeeded) {
        return NextResponse.json(
          { error: "Not enough spots available for your group" },
          { status: 400 }
        )
      }
    }

    // Create RSVP
    const rsvp = await createRsvp({
      eventId,
      userId: session.user.id,
      guestCount: guestCount || 0,
      dietaryRestrictions: dietaryRestrictions || null,
      specialNeeds: specialNeeds || null,
      parentEmail: parentEmail || null,
      parentConsent: parentConsent || false,
      calendarSyncEnabled: calendarSync !== false,
      status: "confirmed",
    })

    return NextResponse.json({ 
      success: true, 
      rsvp: rsvp[0] 
    })
  } catch (error: unknown) {
    console.error("RSVP creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create RSVP" },
      { status: 500 }
    )
  }
}

