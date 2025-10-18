import Link from "next/link"
import type { posts, users } from "@/lib/db/schema"

type Post = typeof posts.$inferSelect & {
  author: Pick<typeof users.$inferSelect, "id" | "name" | "image">
}

interface StoryListItemProps {
  post: Post
  variant?: "poetry" | "community" | "event" | "press"
}

export function StoryListItem({ post, variant = "poetry" }: StoryListItemProps) {
  const categoryPath = 
    post.category === "poetry" ? "poetry" :
    post.category === "stories" ? "community" :
    post.category === "news" ? "events" :
    "press"

  const textColorClasses = {
    poetry: "text-blue-600",
    community: "text-purple-600",
    event: "text-amber-600",
    press: "text-green-600"
  }

  return (
    <Link 
      href={`/stories/${categoryPath}/${post.slug}`}
      className="group block"
    >
      <article className="py-8 border-b border-neutral-200 hover:bg-neutral-50 transition-colors px-6 -mx-6">
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          {/* Thumbnail */}
          {post.coverImage && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-3">
              {post.publishedAt && (
                <div className="text-sm text-neutral-500">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}
              
              {post.readTime && (
                <>
                  <span className="text-neutral-300">•</span>
                  <div className="text-sm text-neutral-500">
                    {post.readTime} min read
                  </div>
                </>
              )}
            </div>
            
            <h3 className={`text-2xl font-bold mb-2 group-hover:${textColorClasses[variant]} transition-colors`}>
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-neutral-600 mb-3 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center gap-3">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-sm text-neutral-600">
                {post.author.name || "Anonymous"}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

