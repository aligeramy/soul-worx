"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Users, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string | null
    images: string[] | null
    startTime: Date
    endTime: Date
    venueName: string | null
    capacity: number | null
    program: {
      title: string
      slug: string
      coverImage: string | null
      category: string
      description: string | null
    } | null
  }
  categoryGradient: string
}

export function EventCard({ event, categoryGradient }: EventCardProps) {
  // Get first image from images array, fallback to program cover image
  const imageSrc = (event.images && event.images.length > 0) 
    ? event.images[0] 
    : event.program?.coverImage || null
  
  return (
    <Link 
      href={event.program ? `/programs/${event.program.slug}/events/${event.id}` : '#'}
      className="block group h-full"
    >
      <div className="relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-neutral-200 h-full">
        <div className="relative aspect-[4/5] overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={event.title}
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
              {/* Date Badge */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-black">
                  {format(new Date(event.startTime), 'd')}
                </div>
                <div className="text-xs font-semibold text-neutral-600 uppercase">
                  {format(new Date(event.startTime), 'MMM')}
                </div>
              </div>

              {/* Location */}
              {event.venueName && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white rounded-full text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{event.venueName}</span>
                </div>
              )}
            </div>

            {/* Bottom content */}
            <div className="space-y-3">
              <div>
                <h3 className="text-4xl tracking-tighter font-crimson font-normal text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-white/80 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Event Details */}
              <div className="flex flex-wrap gap-3 text-white/70 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                  </span>
                </div>
                {event.capacity && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-sm font-semibold text-white">
                  View Event
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
