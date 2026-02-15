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

  // Overlay nav (TopBar h-12 + Navigation h-20) — push content down so nothing sits under the menu
  return (
    <div className="min-h-[100dvh] bg-[rgb(25,21,18)] flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-32 sm:pt-36 pb-8 sm:pb-12 overflow-y-auto">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* Order confirmed header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 border border-white/20 mb-4 sm:mb-5">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-crimson font-normal text-white mb-2">
              Order confirmed
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-md mx-auto">
              Show the QR code below at the door for <strong className="text-white">{event.title}</strong>.
            </p>
          </div>

          {/* Ticket / order details card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start">
                {/* QR code - large and scannable */}
                {qrDataUrl && (
                  <div className="flex-shrink-0 rounded-2xl bg-white p-4 sm:p-5 border border-white/20 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="Ticket QR code — show at the door"
                      className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px]"
                      width={240}
                      height={240}
                    />
                  </div>
                )}

                {/* Details list - plenty of space */}
                <div className="flex-1 min-w-0 w-full space-y-5 sm:space-y-6">
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Event</p>
                    <p className="text-white text-lg sm:text-xl font-medium">{event.title}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Date & time</p>
                    <p className="text-white/90 text-base sm:text-lg">
                      {event.dateLabel}
                    </p>
                    {(event.doorsOpenAt || event.performanceAt) && (
                      <p className="text-white/80 text-sm sm:text-base mt-1">
                        {event.doorsOpenAt && <>Doors {event.doorsOpenAt}</>}
                        {event.doorsOpenAt && event.performanceAt && " · "}
                        {event.performanceAt && <>Show {event.performanceAt}</>}
                      </p>
                    )}
                  </div>
                  {event.venueAddress && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Venue</p>
                      <p className="text-white/90 text-base sm:text-lg">{event.venueAddress}</p>
                    </div>
                  )}
                  {ticket && (
                    <>
                      <div>
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Ticket holder</p>
                        <p className="text-white/90 text-base sm:text-lg">
                          {ticket.purchaserName || ticket.purchaserEmail}
                        </p>
                      </div>
                      {ticket.amountPaidCents > 0 && (
                        <div>
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Amount paid</p>
                          <p className="text-white text-base sm:text-lg font-medium">
                            ${(ticket.amountPaidCents / 100).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!qrDataUrl && (
                <p className="text-white/50 text-sm text-center mt-6 pt-6 border-t border-white/10">
                  Show your confirmation email at the door.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[rgb(25,21,18)] font-semibold rounded-lg hover:bg-white/90 transition text-base"
            >
              Back to events
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition text-base"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
