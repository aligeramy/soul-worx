"use client"

import Link from "next/link"
import Image from "next/image"
import { Share2, Check } from "lucide-react"
import { useState } from "react"
import { HeroSection } from "@/components/stories/hero-section"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  category: string
  tags: string[]
  status: string
  readTime: number | null
  viewCount: number
  publishedAt: Date | null
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface BlogContentProps {
  post: Post
  relatedPosts: Post[]
}

function ShareButton({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt || post.title,
      url: url,
    }

    try {
      // Try Web Share API first (mobile)
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      // User cancelled or error - try clipboard fallback
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (clipboardErr) {
        console.error('Failed to copy:', clipboardErr)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="group inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-neutral-50 border-2 border-neutral-200 hover:border-neutral-300 rounded-full transition-all advance-shadow"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
          <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
            Share this post
          </span>
        </>
      )}
    </button>
  )
}

export function BlogContent({ post, relatedPosts }: BlogContentProps) {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Hero Section */}
      <HeroSection
        coverImage={post.coverImage}
        title={post.title}
        excerpt={post.excerpt}
        author={post.author}
        publishedAt={post.publishedAt}
        readTime={post.readTime}
        viewCount={post.viewCount}
        category="blog"
        backHref="/stories/blog"
        backLabel="Back to Blog"
      />

      {/* Content */}
      <section className="pb-20 px-6 pt-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <style dangerouslySetInnerHTML={{__html: `
            .blog-content blockquote {
              position: relative;
              padding: 2rem 2.5rem;
              margin: 2.5rem 0;
              background: linear-gradient(to right, rgba(121, 79, 65, 0.08) 0%, rgba(121, 79, 65, 0.04) 100%);
              border-left: 4px solid rgb(121, 79, 65);
              border-radius: 0 1rem 1rem 0;
              font-family: var(--font-crimson);
              font-size: 1.55rem;
              line-height: 1.25;
              color: rgb(121, 79, 65);
            }
            .blog-content blockquote::before {
              content: '"';
              position: absolute;
              top: 0rem;
              left: 1rem;
              font-size: 4rem;
              font-family: var(--font-crimson);
              color: rgb(121, 79, 65);
              opacity: 0.25;
              line-height: 1;
            }
            .blog-content blockquote cite {
              display: block;
              margin-top: 1rem;
              font-size: 0.875rem;
              font-style: normal;
              font-family: var(--font-crimson);
              color: rgba(121, 79, 65, 0.8);
              font-weight: 500;
            }
            .blog-content blockquote cite::before {
              content: '— ';
            }
            .blog-content blockquote p {
              margin: 0;
              padding: 0;
            }
            .blog-content blockquote p + p {
              margin-top: 1rem;
            }
          `}} />
          <article 
            className="blog-content prose prose-lg max-w-none
              prose-headings:font-crimson prose-headings:font-normal prose-headings:tracking-tighter prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-neutral-900 prose-a:underline hover:prose-a:text-neutral-600
              prose-strong:text-neutral-900
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Share Section */}
      <section className="pb-20 px-6 border-t border-neutral-200 pt-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Author Info */}
            <div className="flex items-center gap-4">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <div className="text-sm text-neutral-500">Written by</div>
                <div className="font-semibold text-neutral-900">
                  {post.author.name || "Anonymous"}
                </div>
              </div>
            </div>
            
            {/* Share Button */}
            <ShareButton post={post} />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-12">
              More Blog Posts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full border border-neutral-100">
                    {relatedPost.coverImage && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-crimson font-normal tracking-tighter mb-2 group-hover:text-neutral-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      {relatedPost.excerpt && (
                        <p className="text-neutral-600 line-clamp-2 text-sm">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

