"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function RsvpForm({
  eventId,
  userId,
  requiresParentConsent,
}: {
  eventId: string
  userId: string
  requiresParentConsent: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    guestCount: 0,
    dietaryRestrictions: "",
    specialNeeds: "",
    parentEmail: "",
    parentConsent: false,
    calendarSync: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (requiresParentConsent && !formData.parentConsent) {
      setError("Parent/guardian consent is required")
      setLoading(false)
      return
    }

    if (requiresParentConsent && !formData.parentEmail) {
      setError("Parent/guardian email is required")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          userId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create RSVP")
      }

      // Success! Refresh the page to show updated state
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Count */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Additional Guests
        </label>
        <input
          type="number"
          min="0"
          max="5"
          value={formData.guestCount}
          onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="0"
        />
        <p className="text-xs text-neutral-500 mt-1">
          Number of people joining you (not including yourself)
        </p>
      </div>

      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Dietary Restrictions (Optional)
        </label>
        <input
          type="text"
          value={formData.dietaryRestrictions}
          onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="e.g., Vegetarian, Gluten-free"
        />
      </div>

      {/* Special Needs */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Special Accommodations (Optional)
        </label>
        <textarea
          value={formData.specialNeeds}
          onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          rows={3}
          placeholder="Any accessibility needs or special requests"
        />
      </div>

      {/* Parent Consent (if required) */}
      {requiresParentConsent && (
        <>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Parent/Guardian Email *
            </label>
            <input
              type="email"
              required
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="parent@email.com"
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              required
              checked={formData.parentConsent}
              onChange={(e) => setFormData({ ...formData, parentConsent: e.target.checked })}
              className="mt-1 w-5 h-5 border-neutral-300 rounded focus:ring-black"
            />
            <label className="text-sm text-neutral-700">
              I am the parent/legal guardian and I give consent for the participant to attend this event. *
            </label>
          </div>
        </>
      )}

      {/* Calendar Sync Option */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.calendarSync}
            onChange={(e) => setFormData({ ...formData, calendarSync: e.target.checked })}
            className="mt-1 w-5 h-5 border-blue-300 rounded focus:ring-blue-500"
          />
          <div className="flex-grow">
            <label className="text-sm font-semibold text-blue-900">
              Enable calendar sync
            </label>
            <p className="text-xs text-blue-700 mt-1">
              Automatically update your calendar if event details change
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registering..." : "Confirm RSVP"}
      </button>

      <p className="text-xs text-neutral-500 text-center">
        By submitting, you agree to attend or notify us if you can&apos;t make it
      </p>
    </form>
  )
}

