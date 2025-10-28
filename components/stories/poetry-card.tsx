"use client"

import Link from "next/link"
import Image from "next/image"
import type { posts, users } from "@/lib/db/schema"
import { useEffect, useState, useMemo } from "react"

type Post = typeof posts.$inferSelect & {
  author: Pick<typeof users.$inferSelect, "id" | "name" | "image">
}

interface PoetryCardProps {
  post: Post
}

export function PoetryCard({ post }: PoetryCardProps) {
  const [currentVerse, setCurrentVerse] = useState(0)

  // Helper function to strip HTML tags and get plain text
  const stripHtml = (html: string) => {
    // Server-safe HTML stripping using regex
    return html
      .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
      .replace(/<\/p>/gi, '\n') // Convert </p> to newlines
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/\n\n+/g, '\n\n') // Normalize multiple newlines
      .trim()
  }

  // Parse content into verses (split by double line breaks or paragraphs)
  const verses = useMemo(() => {
    const html = post.content ?? ""
    // Try to split by HTML paragraphs first
    const paragraphMatches = html.match(/<p[\s\S]*?<\/p>/gi)
    const blocks: string | string[] =
      paragraphMatches && paragraphMatches.length > 0
        ? paragraphMatches
        : html
            .replace(/<br\s*\/?>(?=\s*<)/gi, '\n') // <br> to newlines when followed by tags
            .replace(/<br\s*\/?>(?!\s*<)/gi, '\n') // <br> to newlines otherwise
            .replace(/<\/p>/gi, '\n\n') // end of paragraph to blank line
            .replace(/<[^>]*>/g, '') // drop remaining tags

    const parts = Array.isArray(blocks)
      ? blocks
      : blocks.split(/\n{2,}|\r?\n\s*\r?\n/) // split by blank lines

    return parts
      .map((v) => {
        const cleanedVerse = stripHtml(v).trim()
        // Limit to 5 lines
        const lines = cleanedVerse.split('\n')
        if (lines.length > 5) {
          return lines.slice(0, 5).join('\n') + '...'
        }
        return cleanedVerse
      })
      .filter((v) => v.length > 0)
  }, [post.content])

  useEffect(() => {
    if (verses.length <= 1) return

    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % verses.length)
    }, 5000) // 5 seconds per verse

    return () => clearInterval(interval)
  }, [verses.length])

  return (
    <Link 
      href={`/stories/poetry/${post.slug}`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>
              </>
            ) : (
              <div className="w-full h-full bg-brand-bg-darker flex items-center justify-center">
                <div className="text-5xl text-white/40">📝</div>
              </div>
            )}
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            {/* Top Section */}
            <div>
              {/* Category Badge */}
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/20">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Poetry
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl md:text-5xl font-crimson font-normal tracking-tight text-white group-hover:text-white/90 transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </div>

            {/* Center Section - Animated Verses */}
            <div className="flex-1 flex items-center justify-center relative my-4 min-h-[80px]">
              {verses.map((verse, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center px-2 transition-opacity duration-[1500ms] ease-in-out ${
                    index === currentVerse 
                      ? 'opacity-100' 
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="text-base md:text-lg text-white font-crimson leading-relaxed italic drop-shadow-md text-center whitespace-pre-line">
                    &ldquo;{verse}&rdquo;
                  </p>
                </div>
              ))}
              
              {/* Verse indicator dots */}
              {verses.length > 1 && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {verses.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === currentVerse ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section - Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                {post.author?.image && (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "Author"}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border border-white/30"
                  />
                )}
                <div className="text-xs text-white/80">
                  <div className="font-semibold">{post.author?.name || "Anonymous"}</div>
                  {post.publishedAt && (
                    <div className="text-[10px] text-white/50">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-white/80 group-hover:translate-x-1 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

