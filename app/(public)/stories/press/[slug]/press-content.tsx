"use client"

import { motion } from "framer-motion"
import Link from "next/link"

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Professional Press Release Header */}
      <section className="pt-32 pb-16 px-6 bg-white border-b-2 border-emerald-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/stories/press" 
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Press & Media
            </Link>
          </motion.div>
          
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold rounded-md shadow-md">
              PRESS RELEASE
            </span>
          </motion.div>
          
          {post.publishedAt && (
            <motion.div
              className="text-sm font-bold text-emerald-700 mb-6 uppercase tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </motion.div>
          )}
          
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight text-neutral-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {post.title}
          </motion.h1>
          
          {post.excerpt && (
            <motion.p
              className="text-xl text-neutral-700 leading-relaxed mb-8 font-medium border-l-4 border-emerald-600 pl-6 py-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {post.excerpt}
            </motion.p>
          )}
          
          <motion.div
            className="flex items-center justify-between pb-8 border-b-2 border-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
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
            
            <div className="flex items-center gap-4">
              {post.readTime && (
                <div className="text-sm text-neutral-600">
                  {post.readTime} min read
                </div>
              )}
              
              <motion.button
                className="p-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </motion.button>
              
              <motion.button
                className="p-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image - Professional Style */}
      {post.coverImage && (
        <section className="pb-16 px-6 pt-16 bg-white">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-neutral-200">
              <motion.img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* Content - Professional Article Style */}
      <section className="pb-20 px-6 bg-white">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <article 
            className="prose prose-lg prose-emerald max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:text-lg
              prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-emerald-600 prose-blockquote:bg-emerald-50 prose-blockquote:p-4 prose-blockquote:not-italic
              prose-strong:text-neutral-900 prose-strong:font-bold
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700
              prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </section>

      {/* Media Contact Section - Professional */}
      <section className="pb-20 px-6 border-t-2 border-neutral-200 pt-12 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl p-8 border-2 border-emerald-200 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 text-neutral-900">Media Contact</h3>
                <div className="space-y-2 text-neutral-700">
                  <p><strong>Organization:</strong> Soulworx</p>
                  <p><strong>Email:</strong> <a href="mailto:press@soulworx.com" className="text-emerald-600 hover:underline">press@soulworx.com</a></p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Website:</strong> <a href="https://www.soulworx.com" className="text-emerald-600 hover:underline">www.soulworx.com</a></p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-emerald-200">
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700"
                >
                  Request Press Kit
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Press Releases */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t-2 border-neutral-200 pt-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl font-bold mb-12 text-neutral-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Related Press Releases
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={`/stories/press/${relatedPost.slug}`}
                    className="group block"
                  >
                    <motion.article
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all h-full border border-neutral-200"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {relatedPost.coverImage && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <motion.img
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        {relatedPost.publishedAt && (
                          <div className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wide">
                            {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { 
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </div>
                        )}
                        
                        <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        
                        {relatedPost.excerpt && (
                          <p className="text-neutral-600 line-clamp-2 text-sm">
                            {relatedPost.excerpt}
                          </p>
                        )}
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

