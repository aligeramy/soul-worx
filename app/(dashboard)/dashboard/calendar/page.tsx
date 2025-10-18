import { auth } from "@/auth"
import { getUpcomingUserRsvps } from "@/lib/db/queries"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { EventList } from "@/components/calendar/event-list"

export default async function UserCalendarPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const rsvps = await getUpcomingUserRsvps(session.user.id)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My Calendar</h1>
          <p className="text-neutral-600">
            View and manage your upcoming events
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8">
              <CalendarGrid rsvps={rsvps} />
            </div>

            {/* Sync Settings */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-bold text-blue-900 mb-2">
                    Calendar Sync Active
                  </h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Your events are automatically synced. If an organizer changes the time or location, your calendar will update automatically.
                  </p>
                  <Link
                    href="/dashboard/settings/calendar"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Manage sync settings →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Upcoming Events</h2>
              <EventList rsvps={rsvps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

