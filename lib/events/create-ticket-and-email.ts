/**
 * Create event ticket record, generate image, send email. Used for both paid (webhook) and free (100% coupon) flows.
 */
import { db } from "@/lib/db"
import { eventTickets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getTicketedEventById } from "@/lib/db/queries"
import { generateTicketImageAndUpload } from "./generate-ticket"
import { sendEventTicketEmail } from "./send-ticket-email"

export async function createTicketAndSendEmail({
  ticketedEventId,
  purchaserEmail,
  purchaserName,
  amountPaidCents,
  stripeSessionId,
  couponId,
}: {
  ticketedEventId: string
  purchaserEmail: string
  purchaserName?: string | null
  amountPaidCents: number
  stripeSessionId: string | null
  couponId?: string | null
}) {
  const event = await getTicketedEventById(ticketedEventId)
  if (!event) throw new Error("Event not found")

  const ticketId = crypto.randomUUID()
  const now = new Date()
  const [ticket] = await db
    .insert(eventTickets)
    .values({
      id: ticketId,
      ticketedEventId,
      purchaserEmail,
      purchaserName: purchaserName ?? null,
      amountPaidCents,
      stripeSessionId,
      qrCodeData: ticketId,
      ticketImageUrl: null,
      couponId: couponId ?? null,
      createdAt: now,
    })
    .returning()

  let ticketImageUrl: string | null = null
  try {
    ticketImageUrl = await generateTicketImageAndUpload(ticket!, event)
    await db
      .update(eventTickets)
      .set({ ticketImageUrl })
      .where(eq(eventTickets.id, ticketId))
  } catch (imgError) {
    console.error("Ticket image generation/upload failed (ticket was created):", imgError)
  }

  try {
    await sendEventTicketEmail({
      to: purchaserEmail,
      eventTitle: event.title,
      dateLabel: event.dateLabel,
      venueAddress: event.venueAddress,
      purchaserName: purchaserName ?? undefined,
      amountPaid: amountPaidCents === 0 ? "Free (coupon)" : `$${(amountPaidCents / 100).toFixed(2)} CAD`,
      ticketImageUrl: ticketImageUrl ?? "",
    })
  } catch (emailError) {
    console.error("Failed to send ticket email (ticket was created):", emailError)
  }

  return ticket!
}
