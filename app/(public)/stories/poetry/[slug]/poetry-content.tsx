"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
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
  const [currentSlide, setCurrentSlide] = useState(0)
  
  useEffect(() => {
    setVerses(parsePoetryContent(post.content))
  }, [post.content])

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (relatedPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % relatedPosts.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [relatedPosts.length])

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
        category="poetry"
        backHref="/stories/poetry"
        backLabel="Back to Poetry Drops"
      />

      {/* Poetry Content - Verse by verse animation */}
      <section className="pb-20 px-6 pt-20 bg-brand-bg-darker relative z-10">
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
            color: white !important;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 1.5rem;
            text-align: center;
            font-style: italic;
          }
          .poetry-content a {
            color: white;
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
            color: white !important;
            text-align: center;
            list-style-position: inside;
          }
          .poetry-content li {
            font-family: var(--font-crimson);
            color: white !important;
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

      {/* Next Poem Preview */}
      {relatedPosts.length > 0 && (
        <section className="pb-20 px-6 pt-20 bg-brand-bg-darker">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <p className="text-white/60 text-sm mb-2">Next Poem</p>
              <div className="flex items-center justify-center gap-2 text-white/40">
                <div className="h-px w-12 bg-white/20" />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <div className="h-px w-12 bg-white/20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[70vh] rounded-3xl overflow-hidden border border-white/10"
            >
              {relatedPosts.map((poem, index) => (
                <motion.div
                  key={poem.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: index === currentSlide ? 1 : 0,
                    scale: index === currentSlide ? 1 : 1.05
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Link 
                    href={`/stories/poetry/${poem.slug}`}
                    className="group block h-full"
                  >
                    <article className="relative h-full">
                      {poem.coverImage && (
                        <>
                          <Image
                            src={poem.coverImage}
                            alt={poem.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 group-hover:from-black/80 transition-all duration-300" />
                        </>
                      )}
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                        <div className="relative z-10">
                          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4 border border-white/20">
                            Next Poem
                          </span>
                          
                          <h3 className="text-3xl md:text-5xl font-crimson font-normal tracking-tighter mb-4 text-white line-clamp-2">
                            {poem.title}
                          </h3>
                          
                          {poem.excerpt && (
                            <p className="text-lg text-white/90 line-clamp-2 italic mb-6">
                              &ldquo;{poem.excerpt}&rdquo;
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 text-white/80 text-sm">
                            <span>Read poem</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
