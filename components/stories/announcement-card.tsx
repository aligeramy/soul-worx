import Link from "next/link"
import Image from "next/image"
import type { posts, users } from "@/lib/db/schema"
import { Megaphone } from "lucide-react"

type Post = typeof posts.$inferSelect & {
  author: Pick<typeof users.$inferSelect, "id" | "name" | "image">
}

interface AnnouncementCardProps {
  post: Post
}

export function AnnouncementCard({ post }: AnnouncementCardProps) {
  return (
    <Link 
      href={`/stories/press/${post.slug}`}
      className="group block"
    >
      <article className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-full bg-brand-bg-darker border border-white/10 hover:border-white/20 flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden flex-1">
          {/* Image Section */}
          <div className="relative h-full">
            {post.coverImage ? (
              <>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/40"></div>
              </>
            ) : (
              <div className="w-full h-full bg-brand-bg-darker flex items-center justify-center">
                <Megaphone className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Top Section - Announcement Badge */}
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-lg border border-white/30 shadow-lg">
                <Megaphone className="w-4 h-4 text-white" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Announcement
                </span>
              </div>
              
              {post.publishedAt && (
                <div className="text-xs text-white/60 font-medium bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>

            {/* Middle Section - Title and Excerpt */}
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors leading-tight line-clamp-2">
                {post.title}
              </h3>
              
              {post.excerpt && (
                <p className="text-sm md:text-base text-white/90 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Bottom Section - CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                {post.author?.image && (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "Author"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white/40"
                  />
                )}
                <div className="text-sm">
                  <div className="font-semibold text-white">{post.author?.name || "Team"}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-lg border border-white/30 group-hover:bg-white/20 transition-all">
                <span className="text-sm font-semibold text-white">Read More</span>
                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

