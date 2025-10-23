import { getPostBySlug, getPublishedPosts } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import { BlogContent } from "./blog-content"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.category !== "blog" || post.status !== "published") {
    notFound()
  }

  // Get related posts
  const allPosts = await getPublishedPosts()
  const relatedPosts = allPosts
    .filter(p => p.category === "blog" && p.id !== post.id)
    .slice(0, 3)
    .map(p => ({ ...p, tags: p.tags || [] }))

  return (
    <BlogContent post={{
      ...post,
      tags: post.tags || []
    }} relatedPosts={relatedPosts} />
  )
}

