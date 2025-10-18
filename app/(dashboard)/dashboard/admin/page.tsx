import { db } from "@/lib/db"
import { programs, events, posts, products, users, rsvps } from "@/lib/db/schema"
import { count, gte } from "drizzle-orm"
import Link from "next/link"

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-neutral-600 mt-2">Manage your content and monitor platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Programs"
          value={programStats?.count || 0}
          href="/dashboard/admin/programs"
          color="bg-blue-500"
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents?.count || 0}
          href="/dashboard/admin/events"
          color="bg-green-500"
        />
        <StatCard
          title="Total RSVPs"
          value={rsvpStats?.count || 0}
          href="/dashboard/admin/events"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Users"
          value={userStats?.count || 0}
          href="/dashboard/admin/users"
          color="bg-orange-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Stories"
          value={postStats?.count || 0}
          href="/dashboard/admin/stories"
          color="bg-indigo-500"
        />
        <StatCard
          title="Products"
          value={productStats?.count || 0}
          href="/dashboard/admin/shop"
          color="bg-pink-500"
        />
        <StatCard
          title="All Events"
          value={eventStats?.count || 0}
          href="/dashboard/admin/events"
          color="bg-teal-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton href="/dashboard/admin/programs/new">
            + New Program
          </QuickActionButton>
          <QuickActionButton href="/dashboard/admin/events/new">
            + New Event
          </QuickActionButton>
          <QuickActionButton href="/dashboard/admin/stories/new">
            + New Story
          </QuickActionButton>
          <QuickActionButton href="/dashboard/admin/shop/new">
            + New Product
          </QuickActionButton>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  href,
  color 
}: { 
  title: string
  value: number
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className={`w-12 h-12 ${color} rounded-xl mb-4 flex items-center justify-center`}>
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
        <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
      </div>
    </Link>
  )
}

function QuickActionButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-black/90 transition-colors text-center"
    >
      {children}
    </Link>
  )
}

