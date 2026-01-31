"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { put } from "@vercel/blob"

interface CreatePersonalizedProgramFormProps {
  userId: string
  adminId: string
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export function CreatePersonalizedProgramForm({
  userId,
  adminId,
}: CreatePersonalizedProgramFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    trainingDays: [] as string[],
    startDate: "",
    endDate: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleVideoUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload to Vercel Blob
      const blob = await put(`personalized-programs/${userId}/${Date.now()}-${file.name}`, file, {
        access: "public",
        contentType: file.type,
      })

      setFormData({ ...formData, videoUrl: blob.url })
      toast.success("Video uploaded successfully")
    } catch (error) {
      console.error("Error uploading video:", error)
      toast.error("Failed to upload video")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.trainingDays.length === 0) {
      newErrors.trainingDays = "Select at least one training day"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end <= start) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/personalized-programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          createdBy: adminId,
          title: formData.title,
          description: formData.description,
          videoUrl: formData.videoUrl || null,
          thumbnailUrl: formData.thumbnailUrl || null,
          trainingDays: formData.trainingDays,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create program")
      }

      toast.success("Program created successfully!")
      router.push(`/dashboard/admin/personalized-programs/${userId}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating program:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create program")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTrainingDay = (day: string) => {
    setFormData({
      ...formData,
      trainingDays: formData.trainingDays.includes(day)
        ? formData.trainingDays.filter((d) => d !== day)
        : [...formData.trainingDays, day],
    })
  }

  const inputBase =
    "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Title */}
          <Field label="Program Title" htmlFor="title" required>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Ball Handling Mastery"
              disabled={isSubmitting}
              className={`${inputBase} ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </Field>

          {/* Description */}
          <Field label="Description" htmlFor="description" required>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the program, what the user will learn, key exercises..."
              rows={6}
              disabled={isSubmitting}
              className={`flex min-h-[120px] w-full rounded-md border border-white/20 bg-white/10 text-white px-3 py-2 text-sm placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </Field>

          {/* Video Upload */}
          <Field label="Training Video" htmlFor="video">
            <div className="space-y-3 relative">
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleVideoUpload(file)
                }}
                disabled={isUploading || isSubmitting}
                className="hidden"
              />
              <label
                htmlFor="video"
                className={`
                  flex flex-col items-center justify-center gap-3 p-8 border border-dashed rounded-xl cursor-pointer transition-colors text-white min-h-[140px]
                  ${
                    isUploading || isSubmitting
                      ? "border-white/30 cursor-not-allowed opacity-50"
                      : formData.videoUrl
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/20 hover:border-white/40 bg-white/5"
                  }
                `}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-white/70" />
                    <span>Uploading...</span>
                  </>
                ) : formData.videoUrl ? (
                  <>
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                    <span>Video uploaded</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData({ ...formData, videoUrl: "" })
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-white/60" />
                    <span className="text-sm font-medium">Click or drop video here</span>
                  </>
                )}
              </label>
              {formData.videoUrl && (
                <div className="mt-2">
                  <video src={formData.videoUrl} controls className="w-full max-w-md rounded" />
                </div>
              )}
              {errors.videoUrl && <p className="text-sm text-red-500 mt-1">{errors.videoUrl}</p>}
            </div>
          </Field>

          {/* Training Days */}
          <Field label="Training Days" required>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = formData.trainingDays.includes(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleTrainingDay(day)}
                    disabled={isSubmitting}
                    className={`
                      rounded-xl border-2 py-4 px-4 text-base font-medium transition-all
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                      disabled:cursor-not-allowed disabled:opacity-50
                      ${isSelected
                        ? "border-white/50 bg-white/20 text-white shadow-sm"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10"
                      }
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            {errors.trainingDays && (
              <p className="text-sm text-red-500 mt-1">{errors.trainingDays}</p>
            )}
          </Field>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" htmlFor="startDate" required>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={isSubmitting}
                className={`${inputBase} [color-scheme:dark] ${errors.startDate ? "border-red-500" : ""}`}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
              )}
            </Field>

            <Field label="End Date" htmlFor="endDate" required>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isSubmitting}
                className={`${inputBase} [color-scheme:dark] ${errors.endDate ? "border-red-500" : ""}`}
                min={formData.startDate || new Date().toISOString().split("T")[0]}
              />
              {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
            </Field>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading} 
              className="flex-1 bg-white/10 hover:bg-white/20 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Program"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
