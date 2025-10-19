"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface Post {
  id: string
  title: string
  category: "poetry" | "news" | "stories" | "tutorials" | "announcements"
  publishedAt: Date | null
  slug: string
}

interface Program {
  id: string
  title: string
  slug: string
  description: string
  status: string
}

type NewsItem = (Post & { type: 'post' }) | (Program & { type: 'program' })

const categoryColors: Record<Post["category"], string> = {
  poetry: "bg-transparent text-white border-white/80",
  news: "bg-transparent text-white border-white/80",
  stories: "bg-transparent text-white border-white/80",
  tutorials: "bg-transparent text-white border-white/80",
  announcements: "bg-transparent text-white border-white/80",
}

const categoryPaths: Record<Post["category"], string> = {
  poetry: "poetry",
  news: "events",
  stories: "community",
  tutorials: "tutorials",
  announcements: "press",
}

export function HeroNewsSlideshow() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    async function fetchContent() {
      try {
        const [postsRes, programsRes] = await Promise.all([
          fetch("/api/stories"),
          fetch("/api/programs")
        ])
        
        const items: NewsItem[] = []
        
        if (postsRes.ok) {
          const posts = await postsRes.json()
          items.push(...posts.slice(0, 3).map((p: Post) => ({ ...p, type: 'post' as const })))
        }
        
        if (programsRes.ok) {
          const programs = await programsRes.json()
          const publishedPrograms = programs.filter((p: Program) => p.status === 'published')
          items.push(...publishedPrograms.slice(0, 2).map((p: Program) => ({ ...p, type: 'program' as const })))
        }
        
        // Shuffle items for variety
        const shuffled = items.sort(() => Math.random() - 0.5)
        setNewsItems(shuffled)
        
        // Trigger initial animation after mount
        setTimeout(() => setIsVisible(true), 300)
      } catch (error) {
        console.error("Failed to fetch content:", error)
      }
    }

    fetchContent()
  }, [])

  useEffect(() => {
    if (newsItems.length <= 1) return

    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false)
      
      // Wait for fade out, then change content and fade back in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % newsItems.length)
        
        setTimeout(() => {
          setIsVisible(true)
        }, 100)
      }, 600)
    }, 6000)

    return () => clearInterval(interval)
  }, [newsItems.length])

  if (newsItems.length === 0) {
    return (
      <div className="h-[2rem] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    )
  }

  const currentItem = newsItems[currentIndex]
  if (!currentItem) return null

  return (
    <div className="w-full max-w-4xl mx-auto pointer-events-auto">
      {/* Fixed height container to prevent collapse */}
      <div className="relative h-[2rem] flex items-center justify-center">
        {/* Absolute positioned content - always takes up space */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {currentItem.type === 'post' ? (
            <Link
              href={`/stories/${categoryPaths[(currentItem as Post & { type: 'post' }).category]}/${currentItem.slug}`}
              className="group hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-2"
              style={{ opacity: 0.85 }}
            >
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-2.5 py-0.5 !backdrop-blur-sm capitalize font-medium border whitespace-nowrap shrink-0",
                  categoryColors[(currentItem as Post & { type: 'post' }).category]
                )}
              >
                {(currentItem as Post & { type: 'post' }).category}
              </Badge>
              <span className="font-crimson text-base md:text-lg font-normal text-white leading-tight whitespace-nowrap">
                {currentItem.title}
              </span>
              <ExternalLink 
                className="w-3 h-3 text-white/80 shrink-0 group-hover:text-white transition-colors duration-300" 
              />
            </Link>
          ) : (
            <Link
              href={`/programs/${currentItem.slug}`}
              className="group hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-2"
              style={{ opacity: 0.85 }}
            >
              <Badge
                variant="outline"
                className="text-[10px] !backdrop-blur-sm px-2.5 py-0.5 font-medium border bg-transparent text-white border-white/80 whitespace-nowrap shrink-0"
              >
                PROGRAM
              </Badge>
              <span className="font-crimson text-base md:text-lg font-normal text-white leading-tight whitespace-nowrap">
                {currentItem.title}
              </span>
              <ExternalLink 
                className="w-3 h-3 text-white/80 shrink-0 group-hover:text-white transition-colors duration-300" 
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
