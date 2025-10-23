import { getProgramBySlug, getEventsByProgram } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import Image from "next/image"
import { EventCard } from "@/components/programs/event-card"
import { getCategoryGradient } from "@/lib/constants/programs"
import { Clock, Users, DollarSign, Calendar } from "lucide-react"

export default async function ProgramDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  // Await params in Next.js 15
  const { slug } = await params
  const program = await getProgramBySlug(slug)

  if (!program || program.status !== "published") {
    notFound()
  }

  const events = await getEventsByProgram(program.id)
  const upcomingEvents = events.filter(
    (event) => event.status === "scheduled" && new Date(event.startTime) > new Date()
  )

  const gradient = getCategoryGradient(program.category)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        {program.coverImage ? (
          <Image
            src={program.coverImage}
            alt={program.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-xs font-bold rounded-full uppercase tracking-wide">
                {program.category}
              </span>
              {program.price !== null && (
                <span className="px-3 py-1.5 bg-black/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  {program.price === "0.00" ? "FREE" : `$${program.price}`}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              {program.title}
            </h1>

            <p className="text-xl text-white/90 max-w-3xl">
              {program.description}
            </p>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl !font-crimson font-normal tracking-tighter mt-4 mb-3">Program Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {program.duration && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <Clock className="w-6 h-6 text-neutral-400 mb-3" />
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-bold">Duration</div>
                <div className="text-lg font-medium">{program.duration}</div>
              </div>
            )}
            {program.ageRange && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <Users className="w-6 h-6 text-neutral-400 mb-3" />
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-bold">Age Range</div>
                <div className="text-lg font-medium">{program.ageRange}</div>
              </div>
            )}
            {program.capacity && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <Calendar className="w-6 h-6 text-neutral-400 mb-3" />
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-bold">Capacity</div>
                <div className="text-lg font-medium">{program.capacity} spots</div>
              </div>
            )}
            {program.price !== null && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <DollarSign className="w-6 h-6 text-neutral-400 mb-3" />
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-bold">Price</div>
                <div className="text-lg font-medium">
                  {program.price === "0.00" ? "Free" : `$${program.price}`}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {program.tags && program.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {program.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Long Description */}
      {program.longDescription && (
        <section className="py-16 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mt-4 mb-3">About This Program</h2>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: program.longDescription }} />
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-crimson font-normal tracking-tighter mt-4 mb-3">Upcoming Sessions</h2>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                const eventWithProgram = {
                  id: event.id,
                  title: event.title,
                  description: event.description,
                  startTime: event.startTime,
                  endTime: event.endTime,
                  venueName: event.venueName,
                  capacity: event.capacity,
                  program: {
                    title: program.title,
                    slug: program.slug,
                    coverImage: program.coverImage,
                    category: program.category,
                    description: program.description
                  }
                }
                return (
                  <EventCard 
                    key={event.id} 
                    event={eventWithProgram} 
                    categoryGradient={gradient} 
                  />
                )
              })}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-3xl p-12 text-center">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-xl font-crimson font-normal tracking-tighter text-neutral-600 mb-2">No upcoming sessions scheduled</p>
              <p className="text-neutral-500">Check back soon for new dates!</p>
            </div>
          )}
        </div>
      </section>

      {/* Parent/Guardian Consent Banner */}
      <section className="py-3 px-6 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-amber-900">
            <span className="font-bold">⚠️ Parent/Guardian Consent Required</span>
            <span className="text-amber-700">—</span>
            <span className="text-amber-800">Participants under 18 must have parent or guardian consent to register</span>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {program.faqs && program.faqs.length > 0 && (
        <section className="py-16 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mt-4 mb-3">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {program.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-2xl font-crimson font-normal mt-4 mb-3">{faq.question}</h3>
                  <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

