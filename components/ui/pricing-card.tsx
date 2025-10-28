"use client"

import { cn } from "@/lib/utils"

export interface PricingTier {
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

interface PricingCardProps {
  tier: PricingTier
  isMobile?: boolean
}

export function PricingCard({ tier, isMobile = false }: PricingCardProps) {
  return (
    <div className={cn(
      "rounded-3xl p-10 border transition-all duration-300 relative w-full",
      tier.styling.bg,
      tier.styling.border,
      tier.styling.hover,
      tier.popular && (isMobile ? "transform scale-105" : "transform scale-105 shadow-2xl relative")
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
          <h3 className={cn(
            isMobile ? "text-3xl font-crimson" : "text-2xl font-crimson",
            tier.styling.text
          )}>
            {tier.name}
          </h3>
          <div className={cn(
            "text-xs uppercase tracking-wide",
            tier.styling.text === "text-white" ? "text-white/60" : "text-neutral-500"
          )}>
            {tier.type}
          </div>
          <div className={cn(
            isMobile ? "text-4xl font-crimson font-normal" : "text-3xl font-crimson font-normal",
            tier.styling.text
          )}>
            {tier.price}
            {tier.priceUnit && (
              <span className={cn(
                isMobile ? "text-xl font-normal" : "text-lg font-normal"
              )}>
                {tier.priceUnit}
              </span>
            )}
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
  )
}
