"use client"

import { useState } from "react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from "date-fns"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
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

export function CalendarGrid({ rsvps }: { rsvps: Rsvp[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Rsvp | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (day: Date) => {
    return rsvps.filter((rsvp) =>
      isSameDay(new Date(rsvp.event.startTime), day)
    )
  }

  const handleDayClick = (day: Date) => {
    const events = getEventsForDay(day)
    if (events.length > 0) {
      setSelectedDay(isSameDay(day, selectedDay || new Date('1900-01-01')) ? null : day)
    }
  }

  const handleEventClick = (rsvp: Rsvp, e: React.MouseEvent) => {
    e.stopPropagation()
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

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 text-sm font-medium hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-neutral-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDay && isSameDay(day, selectedDay)
          const hasEvents = dayEvents.length > 0

          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[100px] p-2 border-2 rounded-lg transition-all duration-200
                ${!isCurrentMonth ? "bg-neutral-50 text-neutral-400 border-neutral-100" : "bg-white border-neutral-200"}
                ${isToday ? "ring-2 ring-black ring-offset-2" : ""}
                ${isSelected ? "border-blue-500 bg-blue-50" : ""}
                ${hasEvents && isCurrentMonth ? "cursor-pointer hover:border-neutral-300 hover:shadow-sm" : ""}
              `}
            >
              <div className={`text-sm font-semibold mb-1 ${isToday ? "text-black" : ""}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((rsvp) => (
                  <div
                    key={rsvp.event.id}
                    onClick={(e) => handleEventClick(rsvp, e)}
                    className={`
                      text-xs px-2 py-1 rounded font-medium truncate cursor-pointer 
                      transition-all duration-200 transform hover:scale-105
                      ${rsvp.rsvp.status === "confirmed" ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
                      ${rsvp.rsvp.status === "waitlisted" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}
                      ${rsvp.rsvp.status === "cancelled" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}
                    `}
                    title={rsvp.event.title}
                  >
                    {format(new Date(rsvp.event.startTime), "h:mm a")}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-neutral-500 px-2 py-1 font-medium">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Day Events Panel */}
      {selectedDay && selectedDayEvents.length > 0 && (
        <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">
                {format(selectedDay, "EEEE, MMMM d, yyyy")}
              </h3>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Close
            </button>
          </div>
          <div className="space-y-3">
            {selectedDayEvents.map((rsvp) => (
              <div
                key={rsvp.event.id}
                onClick={(e) => handleEventClick(rsvp, e)}
                className="bg-white border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-grow">
                    <div className="text-xs text-neutral-500 mb-1">
                      {rsvp.program.title}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">
                      {rsvp.event.title}
                    </h4>
                    <div className="text-xs text-neutral-600">
                      {format(new Date(rsvp.event.startTime), "h:mm a")} - {format(new Date(rsvp.event.endTime), "h:mm a")}
                    </div>
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
                {rsvp.event.description && (
                  <p className="text-xs text-neutral-600 line-clamp-2 mt-2">
                    {rsvp.event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  )
}

