import { getTicketedEvents } from "@/lib/db/queries"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await getTicketedEvents()

  return (
    <div className="min-h-screen bg-[rgb(25,21,18)]">
      {/* Hero - same as event id page: events.jpg with gradient */}
      <section className="relative min-h-[28vh] sm:min-h-[35vh] md:min-h-[40vh] overflow-hidden">
        <Image
          src="/optimized/events.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(25,21,18)] via-[rgb(25,21,18)]/75 to-transparent" />
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

      {/* Events list */}
      <section className="relative z-0 py-8 md:py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <p className="text-white/60 text-base md:text-lg">No upcoming ticketed events right now. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="flex flex-col sm:flex-row rounded-2xl overflow-hidden border border-white/10 bg-white/[0.06] transition-all hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[rgb(25,21,18)]"
                >
                  {/* Portrait image slot - poster fills nicely in landscape card */}
                  <div className="relative w-full sm:w-[38%] sm:min-w-[180px] aspect-[3/4] bg-[rgb(25,21,18)] shrink-0">
                    <Image
                      src="/event-poetry-1.png"
                      alt={event.title}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 640px) 100vw, 42vw"
                    />
                  </div>
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                    <p className="text-white/50 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1 md:mb-2">
                      SOULWORX PRESENTS
                    </p>
                    <h2 className="text-2xl md:text-3xl font-crimson font-normal text-white mb-1 md:mb-2">
                      {event.title}
                    </h2>
                    <p className="text-white/70 text-sm md:text-base mb-2 md:mb-3">{event.dateLabel}</p>
                    <p className="text-white/50 text-xs md:text-sm">{event.venueAddress}</p>
                    <p className="text-white/60 text-sm font-medium mt-4 pt-4 border-t border-white/10">
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
