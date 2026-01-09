import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { format } from "date-fns"
import { DeleteEventButton } from "@/components/admin/delete-event-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Pencil, Calendar, MapPin, Clock } from "lucide-react"

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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <p className="text-white/60 mt-1">Manage all program events and sessions</p>
        </div>
        <Link href="/dashboard/admin/events/new">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-sm border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">Scheduled</div>
            <div className="text-3xl font-bold text-white">{eventsByStatus.scheduled.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">Completed</div>
            <div className="text-3xl font-bold text-white">{eventsByStatus.completed.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-red-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-red-400 mb-1 uppercase tracking-wider">Cancelled</div>
            <div className="text-3xl font-bold text-white">{eventsByStatus.cancelled.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-amber-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">Postponed</div>
            <div className="text-3xl font-bold text-white">{eventsByStatus.postponed.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      {allEvents.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
            <p className="text-white/60 mb-6">Create your first event to get started</p>
            <Link href="/dashboard/admin/events/new">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {allEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{event.title}</div>
                        {event.description && (
                          <div className="text-sm text-white/50 line-clamp-1 mt-1">{event.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/programs/${event.program.slug}`}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                          target="_blank"
                        >
                          {event.program.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(event.startTime), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-white/50 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <MapPin className="h-4 w-4" />
                          {event.locationType === "virtual" && "Virtual"}
                          {event.locationType === "in_person" && (event.venueName || "In Person")}
                          {event.locationType === "hybrid" && "Hybrid"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/programs/${event.program.slug}/events/${event.id}`} target="_blank">
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/admin/events/${event.id}`}>
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <Pencil className="h-4 w-4" />
                            </Button>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    postponed: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  }

  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
