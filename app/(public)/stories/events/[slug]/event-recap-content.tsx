"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Eye } from "lucide-react"
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

interface EventRecapContentProps {
  post: Post
  relatedPosts: Post[]
}

export function EventRecapContent({ post, relatedPosts }: EventRecapContentProps) {
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
        category="events"
        backHref="/stories/events"
        backLabel="Back to Event Recaps"
        additionalMeta={
          <>
            <User className="w-3 h-3" />
            Event Organizer
          </>
        }
      />

      {/* Content */}
      <section className="pb-24 px-6 pt-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <article 
            className="prose prose-xl max-w-none
              prose-headings:font-crimson prose-headings:font-normal prose-headings:tracking-tighter prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:text-lg
              prose-a:text-neutral-900 prose-a:underline hover:prose-a:text-neutral-600
              prose-blockquote:border-l-4 prose-blockquote:border-neutral-900 prose-blockquote:bg-neutral-50 prose-blockquote:py-6 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-lg
              prose-strong:text-neutral-900 prose-strong:font-semibold
              prose-ul:text-neutral-700 prose-ul:text-lg
              prose-ol:text-neutral-700 prose-ol:text-lg
              prose-img:rounded-2xl prose-img:shadow-xl prose-img:border-2 prose-img:border-neutral-200
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Next Event CTA */}
      <section className="pb-24 px-6 border-t border-neutral-200 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl border-2 border-neutral-700">
            <Calendar className="w-16 h-16 mx-auto mb-6 text-white" />
            <h3 className="text-3xl md:text-4xl font-crimson font-normal mb-4">Don&apos;t Miss Our Next Event</h3>
            <p className="text-neutral-300 mb-10 text-lg max-w-2xl mx-auto">
              Join us for upcoming workshops, performances, and community gatherings. Connect with like-minded creatives and be part of the movement.
            </p>
            <Link 
              href="/programs/calendar"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-neutral-900 rounded-full font-bold text-lg hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl"
            >
              View Event Calendar
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-14">
              <h2 className="text-4xl font-crimson font-normal tracking-tighter">
                More Event Recaps
              </h2>
              <Link 
                href="/stories/events"
                className="text-neutral-600 hover:text-neutral-900 flex items-center gap-2 transition-colors"
              >
                View All
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/events/${relatedPost.slug}`}
                  className="group block"
                >
                  <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full border border-neutral-200 hover:border-neutral-300">
                    {relatedPost.coverImage && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {relatedPost.publishedAt && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                            <div className="text-xs font-bold text-neutral-900">
                              {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="p-7">
                      <h3 className="text-xl font-crimson font-normal tracking-tighter mb-3 group-hover:text-neutral-600 transition-colors line-clamp-2 leading-tight">
                        {relatedPost.title}
                      </h3>
                      
                      {relatedPost.excerpt && (
                        <p className="text-neutral-600 line-clamp-2 text-sm leading-relaxed">
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
