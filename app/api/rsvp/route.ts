import { auth } from "@/auth"
import { createRsvp, getEventById, getEventRsvpStats, getUserById, cancelRsvp } from "@/lib/db/queries"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { rsvps } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify user exists in database
    const user = await getUserById(session.user.id)
    if (!user) {
      console.error("User not found in database:", {
        sessionUserId: session.user.id,
        sessionUserEmail: session.user.email,
      })
      return NextResponse.json(
        { error: "User not found. Please sign out and sign in again." },
        { status: 404 }
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
      dietaryRestrictions: dietaryRestrictions?.trim() || undefined,
      specialNeeds: specialNeeds?.trim() || undefined,
      parentEmail: parentEmail?.trim() || undefined,
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

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rsvpId } = body

    // Validate required fields
    if (!rsvpId) {
      return NextResponse.json(
        { error: "RSVP ID is required" },
        { status: 400 }
      )
    }

    // Verify the RSVP belongs to the current user
    const existingRsvp = await db.query.rsvps.findFirst({
      where: eq(rsvps.id, rsvpId),
    })

    if (!existingRsvp) {
      return NextResponse.json(
        { error: "RSVP not found" },
        { status: 404 }
      )
    }

    if (existingRsvp.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only cancel your own RSVPs" },
        { status: 403 }
      )
    }

    // Cancel the RSVP
    const cancelled = await cancelRsvp(rsvpId)

    return NextResponse.json({ 
      success: true, 
      rsvp: cancelled[0] 
    })
  } catch (error: unknown) {
    console.error("RSVP cancellation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel RSVP" },
      { status: 500 }
    )
  }
}

