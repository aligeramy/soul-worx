"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useRef } from "react"

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

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 200
      }}
    >
      <motion.div
        className="text-4xl md:text-5xl font-bold text-amber-900 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-amber-700 font-medium">{label}</div>
    </motion.div>
  )
}

export function EventRecapContent({ post, relatedPosts }: EventRecapContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Animated Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Animated background patterns */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/stories/events" 
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Event Recaps
            </Link>
          </motion.div>
          
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold rounded-full shadow-lg">
              EVENT RECAP
            </span>
            
            {post.publishedAt && (
              <motion.div
                className="px-4 py-2 bg-white rounded-full border-2 border-amber-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="text-sm font-bold text-amber-900">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-amber-950"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {post.title}
          </motion.h1>
          
          {post.excerpt && (
            <motion.p
              className="text-2xl text-neutral-700 font-light leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {post.excerpt}
            </motion.p>
          )}
          
          <motion.div
            className="flex items-center gap-6 pb-8 border-b border-amber-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              {post.author.image && (
                <motion.img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-14 h-14 rounded-full ring-4 ring-amber-100"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
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
          </motion.div>
        </div>
      </section>

      {/* Cover Image with zoom animation */}
      {post.coverImage && (
        <section className="pb-16 px-6">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* Content with fade-in */}
      <section className="pb-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <article 
            className="prose prose-lg prose-amber max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-amber-950
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-amber-600 prose-blockquote:bg-amber-50/50 prose-blockquote:py-4
              prose-strong:text-neutral-900
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700
              prose-img:rounded-2xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </section>

      {/* Event Stats with animated numbers */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative elements */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-amber-950 relative z-10">
              Event Highlights
            </h3>
            <div className="grid grid-cols-3 gap-6 relative z-10">
              <AnimatedStat value="50+" label="Attendees" delay={0.2} />
              <AnimatedStat value="15" label="Performances" delay={0.4} />
              <AnimatedStat value="3hrs" label="Duration" delay={0.6} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Event CTA with hover effects */}
      <section className="pb-20 px-6 border-t border-amber-200 pt-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }}
              animate={{
                backgroundPosition: ["0px 0px", "30px 30px"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Don&apos;t Miss Our Next Event</h3>
              <p className="text-amber-100 mb-8 text-lg">
                Join us for upcoming workshops, performances, and community gatherings
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/programs/calendar"
                  className="inline-block px-8 py-4 bg-white text-amber-600 rounded-full font-bold hover:bg-amber-50 transition-colors shadow-lg"
                >
                  View Event Calendar
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts with stagger animation */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-amber-200 pt-20">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl font-bold mb-12 text-amber-950"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              More Event Recaps
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={`/stories/events/${relatedPost.slug}`}
                    className="group block"
                  >
                    <motion.article
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {relatedPost.coverImage && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <motion.img
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        {relatedPost.publishedAt && (
                          <div className="text-xs font-bold text-amber-600 mb-2">
                            {new Date(relatedPost.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                        
                        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
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

