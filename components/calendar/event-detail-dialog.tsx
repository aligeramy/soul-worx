"use client"

import { format } from "date-fns"
import { MapPin, Clock, Calendar, X, ExternalLink, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EventDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  rsvp: {
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
  onCancelRsvp?: (rsvpId: string) => void
}

export function EventDetailDialog({ isOpen, onClose, rsvp, onCancelRsvp }: EventDetailDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCancelRsvp = async () => {
    if (!onCancelRsvp) return
    
    setIsLoading(true)
    try {
      await onCancelRsvp(rsvp.rsvp.id)
      onClose()
    } catch (error) {
      console.error("Failed to cancel RSVP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const eventDuration = Math.round(
    (new Date(rsvp.event.endTime).getTime() - new Date(rsvp.event.startTime).getTime()) / (1000 * 60)
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-grow pr-8">
              <DialogTitle className="text-2xl mb-2">{rsvp.event.title}</DialogTitle>
              <DialogDescription className="text-sm text-neutral-600">
                {rsvp.program.title}
              </DialogDescription>
            </div>
            <div className={`
              px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
              ${rsvp.rsvp.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
              ${rsvp.rsvp.status === "waitlisted" ? "bg-yellow-100 text-yellow-800" : ""}
              ${rsvp.rsvp.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
            `}>
              {rsvp.rsvp.status.toUpperCase()}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Event Description */}
          {rsvp.event.description && (
            <div>
              <h3 className="font-semibold mb-2">About this event</h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                {rsvp.event.description}
              </p>
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-3">
            <h3 className="font-semibold">Event Details</h3>
            
            {/* Date and Time */}
            <div className="flex items-start space-x-3 text-sm">
              <Calendar className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">
                  {format(new Date(rsvp.event.startTime), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="text-neutral-600">
                  {format(new Date(rsvp.event.startTime), "h:mm a")} - {format(new Date(rsvp.event.endTime), "h:mm a")}
                  <span className="text-neutral-500"> ({eventDuration} min)</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
              <div>
                {rsvp.event.locationType === "in_person" ? (
                  <div>
                    <div className="font-medium">{rsvp.event.venueName || "In Person"}</div>
                    {rsvp.event.venueAddress && (
                      <div className="text-neutral-600">
                        {rsvp.event.venueAddress}
                        {rsvp.event.venueCity && `, ${rsvp.event.venueCity}`}
                        {rsvp.event.venueState && `, ${rsvp.event.venueState}`}
                        {rsvp.event.venueZip && ` ${rsvp.event.venueZip}`}
                      </div>
                    )}
                  </div>
                ) : rsvp.event.locationType === "virtual" ? (
                  <div>
                    <div className="font-medium">Virtual Event</div>
                    {rsvp.event.virtualMeetingUrl && rsvp.rsvp.status === "confirmed" && (
                      <a
                        href={rsvp.event.virtualMeetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                      >
                        Join meeting <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="font-medium">Hybrid Event</div>
                )}
              </div>
            </div>

            {/* Capacity */}
            {rsvp.event.capacity && (
              <div className="flex items-start space-x-3 text-sm">
                <Users className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-neutral-600">
                    Capacity: {rsvp.event.capacity} attendees
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Link
              href={`/programs/${rsvp.program.slug}/events/${rsvp.event.id}`}
              className="flex-1"
            >
              <Button className="w-full" variant="outline">
                View Event Page
              </Button>
            </Link>
            
            {rsvp.rsvp.status === "confirmed" && onCancelRsvp && (
              <Button
                variant="destructive"
                onClick={handleCancelRsvp}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Canceling..." : "Cancel RSVP"}
              </Button>
            )}
          </div>

          {/* Warning for cancellation */}
          {rsvp.rsvp.status === "confirmed" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <div className="font-medium mb-1">Cancellation Policy</div>
                <p className="text-amber-800">
                  Please cancel at least 24 hours before the event to allow others on the waitlist to attend.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

