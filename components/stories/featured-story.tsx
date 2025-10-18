import Link from "next/link"
import Image from "next/image"
import type { posts, users } from "@/lib/db/schema"

type Post = typeof posts.$inferSelect & {
  author: Pick<typeof users.$inferSelect, "id" | "name" | "image">
}

interface FeaturedStoryProps {
  post: Post
  variant?: "poetry" | "community" | "event" | "press"
}

export function FeaturedStory({ post, variant = "poetry" }: FeaturedStoryProps) {
  const categoryPath = 
    post.category === "poetry" ? "poetry" :
    post.category === "stories" ? "community" :
    post.category === "news" ? "events" :
    "press"

  const gradientClasses = {
    poetry: "from-blue-600 to-cyan-600",
    community: "from-purple-600 to-pink-600",
    event: "from-amber-600 to-orange-600",
    press: "from-green-600 to-teal-600"
  }

  const textColorClasses = {
    poetry: "text-blue-600",
    community: "text-purple-600",
    event: "text-amber-600",
    press: "text-green-600"
  }

  return (
    <Link 
      href={`/stories/${categoryPath}/${post.slug}`}
      className="group"
    >
      <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
            {post.coverImage ? (
              <>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
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
            
            <div className={`absolute top-6 left-6 bg-gradient-to-r ${gradientClasses[variant]} text-white px-4 py-2 rounded-full font-bold text-sm`}>
              FEATURED
            </div>
          </div>
          
          {/* Content */}
          <div className="p-12 flex flex-col justify-center">
            {post.publishedAt && (
              <div className={`text-sm font-bold ${textColorClasses[variant]} mb-4`}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </div>
            )}
            
            <h2 className={`text-4xl font-bold tracking-tight mb-4 group-hover:${textColorClasses[variant]} transition-colors`}>
              {post.title}
            </h2>
            
            {post.excerpt && (
              <p className="text-lg text-neutral-600 mb-6 line-clamp-4">
                {post.excerpt}
              </p>
            )}
            
            <div className={`flex items-center gap-2 ${textColorClasses[variant]} font-bold group-hover:gap-4 transition-all`}>
              Read Full Story
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

