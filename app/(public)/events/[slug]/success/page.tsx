import { getTicketedEventBySlug } from "@/lib/db/queries"
import { db } from "@/lib/db"
import { eventTickets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import QRCode from "qrcode"

export const dynamic = "force-dynamic"

type TicketRecord = {
  id: string
  qrCodeData: string
  purchaserName: string | null
  purchaserEmail: string
  amountPaidCents: number
}

async function getTicketForSuccess(
  session_id: string,
  eventId: string
): Promise<TicketRecord | null> {
  if (session_id.startsWith("free_")) {
    const ticketId = session_id.slice(5)
    const t = await db.query.eventTickets.findFirst({
      where: eq(eventTickets.id, ticketId),
      columns: {
        id: true,
        ticketedEventId: true,
        qrCodeData: true,
        purchaserName: true,
        purchaserEmail: true,
        amountPaidCents: true,
      },
    })
    if (!t || t.ticketedEventId !== eventId) return null
    const { ticketedEventId: _, ...rest } = t
    return rest
  }
  const tickets = await db.query.eventTickets.findMany({
    where: eq(eventTickets.stripeSessionId, session_id),
    columns: {
      id: true,
      ticketedEventId: true,
      qrCodeData: true,
      purchaserName: true,
      purchaserEmail: true,
      amountPaidCents: true,
    },
  })
  const t = tickets[0]
  if (!t || t.ticketedEventId !== eventId) return null
  const { ticketedEventId: __, ...rest } = t
  return rest
}

export default async function EventTicketSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { slug } = await params
  const { session_id } = await searchParams
  const event = await getTicketedEventBySlug(slug)
  if (!event) notFound()

  let ticket: TicketRecord | null = null
  let qrDataUrl: string | null = null
  if (session_id) {
    const t = await getTicketForSuccess(session_id, event.id)
    if (t) {
      ticket = t
      try {
        qrDataUrl = await QRCode.toDataURL(t.qrCodeData, {
          width: 280,
          margin: 2,
          color: { dark: "#191512", light: "#ffffff" },
        })
      } catch {
        // non-fatal
      }
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[rgb(25,21,18)] flex flex-col">
      {/* Safe area: clear fixed nav; scrollable content */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-[calc(5rem+env(safe-area-inset-top))] pb-8 sm:pb-12 overflow-y-auto">
        <div className="max-w-md w-full flex flex-col gap-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-crimson font-normal text-white mb-1">
              You&apos;re in!
            </h1>
            <p className="text-white/70 text-sm sm:text-base">
              Your ticket for <strong>{event.title}</strong> has been sent to your email.
            </p>
          </div>

          {/* Ticket card: QR + details */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
              {/* QR code - prominent, scannable */}
              {qrDataUrl && (
                <div className="flex-shrink-0 rounded-xl bg-white p-3 sm:p-4 border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="Ticket QR code — show at the door"
                    className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
                    width={200}
                    height={200}
                  />
                </div>
              )}
              {/* Details */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-3 sm:space-y-4">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Event</p>
                  <p className="text-white font-medium">{event.title}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Date & time</p>
                  <p className="text-white/90 text-sm sm:text-base">
                    {event.dateLabel}
                    {event.doorsOpenAt && (
                      <span className="block sm:inline sm:ml-1">
                        · Doors {event.doorsOpenAt}
                        {event.performanceAt && ` · Show ${event.performanceAt}`}
                      </span>
                    )}
                  </p>
                </div>
                {event.venueAddress && (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Venue</p>
                    <p className="text-white/80 text-sm sm:text-base">{event.venueAddress}</p>
                  </div>
                )}
                {ticket && (
                  <>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Ticket holder</p>
                      <p className="text-white/90 text-sm sm:text-base">
                        {ticket.purchaserName || ticket.purchaserEmail}
                      </p>
                    </div>
                    {ticket.amountPaidCents > 0 && (
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Amount paid</p>
                        <p className="text-white/90 text-sm sm:text-base">
                          ${(ticket.amountPaidCents / 100).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {!qrDataUrl && (
              <p className="text-white/50 text-xs text-center px-4 pb-4">
                Show your confirmation email at the door.
              </p>
            )}
          </div>

          <Link
            href="/events"
            className="inline-block text-center px-6 py-3 bg-white text-[rgb(25,21,18)] font-semibold rounded-lg hover:bg-white/90 transition w-full sm:w-auto"
          >
            Back to events
          </Link>
        </div>
      </div>
    </div>
  )
}
