import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUpcomingUserRsvps } from "@/lib/db/queries"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Shield, Sparkles, MapPin, Clock, ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  const upcomingRsvps = await getUpcomingUserRsvps(session.user.id)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-white/10">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback className="text-2xl bg-white/5 text-white">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {session.user.name?.split(' ')[0]}
              </h1>
              <p className="text-white/60 text-lg">
                {session.user.email}
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Shield className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Administrator</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Access Card */}
      {isAdmin && (
        <Card className="border-0 bg-gradient-to-r from-neutral-900 to-neutral-800 overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-white mb-1">Admin Panel</h3>
                  <p className="text-white/60">Manage content, users, and platform settings</p>
                </div>
              </div>
              <Link href="/dashboard/admin">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold rounded-xl">
                  Open Admin Panel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-neutral-200 bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                Active
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-neutral-900">
                {upcomingRsvps.length}
              </p>
              <p className="text-sm text-neutral-500 font-medium">Upcoming Events</p>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View Calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                Explore
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-neutral-900">Browse</p>
              <p className="text-sm text-neutral-500 font-medium">Programs & Workshops</p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                View Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Plus className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                New
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-neutral-900">Discover</p>
              <p className="text-sm text-neutral-500 font-medium">Latest Stories</p>
            </div>
            <Link href="/stories">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                Read Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      {upcomingRsvps.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Your Upcoming Events</h2>
              <p className="text-neutral-500 mt-1">Events you&apos;ve registered for</p>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="outline" className="rounded-xl">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4">
            {upcomingRsvps.slice(0, 3).map((rsvp) => (
              <Link
                key={rsvp.event.id}
                href={`/programs/${rsvp.program.slug}`}
                className="block group"
              >
                <Card className="border-neutral-200 bg-white hover:shadow-xl hover:border-neutral-300 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {rsvp.program.title}
                          </Badge>
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                            {rsvp.event.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(rsvp.event.startTime), "EEEE, MMMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{format(new Date(rsvp.event.startTime), "h:mm a")}</span>
                          </div>
                          {rsvp.event.venueName && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{rsvp.event.venueName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl">
                          Confirmed
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {upcomingRsvps.length > 3 && (
            <div className="text-center mt-4">
              <Link href="/dashboard/calendar">
                <Button variant="ghost" size="lg" className="text-blue-600 hover:text-blue-700">
                  View all {upcomingRsvps.length} events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-0 bg-gradient-to-br from-neutral-50 to-white">
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-neutral-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Upcoming Events</h3>
                <p className="text-neutral-500">
                  Discover amazing programs and workshops to expand your horizons
                </p>
              </div>
              <Link href="/programs">
                <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Browse Programs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
