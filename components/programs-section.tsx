"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CTAButton } from "@/components/ui/cta-button"
import { cn } from "@/lib/utils"

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
  startTime: Date
  endTime: Date
  venueName: string | null
  venueCity: string | null
}

interface ProgramWithEvent extends Program {
  upcomingEvent?: Event
}

interface ProgramsSectionProps {
  programs: Program[]
  upcomingPrograms?: ProgramWithEvent[]
}

export function ProgramsSection({ programs, upcomingPrograms = [] }: ProgramsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)

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
      ? Math.min(programs.length, 10)
      : programs.filter(p => {
          // Calculate carousel length based on second column allocation
          const secondColIds = new Set<string>()
          const tempSecondCol: Program[] = []
          
          for (const prog of upcomingPrograms) {
            if (!secondColIds.has(prog.id) && tempSecondCol.length < 2) {
              tempSecondCol.push(prog)
              secondColIds.add(prog.id)
            }
          }
          
          if (tempSecondCol.length < 2) {
            for (const prog of programs) {
              if (!secondColIds.has(prog.id) && tempSecondCol.length < 2) {
                tempSecondCol.push(prog)
                secondColIds.add(prog.id)
              }
            }
          }
          
          return !secondColIds.has(p.id)
        }).length
    
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
  }, [programs, upcomingPrograms])

  // Calculate transformations based on scroll progress
  const bgScale = 1 + scrollProgress * 0.2 // Scale from 1 to 1.2 for Ken Burns effect
  const bgTranslateX = scrollProgress * 30 // Ken Burns horizontal pan
  const bgTranslateY = scrollProgress * 20 // Ken Burns vertical pan
  const opacity = Math.min(scrollProgress * 1.5, 1) // Fade in
  const contentTranslateY = (1 - scrollProgress) * 40 // Content rises into view
  const topGradientOpacity = Math.max(1 - scrollProgress * 1.2, 0) // Fade out as we scroll

  // Strategy: Allocate 2 programs to second column first, then carousel gets the rest
  const seenIds = new Set<string>()
  const secondColumnPrograms: (Program | ProgramWithEvent)[] = []
  
  // First, add up to 2 upcoming programs for second column
  for (const program of upcomingPrograms) {
    if (!seenIds.has(program.id) && secondColumnPrograms.length < 2) {
      secondColumnPrograms.push(program)
      seenIds.add(program.id)
    }
  }
  
  // If we need more for second column, add regular programs
  if (secondColumnPrograms.length < 2) {
    for (const program of programs) {
      if (!seenIds.has(program.id) && secondColumnPrograms.length < 2) {
        secondColumnPrograms.push(program)
        seenIds.add(program.id)
      }
    }
  }
  
  // Carousel gets all remaining programs (not in second column), max 5
  const carouselPrograms = programs.filter(p => !seenIds.has(p.id)).slice(0, 5)
  
  // Find the program with the next (earliest) upcoming event (for all programs)
  const allProgramsWithEvents = [...secondColumnPrograms, ...carouselPrograms]
  const nextUpcomingProgramId = allProgramsWithEvents
    .filter(p => 'upcomingEvent' in p && p.upcomingEvent)
    .sort((a, b) => {
      const aDate = (a as ProgramWithEvent).upcomingEvent!.startTime
      const bDate = (b as ProgramWithEvent).upcomingEvent!.startTime
      return new Date(aDate).getTime() - new Date(bDate).getTime()
    })[0]?.id
  
  // Mobile slideshow: all programs with events mapped
  const mobilePrograms: (Program | ProgramWithEvent)[] = programs.slice(0, 10).map(program => {
    const upcomingEvent = upcomingPrograms.find(up => up.id === program.id)
    return upcomingEvent || program
  })

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
            background: 'linear-gradient(to bottom, rgb(25, 21, 18) 0%, rgb(25, 21, 18) 5%, rgba(25, 21, 18, 0.95) 10%, rgba(25, 21, 18, 0.85) 20%, rgba(25, 21, 18, 0.6) 35%, rgba(25, 21, 18, 0.3) 50%, transparent 100%)',
          }} 
        />

        {/* Permanent Top Gradient with Noise */}
        <div 
          className="absolute top-0 inset-x-0 pointer-events-none" 
          style={{ 
            height: '60%',
            background: 'linear-gradient(to bottom, rgb(25, 21, 18), rgba(25, 21, 18, 0.9), rgba(25, 21, 18, 0.7), rgba(25, 21, 18, 0.5), rgba(25, 21, 18, 0.3), rgba(25, 21, 18, 0.15), transparent)',
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
            background: 'linear-gradient(to bottom, rgba(25, 21, 18, 0.6), rgba(25, 21, 18, 0.4), rgba(25, 21, 18, 0.2), transparent)',
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
              <div className=" rounded-3xl p-4 ransition-shadow duration-500">
                <div className="space-y-2">
                  <h2 className="text-5xl font-crimson font-medium tracking-tighter text-white   leading-tight">
                    Discover Our Programs
                  </h2>

                  <p className="text-base font-crimson text-neutral-200 font-light leading-relaxed">
                    Empowering youth through spoken word, creative expression, and community building. 
                    Join us in transforming lives through the power of words.
                  </p>

                  {/* CTA Button */}
                  <div className="flex mt-2">
                    <CTAButton
                      href="/programs"
                      variant="secondary"
                      className="w-full"
                      showArrow={false}
                    >
                      Explore All Programs
                    </CTAButton>
                  </div>
                </div>
              </div>

              {/* Latest Programs - 2 Column Layout */}
              {(carouselPrograms.length > 0 || secondColumnPrograms.length > 0) && (
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
                          {mobilePrograms.map((program) => {
                            const hasUpcomingEvent = 'upcomingEvent' in program && program.upcomingEvent
                            const isNextUpcoming = program.id === nextUpcomingProgramId
                            return (
                              <Link 
                                key={program.id} 
                                href={`/programs/${program.slug}`}
                                className="min-w-full group cursor-pointer"
                              >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                                  {program.coverImage && (
                                    <Image
                                      src={program.coverImage}
                                      alt={program.title}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                  
                                  {/* Upcoming Badge */}
                                  {isNextUpcoming && (
                                    <div className="absolute top-3 right-3">
                                      <span className="px-2 py-1 border border-white text-white text-xs font-bold rounded-full backdrop-blur-sm">
                                        UPCOMING
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-white/80">
                                      {program.category && (
                                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                          {program.category}
                                        </span>
                                      )}
                                      {program.duration && (
                                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                          {program.duration}
                                        </span>
                                      )}
                                    </div>
                                    {hasUpcomingEvent ? (
                                      <div className="text-xs text-white/90 font-medium">
                                        {new Date(program.upcomingEvent!.startTime).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric' 
                                        })}
                                        {program.upcomingEvent!.venueCity && ` • ${program.upcomingEvent!.venueCity}`}
                                      </div>
                                    ) : null}
                                    <h4 className="text-lg font-crimson font-bold text-white">
                                      {program.title}
                                    </h4>
                                    <p className="text-xs text-white/90 line-clamp-2">
                                      {program.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                        
                        {/* Carousel Dots */}
                        {mobilePrograms.length > 1 && (
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
                            {mobilePrograms.map((_, index) => (
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
                      {/* Column 1: Static Programs (2 stacked) */}
                      <div className="flex flex-col gap-3">
                        {secondColumnPrograms.map((program, index) => {
                          const hasUpcomingEvent = 'upcomingEvent' in program && program.upcomingEvent
                          const isNextUpcoming = program.id === nextUpcomingProgramId
                          return (
                            <Link 
                              key={`${program.id}-${index}`}
                              href={`/programs/${program.slug}`}
                              className="group cursor-pointer flex-1"
                            >
                              <div className="relative h-full overflow-hidden rounded-xl min-h-[140px]">
                                {program.coverImage && (
                                  <Image
                                    src={program.coverImage}
                                    alt={program.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                
                                {/* Upcoming Badge - only on next upcoming event */}
                                {isNextUpcoming && (
                                  <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 border border-white text-white text-xs font-bold rounded-full backdrop-blur-sm">
                                      UPCOMING
                                    </span>
                                  </div>
                                )}
                                
                                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                                  {hasUpcomingEvent && (
                                    <div className="text-xs text-white/90 font-medium">
                                      {new Date(program.upcomingEvent!.startTime).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                      {program.upcomingEvent!.venueCity && ` • ${program.upcomingEvent!.venueCity}`}
                                    </div>
                                  )}
                                  <h4 className="text-base font-crimson font-bold text-white line-clamp-2">
                                    {program.title}
                                  </h4>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Column 2: Portrait Carousel */}
                      {carouselPrograms.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl">
                          <div 
                            className="flex transition-transform duration-700 ease-out"
                            style={{ 
                              transform: `translateX(-${currentSlide * 100}%)` 
                            }}
                          >
                            {carouselPrograms.map((program) => (
                              <Link 
                                key={program.id} 
                                href={`/programs/${program.slug}`}
                                className="min-w-full group cursor-pointer"
                              >
                              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                                {program.coverImage && (
                                  <Image
                                    src={program.coverImage}
                                    alt={program.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                  <div className="flex items-center gap-2 text-xs text-white/80">
                                    {program.category && (
                                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                        {program.category}
                                      </span>
                                    )}
                                    {program.duration && (
                                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                        {program.duration}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-lg font-bold text-white">
                                    {program.title}
                                  </h4>
                                  <p className="text-xs text-white/90 line-clamp-2">
                                    {program.description}
                                  </p>
                                </div>
                              </div>
                              </Link>
                            ))}
                          </div>
                          
                          {/* Carousel Dots */}
                          {carouselPrograms.length > 1 && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
                              {carouselPrograms.map((_, index) => (
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
          background: 'linear-gradient(to bottom, transparent 0%, rgba(25, 21, 18, 0.3) 30%, rgba(25, 21, 18, 0.7) 70%, rgb(25, 21, 18) 100%)',
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

