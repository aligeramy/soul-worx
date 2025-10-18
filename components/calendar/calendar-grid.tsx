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
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  }
  program: {
    title: string
  }
}

export function CalendarGrid({ rsvps }: { rsvps: Rsvp[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

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

          return (
            <div
              key={day.toString()}
              className={`
                min-h-[80px] p-2 border border-neutral-200 rounded-lg
                ${!isCurrentMonth ? "bg-neutral-50 text-neutral-400" : "bg-white"}
                ${isToday ? "ring-2 ring-black" : ""}
              `}
            >
              <div className={`text-sm font-semibold mb-1 ${isToday ? "text-black" : ""}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.map((rsvp) => (
                  <div
                    key={rsvp.event.id}
                    className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium truncate cursor-pointer hover:bg-purple-200 transition-colors"
                    title={rsvp.event.title}
                  >
                    {format(new Date(rsvp.event.startTime), "h:mm a")}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

