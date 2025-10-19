import { db } from "@/lib/db"
import { programs, events, posts, products, users, rsvps } from "@/lib/db/schema"
import { count, gte, desc } from "drizzle-orm"
import Link from "next/link"
import { StatCard } from "@/components/admin/stat-card"
import { 
  Calendar,
  Sparkles, 
  ShoppingBag, 
  FileText, 
  Users as UsersIcon,
  CheckCircle2,
  Plus,
  TrendingUp,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Get stats
  const [programStats] = await db.select({ count: count() }).from(programs)
  const [eventStats] = await db.select({ count: count() }).from(events)
  const [postStats] = await db.select({ count: count() }).from(posts)
  const [productStats] = await db.select({ count: count() }).from(products)
  const [userStats] = await db.select({ count: count() }).from(users)
  
  // Get upcoming events count
  const [upcomingEvents] = await db
    .select({ count: count() })
    .from(events)
    .where(gte(events.startTime, new Date()))
  
  // Get total RSVPs
  const [rsvpStats] = await db.select({ count: count() }).from(rsvps)

  // Get recent events for activity
  const recentEvents = await db.query.events.findMany({
    orderBy: [desc(events.createdAt)],
    limit: 5,
    with: {
      program: true,
    },
  })

  // Get recent stories
  const recentStories = await db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
    limit: 3,
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-crimson font-normal text-white mb-2">Dashboard</h1>
        <p className="text-white/60">
          Welcome back. Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Programs"
          value={programStats?.count || 0}
          href="/dashboard/admin/programs"
          icon={Sparkles}
          trend={{ value: 12, label: "this month" }}
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents?.count || 0}
          href="/dashboard/admin/events"
          icon={Calendar}
          trend={{ value: 8, label: "this week" }}
        />
        <StatCard
          title="Total RSVPs"
          value={rsvpStats?.count || 0}
          href="/dashboard/admin/events"
          icon={CheckCircle2}
          trend={{ value: 23, label: "this month" }}
        />
        <StatCard
          title="Total Users"
          value={userStats?.count || 0}
          href="/dashboard/admin"
          icon={UsersIcon}
          trend={{ value: 15, label: "this month" }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Stories Published"
          value={postStats?.count || 0}
          href="/dashboard/admin/stories"
          icon={FileText}
        />
        <StatCard
          title="Shop Products"
          value={productStats?.count || 0}
          href="/dashboard/admin/shop"
          icon={ShoppingBag}
        />
        <StatCard
          title="All Events"
          value={eventStats?.count || 0}
          href="/dashboard/admin/events"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 font-crimson font-normal">
              <Activity className="h-5 w-5" />
              Recent Events
            </CardTitle>
            <CardDescription className="text-white/60">
              Latest events created on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.length > 0 ? (
              <>
                {recentEvents.map((event) => (
                  <Link 
                    key={event.id}
                    href={`/dashboard/admin/events/${event.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                          {event.program?.title}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="ml-2 border-white/20 text-white/70"
                      >
                        {format(new Date(event.startTime), "MMM d")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <p className="text-sm text-white/40 text-center py-8">
                No events yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 font-crimson font-normal">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-white/60">
              Create new content for your platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/admin/programs/new">
              <Button className="w-full bg-white text-brand-bg-darker hover:bg-white/90 font-semibold">
                <Sparkles className="mr-2 h-4 w-4" />
                New Program
              </Button>
            </Link>
            <Link href="/dashboard/admin/events/new">
              <Button className="w-full bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/10">
                <Calendar className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </Link>
            <Link href="/dashboard/admin/stories/new">
              <Button className="w-full bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/10">
                <FileText className="mr-2 h-4 w-4" />
                New Story
              </Button>
            </Link>
            <Link href="/dashboard/admin/shop/new">
              <Button className="w-full bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/10">
                <ShoppingBag className="mr-2 h-4 w-4" />
                New Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Stories */}
      {recentStories.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2 font-crimson font-normal">
                  <TrendingUp className="h-5 w-5" />
                  Recent Stories
                </CardTitle>
                <CardDescription className="text-white/60">
                  Latest published content
                </CardDescription>
              </div>
              <Link href="/dashboard/admin/stories">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  View All →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {recentStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/dashboard/admin/stories/${story.id}`}
                  className="block group"
                >
                  <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Badge 
                      variant="outline" 
                      className="mb-2 border-white/20 text-white/70 text-xs"
                    >
                      {story.category}
                    </Badge>
                    <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-white/90">
                      {story.title}
                    </h4>
                    <p className="text-xs text-white/60">
                      {format(new Date(story.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
