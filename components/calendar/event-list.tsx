"use client"

import { format } from "date-fns"
import { MapPin, Clock } from "lucide-react"
import Link from "next/link"

interface Rsvp {
  rsvp: {
    id: string
    status: string
  }
  event: {
    id: string
    title: string
    startTime: Date
    endTime: Date
    locationType: string
    venueName: string | null
    venueCity: string | null
    venueState: string | null
  }
  program: {
    slug: string
    title: string
  }
}

export function EventList({ rsvps }: { rsvps: Rsvp[] }) {
  if (rsvps.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500 mb-4">No upcoming events</p>
        <Link
          href="/programs"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Browse programs →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rsvps.map((rsvp) => (
        <Link
          key={rsvp.event.id}
          href={`/programs/${rsvp.program.slug}/events/${rsvp.event.id}`}
        >
          <div className="border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-grow">
                <div className="text-xs text-neutral-500 mb-1">
                  {rsvp.program.title}
                </div>
                <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                  {rsvp.event.title}
                </h4>
              </div>
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${rsvp.rsvp.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-800"}
              `}>
                {rsvp.rsvp.status}
              </div>
            </div>

            <div className="space-y-1 text-xs text-neutral-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>
                  {format(new Date(rsvp.event.startTime), "MMM d, h:mm a")}
                </span>
              </div>

              {rsvp.event.locationType === "in_person" && rsvp.event.venueName && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {rsvp.event.venueName}
                    {rsvp.event.venueCity && ` • ${rsvp.event.venueCity}`}
                  </span>
                </div>
              )}

              {rsvp.event.locationType === "virtual" && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>Virtual Event</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

