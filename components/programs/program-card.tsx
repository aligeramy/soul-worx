"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Users, Calendar, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
  return (
    <Link 
      href={`/programs/${program.slug}`} 
      className={cn("block group", fullHeight && "h-full")}
    >
      <div className={cn(
        "relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-neutral-200 h-full",
        fullHeight && "h-full"
      )}>
        <div className="relative aspect-[4/5] overflow-hidden">
          {program.coverImage ? (
            <Image
              src={program.coverImage}
              alt={program.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryGradient}`} />
          )}
          
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Top badges */}
            <div className="flex items-start justify-between">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-xs font-bold rounded-full uppercase tracking-wide">
                {program.category}
              </span>
              
              {program.price !== null && (
                <span className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  {program.price === "0.00" ? "FREE" : `$${program.price}`}
                </span>
              )}
            </div>

            {/* Bottom content */}
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-crimson tracking-tighter font-normal text-white mb-2 line-clamp-2">
                  {program.title}
                </h2>
                {program.description && (
                  <p className="text-sm text-white/80 line-clamp-2">
                    {program.description}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 text-white/70 text-xs">
                {program.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{program.duration}</span>
                  </div>
                )}
                {program.ageRange && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{program.ageRange}</span>
                  </div>
                )}
                {program.capacity && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Max {program.capacity}</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-sm font-semibold text-white">
                  View Details
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

