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
      venueName: "Soul Worx Community Center",
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
  const allRsvps = [mockEvent, ...rsvps]

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
              <CalendarGrid rsvps={allRsvps} />
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
              <EventList rsvps={allRsvps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

