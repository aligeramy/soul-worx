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

interface EventRecapContentProps {
  post: Post
  relatedPosts: Post[]
}

export function EventRecapContent({ post, relatedPosts }: EventRecapContentProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/stories/events" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Event Recaps
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-full uppercase tracking-wider">
              EVENT RECAP
            </span>
            
            {post.publishedAt && (
              <div className="px-4 py-2 bg-neutral-100 rounded-full border border-neutral-200">
                <div className="text-sm font-bold text-neutral-900">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}
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
                <div className="text-neutral-600 text-sm">
                  Event Organizer
                </div>
              </div>
            </div>
            
            {post.readTime && (
              <div className="flex items-center gap-2 text-neutral-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime} min read
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1400}
                height={600}
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
              prose-ol:text-neutral-700
              prose-img:rounded-2xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Next Event CTA */}
      <section className="pb-20 px-6 border-t border-neutral-200 pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-900 rounded-3xl p-12 text-center text-white shadow-xl">
            <h3 className="text-3xl font-crimson font-normal mb-4">Don&apos;t Miss Our Next Event</h3>
            <p className="text-neutral-300 mb-8 text-lg">
              Join us for upcoming workshops, performances, and community gatherings
            </p>
            <Link 
              href="/programs/calendar"
              className="inline-block px-8 py-4 bg-white text-neutral-900 rounded-full font-bold hover:bg-neutral-100 transition-colors"
            >
              View Event Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-12">
              More Event Recaps
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/events/${relatedPost.slug}`}
                  className="group block"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full border border-neutral-100">
                    {relatedPost.coverImage && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      {relatedPost.publishedAt && (
                        <div className="text-xs font-bold text-neutral-600 mb-2">
                          {new Date(relatedPost.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                      
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
