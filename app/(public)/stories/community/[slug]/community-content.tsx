"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

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

interface CommunityContentProps {
  post: Post
  relatedPosts: Post[]
}

export function CommunityContent({ post, relatedPosts }: CommunityContentProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <Link 
              href="/stories/community" 
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Community
            </Link>
            
            <span className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-full uppercase tracking-wider">
              COMMUNITY HIGHLIGHT
            </span>
          </div>
          
          <h1 className="mt-4 text-2xl font-crimson font-normal tracking-tighter mb-8 leading-tight text-neutral-900">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-neutral-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-6 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full"
                />
              )}
              <div>
                <div className="font-bold text-neutral-900 text-lg">
                  {post.author.name || "Anonymous"}
                </div>
                <div className="text-neutral-600">
                  {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-neutral-600 text-sm">
              {post.readTime && (
                <div>{post.readTime} min read</div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.viewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <article 
            className="prose prose-lg max-w-none
              prose-headings:font-crimson prose-headings:font-normal prose-headings:tracking-tighter prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-neutral-900 prose-a:underline hover:prose-a:text-neutral-600
              prose-blockquote:border-l-4 prose-blockquote:border-neutral-900 prose-blockquote:bg-neutral-50 prose-blockquote:py-4
              prose-strong:text-neutral-900
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Share Section */}
      <section className="pb-20 px-6 border-t border-neutral-200 pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-50 rounded-3xl p-8 text-center border border-neutral-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            
            <h3 className="text-2xl font-crimson font-normal mb-4">Share This Story</h3>
            <p className="text-neutral-600 mb-6">Help us celebrate this voice from our community</p>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-12">
              More Community Stories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/community/${relatedPost.slug}`}
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

