import { getTicketedEventBySlug } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import Image from "next/image"
import { EventTicketForm } from "./event-ticket-form"

export const dynamic = "force-dynamic"

export default async function TicketedEventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getTicketedEventBySlug(slug)
  if (!event || event.status !== "scheduled") {
    notFound()
  }

  const minDollars = event.minPriceCents / 100

  return (
    <div className="min-h-screen bg-[rgb(25,21,18)]">
      {/* Hero - header background */}
      <section className="relative min-h-[28vh] sm:min-h-[35vh] md:min-h-[45vh] overflow-hidden">
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
          <div className="max-w-4xl mx-auto">
            <p className="text-white/80 mb-1 text-xs font-semibold uppercase tracking-wider">
              SOULWORX PRESENTS
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white">
              {event.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mt-1">{event.dateLabel}</p>
          </div>
        </div>
      </section>

      {/* Content: mobile = form first, then details. Desktop = details left, form right */}
      <section className="relative z-0 py-6 md:py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
          {/* Ticket form - first on mobile (order-1), right on lg (order-2) */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="rounded-2xl border-2 border-dashed border-amber-400/30 bg-white/5 p-5 md:p-8 shadow-[0_0_20px_rgba(251,191,36,0.08)]">
              <h2 className="text-xl md:text-2xl font-crimson font-normal text-white mb-1 md:mb-2">
                Get your ticket
              </h2>
              <p className="text-white/60 text-xs md:text-sm mb-4 md:mb-6">
                Pick your price. Minimum ${minDollars}. Pay what you can to support the arts.
              </p>
              <EventTicketForm
                eventId={event.id}
                eventSlug={event.slug}
                eventTitle={event.title}
                minPriceCents={event.minPriceCents}
              />
            </div>
          </div>

          {/* Event details - second on mobile (order-2), left on lg (order-1) */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-4 md:space-y-6">
            <div className="rounded-3xl border-2 border-dashed border-amber-400/25 bg-[rgb(25,21,18)]/95 overflow-hidden shadow-[0_0_20px_rgba(251,191,36,0.06)]">
              {/* Event image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/event-poetry-1.png"
                  alt={event.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 border-b-2 border-dashed border-amber-400/20" />
              </div>
              {/* Venue & Schedule */}
              <div className="p-4 md:p-6">
                <h2 className="text-[10px] md:text-xs font-semibold text-amber-400/90 uppercase tracking-[0.2em] mb-3 md:mb-4">
                  Venue & Schedule
                </h2>
                <p className="text-white font-medium text-sm md:text-base mb-4 md:mb-5 pb-4 md:pb-5 border-b border-dashed border-white/15">
                  {event.venueAddress}
                </p>
                <ul className="space-y-2 md:space-y-2.5 text-white/85 text-xs md:text-sm">
                  {event.doorsOpenAt && (
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400/80">★</span>
                      <span>Doors Open at {event.doorsOpenAt}</span>
                    </li>
                  )}
                  {event.performanceAt && (
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400/80">★</span>
                      <span>Performances at {event.performanceAt}</span>
                    </li>
                  )}
                  {event.mixMingleEnd && (
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400/80">★</span>
                      <span>Mix & Mingle {event.mixMingleEnd}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {event.description && (
              <p className="text-white/70 text-xs md:text-sm leading-relaxed px-1">{event.description}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
