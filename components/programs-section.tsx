"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Calendar, Users, School, HelpCircle, ArrowRight } from "lucide-react"
import { getCategoryGradient } from "@/lib/constants/programs"
import { format } from "date-fns"

interface Program {
  id: string
  slug: string
  title: string
  description: string
  coverImage: string | null
  category: string
  ageRange: string | null
  duration: string | null
}

interface Event {
  id: string
  programId: string
  title: string
  description: string | null
  images: string[] | null
  startTime: Date
  endTime: Date
  venueName: string | null
  venueCity: string | null
  program: {
    title: string
    slug: string
    coverImage: string | null
    category: string
    description: string | null
  } | null
}

interface ProgramWithEvent extends Program {
  upcomingEvent?: Event
}

interface ProgramsSectionProps {
  programs: Program[]
  upcomingPrograms?: ProgramWithEvent[]
  events?: Event[]
}

export function ProgramsSection({ events = [] }: ProgramsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Helper function to extract image string from images array
  const getImageSrc = (images: string[] | null | undefined, fallback: string | null | undefined): string | null => {
    if (images && images.length > 0) {
      return images[0]
    }
    return fallback || null
  }

  // Strategy: Allocate 2 special events to left column, then carousel gets latest regular events
  const seenIds = new Set<string>()
  const secondColumnEvents: Event[] = []
  
  // Filter special events (events from programs with category "special")
  const specialEvents = events.filter(e => e.program?.category === "special")
  
  // Add up to 2 special events for left column
  for (const event of specialEvents) {
    if (!seenIds.has(event.id) && secondColumnEvents.length < 2) {
      secondColumnEvents.push(event)
      seenIds.add(event.id)
    }
  }
  
  // If we need more for left column, add other events
  if (secondColumnEvents.length < 2) {
    for (const event of events) {
      if (!seenIds.has(event.id) && secondColumnEvents.length < 2) {
        secondColumnEvents.push(event)
        seenIds.add(event.id)
      }
    }
  }
  
  // Carousel gets all remaining events (not in second column), excluding special events, max 5
  const carouselEvents = events.filter(e => !seenIds.has(e.id) && e.program?.category !== "special").slice(0, 5)
  
  // Find the earliest event for highlighting (currently unused but kept for future features)
  const allEvents = [...secondColumnEvents, ...carouselEvents]
  // const nextUpcomingEventId = allEvents
  //   .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0]?.id
  
  // Mobile slideshow: all events, excluding special events
  const mobileEvents = events
    .filter(e => e.program?.category !== "special")
    .slice(0, 10)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const sectionTop = rect.top
      const windowHeight = window.innerHeight

      // Calculate progress: 0 when section enters viewport, 1 when it reaches top
      const progress = Math.min(Math.max((windowHeight - sectionTop) / windowHeight, 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    // Check window width to determine which carousel length to use
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    
    const carouselLength = isMobile 
      ? Math.min(mobileEvents.length, 10)
      : carouselEvents.length
    
    if (carouselLength === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselLength)
    }, 4000)
    
    // Reset slide on resize
    const handleResize = () => {
      setCurrentSlide(0)
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [carouselEvents.length, mobileEvents.length])

  // Calculate transformations based on scroll progress
  const bgScale = 1 + scrollProgress * 0.2 // Scale from 1 to 1.2 for Ken Burns effect
  const bgTranslateX = scrollProgress * 30 // Ken Burns horizontal pan
  const bgTranslateY = scrollProgress * 20 // Ken Burns vertical pan
  const opacity = Math.min(scrollProgress * 1.5, 1) // Fade in
  const contentTranslateY = (1 - scrollProgress) * 40 // Content rises into view
  const topGradientOpacity = Math.max(1 - scrollProgress * 1.2, 0) // Fade out as we scroll

  return (
    <div ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-brand-bg-darker">
      {/* Background Image - Ken Burns effect (zoom and pan) */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          transform: `scale(${bgScale}) translate(${bgTranslateX}px, ${bgTranslateY}px)`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <Image
          src="/home/programs-bg.png"
          alt="Programs Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-darker/60 to-brand-bg-darker/30" />
      </div>

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          backgroundImage: `url('/noise.png')`,
          backgroundRepeat: 'repeat',
          opacity: 0.3,
        }}
      />

      {/* Animated highlights */}
      <div 
        className="absolute pointer-events-none z-6"
        style={{
          left: '15%',
          top: '25%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute pointer-events-none z-6"
        style={{
          left: '70%',
          top: '70%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 14s ease-in-out infinite reverse',
        }}
      />

      {/* Static Gradient Container - Does not scale with background */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Additional Top Fade Layer - No Noise - Stronger blend */}
        <div 
          className="absolute top-0 inset-x-0 pointer-events-none" 
          style={{ 
            height: '60%',
            background: 'linear-gradient(to bottom, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)) 0%, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)) 5%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.95) 10%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.85) 20%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.6) 35%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.3) 50%, transparent 100%)',
          }} 
        />

        {/* Permanent Top Gradient with Noise */}
        <div 
          className="absolute top-0 inset-x-0 pointer-events-none" 
          style={{ 
            height: '60%',
            background: 'linear-gradient(to bottom, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.9), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.7), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.5), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.3), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.15), transparent)',
          }} 
        >
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url('/noise.png')`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>
        
        {/* Scroll-triggered fade overlay with noise */}
        <div 
          className="absolute top-0 inset-x-0 pointer-events-none" 
          style={{ 
            height: '50%',
            background: 'linear-gradient(to bottom, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.6), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.4), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.2), transparent)',
            opacity: topGradientOpacity,
          }} 
        >
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url('/noise.png')`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>
      </div>

      {/* Foreground Image - stuck to bottom of section, fit to width */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{
          opacity: opacity,
          transition: 'opacity 0.1s ease-out',
        }}
      >
        <div className="relative w-full">
          <Image
            src="/home/programs-fg.png"
            alt="Programs"
            width={1920}
            height={1080}
            className="w-full h-auto object-bottom"
            priority
          />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-30 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - empty space for the person in the image on desktop */}
            <div className="hidden lg:block" />

            {/* Right side - Content Card */}
            <div 
              className="space-y-8"
              style={{
                opacity: opacity,
                transform: `translateY(${contentTranslateY}px)`,
                transition: 'all 0.1s ease-out',
              }}
            >
              {/* Main Content Card */}
              <div className=" rounded-3xl p-4 ransition-shadow duration-500 backdrop-blur-sm">
                <div className="space-y-2">
                  <h2 className="text-5xl font-crimson font-medium tracking-tighter text-white   leading-tight">
                    Discover Our Programs
                  </h2>

                  {/* Program Description - Hidden */}
                  <p className="text-xl font-crimson text-shadow-lg text-neutral-200 font-light leading-tight hidden md:block">
                    Soulworx exists for the youth who&apos;ve been overlooked, under-resourced, or underestimated.
                    Every program is built to open doors, nurture character, and show kids that they are capable of more than they&apos;ve been told.
                    We don&apos;t just develop skills — we build purpose, passion, and people.
                  </p>

                  {/* Program Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Link 
                      href="/programs/calendar"
                      className="group relative aspect-square rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                      aria-label="View programs calendar"
                    >
                      <div className="absolute inset-px rounded-[10px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full border border-white/30 bg-white/5 flex items-center justify-center shadow-sm">
                          <Calendar className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                        </div>
                        <span className="text-white font-medium text-sm">Calendar</span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-white/70" />
                      </div>
                    </Link>
                    <Link 
                      href="/programs/youth"
                      className="group relative aspect-square rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                      aria-label="Explore youth programs"
                    >
                      <div className="absolute inset-px rounded-[10px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full border border-white/30 bg-white/5 flex items-center justify-center shadow-sm">
                          <Users className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                        </div>
                        <span className="text-white font-medium text-sm">Youth</span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-white/70" />
                      </div>
                    </Link>
                    <Link 
                      href="/programs/partnerships"
                      className="group relative aspect-square rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                      aria-label="Learn about partnerships"
                    >
                      <div className="absolute inset-px rounded-[10px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full border border-white/30 bg-white/5 flex items-center justify-center shadow-sm">
                          <School className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                        </div>
                        <span className="text-white font-medium text-sm">Partnerships</span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-white/70" />
                      </div>
                    </Link>
                    <Link 
                      href="/programs/faq"
                      className="group relative aspect-square rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                      aria-label="Read program FAQs"
                    >
                      <div className="absolute inset-px rounded-[10px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full border border-white/30 bg-white/5 flex items-center justify-center shadow-sm">
                          <HelpCircle className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                        </div>
                        <span className="text-white font-medium text-sm">FAQ</span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-white/70" />
                      </div>
                    </Link>
                  </div>

                  {/* View All Link */}
                  <div className="mt-4">
                    <Link 
                      href="/programs"
                      className="flex justify-center items-center gap-2 text-white/80 hover:text-white transition-colors group"
                    >
                      <span className="font-medium text-sm ">View All Programs</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Latest Events - 2 Column Layout */}
              {(carouselEvents.length > 0 || secondColumnEvents.length > 0) && (
                <div className="bg-brand-bg-darker/80 rounded-xl p-5 shadow-2xl">
                  <div className="space-y-3">
                   

                    {/* Mobile: Single Slideshow */}
                    <div className="md:hidden">
                      <div className="relative overflow-hidden rounded-xl">
                        <div 
                          className="flex transition-transform duration-700 ease-out"
                          style={{ 
                            transform: `translateX(-${currentSlide * 100}%)` 
                          }}
                        >
                          {mobileEvents.map((event) => {
                            const gradient = event.program ? getCategoryGradient(event.program.category) : "from-neutral-500 to-neutral-600"
                            const imageSrc = getImageSrc(event.images, event.program?.coverImage)
                            return (
                              <Link 
                                key={event.id} 
                                href={event.program ? `/programs/${event.program.slug}/events/${event.id}` : '#'}
                                className="min-w-full group cursor-pointer"
                              >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                                  {imageSrc ? (
                                    <Image
                                      src={imageSrc}
                                      alt={event.title}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                  
                                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                    <div className="text-xs text-white/90 font-medium">
                                      {format(new Date(event.startTime), 'MMM d')}
                                      {event.venueCity && ` • ${event.venueCity}`}
                                    </div>
                                    <h4 className="text-3xl font-crimson font-normal tracking-tighter text-white">
                                      {event.title}
                                    </h4>
                                    {event.description && (
                                      <p className="text-xs text-white/90 line-clamp-2">
                                        {event.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                        
                        {/* Carousel Dots */}
                        {mobileEvents.length > 1 && (
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
                            {mobileEvents.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={cn(
                                  "transition-all duration-300 rounded-full",
                                  currentSlide === index
                                    ? "w-6 h-1.5 bg-white"
                                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop: 2 Column Grid */}
                    <div className="hidden md:grid grid-cols-2 gap-3">
                      {/* Column 1: Static Events (2 stacked) */}
                      <div className="flex flex-col gap-3">
                        {secondColumnEvents.map((event, index) => {
                          const gradient = event.program ? getCategoryGradient(event.program.category) : "from-neutral-500 to-neutral-600"
                          const imageSrc = getImageSrc(event.images, event.program?.coverImage)
                          return (
                            <Link 
                              key={`${event.id}-${index}`}
                              href={event.program ? `/programs/${event.program.slug}/events/${event.id}` : '#'}
                              className="group cursor-pointer flex-1"
                            >
                              <div className="relative h-full overflow-hidden rounded-xl min-h-[140px]">
                                {imageSrc ? (
                                  <Image
                                    src={imageSrc}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                                  <div className="text-xs text-white/90 font-medium">
                                    {format(new Date(event.startTime), 'MMM d')}
                                    {event.venueCity && ` • ${event.venueCity}`}
                                  </div>
                                  <h4 className="text-2xl font-crimson font-normal tracking-tighter text-white line-clamp-2">
                                    {event.title}
                                  </h4>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Column 2: Portrait Carousel */}
                      {carouselEvents.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl">
                          <div 
                            className="flex transition-transform duration-700 ease-out"
                            style={{ 
                              transform: `translateX(-${currentSlide * 100}%)` 
                            }}
                          >
                            {carouselEvents.map((event) => {
                              const gradient = event.program ? getCategoryGradient(event.program.category) : "from-neutral-500 to-neutral-600"
                              const imageSrc = getImageSrc(event.images, event.program?.coverImage)
                              return (
                              <Link 
                                key={event.id} 
                                href={event.program ? `/programs/${event.program.slug}/events/${event.id}` : '#'}
                                className="min-w-full group cursor-pointer"
                              >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                                  {imageSrc ? (
                                    <Image
                                      src={imageSrc}
                                      alt={event.title}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                    <div className="text-xs text-white/90 font-medium">
                                      {format(new Date(event.startTime), 'MMM d')}
                                      {event.venueCity && ` • ${event.venueCity}`}
                                    </div>
                                    <h4 className="text-3xl font-crimson font-normal tracking-tighter text-white">
                                      {event.title}
                                    </h4>
                                    {event.description && (
                                      <p className="text-xs text-white/90 line-clamp-2">
                                        {event.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            )})}
                          </div>
                          
                          {/* Carousel Dots */}
                          {carouselEvents.length > 1 && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
                              {carouselEvents.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentSlide(index)}
                                  className={cn(
                                    "transition-all duration-300 rounded-full",
                                    currentSlide === index
                                      ? "w-6 h-1.5 bg-white"
                                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                                  )}
                                  aria-label={`Go to slide ${index + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to testimonials section */}
      <div 
        className="absolute bottom-0 inset-x-0 h-40 z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.3) 30%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.7) 70%, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)) 100%)',
        }}
      >
        {/* Noise texture for gradient */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/noise.png')`,
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

    </div>
  )
}

