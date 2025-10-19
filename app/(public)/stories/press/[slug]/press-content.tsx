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

interface PressContentProps {
  post: Post
  relatedPosts: Post[]
}

export function PressContent({ post, relatedPosts }: PressContentProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Professional Press Release Header */}
      <section className="pt-32 pb-16 px-6 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/stories/press" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Press & Media
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-full uppercase tracking-wider">
              PRESS RELEASE
            </span>
          </div>
          
          {post.publishedAt && (
            <div className="text-sm font-bold text-neutral-600 mb-6 uppercase tracking-wide">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </div>
          )}
          
          <h1 className="mt-4 text-2xl font-crimson font-normal tracking-tighter mb-8 leading-tight text-neutral-900">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-neutral-600 leading-relaxed mb-8 border-l-4 border-neutral-900 pl-6 py-2">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3">
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
                <div className="font-bold text-neutral-900">
                  {post.author.name || "Soulworx Team"}
                </div>
                <div className="text-sm text-neutral-600">
                  Media Contact
                </div>
              </div>
            </div>
            
            {post.readTime && (
              <div className="text-sm text-neutral-600">
                {post.readTime} min read
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="pb-16 px-6 pt-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-neutral-200">
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
      <section className="pb-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <article 
            className="prose prose-lg max-w-none
              prose-headings:font-crimson prose-headings:font-normal prose-headings:tracking-tighter prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-neutral-900 prose-a:underline hover:prose-a:text-neutral-600
              prose-blockquote:border-l-4 prose-blockquote:border-neutral-900 prose-blockquote:bg-neutral-50 prose-blockquote:p-4 prose-blockquote:not-italic
              prose-strong:text-neutral-900 prose-strong:font-bold
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700
              prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Media Contact Section */}
      <section className="pb-20 px-6 border-t border-neutral-200 pt-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-neutral-900 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-crimson font-normal mb-4">Media Contact</h3>
                <div className="space-y-2 text-neutral-700">
                  <p><strong>Organization:</strong> Soulworx</p>
                  <p><strong>Email:</strong> <a href="mailto:press@soulworx.com" className="text-neutral-900 hover:underline">press@soulworx.com</a></p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Website:</strong> <a href="https://www.soulworx.com" className="text-neutral-900 hover:underline">www.soulworx.com</a></p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-neutral-200">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 text-neutral-900 font-bold hover:text-neutral-600"
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
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-12">
              Related Press Releases
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/press/${relatedPost.slug}`}
                  className="group block"
                >
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full border border-neutral-200">
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
                        <div className="text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wide">
                          {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </div>
                      )}
                      
                      <h3 className="text-lg font-crimson font-normal tracking-tighter mb-2 group-hover:text-neutral-600 transition-colors line-clamp-2">
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
