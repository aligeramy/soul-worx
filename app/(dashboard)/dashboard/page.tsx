import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import { getUpcomingUserRsvps } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, Sparkles, MapPin, Clock, ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const upcomingRsvps = await getUpcomingUserRsvps(session.user.id)

  // Add mock upcoming event for preview
  const mockEvent = {
    rsvp: {
      id: "mock-rsvp-1",
      eventId: "mock-event-1",
      userId: session.user.id,
      status: "confirmed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      cancelledAt: null,
      attendanceMarked: false,
      attendanceMarkedAt: null,
      notes: null,
      emergencyContact: null,
      emergencyPhone: null,
      dietaryRestrictions: null,
      specialAccommodations: null,
    },
    event: {
      id: "mock-event-1",
      programId: "mock-program-1",
      title: "Poetry & Spoken Word Workshop",
      description: "Join us for an inspiring evening of poetry and creative expression. Share your work, get feedback, and connect with fellow poets.",
      status: "scheduled" as const,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
      timezone: "America/New_York",
      locationType: "in_person" as const,
      venueName: "Soulworx Community Center",
      venueAddress: "123 Creative Lane",
      venueCity: "Brooklyn",
      venueState: "NY",
      venueZip: "11201",
      venueCountry: "USA",
      latitude: null,
      longitude: null,
      virtualMeetingUrl: null,
      capacity: 30,
      waitlistEnabled: true,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    program: {
      id: "mock-program-1",
      slug: "poetry-workshops",
      title: "Poetry Workshops",
      description: "Weekly poetry and creative writing workshops for all skill levels",
      longDescription: null,
      category: "workshops" as const,
      status: "published" as const,
      coverImage: "/quick-nav/poetry.jpg",
      images: [],
      videoUrl: null,
      duration: "2 hours",
      ageRange: "16+",
      capacity: 30,
      price: "0",
      registrationRequired: true,
      requiresParentConsent: false,
      tags: ["poetry", "writing", "creative"],
      faqs: [],
      metaTitle: null,
      metaDescription: null,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
    }
  }

  // Add mock event to the beginning of the array
  const allRsvps = [mockEvent, ...upcomingRsvps]

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <DashboardCard
          href="/dashboard/calendar"
          icon={Calendar}
          title="Events"
          subtitle="Upcoming"
          value={allRsvps.length}
        />
        <DashboardCard
          href="/programs"
          icon={Sparkles}
          title="Browse"
          subtitle="Programs"
        />
        <DashboardCard
          href="/stories"
          icon={Plus}
          title="Discover"
          subtitle="Stories"
        />
      </div>

      {/* Upcoming Events */}
      {allRsvps.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-crimson font-normal tracking-tight text-white">Your Upcoming Events</h2>
              <p className="text-white/60 -mt-2">Events you&apos;ve registered for</p>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 hover:border-white/40 bg-white/5">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allRsvps.slice(0, 3).map((rsvp) => (
              <Link
                key={rsvp.event.id}
                href={`/programs/${rsvp.program.slug}`}
                className="block group"
              >
                <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden h-full flex flex-col p-0">
                  {/* Event Image */}
                  <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
                    {rsvp.program.coverImage ? (
                      <Image
                        src={rsvp.program.coverImage}
                        alt={rsvp.program.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-black/35 backdrop-blur-sm rounded-md px-3 py-2 text-center">
                        <div className="text-xl font-bold text-white">
                          {format(new Date(rsvp.event.startTime), "d")}
                        </div>
                        <div className="text-xs font-semibold text-white uppercase">
                          {format(new Date(rsvp.event.startTime), "MMM")}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        Confirmed
                      </div>
                    </div>

                    {/* Time on Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2  text-xs text-white text-shadow-md">
                        <div className="flex items-center gap-2 bg-black/35 backdrop-blur-sm rounded-md px-3 py-2">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">
                          {format(new Date(rsvp.event.startTime), "h:mm a")}
                        </span>
                      </div>
                        </div>
                    </div>
                  </div>

                  {/* Event Content */}
                  <CardContent className="p-5 -mt-3 flex flex-col flex-grow">
                    <Badge variant="outline" className="mb-0 border-white/30 text-white/90 w-fit">
                      {rsvp.program.title}
                    </Badge>
                    <h3 className="text-2xl tracking-tight font-crimson font-normal text-white group-hover:text-white/80 transition-colors mb-2 line-clamp-2">
                      {rsvp.event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-white/70 mt-auto">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs">{format(new Date(rsvp.event.startTime), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      {rsvp.event.venueName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate text-xs">{rsvp.event.venueName}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {allRsvps.length > 3 && (
            <div className="text-center mt-4">
              <Link href="/dashboard/calendar">
                <Button variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10">
                  View all {allRsvps.length} events
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
