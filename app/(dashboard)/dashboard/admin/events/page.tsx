import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { format } from "date-fns"
import { DeleteEventButton } from "@/components/admin/delete-event-button"

export default async function AdminEventsPage() {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const allEvents = await db.query.events.findMany({
    orderBy: desc(events.startTime),
    with: {
      program: {
        columns: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  })

  const eventsByStatus = {
    scheduled: allEvents.filter(e => e.status === "scheduled"),
    completed: allEvents.filter(e => e.status === "completed"),
    cancelled: allEvents.filter(e => e.status === "cancelled"),
    postponed: allEvents.filter(e => e.status === "postponed"),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Events Management</h1>
          <p className="text-neutral-600 mt-2">
            Manage all program events and sessions
          </p>
        </div>
        <Link 
          href="/dashboard/admin/events/new"
          className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors inline-block"
        >
          + New Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
          <div className="text-sm font-bold text-blue-600 mb-2">SCHEDULED</div>
          <div className="text-4xl font-bold text-blue-900">{eventsByStatus.scheduled.length}</div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-100">
          <div className="text-sm font-bold text-green-600 mb-2">COMPLETED</div>
          <div className="text-4xl font-bold text-green-900">{eventsByStatus.completed.length}</div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
          <div className="text-sm font-bold text-red-600 mb-2">CANCELLED</div>
          <div className="text-4xl font-bold text-red-900">{eventsByStatus.cancelled.length}</div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100">
          <div className="text-sm font-bold text-amber-600 mb-2">POSTPONED</div>
          <div className="text-4xl font-bold text-amber-900">{eventsByStatus.postponed.length}</div>
        </div>
      </div>

      {/* All Events Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold">All Events</h2>
        </div>
        
        {allEvents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No events yet</h3>
            <p className="text-neutral-600 mb-6">Create your first event to get started</p>
            <Link 
              href="/dashboard/admin/events/new"
              className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors inline-block"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {allEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900">{event.title}</div>
                      {event.description && (
                        <div className="text-sm text-neutral-500 line-clamp-1">{event.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/programs/${event.program.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        target="_blank"
                      >
                        {event.program.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      <div>{format(new Date(event.startTime), "MMM d, yyyy")}</div>
                      <div className="text-xs text-neutral-500">
                        {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {event.locationType === "virtual" && "Virtual"}
                      {event.locationType === "in_person" && (event.venueName || "In Person")}
                      {event.locationType === "hybrid" && "Hybrid"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                        ${event.status === "scheduled" ? "bg-blue-100 text-blue-700" : ""}
                        ${event.status === "completed" ? "bg-green-100 text-green-700" : ""}
                        ${event.status === "cancelled" ? "bg-red-100 text-red-700" : ""}
                        ${event.status === "postponed" ? "bg-amber-100 text-amber-700" : ""}
                      `}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/programs/${event.program.slug}/events/${event.id}`}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          target="_blank"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/dashboard/admin/events/${event.id}`}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <DeleteEventButton 
                          eventId={event.id} 
                          eventTitle={event.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

