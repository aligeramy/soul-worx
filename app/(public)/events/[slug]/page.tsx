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
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <Image
          src="/optimized/events.jpg"
          alt={event.title}
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(25,21,18)] via-[rgb(25,21,18)]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-white/70 mb-2 text-sm font-semibold uppercase tracking-wider">
              SOULWORX PRESENTS
            </p>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-white/80">{event.dateLabel}</p>
          </div>
        </div>
      </section>

      {/* Content + ticket form */}
      <section className="relative z-0 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Event details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                Venue & Schedule
              </h2>
              <p className="text-white font-medium mb-4">{event.venueAddress}</p>
              <ul className="space-y-2 text-white/80 text-sm">
                {event.doorsOpenAt && (
                  <li>Doors Open at {event.doorsOpenAt}</li>
                )}
                {event.performanceAt && (
                  <li>Performances at {event.performanceAt}</li>
                )}
                {event.mixMingleEnd && (
                  <li>Mix & Mingle {event.mixMingleEnd}</li>
                )}
              </ul>
            </div>
            {event.description && (
              <p className="text-white/70 leading-relaxed">{event.description}</p>
            )}
          </div>

          {/* Ticket form - pick your price */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-crimson font-normal text-white mb-2">
                Get your ticket
              </h2>
              <p className="text-white/60 text-sm mb-6">
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
        </div>
      </section>
    </div>
  )
}
