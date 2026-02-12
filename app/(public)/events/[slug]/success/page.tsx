import { getTicketedEventBySlug } from "@/lib/db/queries"
import { db } from "@/lib/db"
import { eventTickets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

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

  let ticketImageUrl: string | null = null
  if (session_id) {
    if (session_id.startsWith("free_")) {
      const ticketId = session_id.slice(5)
      const t = await db.query.eventTickets.findFirst({
        where: eq(eventTickets.id, ticketId),
      })
      if (t?.ticketImageUrl) ticketImageUrl = t.ticketImageUrl
    } else {
      const tickets = await db.query.eventTickets.findMany({
        where: eq(eventTickets.stripeSessionId, session_id),
      })
      const t = tickets[0]
      if (t?.ticketImageUrl) ticketImageUrl = t.ticketImageUrl
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(25,21,18)] py-16 px-6">
      <div className="max-w-xl mx-auto text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8">
          <h1 className="text-3xl font-crimson font-normal text-white mb-2">
            You&apos;re in!
          </h1>
          <p className="text-white/70 mb-6">
            Your ticket for <strong>{event.title}</strong> has been sent to your email.
          </p>
          {ticketImageUrl && (
            <div className="mb-6">
              <img
                src={ticketImageUrl}
                alt="Your ticket"
                className="w-full rounded-xl border border-white/10"
              />
            </div>
          )}
          <Link
            href="/events"
            className="inline-block px-6 py-3 bg-white text-[rgb(25,21,18)] font-semibold rounded-lg hover:bg-white/90 transition"
          >
            Back to events
          </Link>
        </div>
      </div>
    </div>
  )
}
