import Image from "next/image"
import Link from "next/link"
import { Clock, Users, Calendar, ArrowRight } from "lucide-react"

interface ProgramCardProps {
  program: {
    id: string
    title: string
    description: string | null
    slug: string
    coverImage: string | null
    category: string
    price: string | null
    duration: string | null
    ageRange: string | null
    capacity: number | null
  }
  categoryGradient: string
  fullHeight?: boolean
}

export function ProgramCard({ program, categoryGradient, fullHeight = false }: ProgramCardProps) {
  const cardClasses = fullHeight 
    ? "group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-200 hover:border-neutral-300 h-full flex flex-col"
    : "group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-200 hover:border-neutral-300"

  const imageClasses = fullHeight
    ? "relative aspect-[16/10] overflow-hidden flex-shrink-0"
    : "relative aspect-[16/10] overflow-hidden"

  const contentClasses = fullHeight
    ? "p-6 flex flex-col flex-grow"
    : "p-6"

  const titleClasses = fullHeight
    ? "text-3xl font-crimson font-normal tracking-tighter mb-3 group-hover:text-amber-900 transition-colors min-h-[64px] flex items-start"
    : "text-3xl font-crimson font-normal tracking-tighter mb-3 group-hover:text-amber-900 transition-colors"

  const descriptionClasses = fullHeight
    ? "text-neutral-600 text-sm line-clamp-2 mb-4 leading-relaxed min-h-[40px]"
    : "text-neutral-600 text-sm line-clamp-2 mb-4 leading-relaxed"

  const metadataClasses = fullHeight
    ? "flex flex-wrap gap-3 mb-4 flex-grow"
    : "flex flex-wrap gap-3 mb-4"

  const ctaClasses = fullHeight
    ? "flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto"
    : "flex items-center justify-between pt-4 border-t border-neutral-100"

  return (
    <Link 
      href={`/programs/${program.slug}`} 
      className={fullHeight ? "h-full" : ""}
    >
      <div className={cardClasses}>
        {/* Image Header */}
        <div className={imageClasses}>
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
        <div className={contentClasses}>
          <h2 className={titleClasses}>
            {program.title}
          </h2>
          <p className={descriptionClasses}>
            {program.description}
          </p>

          {/* Metadata */}
          <div className={metadataClasses}>
            {program.duration && (
              <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{program.duration}</span>
              </div>
            )}
            {program.ageRange && (
              <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{program.ageRange}</span>
              </div>
            )}
            {program.capacity && (
              <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Max {program.capacity}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className={ctaClasses}>
            <span className="text-sm font-semibold text-amber-900">
              View Details
            </span>
            <ArrowRight className="w-4 h-4 text-amber-900 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

