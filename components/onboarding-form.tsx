"use client"

import { useState, useRef } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import { toast } from "sonner"

interface OnboardingFormProps {
  userImage: string
  userInitials: string
  userName: string
  userEmail: string
}

export function OnboardingForm({ userImage, userInitials, userName, userEmail }: OnboardingFormProps) {
  const [name, setName] = useState(userName)
  const [image, setImage] = useState(userImage)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setImage(data.url)
      toast.success("Profile picture uploaded successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error("Please enter your name")
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append("name", name.trim())
      if (image) {
        formData.append("image", image)
      }

      // Save to database
      await updateProfile(formData)
      
      toast.success("Profile complete! Loading your dashboard...")
      
      // Set a flag in session storage to indicate onboarding is complete
      // This prevents the onboarding loop issue
      sessionStorage.setItem("onboarding_complete", "true")
      
      // Redirect to dashboard - the session will refresh on next page load
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage src={image} alt="Profile picture" />
            <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {image ? "Click camera icon to change" : "Add a profile picture"}
          </p>
          {isUploading && (
            <p className="text-xs text-muted-foreground mt-1">
              Uploading...
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          This is how others will see you in the app
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={userEmail}
          disabled
          className="w-full bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Your email cannot be changed
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isUploading || isSubmitting || !name.trim()}>
        {isSubmitting ? "Completing Setup..." : "Complete Setup"}
      </Button>
    </form>
  )
}

