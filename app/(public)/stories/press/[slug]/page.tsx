import { getPostBySlug, getPublishedPosts } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import { PressContent } from "./press-content"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PressDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post || post.category !== "announcements" || post.status !== "published") {
    notFound()
  }

  // Get related posts
  const allPosts = await getPublishedPosts()
  const relatedPosts = allPosts
    .filter(p => p.category === "announcements" && p.id !== post.id)
    .slice(0, 3)
    .map(p => ({ ...p, tags: p.tags || [] }))

  return (
    <PressContent post={{
      ...post,
      tags: post.tags || []
    }} relatedPosts={relatedPosts} />
  )
}
