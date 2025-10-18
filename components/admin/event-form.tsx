"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Loader2 } from "lucide-react"

interface EventFormProps {
  programId?: string
  programs?: Array<{ id: string; title: string }>
  event?: {
    id: string
    programId: string
    title: string
    description: string | null
    status: string
    startTime: Date
    endTime: Date
    timezone: string
    locationType: string
    venueName: string | null
    venueAddress: string | null
    venueCity: string | null
    venueState: string | null
    venueZip: string | null
    venueCountry: string | null
    latitude: string | null
    longitude: string | null
    virtualMeetingUrl: string | null
    capacity: number | null
    waitlistEnabled: boolean
    notes: string | null
  }
}

export function EventForm({ programId, programs = [], event }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    programId: event?.programId || programId || "",
    title: event?.title || "",
    description: event?.description || "",
    status: event?.status || "scheduled",
    startTime: event?.startTime
      ? new Date(event.startTime).toISOString().slice(0, 16)
      : "",
    endTime: event?.endTime
      ? new Date(event.endTime).toISOString().slice(0, 16)
      : "",
    timezone: event?.timezone || "America/New_York",
    locationType: event?.locationType || "in_person",
    venueName: event?.venueName || "",
    venueAddress: event?.venueAddress || "",
    venueCity: event?.venueCity || "",
    venueState: event?.venueState || "",
    venueZip: event?.venueZip || "",
    venueCountry: event?.venueCountry || "USA",
    latitude: event?.latitude || "",
    longitude: event?.longitude || "",
    virtualMeetingUrl: event?.virtualMeetingUrl || "",
    capacity: event?.capacity || "",
    waitlistEnabled: event?.waitlistEnabled || false,
    notes: event?.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = event
        ? `/api/events/${event.id}`
        : "/api/events"
      
      const response = await fetch(url, {
        method: event ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity as string) : null,
          latitude: formData.latitude || null,
          longitude: formData.longitude || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save event")
      }

      if (programId) {
        router.push(`/dashboard/admin/programs`)
      } else {
        router.push("/dashboard/admin/programs")
      }
      router.refresh()
    } catch (error) {
      console.error("Error saving event:", error)
      alert(error instanceof Error ? error.message : "Failed to save event")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-8 space-y-8">
      {/* Basic Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Basic Information</h2>
        
        {!programId && programs.length > 0 && (
          <Field label="Program" htmlFor="programId" required>
            <select
              id="programId"
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select a program...</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Event Title" htmlFor="title" required>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g., Workshop Session #1"
            required
          />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event details and description..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </Field>

        <Field label="Status" htmlFor="status" required>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
          </select>
        </Field>
      </div>

      {/* Date & Time */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Date & Time</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Time" htmlFor="startTime" required>
            <Input
              id="startTime"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </Field>

          <Field label="End Time" htmlFor="endTime" required>
            <Input
              id="endTime"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </Field>
        </div>

        <Field label="Timezone" htmlFor="timezone">
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="America/Anchorage">Alaska Time (AKT)</option>
            <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
          </select>
        </Field>
      </div>

      {/* Location */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Location</h2>
        
        <Field label="Location Type" htmlFor="locationType" required>
          <select
            id="locationType"
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="in_person">In Person</option>
            <option value="virtual">Virtual</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </Field>

        {(formData.locationType === "in_person" || formData.locationType === "hybrid") && (
          <>
            <Field label="Venue Name" htmlFor="venueName">
              <Input
                id="venueName"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="E.g., Community Center"
              />
            </Field>

            <Field label="Address" htmlFor="venueAddress">
              <Input
                id="venueAddress"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                placeholder="123 Main St"
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="City" htmlFor="venueCity">
                <Input
                  id="venueCity"
                  name="venueCity"
                  value={formData.venueCity}
                  onChange={handleChange}
                  placeholder="City"
                />
              </Field>

              <Field label="State" htmlFor="venueState">
                <Input
                  id="venueState"
                  name="venueState"
                  value={formData.venueState}
                  onChange={handleChange}
                  placeholder="CA"
                />
              </Field>

              <Field label="ZIP" htmlFor="venueZip">
                <Input
                  id="venueZip"
                  name="venueZip"
                  value={formData.venueZip}
                  onChange={handleChange}
                  placeholder="12345"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude (optional)" htmlFor="latitude">
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="37.7749"
                />
              </Field>

              <Field label="Longitude (optional)" htmlFor="longitude">
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="-122.4194"
                />
              </Field>
            </div>
          </>
        )}

        {(formData.locationType === "virtual" || formData.locationType === "hybrid") && (
          <Field label="Virtual Meeting URL" htmlFor="virtualMeetingUrl">
            <Input
              id="virtualMeetingUrl"
              name="virtualMeetingUrl"
              value={formData.virtualMeetingUrl}
              onChange={handleChange}
              placeholder="https://zoom.us/..."
            />
          </Field>
        )}
      </div>

      {/* Capacity */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Capacity</h2>
        
        <Field label="Max Capacity" htmlFor="capacity">
          <Input
            id="capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Leave blank for unlimited"
          />
        </Field>

        <Field label="" htmlFor="waitlistEnabled">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="waitlistEnabled"
              name="waitlistEnabled"
              checked={formData.waitlistEnabled}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">Enable waitlist when full</span>
          </label>
        </Field>
      </div>

      {/* Internal Notes */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Internal Notes</h2>
        
        <Field label="Notes" htmlFor="notes">
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Internal notes for organizers (not visible to public)..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            event ? "Update Event" : "Create Event"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

