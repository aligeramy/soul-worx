import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import { getUpcomingUserRsvps, getUserTier, getUserPersonalizedPrograms, getNextDueWorkoutDate, hasProPlusQuestionnaire } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"
import { Calendar, Sparkles, MapPin, Clock, ArrowRight, Plus, Bot, Target, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const [upcomingRsvps, userTier, userPrograms, nextDueDate, hasQuestionnaire] = await Promise.all([
    getUpcomingUserRsvps(session.user.id),
    getUserTier(session.user.id),
    getUserPersonalizedPrograms(session.user.id),
    getNextDueWorkoutDate(session.user.id),
    hasProPlusQuestionnaire(session.user.id),
  ])

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  const isProPlus = userTier === "pro_plus"
  const activeProgramsCount = userPrograms.length

  // Programs active for the current week (date range overlaps with this week)
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 })
  const programsInCurrentWeek = userPrograms.filter((p) => {
    const start = new Date(p.startDate)
    const end = new Date(p.endDate)
    return start <= weekEnd && end >= weekStart
  })

  // Sort by relevance: programs with due items this week first, then by next due date
  const sortedPrograms = [...programsInCurrentWeek].sort((a, b) => {
    const aHasDueThisWeek = a.checklistItems.some((item) => {
      if (item.completed) return false
      const due = new Date(item.dueDate)
      return isWithinInterval(due, { start: weekStart, end: weekEnd })
    })
    const bHasDueThisWeek = b.checklistItems.some((item) => {
      if (item.completed) return false
      const due = new Date(item.dueDate)
      return isWithinInterval(due, { start: weekStart, end: weekEnd })
    })
    if (aHasDueThisWeek && !bHasDueThisWeek) return -1
    if (!aHasDueThisWeek && bHasDueThisWeek) return 1
    const aNext = a.checklistItems.find((i) => !i.completed)
    const bNext = b.checklistItems.find((i) => !i.completed)
    if (!aNext) return 1
    if (!bNext) return -1
    return new Date(aNext.dueDate).getTime() - new Date(bNext.dueDate).getTime()
  })

  // Use programs in current week, or fall back to first 2 active if none in week
  const topPrograms =
    sortedPrograms.length > 0 ? sortedPrograms.slice(0, 2) : userPrograms.slice(0, 2)

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
      {/* Pro+ Questionnaire Card - Show if Pro+ but no questionnaire (not for admins) */}
      {!isAdmin && isProPlus && !hasQuestionnaire && (
        <Card className="border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm hover:bg-amber-500/15 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <FileText className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-crimson font-normal text-white mb-1">
                    Complete Your Questionnaire
                  </h3>
                  <p className="text-white/60 text-sm">
                    Help us create your personalized program by completing the Pro+ questionnaire
                  </p>
                </div>
              </div>
              <Link href="/onboarding/pro-plus-questionnaire?from=dashboard">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  Start Questionnaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro+ Personalized Programs - 2 cards + View All (when programs exist) */}
      {isProPlus && hasQuestionnaire && activeProgramsCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-crimson font-normal tracking-tight text-white">
                Your Personalized Programs
              </h2>
              <p className="text-white/60 -mt-2">
                Active programs for this week
                {nextDueDate && (
                  <> • Next: {format(nextDueDate, "MMM d")}</>
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Program cards - white bg, brown text */}
            {topPrograms.map((program) => {
              const completedCount = program.checklistItems.filter((item) => item.completed).length
              const totalCount = program.checklistItems.length
              const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
              const nextDue = program.checklistItems.find((item) => !item.completed)

              return (
                <Link
                  key={program.id}
                  href={`/dashboard/personalized-programs/${program.id}`}
                  className="block group"
                >
                  <Card className="border border-stone-200 bg-white hover:bg-stone-50 transition-all h-full flex flex-col overflow-hidden">
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-brand-bg-darker/10 rounded-lg shrink-0">
                          <Target className="h-5 w-5 text-brand-bg-darker" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-crimson font-normal text-brand-bg-darker group-hover:text-brand-bg-darker/90 transition-colors line-clamp-2">
                            {program.title}
                          </h3>
                          <p className="text-stone-600 text-sm mt-0.5 line-clamp-2">
                            {program.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mt-auto">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-stone-500">Progress</span>
                            <span className="font-medium text-brand-bg-darker">
                              {completedCount} / {totalCount}
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-1.5">
                            <div
                              className="bg-brand-bg-darker h-1.5 rounded-full transition-all"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>

                        {nextDue ? (
                          <div className="flex items-center gap-2 text-sm text-brand-bg-darker">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>Next: {format(new Date(nextDue.dueDate), "MMM d")}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-green-700">
                            <Target className="h-4 w-4 shrink-0" />
                            <span>All done!</span>
                          </div>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-brand-bg-darker text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                        View program
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}

            {/* View all card */}
            <Link href="/dashboard/personalized-programs" className="block group">
              <Card className="border border-stone-200 bg-white hover:bg-stone-50 transition-all h-full flex flex-col overflow-hidden">
                <CardContent className="p-5 flex flex-col flex-1 items-center justify-center min-h-[180px]">
                  <div className="p-3 bg-brand-bg-darker/10 rounded-full mb-3">
                    <Target className="h-8 w-8 text-brand-bg-darker" />
                  </div>
                  <h3 className="font-crimson font-normal text-brand-bg-darker text-center group-hover:text-brand-bg-darker/90 transition-colors">
                    View all your personalized programs
                  </h3>
                  <p className="text-stone-600 text-sm text-center mt-1">
                    {activeProgramsCount} program{activeProgramsCount !== 1 ? "s" : ""} total
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-bg-darker text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* Pro+ Programs - no programs yet */}
      {isProPlus && hasQuestionnaire && activeProgramsCount === 0 && (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-crimson font-normal text-white mb-1">
                    Your Personalized Programs
                  </h3>
                  <p className="text-white/60 text-sm">
                    Your personalized programs will appear here once they&apos;re created
                  </p>
                </div>
              </div>
              <Link href="/dashboard/personalized-programs">
                <Button className="bg-white/10 hover:bg-white/20 text-white">
                  View Programs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <DashboardCard
          href="/dashboard/calendar"
          icon={Calendar}
          title="Events"
          subtitle="Upcoming"
          value={allRsvps.length}
        />
        <DashboardCard
          href="/dashboard/ai-assistant"
          icon={Bot}
          title="AI Assistant"
          subtitle="Get help"
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
