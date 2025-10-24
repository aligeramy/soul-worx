import { getPublishedPrograms, getUpcomingEvents } from "@/lib/db/queries"
import { ProgramCard } from "@/components/programs/program-card"
import { EventCard } from "@/components/programs/event-card"
import { getCategoryGradient } from "@/lib/constants/programs"
import Image from "next/image"
import { Calendar } from "lucide-react"

export default async function ProgramsCalendarPage() {
  const [programs, upcomingEvents] = await Promise.all([
    getPublishedPrograms(),
    getUpcomingEvents()
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <Image
          src="/optimized/events.jpg"
          alt="Calendar"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              CALENDAR
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Upcoming Events
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Join us for transformative workshops, performances, and community gatherings
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="pb-16 px-6 pt-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  categoryGradient={getCategoryGradient(event.program?.category || '')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Programs */}
      <section className="pb-2 px-6 pt-16 bg-brand-bg-darker">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-crimson !font-light tracking-tight text-white text-center">All Programs</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mt-2 text-center !mb-10">
            Explore our full collection of programs, workshops, partnerships and more—each built to inspire and empower youth and our creative community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                categoryGradient={getCategoryGradient(program.category)}
                fullHeight={true}
              />
            ))}
          </div>

          {programs.length === 0 && (
            <div className="text-center py-24 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-white/60" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">No Programs Yet</h3>
              <p className="text-white/70">Check back soon for new opportunities!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

