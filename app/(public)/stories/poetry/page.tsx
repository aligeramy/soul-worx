import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"

export default async function PoetryDropsPage() {
  const posts = await getPublishedPosts()
  const poetryPosts = posts.filter(p => p.category === "poetry")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Artistic Header */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Link 
            href="/stories" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </Link>
          
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-full">
              POETRY DROPS
            </span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold tracking-tight mb-8 leading-none">
            Words
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent italic">
              Unbound
            </span>
          </h1>
          
          <p className="text-2xl text-neutral-600 max-w-2xl font-light leading-relaxed">
            Raw verses, spoken truths, and the art of expression through poetry
          </p>
        </div>
      </section>

      {/* Poetry Cards - Literary Magazine Style */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          {poetryPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">No poetry yet</h3>
              <p className="text-neutral-600">Check back soon for new drops</p>
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
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
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
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h2>
                            
                            {post.excerpt && (
                              <p className="text-lg text-neutral-600 leading-relaxed font-light italic">
                                &ldquo;{post.excerpt}&rdquo;
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {post.author.image && (
                              <img
                                src={post.author.image}
                                alt={post.author.name || "Author"}
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
                          
                          <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
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

