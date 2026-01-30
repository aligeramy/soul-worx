"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Star, Sparkles, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface UpgradePageProps {
  currentTier: "free" | "pro" | "pro_plus" | null
  selectedTier?: "pro" | "pro_plus"
  userId: string
}

export function UpgradePage({ currentTier, selectedTier, userId }: UpgradePageProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async (tier: "pro" | "pro_plus") => {
    setIsProcessing(true)

    try {
      // Check if mobile request
      const isMobile = typeof window !== 'undefined' && window.location.search.includes('mobile=true')
      const isOnboarding = typeof window !== 'undefined' && window.location.search.includes('onboarding=true')
      
      // Get tier details first
      const tierResponse = await fetch("/api/community/memberships")
      const tiersData = await tierResponse.json()
      const targetTier = tiersData.tiers?.find((t: { slug: string }) => t.slug === tier || t.slug === tier.replace("_", "-"))
      
      if (!targetTier) {
        throw new Error("Tier not found")
      }

      // Create checkout session
      const response = await fetch("/api/community/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tierId: targetTier.id,
          tierSlug: tier,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { url } = await response.json()
      
      if (url) {
        // Update success URL for mobile/onboarding
        if (isMobile || isOnboarding) {
          // Note: Stripe checkout URL is already created, but we can redirect after payment
          window.location.href = url
        } else {
          window.location.href = url
        }
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Error initiating upgrade:", error)
      toast.error(error instanceof Error ? error.message : "Failed to start upgrade process. Please try again.")
      setIsProcessing(false)
    }
  }

  const tiers = [
    {
      id: "pro" as const,
      name: "Pro",
      price: "$20",
      priceNote: "per month",
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      features: [
        "Access to all videos right away",
        "1-2 specific programs per month",
        "Soulworx AI assistant",
        "Journal",
        "Discord Community (VIP + public)",
      ],
      popular: false,
    },
    {
      id: "pro_plus" as const,
      name: "Pro+",
      price: "$25",
      priceNote: "per month",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      features: [
        "Everything in Pro",
        "Ability to upload videos for review and coaching",
        "Personalized programs",
        "1-2 specific per month (Not tailored to player)",
        "Private Discord channel + VIP + public",
      ],
      popular: true,
    },
  ]

  return (
    <div className="space-y-8">
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
        <h1 className="text-4xl font-medium font-crimson tracking-tight text-white">
          Upgrade Your Membership
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          {currentTier === "free"
            ? "Choose the plan that's right for you"
            : currentTier === "pro"
            ? "Upgrade to Pro+ for personalized programs and more"
            : "You're already on the highest tier!"}
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isCurrentTier =
            (tier.id === "pro" && currentTier === "pro") ||
            (tier.id === "pro_plus" && currentTier === "pro_plus")
          const isSelected = selectedTier === tier.id

          return (
            <Card
              key={tier.id}
              className={`relative border-2 transition-all ${
                isSelected ? tier.borderColor + " shadow-xl scale-105" : "border-neutral-200"
              } ${tier.bgColor}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-6 w-6 ${tier.color}`} />
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                </div>
                <div className="text-3xl font-bold">
                  {tier.price}
                  <span className="text-sm font-normal text-neutral-600 ml-2">{tier.priceNote}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 ${tier.color} flex-shrink-0 mt-0.5`} />
                      <span className="text-sm text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentTier ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isProcessing}
                    className={`w-full ${tier.id === "pro_plus" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {currentTier === "free" ? "Upgrade to " : "Switch to "}
                        {tier.name}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Button variant="ghost" onClick={() => router.back()} className="text-white/60 hover:text-white">
          ← Back
        </Button>
      </div>
    </div>
  )
}
