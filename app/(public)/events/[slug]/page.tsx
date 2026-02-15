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
      {/* Hero - header background (same as events list) */}
      <section className="relative min-h-[24vh] sm:min-h-[28vh] md:min-h-[38vh] overflow-hidden">
        <Image
          src="/optimized/events.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(25,21,18)] via-[rgb(25,21,18)]/75 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-5 md:pb-10">
          <div className="max-w-4xl mx-auto flex flex-col">
            <p className="text-white/80 mb-1 text-xs font-semibold uppercase tracking-wider">
              SOULWORX PRESENTS
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-crimson font-normal tracking-tighter text-white">
              {event.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mt-1">{event.dateLabel}</p>
          </div>
        </div>
      </section>

      {/* Content: mobile = form first, then details. Desktop = details left, form right */}
      <section className="relative z-0 py-6 md:py-14 px-4 md:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10">
          {/* Ticket form */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-8">
              <h2 className="text-xl md:text-2xl font-crimson font-normal text-white mb-1 md:mb-2">
                Get your ticket
              </h2>
              <p className="text-white/55 text-xs md:text-sm mb-4 md:mb-6">
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

          {/* Event details card */}
          <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col space-y-4 md:space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">
              <div className="relative aspect-[3/2] w-full max-h-[200px] bg-[rgb(25,21,18)]">
                <Image
                  src="/event-poetry-1.png"
                  alt={event.title}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 md:p-5">
                <h2 className="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 md:mb-4">
                  Venue & Schedule
                </h2>
                <p className="text-white font-medium text-sm md:text-base mb-4 pb-4 border-b border-white/10">
                  {event.venueAddress}
                </p>
                <ul className="space-y-2 text-white/75 text-xs md:text-sm">
                  {event.doorsOpenAt && (
                    <li className="flex items-center gap-2">
                      <span className="text-white/50">★</span>
                      <span>Doors Open at {event.doorsOpenAt}</span>
                    </li>
                  )}
                  {event.performanceAt && (
                    <li className="flex items-center gap-2">
                      <span className="text-white/50">★</span>
                      <span>Performances at {event.performanceAt}</span>
                    </li>
                  )}
                  {event.mixMingleEnd && (
                    <li className="flex items-center gap-2">
                      <span className="text-white/50">★</span>
                      <span>Mix & Mingle {event.mixMingleEnd}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {event.description && (
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">{event.description}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
