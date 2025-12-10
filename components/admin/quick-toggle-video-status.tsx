"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface QuickToggleVideoStatusProps {
  videoId: string
  currentStatus: string
}

export function QuickToggleVideoStatus({ videoId, currentStatus }: QuickToggleVideoStatusProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const isPublished = currentStatus === "published"
  const isUnlisted = currentStatus === "unlisted"
  const canToggle = isPublished || isUnlisted

  const handleToggle = async () => {
    if (!canToggle) return
    
    setLoading(true)
    try {
      const newStatus = isPublished ? "unlisted" : "published"
      
      const response = await fetch(`/api/community/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update video status")
      }

      toast.success(`Video ${newStatus === "published" ? "listed" : "unlisted"}`)
      router.refresh()
    } catch (error: unknown) {
      console.error("Error toggling video status:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update video status"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!canToggle) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
      onClick={handleToggle}
      disabled={loading}
      title={isPublished ? "Unlist video" : "List video"}
    >
      {isPublished ? (
        <EyeOff className="h-3 w-3" />
      ) : (
        <Eye className="h-3 w-3" />
      )}
    </Button>
  )
}
