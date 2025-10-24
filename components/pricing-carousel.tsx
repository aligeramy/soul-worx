"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface PricingTier {
  name: string
  type: string
  price: string
  priceUnit: string
  features: string[]
  popular?: boolean
  styling: {
    bg: string
    text: string
    border: string
    hover: string
  }
}

const tiers: PricingTier[] = [
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
    price: "$9",
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
    price: "$29",
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

export function PricingCarousel() {
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
                <div className={cn(
                  "rounded-3xl p-8 border transition-all duration-300 relative",
                  tier.styling.bg,
                  tier.styling.border,
                  tier.styling.hover,
                  tier.popular && "transform scale-105"
                )}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="px-4 py-1 bg-brand-bg-darker border border-white text-white text-xs font-geist font-bold rounded-full whitespace-nowrap">
                        POPULAR
                      </div>
                    </div>
                  )}
                  <div className={cn("space-y-6 text-center", tier.styling.text)}>
                    <div className="space-y-2">
                      <h3 className={cn("text-3xl font-crimson", tier.styling.text)}>{tier.name}</h3>
                      <div className={cn("text-xs uppercase tracking-wide", tier.styling.text === "text-white" ? "text-white/60" : "text-neutral-500")}>
                        {tier.type}
                      </div>
                      <div className={cn("text-4xl font-crimson font-normal flex items-center justify-center gap-1", tier.styling.text)}>
                        {tier.price}
                        {tier.priceUnit && <span className="text-xl font-normal">{tier.priceUnit}</span>}
                      </div>
                    </div>
                    <div className="space-y-4 pt-4">
                      {tier.features.map((feature, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "text-sm py-2",
                            tier.styling.text === "text-white" 
                              ? "text-white/80 border-b border-white/10" 
                              : "text-neutral-700 border-b border-neutral-200"
                          )}
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
          <div
            key={tier.name}
            className={cn(
              "rounded-3xl p-8 border transition-all duration-300",
              tier.styling.bg,
              tier.styling.border,
              tier.styling.hover,
              tier.popular && "transform scale-105 shadow-2xl relative"
            )}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="px-4 py-1 bg-brand-bg-darker border border-white text-white text-xs font-geist font-bold rounded-full">
                  POPULAR
                </div>
              </div>
            )}
            <div className={cn("space-y-6 text-center", tier.styling.text)}>
              <div className="space-y-2">
                <h3 className={cn("text-2xl font-crimson", tier.styling.text)}>{tier.name}</h3>
                <div className={cn("text-xs uppercase tracking-wide", tier.styling.text === "text-white" ? "text-white/60" : "text-neutral-500")}>
                  {tier.type}
                </div>
                <div className={cn("text-3xl font-crimson font-normal", tier.styling.text)}>
                  {tier.price}
                  {tier.priceUnit && <span className="text-lg font-normal">{tier.priceUnit}</span>}
                </div>
              </div>
              <div className="space-y-4">
                {tier.features.map((feature, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "text-sm py-2",
                      tier.styling.text === "text-white" 
                        ? "text-white/80 border-b border-white/10" 
                        : "text-neutral-700 border-b border-neutral-200"
                    )}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

