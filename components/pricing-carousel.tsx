"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"

const defaultTiers: PricingTier[] = [
  {
    name: "Free",
    type: "Membership",
    price: "$0",
    priceUnit: "",
    features: [
      "Program announcements",
      "Community access",
      "Weekly newsletter"
    ],
    styling: {
      bg: "bg-white/5 backdrop-blur-sm",
      text: "text-white",
      border: "border-white/10",
      hover: "hover:bg-white/10"
    }
  },
  {
    name: "Pro",
    type: "Membership",
    price: "$10",
    priceUnit: "/mo",
    features: [
      "Video library access",
      "Exclusive channels",
      "Digital workshops"
    ],
    popular: true,
    styling: {
      bg: "bg-white",
      text: "text-black",
      border: "border-white",
      hover: "hover:bg-white"
    }
  },
  {
    name: "Hall of Fame",
    type: "Membership",
    price: "$25",
    priceUnit: "/mo",
    features: [
      "Live sessions",
      "Early merch access",
      "1-on-1 Q&A"
    ],
    styling: {
      bg: "bg-white/5 backdrop-blur-sm",
      text: "text-white",
      border: "border-white/10",
      hover: "hover:bg-white/10"
    }
  }
]

interface PricingCarouselProps {
  tiers?: PricingTier[]
  variant?: "dark" | "light"
}

export function PricingCarousel({ tiers = defaultTiers, variant = "dark" }: PricingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe && currentSlide < tiers.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Auto-rotate carousel on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % tiers.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pt-8">
      {/* Mobile: Full-screen carousel */}
      <div className="md:hidden">
        <div 
          className="relative overflow-hidden pt-10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-x' }}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)` 
            }}
          >
            {tiers.map((tier) => (
              <div key={tier.name} className="min-w-full px-4 pt-8 pb-6">
                <PricingCard tier={tier} isMobile={true} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Dots - Below the cards */}
        <div className="flex justify-center items-center gap-2 pt-4">
          {tiers.map((_, index) => (
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
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <PricingCard key={tier.name} tier={tier} isMobile={false} />
        ))}
      </div>
    </div>
  )
}

