import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Users, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface EventCardProps {
  event: {
    id: string
    title: string
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
  return (
    <Link 
      href={event.program ? `/programs/${event.program.slug}/events/${event.id}` : '#'}
      className="h-full"
    >
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-200 hover:border-neutral-300 h-full flex flex-col">
        {/* Image Header */}
        <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
          {event.program?.coverImage ? (
            <Image
              src={event.program.coverImage}
              alt={event.program.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryGradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Date Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
              <div className="text-2xl font-bold text-black">
                {format(new Date(event.startTime), 'd')}
              </div>
              <div className="text-xs font-semibold text-neutral-600 uppercase">
                {format(new Date(event.startTime), 'MMM')}
              </div>
            </div>
          </div>

          {/* Location - Top Right */}
          {event.venueName && (
            <div className="absolute top-4 right-4 flex items-center space-x-1 text-xs text-white text-shadow-md">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{event.venueName}</span>
            </div>
          )}

          {/* Event Details on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-xs text-white text-shadow-md">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
              </span>
            </div>
            {event.capacity && (
              <div className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Capacity: {event.capacity}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-3xl font-crimson font-normal tracking-tighter group-hover:text-amber-900 transition-colors mb-2 flex items-start">
            {event.program?.title || 'Event'}
          </h3>
          {event.program?.description && (
            <p className="text-neutral-600 text-sm line-clamp-2 mb-4 leading-relaxed min-h-[40px]">
              {event.program.description}
            </p>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
            <span className="text-sm font-semibold text-amber-900">
              View Event
            </span>
            <ArrowRight className="w-4 h-4 text-amber-900 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
