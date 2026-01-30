"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface OnboardingQuestionsProps {
  userId: string
}

export function OnboardingQuestions({ userId }: OnboardingQuestionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [primaryInterest, setPrimaryInterest] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    age: "",
    goals: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Fetch user's primary interest
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/onboarding/user-data")
        const data = await response.json()
        
        if (data.primaryInterest) {
          setPrimaryInterest(data.primaryInterest)
        } else {
          // No interest selected, redirect back
          router.push("/onboarding/interest")
          return
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user data")
        router.push("/onboarding/interest")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/onboarding/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: formData.age ? parseInt(formData.age) : null,
          goals: formData.goals || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save answers")
      }

      // Navigate based on interest
      if (primaryInterest === "sports_basketball") {
        router.push("/onboarding/tiers")
      } else {
        // For poetry/arts or life coaching, complete onboarding
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error saving questions:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save answers")
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
        <h1 className="text-3xl font-medium font-crimson tracking-tight">
          Tell Us About Yourself
        </h1>
        <p className="text-neutral-600">
          Help us personalize your experience
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
        {/* Age */}
        <Field label="Age" htmlFor="age">
          <Input
            id="age"
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="Enter your age"
            disabled={isSubmitting}
          />
          <p className="text-xs text-neutral-500 mt-1">
            This helps us provide age-appropriate content
          </p>
        </Field>

        {/* Goals */}
        <Field label="What do you hope to accomplish?" htmlFor="goals">
          <textarea
            id="goals"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            placeholder="Share your goals and aspirations..."
            rows={4}
            disabled={isSubmitting}
            className="flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Optional - Tell us what you&apos;re looking to achieve
          </p>
        </Field>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
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
      </form>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
          <div className="w-2 h-2 rounded-full bg-neutral-900" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
        </div>
      </div>
    </div>
  )
}
