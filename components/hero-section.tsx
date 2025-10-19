"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { HeroNewsSlideshow } from "@/components/hero-news-slideshow"
import { CTAButton } from "@/components/ui/cta-button"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [showNews, setShowNews] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Swap subheading to news after 10 seconds
    const timer = setTimeout(() => {
      setShowNews(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  // Calculate scale based on scroll (starts at 1, goes down to 0.8)
  const scale = Math.max(0.8, 1 - scrollY * 0.0007)
  
  // Calculate border radius based on scroll (starts at 0, goes up to 24px)
  const borderRadius = Math.min(36, scrollY * 0.08)
  
  // Calculate padding based on scroll (starts at 0, goes up to 16px)
  const padding = Math.min(16, scrollY * 0.053)
  
  // Calculate text opacity and translate (fades out and moves up)
  const textOpacity = Math.max(0, 1 - scrollY * 0.003)
  const textTranslateY = -(scrollY * 0.3)

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-brand-bg-darker">
      {/* Noise texture on background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url('/noise.png')`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Video Background Container */}
      <div 
        ref={videoContainerRef}
        className="sticky top-0 w-full h-screen overflow-hidden transition-all duration-75 ease-out"
        style={{
          transform: `scale(${scale})`,
          borderRadius: `${borderRadius}px`,
          padding: `${padding}px`,
        }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-[inherit]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Rich Gradient Overlay - Apple-inspired */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        </div>
      </div>

      {/* Content */}
      <div 
        ref={textContainerRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Main Heading - Apple-like refinement */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-shadow-lg font-light tracking-[-0.025em] text-white leading-[1.1] font-exodus-sharp">
            <TextEffect per="word" preset="fade" delay={0.2}>
              Words that walk through souls
            </TextEffect>
          </h1>

          {/* Subheading → News Slideshow swap area (below header) */}
          <div className="relative min-h-[2rem] md:min-h-[2.25rem] flex items-center justify-center px-4">
            {/* Subheading: visible first 10s, then fades out */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out",
                showNews ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="font-crimson text-lg md:text-xl lg:text-3xl font-normal text-white/70 max-w-3xl mx-auto leading-tigh mt-4">
                <TextEffect per="word" preset="fade" delay={0.8} as="p">
                  Empowering youth through the transformative power of spoken word and creative expression
                </TextEffect>
              </div>
            </div>

            {/* News Slideshow: fades in after 10s, inline single line */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out",
                showNews ? "opacity-100" : "opacity-0"
              )}
            >
              <HeroNewsSlideshow />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto pt-8">
            <CTAButton
              href="/programs"
              variant="primary"
              className="animate-fade-in-up opacity-0"
              style={{ 
                animationDelay: '3s',
                animationFillMode: 'forwards'
              }}
            >
              Explore Programs
            </CTAButton>
            
            <Link 
              href="/stories"
              className="group relative text-white animate-fade-in-up opacity-0 font-monteci"
              style={{ 
                animationDelay: '3.2s',
                animationFillMode: 'forwards'
              }}
            >
              <span className="text-2xl font-normal relative">
                Our Stories
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/60 origin-left scale-x-100 transition-transform duration-300 group-hover:scale-x-0" />
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        style={{ opacity: textOpacity }}
      >
        <div className="w-5 h-8 border border-white/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 bg-white/60 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  )
}

