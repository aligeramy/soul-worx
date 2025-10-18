import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"

export default async function EventRecapsPage() {
  const posts = await getPublishedPosts()
  const eventPosts = posts.filter(p => p.category === "news")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Dynamic Event Header */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
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
            <span className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold rounded-full">
              EVENT RECAPS
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            Moments
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Captured
            </span>
          </h1>
          
          <p className="text-xl text-neutral-600 max-w-2xl font-light">
            Relive the energy and highlights from our workshops, performances, and gatherings
          </p>
        </div>
      </section>

      {/* Event Cards - Timeline Style */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          {eventPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">No event recaps yet</h3>
              <p className="text-neutral-600">Check back after our next event</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-200 via-orange-200 to-amber-200 transform -translate-x-1/2"></div>
              
              <div className="space-y-16">
                {eventPosts.map((post, index) => (
                  <div 
                    key={post.id}
                    className={`relative grid md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:grid-flow-dense'}`}
                  >
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 top-8 w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full transform -translate-x-1/2 z-10 ring-4 ring-white shadow-lg"></div>
                    
                    {/* Content card */}
                    <Link 
                      href={`/stories/events/${post.slug}`}
                      className={`group ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:col-start-2'}`}
                    >
                      <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {post.coverImage ? (
                            <>
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              
                              {/* Event date badge */}
                              {post.publishedAt && (
                                <div className="absolute top-6 left-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg">
                                  <div className="text-2xl font-bold leading-none mb-1">
                                    {new Date(post.publishedAt).getDate()}
                                  </div>
                                  <div className="text-xs font-bold uppercase">
                                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short' })}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                              <div className="text-6xl">📸</div>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-8">
                          <h2 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-amber-600 transition-colors">
                            {post.title}
                          </h2>
                          
                          {post.excerpt && (
                            <p className="text-neutral-600 mb-6 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {post.author.image && (
                                <img
                                  src={post.author.image}
                                  alt={post.author.name || "Author"}
                                  className="w-10 h-10 rounded-full"
                                />
                              )}
                              <div className="text-sm">
                                <div className="font-bold text-neutral-900">
                                  {post.author.name || "Anonymous"}
                                </div>
                                {post.readTime && (
                                  <div className="text-neutral-500">
                                    {post.readTime} min read
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-amber-600 font-bold group-hover:gap-3 transition-all">
                              Read Recap
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

