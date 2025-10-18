import { getProgramBySlug, getEventsByProgram } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import Image from "next/image"
import { EventCard } from "@/components/programs/event-card"
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

  const categoryColors: Record<string, string> = {
    youth: 'from-purple-500 to-pink-500',
    community: 'from-blue-500 to-cyan-500',
    schools: 'from-green-500 to-emerald-500',
    workshops: 'from-orange-500 to-red-500',
  }

  const gradient = categoryColors[program.category] || 'from-neutral-800 to-neutral-900'

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Modern Hero */}
      <section className="relative">
        {/* Background Image */}
        <div className="relative h-[60vh] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Floating Card */}
        <div className="relative -mt-32 px-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white text-sm font-bold rounded-full uppercase tracking-wide`}>
                  {program.category}
                </span>
                {program.price !== null && (
                  <span className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full">
                    {program.price === "0.00" ? "FREE PROGRAM" : `$${program.price}`}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {program.title}
              </h1>

              <p className="text-xl text-neutral-600 leading-relaxed mb-8">
                {program.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {program.duration && (
                  <div className="bg-neutral-50 rounded-2xl p-4">
                    <Clock className="w-5 h-5 text-neutral-400 mb-2" />
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Duration</div>
                    <div className="text-sm font-bold">{program.duration}</div>
                  </div>
                )}
                {program.ageRange && (
                  <div className="bg-neutral-50 rounded-2xl p-4">
                    <Users className="w-5 h-5 text-neutral-400 mb-2" />
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Age Range</div>
                    <div className="text-sm font-bold">{program.ageRange}</div>
                  </div>
                )}
                {program.capacity && (
                  <div className="bg-neutral-50 rounded-2xl p-4">
                    <Calendar className="w-5 h-5 text-neutral-400 mb-2" />
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Capacity</div>
                    <div className="text-sm font-bold">{program.capacity} spots</div>
                  </div>
                )}
                {program.price !== null && (
                  <div className="bg-neutral-50 rounded-2xl p-4">
                    <DollarSign className="w-5 h-5 text-neutral-400 mb-2" />
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Investment</div>
                    <div className="text-sm font-bold">
                      {program.price === "0.00" ? "Free" : `$${program.price}`}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {program.tags && program.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {program.duration && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-2">Duration</div>
                <div className="text-xl font-bold">{program.duration}</div>
              </div>
            )}
            {program.ageRange && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-2">Age Range</div>
                <div className="text-xl font-bold">{program.ageRange}</div>
              </div>
            )}
            {program.capacity && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-2">Max Capacity</div>
                <div className="text-xl font-bold">{program.capacity} people</div>
              </div>
            )}
            {program.price !== null && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-2">Price</div>
                <div className="text-xl font-bold">
                  {program.price === "0.00" ? "Free" : `$${program.price}`}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Long Description */}
      {program.longDescription && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div dangerouslySetInnerHTML={{ __html: program.longDescription }} />
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Upcoming Sessions</h2>
          
          {upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} programSlug={slug} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
              <p className="text-xl text-neutral-500 mb-2">No upcoming sessions scheduled</p>
              <p className="text-neutral-400">Check back soon for new dates!</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      {program.faqs && program.faqs.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {program.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-neutral-200">
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parent Consent Notice */}
      {program.requiresParentConsent && (
        <section className="py-8 px-6 bg-yellow-50 border-y border-yellow-200">
          <div className="max-w-5xl mx-auto flex items-start space-x-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Parent/Guardian Consent Required</h3>
              <p className="text-neutral-700">
                Participants under 18 must have parent or guardian consent to register for this program.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

