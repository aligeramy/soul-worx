import { getTicketedEvents } from "@/lib/db/queries"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await getTicketedEvents()

  return (
    <div className="min-h-screen bg-[rgb(25,21,18)]">
      {/* Hero */}
      <section className="relative min-h-[40vh] overflow-hidden">
        <Image
          src="/optimized/events.jpg"
          alt="Events"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(25,21,18)] via-[rgb(25,21,18)]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-white/70 mb-2 text-sm font-semibold uppercase tracking-wider">
              SOULWORX PRESENTS
            </p>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Events & Tickets
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Live poetry nights, performances, and community gatherings. Pick your price and join us.
            </p>
          </div>
        </div>
      </section>

      {/* Events list */}
      <section className="relative z-0 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No upcoming ticketed events right now. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors"
                >
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                    SOULWORX PRESENTS
                  </p>
                  <h2 className="text-3xl md:text-4xl font-crimson font-normal text-white mb-2">
                    {event.title}
                  </h2>
                  <p className="text-white/70 mb-4">{event.dateLabel}</p>
                  <p className="text-white/50 text-sm">{event.venueAddress}</p>
                  <p className="text-white/60 mt-4 text-sm">
                    From ${(event.minPriceCents / 100).toFixed(0)} — pick your price
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
