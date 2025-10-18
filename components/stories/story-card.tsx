import Link from "next/link"
import type { posts, users } from "@/lib/db/schema"

type Post = typeof posts.$inferSelect & {
  author: Pick<typeof users.$inferSelect, "id" | "name" | "image">
}

interface StoryCardProps {
  post: Post
  variant?: "poetry" | "community" | "event" | "press"
}

export function StoryCard({ post, variant = "community" }: StoryCardProps) {
  const categoryPath = 
    post.category === "poetry" ? "poetry" :
    post.category === "stories" ? "community" :
    post.category === "news" ? "events" :
    "press"

  const colorClasses = {
    poetry: {
      badge: "bg-blue-100 text-blue-700",
      hover: "group-hover:text-blue-600"
    },
    community: {
      badge: "bg-purple-100 text-purple-700",
      hover: "group-hover:text-purple-600"
    },
    event: {
      badge: "bg-amber-100 text-amber-700",
      hover: "group-hover:text-amber-600"
    },
    press: {
      badge: "bg-green-100 text-green-700",
      hover: "group-hover:text-green-600"
    }
  }

  const colors = colorClasses[variant]

  return (
    <Link 
      href={`/stories/${categoryPath}/${post.slug}`}
      className="group"
    >
      <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {post.coverImage ? (
            <>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${
              variant === "poetry" ? "from-blue-100 to-cyan-100" :
              variant === "community" ? "from-purple-100 to-pink-100" :
              variant === "event" ? "from-amber-100 to-orange-100" :
              "from-green-100 to-teal-100"
            } flex items-center justify-center`}>
              <div className="text-6xl">
                {variant === "poetry" ? "📝" : 
                 variant === "community" ? "👥" :
                 variant === "event" ? "📸" : "📢"}
              </div>
            </div>
          )}
          
          {/* Overlay badge */}
          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full">
            <div className={`text-xs font-bold ${colors.badge.split(" ")[1]}`}>
              {post.category.toUpperCase()}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h2 className={`text-2xl font-bold tracking-tight mb-3 ${colors.hover} transition-colors line-clamp-2`}>
            {post.title}
          </h2>
          
          {post.excerpt && (
            <p className="text-neutral-600 mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  {post.author.name || "Anonymous"}
                </div>
                {post.publishedAt && (
                  <div className="text-xs text-neutral-500">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            </div>
            
            <div className={`${colors.badge.split(" ")[1]} group-hover:translate-x-1 transition-transform`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

