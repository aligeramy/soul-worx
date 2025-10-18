import { CategoryCard } from "@/components/ui/category-card"
import { getPublishedPrograms } from "@/lib/db/queries"
import Image from "next/image"
import Link from "next/link"
import { Clock, Users, Calendar, ArrowRight } from "lucide-react"

export default async function ProgramsPage() {
  const programs = await getPublishedPrograms()

  const categories = [
    {
      title: "Calendar",
      description: "View upcoming events and workshops",
      href: "/programs/calendar",
      image: "/optimized/0K0A5232.jpg"
    },
    {
      title: "Youth Workshops",
      description: "Creative writing programs for young minds",
      href: "/programs/youth",
      image: "/optimized/0K0A4923.jpg"
    },
    {
      title: "School Partnerships",
      description: "Collaborative programs with educational institutions",
      href: "/programs/schools",
      image: "/optimized/0K0A3921.jpg"
    },
    {
      title: "FAQ",
      description: "Frequently asked questions about our programs",
      href: "/programs/faq",
      image: "/optimized/0K0A2899.jpg"
    }
  ]

  const categoryColors: Record<string, string> = {
    youth: 'from-purple-500 to-pink-500',
    community: 'from-blue-500 to-cyan-500',
    schools: 'from-green-500 to-emerald-500',
    workshops: 'from-orange-500 to-red-500',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Modern Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full">
              PROGRAMS
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            Find Your
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Voice
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl font-light">
            Transformative programs designed to empower, inspire, and elevate through the art of spoken word
          </p>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.href}
                {...category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Programs Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">All Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => {
              const categoryGradient = categoryColors[program.category] || 'from-neutral-800 to-neutral-900'
              
              return (
                <Link key={program.id} href={`/programs/${program.slug}`}>
                  <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-200 hover:border-neutral-300">
                    {/* Image Header */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {program.coverImage ? (
                        <Image
                          src={program.coverImage}
                          alt={program.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${categoryGradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-xs font-bold rounded-full uppercase tracking-wide">
                          {program.category}
                        </span>
                      </div>
                      
                      {/* Price Badge */}
                      {program.price !== null && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1.5 bg-black/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                            {program.price === "0.00" ? "FREE" : `$${program.price}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-neutral-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {program.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {program.duration && (
                          <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{program.duration}</span>
                          </div>
                        )}
                        {program.ageRange && (
                          <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                            <Users className="w-3.5 h-3.5" />
                            <span>{program.ageRange}</span>
                          </div>
                        )}
                        {program.capacity && (
                          <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Max {program.capacity}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <span className="text-sm font-semibold text-purple-600">
                          View Details
                        </span>
                        <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {programs.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Programs Yet</h3>
              <p className="text-neutral-500">Check back soon for new opportunities!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

