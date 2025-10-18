import { getEventById, getEventRsvpStats, getUserRsvpForEvent } from "@/lib/db/queries"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { RsvpForm } from "@/components/programs/rsvp-form"
import { CalendarDownload } from "@/components/programs/calendar-download"
import { EventMap } from "@/components/programs/event-map"
import { MapPin, Users, Calendar } from "lucide-react"

export default async function EventRsvpPage({
  params,
}: {
  params: Promise<{ slug: string; eventId: string }>
}) {
  // Await params in Next.js 15
  const { slug, eventId } = await params
  
  const session = await auth()
  const event = await getEventById(eventId)

  if (!event) {
    notFound()
  }

  // Get RSVP stats
  const stats = await getEventRsvpStats(eventId)
  
  // Check if user already has RSVP
  let existingRsvp = null
  if (session?.user?.id) {
    existingRsvp = await getUserRsvpForEvent(session.user.id, eventId)
  }

  const startDate = new Date(event.startTime)
  const endDate = new Date(event.endTime)
  const isFull = stats.capacity && stats.confirmedCount >= stats.capacity

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        {event.program?.coverImage ? (
          <Image
            src={event.program.coverImage}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-white/80 mb-2">
              {event.program?.title}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date & Time */}
            <div className="bg-neutral-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-6 h-6 text-neutral-600 mt-1" />
                  <div>
                    <div className="font-semibold text-lg">
                      {format(startDate, "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="text-neutral-600">
                      {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {event.locationType === "in_person" && (
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-neutral-600 mt-1" />
                    <div>
                      <div className="font-semibold">{event.venueName}</div>
                      {event.venueAddress && (
                        <div className="text-neutral-600">{event.venueAddress}</div>
                      )}
                      {event.venueCity && event.venueState && (
                        <div className="text-neutral-600">
                          {event.venueCity}, {event.venueState} {event.venueZip}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {event.locationType === "virtual" && (
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-neutral-600 mt-1" />
                    <div>
                      <div className="font-semibold">Virtual Event</div>
                      <div className="text-neutral-600">
                        Meeting link will be sent after RSVP
                      </div>
                    </div>
                  </div>
                )}

                {event.locationType === "hybrid" && (
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-neutral-600 mt-1" />
                    <div>
                      <div className="font-semibold">Hybrid Event</div>
                      <div className="text-neutral-600">
                        {event.venueName} or join virtually
                      </div>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.capacity && (
                  <div className="flex items-start space-x-4">
                    <Users className="w-6 h-6 text-neutral-600 mt-1" />
                    <div>
                      <div className="font-semibold">Capacity</div>
                      <div className="text-neutral-600">
                        {stats.confirmedCount} / {event.capacity} registered
                        {stats.spotsAvailable !== null && stats.spotsAvailable > 0 && (
                          <span className="ml-2 text-green-600">
                            ({stats.spotsAvailable} spots left)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-neutral-700 text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Map */}
            {event.locationType !== "virtual" && event.latitude && event.longitude && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Event Location</h2>
                <EventMap
                  latitude={event.latitude}
                  longitude={event.longitude}
                  venueName={event.venueName || "Event Location"}
                  venueAddress={event.venueAddress}
                />
              </div>
            )}

            {/* Calendar Download */}
            {existingRsvp && existingRsvp.status === "confirmed" && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4 text-green-900">
                  ✓ You&apos;re Registered!
                </h3>
                <p className="text-green-800 mb-6">
                  You&apos;ve successfully registered for this event. Add it to your calendar so you don&apos;t miss it!
                </p>
                <CalendarDownload event={event} />
              </div>
            )}
          </div>

          {/* RSVP Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {existingRsvp && existingRsvp.status === "confirmed" ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold mb-2">You&apos;re In!</h3>
                  <p className="text-neutral-600 mb-6">
                    We&apos;ve saved your spot for this event.
                  </p>
                  <CalendarDownload event={event} compact />
                </div>
              ) : isFull ? (
                <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-8 text-center">
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="text-2xl font-bold mb-2">Event Full</h3>
                  <p className="text-neutral-600">
                    This event has reached capacity. Check back for future events!
                  </p>
                </div>
              ) : !session ? (
                <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-4">RSVP Required</h3>
                  <p className="text-neutral-600 mb-6">
                    Sign in to reserve your spot for this event.
                  </p>
                  <a
                    href={`/signin?callbackUrl=/programs/${slug}/events/${eventId}`}
                    className="block w-full px-6 py-4 bg-black text-white text-center font-semibold rounded-xl hover:bg-black/90 transition-colors"
                  >
                    Sign In to RSVP
                  </a>
                </div>
              ) : (
                <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6">Reserve Your Spot</h3>
                  <RsvpForm
                    eventId={eventId}
                    userId={session.user.id}
                    requiresParentConsent={event.program?.requiresParentConsent || false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

