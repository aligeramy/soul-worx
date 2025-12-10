"use client"

import { useEffect, useRef } from "react"

interface VideoViewTrackerProps {
  videoId: string
  videoDuration?: number | null
}

export function VideoViewTracker({ videoId, videoDuration }: VideoViewTrackerProps) {
  const hasTrackedView = useRef(false)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastTrackedSeconds = useRef(0)

  useEffect(() => {
    // Track initial view when component mounts
    const trackView = async (watchedSeconds: number = 0, completed: boolean = false) => {
      try {
        const response = await fetch(`/api/community/videos/${videoId}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            watchedSeconds,
            completed,
          }),
        })

        if (response.ok) {
          hasTrackedView.current = true
        }
      } catch (error) {
        console.error("Error tracking video view:", error)
      }
    }

    // Track view after a short delay to ensure user actually viewed the page
    const timer = setTimeout(() => {
      startTimeRef.current = Date.now()
      trackView(0, false)
    }, 2000) // 2 second delay to count as a "view"

    // Track progress periodically (every 30 seconds)
    // Note: For embedded videos (YouTube/Vimeo), we can't directly access player state
    // This tracks time on page as an approximation
    if (videoDuration) {
      progressIntervalRef.current = setInterval(async () => {
        if (!hasTrackedView.current || !startTimeRef.current) return

        // Estimate watched seconds based on time on page
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const estimatedSeconds = Math.min(timeOnPage, videoDuration)
        const completed = estimatedSeconds >= videoDuration * 0.9 // 90% watched = completed

        if (estimatedSeconds > lastTrackedSeconds.current + 25) {
          // Only update if we've watched at least 25 more seconds
          await trackView(estimatedSeconds, completed)
          lastTrackedSeconds.current = estimatedSeconds
        }
      }, 30000) // Every 30 seconds
    }

    // Track completion when user leaves page (if they watched enough)
    const handleBeforeUnload = () => {
      if (startTimeRef.current && videoDuration && hasTrackedView.current) {
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const estimatedSeconds = Math.min(timeOnPage, videoDuration)
        const completed = estimatedSeconds >= videoDuration * 0.9
        
        // Use fetch with keepalive for reliable tracking on page unload
        fetch(`/api/community/videos/${videoId}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            watchedSeconds: estimatedSeconds,
            completed,
          }),
          keepalive: true,
        }).catch(() => {
          // Ignore errors on page unload
        })
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      clearTimeout(timer)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [videoId, videoDuration])

  return null
}
