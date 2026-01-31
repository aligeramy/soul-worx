"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Check, Lock, Star, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

type TierLevel = "free" | "pro" | "pro_plus"

interface Tier {
  id: TierLevel
  name: string
  price: string
  priceNote?: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  color: string
  bgColor: string
  borderColor: string
  popular?: boolean
}

interface TierSelectionProps {
  userId: string
}

const tiers: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceNote: "Forever",
    icon: Lock,
    features: [
      "First 2 videos",
      "Rotate per month",
      "Journal",
      "Public Discord channel",
    ],
    color: "text-neutral-600",
    bgColor: "bg-white",
    borderColor: "border-neutral-200",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$20",
    priceNote: "per month",
    icon: Star,
    features: [
      "Access to all videos right away",
      "1-2 specific programs per month",
      "Soulworx AI assistant",
      "Journal",
      "Discord Community (VIP + Public)",
    ],
    color: "text-neutral-900",
    bgColor: "bg-white",
    borderColor: "border-neutral-300",
    popular: true,
  },
  {
    id: "pro_plus",
    name: "Pro+",
    price: "$25",
    priceNote: "per month",
    icon: Sparkles,
    features: [
      "Access to all videos right away",
      "Ability to upload videos for review and coaching",
      "Personalized programs",
      "1-2 specific per month (Not tailored to player)",
      "Soulworx AI assistant",
      "Journal",
      "Discord Community (Private + VIP + Public)",
    ],
    color: "text-neutral-900",
    bgColor: "bg-white",
    borderColor: "border-neutral-300",
  },
]

export function TierSelection({ userId }: TierSelectionProps) {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<TierLevel | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify user selected basketball
    const checkInterest = async () => {
      try {
        const response = await fetch("/api/onboarding/user-data")
        const data = await response.json()
        
        if (data.primaryInterest !== "sports_basketball") {
          // Not basketball, redirect to dashboard
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("Error checking interest:", error)
      } finally {
        setLoading(false)
      }
    }

    checkInterest()
  }, [router])

  const handleContinue = async () => {
    if (!selectedTier) {
      toast.error("Please select a tier")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/onboarding/tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save tier selection")
      }

      // Check if mobile request
      const isMobile = typeof window !== 'undefined' && window.location.search.includes('mobile=true')
      
      // If Pro or Pro+, redirect to upgrade/payment
      if (selectedTier === "pro" || selectedTier === "pro_plus") {
        if (isMobile) {
          // Mobile: redirect to web for payment setup
          window.location.href = `/upgrade?tier=${selectedTier}&mobile=true&onboarding=true`
        } else {
          // Web: redirect to upgrade page
          router.push(`/upgrade?tier=${selectedTier}&onboarding=true`)
        }
      } else {
        // For Free, complete onboarding and redirect to dashboard
        router.push("/dashboard")
      }
      
      // Note: Pro+ questionnaire will be shown after payment is completed
    } catch (error) {
      console.error("Error saving tier:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save selection")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <Image
            src="/logo-v2/w.png"
            alt="Soulworx Logo"
            width={40}
            height={60}
            className="h-10 w-auto border border-black/10 rounded-lg p-2 px-3 bg-brand-bg-darker"
          />
        </div>
        <h1 className="text-2xl font-medium font-crimson tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
          Select the membership tier that best fits your basketball training needs
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isSelected = selectedTier === tier.id

          return (
            <div
              key={tier.id}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 bg-white
                flex flex-col h-full
                ${isSelected ? "border-neutral-900 shadow-md scale-[1.01]" : "border-neutral-200"}
                ${isSubmitting ? "opacity-50" : "hover:border-neutral-300"}
              `}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <span className="bg-neutral-900 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-neutral-100 text-neutral-700">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-neutral-900 mb-1 text-center">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-neutral-900">{tier.price}</span>
                {tier.priceNote && (
                  <span className="text-xs text-neutral-600 ml-1">{tier.priceNote}</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-1.5 mb-4 flex-grow text-xs">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Select Button - Always at bottom */}
              <Button
                onClick={() => setSelectedTier(tier.id)}
                disabled={isSubmitting}
                variant={isSelected ? "default" : "outline"}
                className={`
                  w-full h-10 text-sm font-medium transition-all
                  ${isSelected 
                    ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                    : "border-neutral-300 text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400"
                  }
                `}
              >
                {isSelected ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Selected
                  </span>
                ) : (
                  "Select Plan"
                )}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleContinue}
          disabled={!selectedTier || isSubmitting}
          size="lg"
          className="min-w-[200px] h-11"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
        </div>
      </div>
    </div>
  )
}
