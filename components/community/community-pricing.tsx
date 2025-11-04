"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"
import { SubscribeButton } from "./subscribe-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CommunityPricingProps {
  tiers: Array<{
    id: string
    name: string
    description: string
    price: string
    billingPeriod: string | null
    features: string[]
    level: string
  }>
  currentTierId?: string
  isAuthenticated: boolean
}

export function CommunityPricing({ tiers, currentTierId, isAuthenticated }: CommunityPricingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Convert database tiers to pricing tiers with light styling
  const pricingTiers: PricingTier[] = tiers.map((tier) => {
    const price = parseFloat(tier.price || "0")
    const isPopular = tier.level === "premium"
    
    return {
      name: tier.name,
      type: "Membership",
      price: price === 0 ? "Free" : `$${price.toFixed(0)}`,
      priceUnit: price > 0 ? "/mo" : "",
      features: tier.features,
      popular: isPopular,
      styling: isPopular
        ? {
            bg: "bg-neutral-900",
            text: "text-white",
            border: "border-neutral-900",
            hover: "hover:bg-neutral-800"
          }
        : {
            bg: "bg-white",
            text: "text-neutral-900",
            border: "border-neutral-200",
            hover: "hover:border-neutral-300"
          }
    }
  })

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
    
    if (isLeftSwipe && currentSlide < pricingTiers.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Auto-rotate carousel on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % pricingTiers.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [pricingTiers.length])

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
            {pricingTiers.map((tier, index) => {
              const dbTier = tiers[index]
              const price = parseFloat(dbTier.price || "0")
              const isCurrent = currentTierId === dbTier.id
              
              return (
                <div key={dbTier.id} className="min-w-full px-4 pt-8 pb-6">
                  <PricingCard tier={tier} isMobile={true} />
                  <div className="mt-6 px-4">
                    {!isAuthenticated ? (
                      <Link href="/signin" className="block">
                        <Button className="w-full" size="lg">
                          {price === 0 ? "Sign In to Access" : "Sign In to Subscribe"}
                        </Button>
                      </Link>
                    ) : (
                      <SubscribeButton
                        tierId={dbTier.id}
                        isCurrentPlan={isCurrent}
                        isFree={price === 0}
                        hasExistingMembership={!!currentTierId}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Carousel Dots - Below the cards */}
        <div className="flex justify-center items-center gap-2 pt-4">
          {pricingTiers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                currentSlide === index
                  ? "w-6 h-1.5 bg-neutral-900"
                  : "w-1.5 h-1.5 bg-neutral-400 hover:bg-neutral-600"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingTiers.map((tier, index) => {
          const dbTier = tiers[index]
          const price = parseFloat(dbTier.price || "0")
          const isCurrent = currentTierId === dbTier.id
          
          return (
            <div key={dbTier.id}>
              <PricingCard tier={tier} isMobile={false} />
              <div className="mt-6">
                {!isAuthenticated ? (
                  <Link href="/signin" className="block">
                    <Button className="w-full" size="lg">
                      {price === 0 ? "Sign In to Access" : "Sign In to Subscribe"}
                    </Button>
                  </Link>
                ) : (
                  <SubscribeButton
                    tierId={dbTier.id}
                    isCurrentPlan={isCurrent}
                    isFree={price === 0}
                    hasExistingMembership={!!currentTierId}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

