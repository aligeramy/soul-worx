import type { PostCategory } from "./db/schema"

/**
 * Map post categories to their display names
 */
export const categoryDisplayNames: Record<PostCategory, string> = {
  poetry: "Poetry Drops",
  stories: "Community Highlights",
  news: "Event Recaps",
  announcements: "Press & Media",
  tutorials: "Tutorials"
}

/**
 * Map post categories to their URL paths
 */
export const categoryPaths: Record<PostCategory, string> = {
  poetry: "poetry",
  stories: "community",
  news: "events",
  announcements: "press",
  tutorials: "tutorials"
}

/**
 * Map URL paths back to categories
 */
export const pathToCategory: Record<string, PostCategory> = {
  poetry: "poetry",
  community: "stories",
  events: "news",
  press: "announcements",
  tutorials: "tutorials"
}

/**
 * Get category from path
 */
export function getCategoryFromPath(path: string): PostCategory | null {
  return pathToCategory[path] || null
}

/**
 * Get path from category
 */
export function getPathFromCategory(category: PostCategory): string {
  return categoryPaths[category]
}

/**
 * Get display name from category
 */
export function getDisplayNameFromCategory(category: PostCategory): string {
  return categoryDisplayNames[category]
}

/**
 * Format date for display
 */
export function formatStoryDate(date: Date | null | undefined): string {
  if (!date) return ""
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Calculate estimated read time from content
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Generate excerpt from content if not provided
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '')
  
  if (text.length <= maxLength) return text
  
  // Find the last complete word before maxLength
  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...'
}

/**
 * Get story variant from category
 */
export function getStoryVariant(category: PostCategory): "poetry" | "community" | "event" | "press" {
  const variantMap: Record<PostCategory, "poetry" | "community" | "event" | "press"> = {
    poetry: "poetry",
    stories: "community",
    news: "event",
    announcements: "press",
    tutorials: "community"
  }
  
  return variantMap[category]
}

/**
 * Get color classes for a story category
 */
export function getStoryColorClasses(category: PostCategory) {
  const colorMap = {
    poetry: {
      bg: "from-blue-50 to-cyan-50",
      gradient: "from-blue-600 to-cyan-600",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      border: "border-blue-200"
    },
    stories: {
      bg: "from-purple-50 to-pink-50",
      gradient: "from-purple-600 to-pink-600",
      text: "text-purple-600",
      badge: "bg-purple-100 text-purple-700",
      border: "border-purple-200"
    },
    news: {
      bg: "from-amber-50 to-orange-50",
      gradient: "from-amber-600 to-orange-600",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      border: "border-amber-200"
    },
    announcements: {
      bg: "from-green-50 to-teal-50",
      gradient: "from-green-600 to-teal-600",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
      border: "border-green-200"
    },
    tutorials: {
      bg: "from-indigo-50 to-violet-50",
      gradient: "from-indigo-600 to-violet-600",
      text: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      border: "border-indigo-200"
    }
  }
  
  return colorMap[category]
}

