import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUpcomingUserRsvps } from "@/lib/db/queries"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Shield } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  const upcomingRsvps = await getUpcomingUserRsvps(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Admin Access Banner */}
      {isAdmin && (
        <Card className="border-black bg-black text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Admin Access</h3>
                  <p className="text-white/70 text-sm">You have administrative privileges</p>
                </div>
              </div>
              <Link
                href="/dashboard/admin"
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                Open Admin Panel
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                <AvatarFallback className="text-xl">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-black text-white text-xs font-bold rounded">
                    {session.user.role.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your registered events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Registered</span>
                <span className="text-sm font-medium">{upcomingRsvps.length}</span>
              </div>
              <Link
                href="/dashboard/calendar"
                className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <Calendar className="w-4 h-4" />
                <span>View Calendar →</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/programs"
              className="block text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Programs →
            </Link>
            <Link
              href="/dashboard/calendar"
              className="block text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              My Calendar →
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/admin/programs"
                className="block text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Manage Programs →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events List */}
      {upcomingRsvps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Next Events</CardTitle>
            <CardDescription>Events you&apos;ve registered for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingRsvps.slice(0, 3).map((rsvp) => (
                <Link
                  key={rsvp.event.id}
                  href={`/programs/${rsvp.program.slug}/events/${rsvp.event.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow">
                    <div>
                      <h4 className="font-semibold">{rsvp.event.title}</h4>
                      <p className="text-sm text-muted-foreground">{rsvp.program.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(rsvp.event.startTime), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Confirmed
                    </span>
                  </div>
                </Link>
              ))}
              {upcomingRsvps.length > 3 && (
                <Link
                  href="/dashboard/calendar"
                  className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium pt-2"
                >
                  View all {upcomingRsvps.length} events →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No events CTA */}
      {upcomingRsvps.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground mb-6">
              Discover amazing programs and workshops to join
            </p>
            <Link
              href="/programs"
              className="inline-block px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-black/90 transition-colors"
            >
              Browse Programs
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

