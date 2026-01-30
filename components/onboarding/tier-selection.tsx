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
    bgColor: "bg-neutral-50",
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
      "Discord Community (VIP + public)",
    ],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
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
      "Discord Community (private channel + VIP + public)",
    ],
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
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

      // If Pro+, redirect to questionnaire (which will then redirect to booking)
      if (selectedTier === "pro_plus") {
        router.push("/onboarding/pro-plus-questionnaire")
      } else {
        // For Free or Pro, complete onboarding and redirect to dashboard
        router.push("/dashboard")
      }
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
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-v2/w.png"
            alt="Soulworx Logo"
            width={60}
            height={90}
            className="h-15 w-auto border border-black/10 rounded-lg p-3 px-4 bg-brand-bg-darker"
          />
        </div>
        <h1 className="text-4xl font-medium font-crimson tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Select the membership tier that best fits your basketball training needs
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isSelected = selectedTier === tier.id

          return (
            <div
              key={tier.id}
              className={`
                relative p-8 rounded-2xl border-2 transition-all duration-200
                ${isSelected ? tier.borderColor + " shadow-xl scale-105" : "border-neutral-200"}
                ${tier.bgColor}
                ${isSubmitting ? "opacity-50" : ""}
              `}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full ${tier.color.replace("text-", "bg-")} flex items-center justify-center`}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${tier.bgColor} ${tier.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-neutral-900">{tier.price}</span>
                {tier.priceNote && (
                  <span className="text-sm text-neutral-600 ml-2">{tier.priceNote}</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 ${tier.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-sm text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Select Button */}
              <Button
                onClick={() => setSelectedTier(tier.id)}
                disabled={isSubmitting}
                variant={isSelected ? "default" : "outline"}
                className={`w-full ${isSelected ? tier.bgColor.replace("bg-", "bg-") + " " + tier.color : ""}`}
              >
                {isSelected ? "Selected" : "Select Plan"}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedTier || isSubmitting}
          size="lg"
          className="min-w-[200px]"
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
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
          <div className="w-2 h-2 rounded-full bg-neutral-900" />
        </div>
      </div>
    </div>
  )
}
