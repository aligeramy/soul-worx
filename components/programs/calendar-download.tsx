"use client"

import { Calendar, Download } from "lucide-react"

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
  venueZip: string | null
  virtualMeetingUrl: string | null
}

export function CalendarDownload({ 
  event, 
  compact = false 
}: { 
  event: Event
  compact?: boolean
}) {
  const handleDownload = async (type: "google" | "ics" | "outlook") => {
    try {
      const response = await fetch(`/api/calendar/download?eventId=${event.id}&type=${type}`)
      
      if (type === "google") {
        const data = await response.json()
        window.open(data.url, "_blank")
      } else {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to download calendar event:", error)
      alert("Failed to download calendar event. Please try again.")
    }
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => handleDownload("google")}
          className="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Add to Calendar</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <span>Add to Calendar</span>
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleDownload("google")}
          className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors"
        >
          Google Calendar
        </button>
        <button
          onClick={() => handleDownload("ics")}
          className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Apple / iCal</span>
        </button>
        <button
          onClick={() => handleDownload("outlook")}
          className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors"
        >
          Outlook
        </button>
      </div>

      <p className="text-xs text-neutral-500">
        💡 Events added to your calendar will automatically update if details change
      </p>
    </div>
  )
}

