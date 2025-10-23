import { ProgramCard } from "@/components/programs/program-card"
import { getCategoryGradient } from "@/lib/constants/programs"
import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export default async function YouthProgramsPage() {
  // Get all youth programs
  const allPrograms = await db.query.programs.findMany({
    where: eq(programs.category, "youth"),
    orderBy: desc(programs.publishedAt),
  })
  
  // Filter out special-events program
  const youthPrograms = allPrograms.filter(p => p.slug !== "special-events")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/0K0A4923.jpg"
          alt="Youth Programs"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              YOUTH PROGRAMS
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4 flex items-center gap-3">
              Soulworx Youth Programs
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Inspiring the next generation through sport, creativity, and purpose.
            </p>
          </div>
        </div>
      </section>


      {/* Programs Grid */}
      <section className="pt-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-8">Youth Programs</h2>
          {youthPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youthPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  categoryGradient={getCategoryGradient(program.category)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Youth Programs Yet</h3>
              <p className="text-neutral-500">Check back soon for new opportunities!</p>
            </div>
          )}
        </div>
      </section>


      {/* About Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-neutral-700 leading-relaxed mb-6 font-crimson">
              Soulworx was built on a simple belief — that every young person deserves a chance to discover who they are, no matter where they come from.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed font-crimson">
              Through basketball, career guidance, and the arts, our programs help youth develop confidence, discipline, and compassion — the tools to rise above circumstance and create change in their communities.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

