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
      <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback className="text-2xl bg-white/5 text-white">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-crimson font-normal text-white mb-2">
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
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-brand-bg-darker" />
                </div>
                <div>
                  <h3 className="font-crimson text-2xl text-white mb-1">Admin Panel</h3>
                  <p className="text-white/60">Manage content, users, and platform settings</p>
                </div>
              </div>
              <Link href="/dashboard/admin">
                <Button size="lg" className="bg-white text-brand-bg-darker hover:bg-white/90 font-semibold rounded-xl">
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
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Active
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-crimson font-normal text-white">
                {upcomingRsvps.length}
              </p>
              <p className="text-sm text-white/60 font-medium">Upcoming Events</p>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-white/80 hover:text-white hover:bg-white/10">
                View Calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Explore
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-crimson font-normal text-white">Browse</p>
              <p className="text-sm text-white/60 font-medium">Programs & Workshops</p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-white/80 hover:text-white hover:bg-white/10">
                View Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                New
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-crimson font-normal text-white">Discover</p>
              <p className="text-sm text-white/60 font-medium">Latest Stories</p>
            </div>
            <Link href="/stories">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-white/80 hover:text-white hover:bg-white/10">
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
              <h2 className="text-2xl font-crimson font-normal text-white">Your Upcoming Events</h2>
              <p className="text-white/60 mt-1">Events you&apos;ve registered for</p>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
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
                <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <Badge variant="outline" className="mb-2 border-white/20 text-white">
                            {rsvp.program.title}
                          </Badge>
                          <h3 className="text-xl font-crimson font-normal text-white group-hover:text-white/80 transition-colors">
                            {rsvp.event.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
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
                        <div className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/20">
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
                <Button variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10">
                  View all {upcomingRsvps.length} events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-white/60" />
              </div>
              <div>
                <h3 className="text-2xl font-crimson font-normal text-white mb-2">No Upcoming Events</h3>
                <p className="text-white/60">
                  Discover amazing programs and workshops to expand your horizons
                </p>
              </div>
              <Link href="/programs">
                <Button size="lg" className="bg-white text-brand-bg-darker hover:bg-white/90 rounded-xl font-semibold">
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
