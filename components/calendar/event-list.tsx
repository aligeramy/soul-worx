"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { EventDetailDialog } from "./event-detail-dialog"

interface Rsvp {
  rsvp: {
    id: string
    status: string
  }
  event: {
    id: string
    title: string
    description: string | null
    startTime: Date
    endTime: Date
    locationType: string
    venueName: string | null
    venueAddress: string | null
    venueCity: string | null
    venueState: string | null
    venueZip: string | null
    virtualMeetingUrl: string | null
    capacity: number | null
  }
  program: {
    slug: string
    title: string
    coverImage: string | null
  }
}

export function EventList({ rsvps }: { rsvps: Rsvp[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Rsvp | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

  const handleEventClick = (rsvp: Rsvp, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedEvent(rsvp)
    setIsEventDialogOpen(true)
  }

  const handleCancelRsvp = async (rsvpId: string) => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rsvpId }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel RSVP')
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error canceling RSVP:', error)
      throw error
    }
  }
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
    <>
      <div className="space-y-4">
        {rsvps.map((rsvp) => (
          <div
            key={rsvp.event.id}
            onClick={(e) => handleEventClick(rsvp, e)}
            className="border border-neutral-200 rounded-xl p-4 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
          >
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
                px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                ${rsvp.rsvp.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                ${rsvp.rsvp.status === "waitlisted" ? "bg-yellow-100 text-yellow-800" : ""}
                ${rsvp.rsvp.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
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
        ))}
      </div>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <EventDetailDialog
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false)
            setSelectedEvent(null)
          }}
          rsvp={selectedEvent}
          onCancelRsvp={handleCancelRsvp}
        />
      )}
    </>
  )
}

