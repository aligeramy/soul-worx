import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen } from "lucide-react"

export default async function PoetryDropsPage() {
  const posts = await getPublishedPosts()
  const poetryPosts = posts.filter(p => p.category === "poetry")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/0K0A2885.jpg"
          alt="Poetry"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/stories" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Stories
            </Link>
            
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              POETRY DROPS
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Words Unbound
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Raw verses, spoken truths, and the art of expression through poetry
            </p>
          </div>
        </div>
      </section>

      {/* Poetry Cards */}
      <section className="pb-32 px-6 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          {poetryPosts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-crimson font-normal mb-2">No poetry yet</h3>
              <p className="text-neutral-500">Check back soon for new drops</p>
            </div>
          ) : (
            <div className="space-y-20">
              {poetryPosts.map((post, index) => (
                <article 
                  key={post.id}
                  className="group relative"
                >
                  <Link href={`/stories/poetry/${post.slug}`}>
                    <div className={`
                      grid md:grid-cols-2 gap-12 items-center
                      ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}
                    `}>
                      {/* Image */}
                      <div className={`relative overflow-hidden rounded-3xl aspect-[4/5] ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                        {post.coverImage ? (
                          <>
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              width={400}
                              height={500}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                            <div className="text-6xl">📝</div>
                          </div>
                        )}
                        
                        {/* Floating date badge */}
                        {post.publishedAt && (
                          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                            <div className="text-xs font-bold text-neutral-900">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-4xl md:text-5xl font-crimson font-normal tracking-tighter mb-4 text-neutral-900 group-hover:text-neutral-600 transition-colors">
                              {post.title}
                            </h2>
                            
                            {post.excerpt && (
                              <p className="text-lg text-neutral-600 leading-relaxed italic">
                                &ldquo;{post.excerpt}&rdquo;
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
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
                                {post.author.name || "Anonymous"}
                              </div>
                              {post.readTime && (
                                <div className="text-sm text-neutral-600">
                                  {post.readTime} min read
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-neutral-900 font-semibold group-hover:gap-4 transition-all">
                            Read More
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

