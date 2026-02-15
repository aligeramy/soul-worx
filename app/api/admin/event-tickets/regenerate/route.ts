import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { eventTickets } from "@/lib/db/schema"
import { eq, and, isNull } from "drizzle-orm"
import { getTicketedEventById } from "@/lib/db/queries"
import { generateTicketImageAndUpload } from "@/lib/events/generate-ticket"

/**
 * POST /api/admin/event-tickets/regenerate
 * Regenerate ticket image(s) that are stuck "Processing…" (missing ticketImageUrl).
 * Body: { ticketId?: string, eventId?: string }
 * - ticketId: regenerate one ticket
 * - eventId: regenerate all tickets for that event that have no image
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { ticketId, eventId } = body as { ticketId?: string; eventId?: string }

    if (!ticketId && !eventId) {
      return NextResponse.json(
        { error: "Provide ticketId or eventId" },
        { status: 400 }
      )
    }

    const toRegenerate: { ticket: typeof eventTickets.$inferSelect; event: Awaited<ReturnType<typeof getTicketedEventById>> }[] = []

    if (ticketId) {
      const ticket = await db.query.eventTickets.findFirst({
        where: eq(eventTickets.id, ticketId),
        with: { ticketedEvent: true },
      })
      if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
      }
      if (!ticket.ticketedEvent) {
        return NextResponse.json({ error: "Event not found for ticket" }, { status: 404 })
      }
      const event = await getTicketedEventById(ticket.ticketedEvent.id)
      if (!event) {
        return NextResponse.json({ error: "Event not found for ticket" }, { status: 404 })
      }
      toRegenerate.push({ ticket, event })
    } else if (eventId) {
      const event = await getTicketedEventById(eventId)
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
      const missing = await db.query.eventTickets.findMany({
        where: and(
          eq(eventTickets.ticketedEventId, eventId),
          isNull(eventTickets.ticketImageUrl)
        ),
      })
      for (const ticket of missing) {
        toRegenerate.push({ ticket, event })
      }
    }

    const errors: string[] = []
    let regenerated = 0

    for (const { ticket, event } of toRegenerate) {
      try {
        const ticketImageUrl = await generateTicketImageAndUpload(ticket, event)
        await db
          .update(eventTickets)
          .set({ ticketImageUrl })
          .where(eq(eventTickets.id, ticket.id))
        regenerated++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        errors.push(`${ticket.id}: ${msg}`)
        console.error("Regenerate ticket image failed:", ticket.id, err)
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      regenerated,
      errors: errors.length ? errors : undefined,
    })
  } catch (error) {
    console.error("Regenerate ticket images error:", error)
    return NextResponse.json(
      {
        error: "Failed to regenerate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
