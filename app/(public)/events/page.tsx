import { getTicketedEvents } from "@/lib/db/queries"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await getTicketedEvents()

  return (
    <div className="min-h-screen bg-[rgb(25,21,18)]">
      {/* Hero - event poster image */}
      <section className="relative min-h-[35vh] md:min-h-[40vh] overflow-hidden">
        <Image
          src="/event-poetry-1.png"
          alt="Events"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(25,21,18)] via-[rgb(25,21,18)]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-6 md:pb-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-white/80 mb-1 md:mb-2 text-xs md:text-sm font-semibold uppercase tracking-wider">
              SOULWORX PRESENTS
            </p>
            <h1 className="text-3xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-2 md:mb-4">
              Events & Tickets
            </h1>
            <p className="text-base md:text-xl text-white/80 max-w-2xl">
              Live poetry nights, performances, and community gatherings. Pick your price and join us.
            </p>
          </div>
        </div>
      </section>

      {/* Events list - ticket-style cards */}
      <section className="relative z-0 py-8 md:py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <p className="text-white/60 text-base md:text-lg">No upcoming ticketed events right now. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-5 md:space-y-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="block rounded-3xl border-2 border-dashed border-amber-400/40 bg-[rgb(25,21,18)]/90 p-5 md:p-8 transition-all hover:border-amber-400/70 hover:shadow-[0_0_24px_rgba(251,191,36,0.15)] focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[rgb(25,21,18)]"
                >
                  {/* Ticket perforation line */}
                  <div className="border-t border-dashed border-white/20 my-4 md:my-5" />
                  <p className="text-amber-400/90 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] mb-1 md:mb-2">
                    SOULWORX PRESENTS
                  </p>
                  <h2 className="text-2xl md:text-4xl font-crimson font-normal text-white mb-1 md:mb-2">
                    {event.title}
                  </h2>
                  <p className="text-white/70 text-sm md:text-base mb-3 md:mb-4">{event.dateLabel}</p>
                  <p className="text-white/50 text-xs md:text-sm">{event.venueAddress}</p>
                  <div className="border-t border-dashed border-white/20 mt-4 md:mt-5 pt-4 md:pt-5">
                    <p className="text-amber-400/80 text-sm font-medium">
                      From ${(event.minPriceCents / 100).toFixed(0)} — pick your price
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
