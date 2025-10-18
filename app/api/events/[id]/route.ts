import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
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
      programId,
      title,
      description,
      status,
      startTime,
      endTime,
      timezone,
      locationType,
      venueName,
      venueAddress,
      venueCity,
      venueState,
      venueZip,
      venueCountry,
      latitude,
      longitude,
      virtualMeetingUrl,
      capacity,
      waitlistEnabled,
      notes,
    } = body

    const now = new Date()
    const [event] = await db
      .update(events)
      .set({
        programId,
        title,
        description: description || null,
        status,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        timezone,
        locationType,
        venueName: venueName || null,
        venueAddress: venueAddress || null,
        venueCity: venueCity || null,
        venueState: venueState || null,
        venueZip: venueZip || null,
        venueCountry: venueCountry || "USA",
        latitude: latitude || null,
        longitude: longitude || null,
        virtualMeetingUrl: virtualMeetingUrl || null,
        capacity: capacity || null,
        waitlistEnabled: waitlistEnabled || false,
        notes: notes || null,
        updatedAt: now,
      })
      .where(eq(events.id, id))
      .returning()

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      { message: "Failed to update event" },
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
    await db.delete(events).where(eq(events.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 }
    )
  }
}

