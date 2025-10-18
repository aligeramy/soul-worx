import { getEventById } from "@/lib/db/queries"
import { NextResponse } from "next/server"
import ical from "ical-generator"
import { format } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")
    const type = searchParams.get("type") || "ics"

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    const event = await getEventById(eventId)
    
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Build location string
    let location = ""
    if (event.locationType === "in_person" || event.locationType === "hybrid") {
      const parts = [
        event.venueName,
        event.venueAddress,
        event.venueCity && event.venueState ? `${event.venueCity}, ${event.venueState}` : null,
        event.venueZip,
      ].filter(Boolean)
      location = parts.join(", ")
    } else if (event.locationType === "virtual") {
      location = event.virtualMeetingUrl || "Online Event"
    }

    // Build description
    let description = event.description || ""
    if (event.program) {
      description = `${event.program.title}\n\n${description}`
    }
    if (event.virtualMeetingUrl && event.locationType !== "in_person") {
      description += `\n\nJoin online: ${event.virtualMeetingUrl}`
    }

    // For Google Calendar
    if (type === "google") {
      const startTime = new Date(event.startTime)
      const endTime = new Date(event.endTime)
      
      const googleUrl = new URL("https://calendar.google.com/calendar/render")
      googleUrl.searchParams.append("action", "TEMPLATE")
      googleUrl.searchParams.append("text", event.title)
      googleUrl.searchParams.append("details", description)
      googleUrl.searchParams.append("location", location)
      googleUrl.searchParams.append(
        "dates",
        `${format(startTime, "yyyyMMdd'T'HHmmss")}/${format(endTime, "yyyyMMdd'T'HHmmss")}`
      )

      return NextResponse.json({ url: googleUrl.toString() })
    }

    // For ICS/Outlook
    const calendar = ical({ name: "Soulworx Events" })
    
    calendar.createEvent({
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      summary: event.title,
      description,
      location,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://soulworx.com"}/programs/${event.program?.slug}/events/${event.id}`,
      organizer: {
        name: "Soulworx",
        email: process.env.CALENDAR_EMAIL || "events@soulworx.com",
      },
    })

    const icsContent = calendar.toString()

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, "_")}.ics"`,
      },
    })
  } catch (error: unknown) {
    console.error("Calendar download error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate calendar file" },
      { status: 500 }
    )
  }
}

