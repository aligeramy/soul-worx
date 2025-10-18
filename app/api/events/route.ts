import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      .insert(events)
      .values({
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
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { message: "Failed to create event" },
      { status: 500 }
    )
  }
}

