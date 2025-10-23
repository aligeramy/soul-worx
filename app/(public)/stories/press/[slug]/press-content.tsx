"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Eye, Award } from "lucide-react"

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

interface PressContentProps {
  post: Post
  relatedPosts: Post[]
}

export function PressContent({ post, relatedPosts }: PressContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/stories/press" 
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 group transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Press</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link href="/stories/poetry" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Poetry
              </Link>
              <Link href="/stories/blog" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Blog
              </Link>
              <Link href="/stories/events" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Events
              </Link>
              <Link href="/stories/press" className="text-sm font-semibold text-neutral-900">
                Press
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Badges */}
          <div className="flex items-center gap-4 mb-8">
            <span className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-full uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              Press Release
            </span>
            
            {post.publishedAt && (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 rounded-full border border-neutral-200">
                <Calendar className="w-4 h-4 text-neutral-600" />
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
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-crimson font-normal tracking-tighter mb-6 leading-[1.1] text-neutral-900">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed mb-10 max-w-3xl border-l-4 border-neutral-900 pl-6 py-2">
              {post.excerpt}
            </p>
          )}
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full ring-2 ring-neutral-200"
                />
              )}
              <div>
                <div className="font-bold text-neutral-900 text-lg">
                  {post.author.name || "Soulworx Team"}
                </div>
                <div className="text-neutral-500 text-sm flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Media Contact
                </div>
              </div>
            </div>
            
            {post.readTime && (
              <div className="flex items-center gap-2 text-neutral-600 px-4 py-2 bg-neutral-50 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{post.readTime} min read</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-neutral-600 px-4 py-2 bg-neutral-50 rounded-full">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{post.viewCount} views</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-200">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1400}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <article 
            className="prose prose-xl max-w-none
              prose-headings:font-crimson prose-headings:font-normal prose-headings:tracking-tighter prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:text-lg
              prose-a:text-neutral-900 prose-a:underline hover:prose-a:text-neutral-600
              prose-blockquote:border-l-4 prose-blockquote:border-neutral-900 prose-blockquote:bg-neutral-50 prose-blockquote:py-6 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-lg prose-blockquote:not-italic
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

      {/* Media Contact Section */}
      <section className="pb-24 px-6 border-t border-neutral-200 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-10 md:p-12 text-white shadow-2xl border-2 border-neutral-700">
            <div className="flex items-start gap-6 mb-8">
             
              <div className="flex-1">
                <div className="space-y-4 text-white/90">
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-white min-w-[100px]">Organization:</span>
                    <span>Soulworx</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-white min-w-[100px]">Email:</span>
                    <a href="mailto:Indianarotondo@soulworx.ca" className="text-white hover:text-white/80 underline transition-colors">
                      Indianarotondo@soulworx.ca
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-white min-w-[100px]">Phone:</span>
                    <a href="tel:+16474531223" className="text-white hover:text-white/80 underline transition-colors">
                      +1 (647) 453-1223
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-white min-w-[100px]">Website:</span>
                    <a href="https://www.soulworx.ca" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 underline transition-colors">
                      www.soulworx.ca
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/20">
              <Link 
                href="/contact/press"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-full font-bold text-lg hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl"
              >
                Request Press Kit
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Press Releases */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-14">
              <h2 className="text-4xl font-crimson font-normal tracking-tighter">
                More Press Releases
              </h2>
              <Link 
                href="/stories/press"
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
                  href={`/stories/press/${relatedPost.slug}`}
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
