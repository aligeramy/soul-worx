import Link from "next/link"
import Image from "next/image"
import type { posts, users } from "@/lib/db/schema"
import { BookOpen } from "lucide-react"

type Post = typeof posts.$inferSelect & {
  author: Pick<typeof users.$inferSelect, "id" | "name" | "image">
}

interface BlogCardProps {
  post: Post
}

export function BlogCard({ post }: BlogCardProps) {
  // Map categories to paths
  const getCategoryPath = (category: string) => {
    switch (category) {
      case 'blog':
        return 'blog'
      case 'news':
        return 'events'
      case 'tutorials':
        return 'community'
      default:
        return 'blog'
    }
  }

  return (
    <Link 
      href={`/stories/${getCategoryPath(post.category)}/${post.slug}`}
      className="group block"
    >
      <article className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-neutral-100">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {post.coverImage ? (
            <>
              <Image
                src={post.coverImage}
                alt={post.title}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-purple-400" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-2 px-4 py-1.5 bg-white/95 backdrop-blur-md text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
              <BookOpen className="w-4 h-4" />
              {post.category}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-crimson font-normal tracking-tight mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              {post.author?.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-sm">
                <div className="font-semibold text-neutral-900">{post.author?.name || "Anonymous"}</div>
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
            
            <div className="text-purple-500 group-hover:translate-x-1 transition-transform">
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

