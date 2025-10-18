import { getPostBySlug, getPublishedPosts } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import { EventRecapContent } from "./event-recap-content"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function EventRecapDetailPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.category !== "news" || post.status !== "published") {
    notFound()
  }

  // Get related posts
  const allPosts = await getPublishedPosts()
  const relatedPosts = allPosts
    .filter(p => p.category === "news" && p.id !== post.id)
    .slice(0, 3)
    .map(p => ({ ...p, tags: p.tags || [] }))

  return (
    <EventRecapContent post={{
      ...post,
      tags: post.tags || []
    }} relatedPosts={relatedPosts} />
  )
}
