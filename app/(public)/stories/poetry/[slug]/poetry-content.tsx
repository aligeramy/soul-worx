"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"

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
    <div className="min-h-screen bg-brand-bg-darker relative">
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url('/noise.png')`,
          backgroundRepeat: 'repeat',
          opacity: 0.3,
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/stories/poetry" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 group"
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
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold rounded-full">
              POETRY DROP
            </span>
          </motion.div>
          
          <motion.h1
            className="mt-4 text-2xl font-crimson font-normal tracking-tighter mb-8 leading-tight text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {post.title}
          </motion.h1>
          
          {post.excerpt && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <p className="text-xl text-white/90 font-light leading-relaxed italic">
                  &ldquo;{post.excerpt}&rdquo;
                </p>
              </div>
            </motion.div>
          )}
          
          <motion.div
            className="flex items-center gap-6 pb-8 border-b border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              {post.author.image && (
                <motion.img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-14 h-14 rounded-full ring-2 ring-white/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
              <div>
                <div className="font-bold text-white text-lg">
                  {post.author.name || "Anonymous"}
                </div>
                <div className="text-white/60 text-sm">
                  {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            {post.readTime && (
              <div className="text-white/60 text-sm">
                {post.readTime} min read
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cover Image with parallax effect */}
      {post.coverImage && (
        <section className="pb-16 px-6 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>
        </section>
      )}

      {/* Poetry Content - Verse by verse animation */}
      <section className="pb-20 px-6 relative z-10">
        <style dangerouslySetInnerHTML={{__html: `
          .poetry-content p {
            font-family: var(--font-crimson);
            font-weight: 400;
            color: white !important;
            font-size: 1.25rem;
            line-height: 1.75;
            text-align: center;
            margin: 2rem 0;
          }
          .poetry-content h1,
          .poetry-content h2,
          .poetry-content h3,
          .poetry-content h4,
          .poetry-content h5,
          .poetry-content h6 {
            font-family: var(--font-crimson);
            font-weight: 400;
            color: white !important;
            text-align: center;
          }
          .poetry-content blockquote {
            font-family: var(--font-crimson);
            color: rgba(255, 255, 255, 0.9) !important;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 1.5rem;
            text-align: center;
            font-style: italic;
          }
          .poetry-content a {
            color: oklch(0.75 0.15 60);
            text-decoration: none;
          }
          .poetry-content a:hover {
            text-decoration: underline;
          }
          .poetry-content strong {
            color: white !important;
            font-weight: 600;
          }
          .poetry-content ul,
          .poetry-content ol {
            font-family: var(--font-crimson);
            color: rgba(255, 255, 255, 0.8) !important;
            text-align: center;
            list-style-position: inside;
          }
          .poetry-content li {
            font-family: var(--font-crimson);
            color: rgba(255, 255, 255, 0.8) !important;
          }
        `}} />
        <div className="max-w-3xl mx-auto">
          <div className="poetry-content">
            {verses.map((verse, index) => (
              <VerseAnimation key={verse.id} index={index}>
                <div 
                  dangerouslySetInnerHTML={{ __html: verse.html }}
                />
              </VerseAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative quote section */}
      <motion.section
        className="pb-20 px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative z-10">
              <svg className="w-16 h-16 mx-auto mb-4 text-gold opacity-70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl md:text-2xl font-light text-white italic mb-4">
                &ldquo;Poetry is the rhythmical creation of beauty in words.&rdquo;
              </p>
              <p className="text-sm text-white/70 font-medium">— Edgar Allan Poe</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-white/20 pt-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl font-crimson font-normal tracking-tighter mb-12 text-white"
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
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-white/10">
                          <Image
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                        </div>
                      )}
                      
                      <h3 className="text-xl font-crimson font-normal tracking-tighter mb-2 text-white group-hover:text-gold transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      {relatedPost.excerpt && (
                        <p className="text-white/70 line-clamp-2 text-sm italic">
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
