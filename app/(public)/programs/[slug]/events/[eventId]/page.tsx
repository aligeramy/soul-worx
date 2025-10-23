import { getEventById, getEventRsvpStats, getUserRsvpForEvent } from "@/lib/db/queries"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { RsvpForm } from "@/components/programs/rsvp-form"
import { CalendarDownload } from "@/components/programs/calendar-download"
import { EventMap } from "@/components/programs/event-map"
import { MapPin, Users, Calendar, Info, CheckCircle2, Lock } from "lucide-react"

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

  // Get event image with fallback to program cover image
  const heroImage = (event.images && event.images.length > 0) 
    ? event.images[0] 
    : event.program?.coverImage

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-semibold text-white">
                {event.program?.title}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-crimson font-bold text-white mb-6 tracking-tight">
              {event.title}
            </h1>
            
            {/* Quick Info Bar */}
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {format(startDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {event.locationType === "virtual" ? "Virtual Event" : event.venueName || "TBA"}
                </span>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {stats.confirmedCount} / {event.capacity} registered
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Date & Time */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <h2 className="text-2xl font-crimson font-semibold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </span>
                Event Details
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Calendar className="w-6 h-6 text-neutral-700" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                      Date & Time
                    </div>
                    <div className="font-semibold text-lg text-black">
                      {format(startDate, "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="text-neutral-600 mt-1">
                      {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {event.locationType === "in_person" && (
                  <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-2xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MapPin className="w-6 h-6 text-neutral-700" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                        Location
                      </div>
                      <div className="font-semibold text-lg text-black">{event.venueName}</div>
                      {event.venueAddress && (
                        <div className="text-neutral-600 mt-1">{event.venueAddress}</div>
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
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MapPin className="w-6 h-6 text-blue-700" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                        Location
                      </div>
                      <div className="font-semibold text-lg text-blue-900">Virtual Event</div>
                      <div className="text-blue-700 mt-1">
                        Meeting link will be sent after RSVP
                      </div>
                    </div>
                  </div>
                )}

                {event.locationType === "hybrid" && (
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MapPin className="w-6 h-6 text-purple-700" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                        Location
                      </div>
                      <div className="font-semibold text-lg text-purple-900">Hybrid Event</div>
                      <div className="text-purple-700 mt-1">
                        {event.venueName} or join virtually
                      </div>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.capacity && (
                  <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-2xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Users className="w-6 h-6 text-neutral-700" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                        Attendance
                      </div>
                      <div className="font-semibold text-lg text-black">
                        {stats.confirmedCount} / {event.capacity} registered
                      </div>
                      {stats.spotsAvailable !== null && stats.spotsAvailable > 0 && (
                        <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {stats.spotsAvailable} spots available
                        </div>
                      )}
                      {isFull && (
                        <div className="mt-2 inline-flex items-center gap-2 bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Event is full
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-crimson font-semibold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                  </span>
                  About This Event
                </h2>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 text-base leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {/* Map */}
            {event.locationType !== "virtual" && event.latitude && event.longitude && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 overflow-hidden">
                <h2 className="text-2xl font-crimson font-semibold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </span>
                  Event Location
                </h2>
                <div className="rounded-2xl overflow-hidden">
                  <EventMap
                    latitude={event.latitude}
                    longitude={event.longitude}
                    venueName={event.venueName || "Event Location"}
                    venueAddress={event.venueAddress}
                  />
                </div>
              </div>
            )}

            {/* Calendar Download */}
            {existingRsvp && existingRsvp.status === "confirmed" && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-1">
                      You&apos;re Registered!
                    </h3>
                    <p className="text-green-800 text-sm">
                      You&apos;ve successfully registered for this event. Add it to your calendar so you don&apos;t miss it!
                    </p>
                  </div>
                </div>
                <CalendarDownload event={event} />
              </div>
            )}
          </div>

          {/* RSVP Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              {existingRsvp && existingRsvp.status === "confirmed" ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-8 text-center shadow-sm">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-green-900">You&apos;re In!</h3>
                  <p className="text-neutral-600 text-sm mb-6">
                    We&apos;ve saved your spot for this event.
                  </p>
                  <CalendarDownload event={event} compact />
                </div>
              ) : isFull ? (
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-3xl p-8 text-center shadow-sm">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-red-900">Event Full</h3>
                  <p className="text-neutral-600 text-sm">
                    This event has reached capacity. Check back for future events!
                  </p>
                </div>
              ) : !session ? (
                <div className="bg-white border-2 border-neutral-200 rounded-3xl p-8 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">RSVP Required</h3>
                    <p className="text-neutral-600 text-sm">
                      Sign in to reserve your spot for this event.
                    </p>
                  </div>
                  <a
                    href={`/signin?callbackUrl=/programs/${slug}/events/${eventId}`}
                    className="block w-full px-6 py-3.5 bg-black text-white text-center font-semibold rounded-xl hover:bg-black/90 transition-colors text-sm"
                  >
                    Sign In to RSVP
                  </a>
                </div>
              ) : (
                <div className="bg-white border-2 border-neutral-200 rounded-3xl p-8 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Reserve Your Spot</h3>
                    <p className="text-neutral-600 text-sm">
                      Fill out the form below to secure your attendance
                    </p>
                  </div>
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

