import { CategoryCard } from "@/components/ui/category-card"
import { getPublishedPrograms } from "@/lib/db/queries"
import { ProgramCard } from "@/components/programs/program-card"
import { getCategoryGradient } from "@/lib/constants/programs"
import Image from "next/image"
import { Calendar } from "lucide-react"

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
      title: "Partnerships",
      description: "Collaborative programs with educational institutions",
      href: "/programs/partnerships",
      image: "/optimized/0K0A3921.jpg"
    },
    {
      title: "FAQ",
      description: "Frequently asked questions about our programs",
      href: "/programs/faq",
      image: "/optimized/0K0A2899.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/programs.jpg"
          alt="Programs"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              PROGRAMS
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Find Your Voice
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Soulworx exists for the youth who've been overlooked, under-resourced, or underestimated.
              Every program is built to open doors, nurture character, and show kids that they are capable of more than they've been told.
              We don't just develop skills — we build purpose, passion, and people.
            </p>
          </div>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="relative z-0 pb-16 px-6 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-8">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="relative z-0 pb-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-8">All Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                categoryGradient={getCategoryGradient(program.category)}
              />
            ))}
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

