"use client"

import { format } from "date-fns"
import Link from "next/link"
import { MapPin, Users, Clock } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  locationType: "in_person" | "virtual" | "hybrid"
  venueName: string | null
  venueAddress: string | null
  venueCity: string | null
  venueState: string | null
  virtualMeetingUrl: string | null
  capacity: number | null
  status: string
}

export function EventCard({ 
  event, 
  programSlug 
}: { 
  event: Event
  programSlug: string
}) {
  const startDate = new Date(event.startTime)
  const endDate = new Date(event.endTime)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Date Badge */}
          <div className="flex-shrink-0">
            <div className="bg-black text-white rounded-2xl p-6 text-center w-32">
              <div className="text-3xl font-bold">{format(startDate, "d")}</div>
              <div className="text-sm uppercase tracking-wide">{format(startDate, "MMM")}</div>
              <div className="text-xs opacity-70">{format(startDate, "yyyy")}</div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-grow space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
              {event.description && (
                <p className="text-neutral-600">{event.description}</p>
              )}
            </div>

            <div className="space-y-2 text-sm text-neutral-600">
              {/* Time */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>
                  {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                </span>
              </div>

              {/* Location */}
              {event.locationType === "in_person" && event.venueName && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {event.venueName}
                    {event.venueCity && event.venueState && ` • ${event.venueCity}, ${event.venueState}`}
                  </span>
                </div>
              )}

              {event.locationType === "virtual" && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Virtual Event (Online)</span>
                </div>
              )}

              {event.locationType === "hybrid" && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Hybrid Event (In-Person & Virtual)</span>
                </div>
              )}

              {/* Capacity */}
              {event.capacity && (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Up to {event.capacity} participants</span>
                </div>
              )}
            </div>
          </div>

          {/* RSVP Button */}
          <div className="flex-shrink-0">
            <Link href={`/programs/${programSlug}/events/${event.id}`}>
              <button className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-black/90 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                RSVP Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

