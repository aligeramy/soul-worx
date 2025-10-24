"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

interface HeroSectionProps {
  coverImage: string | null
  title: string
  excerpt: string | null
  author: {
    id: string
    name: string | null
    image: string | null
  }
  publishedAt: Date | null
  readTime: number | null
  viewCount: number
  category: "blog" | "poetry" | "events"
  backHref: string
  backLabel: string
  additionalMeta?: React.ReactNode
}

export function HeroSection({
  coverImage,
  title,
  excerpt,
  author,
  publishedAt,
  readTime,
  viewCount,
  category,
  backHref,
  backLabel,
  additionalMeta
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate fade based on scroll
  const opacity = Math.max(0, 1 - scrollY / 400)

  const categoryLabels = {
    blog: "BLOG",
    poetry: "POETRY DROP",
    events: "EVENT RECAP"
  }

  return (
    <section className="relative h-screen min-h-[120vh] overflow-hidden bg-neutral-900">
      {coverImage ? (
        <div className="relative h-full">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 pt-36">
            <div className="max-w-4xl mx-auto w-full">
              {/* Back Button */}
              <div className="mb-8">
                <Link 
                  href={backHref} 
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white group transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  {backLabel}
                </Link>
              </div>

              {/* Title & Description */}
              <div
                style={{
                  opacity: opacity
                }}
                className="transition-opacity duration-300"
              >
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-bold rounded-full uppercase tracking-wider mb-6 border border-white/20">
                  {categoryLabels[category]}
                </span>
                
                <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter mb-6 leading-tight text-white drop-shadow-2xl">
                  {title}
                </h1>
                
                {excerpt && (
                  <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 drop-shadow-lg max-w-3xl">
                    {excerpt}
                  </p>
                )}
                
                {/* Author & Meta */}
                <div className="flex flex-wrap items-center gap-6 pb-8 text-white/80">
                  <div className="flex items-center gap-3">
                    {author.image && (
                      <Image
                        src={author.image}
                        alt={author.name || "Author"}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full border-2 border-white/30"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-white">
                        {author.name || "Anonymous"}
                      </div>
                      {publishedAt && (
                        <div className="text-sm text-white/70">
                          {new Date(publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </div>
                      )}
                      {additionalMeta && category === 'events' && (
                        <div className="text-sm text-white/70 flex items-center gap-1 mt-1">
                          {additionalMeta}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {readTime && (
                      <div>{readTime} min read</div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{viewCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Fallback if no cover image
        <div className="h-full bg-neutral-900 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6">
            <Link 
              href={backHref} 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white group mb-8"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {backLabel}
            </Link>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter mb-6 text-white">
              {title}
            </h1>
            {excerpt && (
              <p className="text-xl text-white/80">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

