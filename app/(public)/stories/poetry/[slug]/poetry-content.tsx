"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"

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

interface PoetryContentProps {
  post: Post
  relatedPosts: Post[]
}

// Split content into verses (paragraphs)
function parsePoetryContent(html: string) {
  // Simple parsing - split by paragraph tags
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const elements = Array.from(doc.body.children)
  
  return elements.map((el, index) => ({
    id: index,
    html: el.outerHTML,
    type: el.tagName.toLowerCase()
  }))
}

function VerseAnimation({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

export function PoetryContent({ post, relatedPosts }: PoetryContentProps) {
  const [verses, setVerses] = useState<{ id: number; html: string; type: string }[]>([])
  
  useEffect(() => {
    setVerses(parsePoetryContent(post.content))
  }, [post.content])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
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
              href="/stories/poetry" 
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Poetry Drops
            </Link>
          </motion.div>
          
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
              POETRY DROP
            </span>
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-gold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {post.title}
          </motion.h1>
          
          {post.excerpt && (
            <motion.p
              className="text-2xl text-neutral-700 font-light leading-relaxed mb-8 italic border-l-4 border-purple-600 pl-6 bg-white/50 backdrop-blur-sm py-4 rounded-r-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              &ldquo;{post.excerpt}&rdquo;
            </motion.p>
          )}
          
          <motion.div
            className="flex items-center gap-6 pb-8 border-b border-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              {post.author.image && (
                <motion.img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-14 h-14 rounded-full ring-4 ring-purple-100"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
              <div>
                <div className="font-bold text-neutral-900 text-lg">
                  {post.author.name || "Anonymous"}
                </div>
                <div className="text-neutral-600 text-sm">
                  {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            {post.readTime && (
              <div className="text-neutral-600 text-sm">
                {post.readTime} min read
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cover Image with parallax effect */}
      {post.coverImage && (
        <section className="pb-16 px-6">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        </section>
      )}

      {/* Poetry Content - Verse by verse animation */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-purple max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-purple-900
            prose-p:text-neutral-800 prose-p:leading-relaxed prose-p:text-lg
            prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-purple-600 prose-blockquote:italic prose-blockquote:bg-purple-50/50 prose-blockquote:py-4
            prose-strong:text-purple-900
            prose-ul:text-neutral-700
            prose-ol:text-neutral-700">
            {verses.map((verse, index) => (
              <VerseAnimation key={verse.id} index={index}>
                <div 
                  dangerouslySetInnerHTML={{ __html: verse.html }}
                  className={verse.type === 'p' ? 'my-8' : ''}
                />
              </VerseAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative quote section */}
      <motion.section
        className="pb-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl p-12 text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                backgroundImage: "radial-gradient(circle, purple 1px, transparent 1px)",
                backgroundSize: "50px 50px"
              }}
            />
            <div className="relative z-10">
              <svg className="w-16 h-16 mx-auto mb-4 text-purple-600 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl md:text-2xl font-light text-purple-900 italic mb-4">
                &ldquo;Poetry is the rhythmical creation of beauty in words.&rdquo;
              </p>
              <p className="text-sm text-purple-700 font-medium">— Edgar Allan Poe</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl font-bold mb-12 text-purple-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              More Poetry
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
                    href={`/stories/poetry/${relatedPost.slug}`}
                    className="group block"
                  >
                    <article className="h-full">
                      {relatedPost.coverImage && (
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                          <motion.img
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      {relatedPost.excerpt && (
                        <p className="text-neutral-600 line-clamp-2 text-sm italic">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </article>
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

