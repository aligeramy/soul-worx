"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Activity, PenTool, HeartHandshake } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

type InterestType = "sports_basketball" | "poetry_arts" | "life_coaching"

interface InterestSelectionProps {
  userId: string
}

const interests: {
  id: InterestType
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}[] = [
  {
    id: "sports_basketball",
    title: "Sports / Basketball",
    description: "Training programs, drills, and coaching for basketball players",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
  {
    id: "poetry_arts",
    title: "Poetry / The Arts",
    description: "Creative expression, writing workshops, and artistic community",
    icon: PenTool,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    id: "life_coaching",
    title: "Life Coaching / Assistance",
    description: "Personal development, mentorship, and life guidance",
    icon: HeartHandshake,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
]

export function InterestSelection({ userId }: InterestSelectionProps) {
  const router = useRouter()
  const [selectedInterest, setSelectedInterest] = useState<InterestType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    if (!selectedInterest) {
      toast.error("Please select an interest")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/onboarding/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interest: selectedInterest,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save interest")
      }

      // Navigate to questions page
      router.push("/onboarding/questions")
    } catch (error) {
      console.error("Error saving interest:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save selection")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-v2/w.png"
            alt="Soulworx Logo"
            width={80}
            height={120}
            className="h-20 w-auto border border-black/10 rounded-lg p-3 px-4 bg-brand-bg-darker"
          />
        </div>
        <h1 className="text-4xl font-medium font-crimson tracking-tight">
          Welcome to Soulworx
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          What brought you here? Select the area that interests you most.
        </p>
      </div>

      {/* Interest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {interests.map((interest) => {
          const Icon = interest.icon
          const isSelected = selectedInterest === interest.id

          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => setSelectedInterest(interest.id)}
              disabled={isSubmitting}
              className={`
                relative p-8 rounded-2xl border-2 transition-all duration-200
                ${isSelected ? "border-neutral-900 shadow-lg scale-105" : "border-neutral-200"}
                ${interest.bgColor}
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${interest.bgColor} ${interest.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-neutral-900 mb-2 text-center">
                {interest.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-neutral-600 text-center">
                {interest.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedInterest || isSubmitting}
          size="lg"
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <div className="w-2 h-2 rounded-full bg-neutral-900" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
        </div>
      </div>
    </div>
  )
}
