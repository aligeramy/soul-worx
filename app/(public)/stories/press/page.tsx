import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"

export default async function PressMediaPage() {
  const posts = await getPublishedPosts()
  const pressPosts = posts.filter(p => p.category === "announcements")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Professional Press Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
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
            <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-bold rounded-full">
              PRESS & MEDIA
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            In The
            <br />
            <span className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Spotlight
            </span>
          </h1>
          
          <p className="text-xl text-neutral-600 max-w-2xl font-light">
            Media coverage, press releases, and official announcements from Soulworx
          </p>
        </div>
      </section>

      {/* Press Cards - News Grid Style */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {pressPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">No press releases yet</h3>
              <p className="text-neutral-600">Check back for news and announcements</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured post (first one) */}
              {pressPosts[0] && (
                <Link 
                  href={`/stories/press/${pressPosts[0].slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                        {pressPosts[0].coverImage ? (
                          <>
                            <img
                              src={pressPosts[0].coverImage}
                              alt={pressPosts[0].title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                            <div className="text-6xl">📢</div>
                          </div>
                        )}
                        
                        <div className="absolute top-6 left-6 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                          FEATURED
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-12 flex flex-col justify-center">
                        {pressPosts[0].publishedAt && (
                          <div className="text-sm font-bold text-green-600 mb-4">
                            {new Date(pressPosts[0].publishedAt).toLocaleDateString('en-US', { 
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </div>
                        )}
                        
                        <h2 className="text-4xl font-bold tracking-tight mb-4 group-hover:text-green-600 transition-colors">
                          {pressPosts[0].title}
                        </h2>
                        
                        {pressPosts[0].excerpt && (
                          <p className="text-lg text-neutral-600 mb-6 line-clamp-4">
                            {pressPosts[0].excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-green-600 font-bold group-hover:gap-4 transition-all">
                          Read Full Article
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}
              
              {/* Rest of posts in grid */}
              {pressPosts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pressPosts.slice(1).map((post) => (
                    <Link 
                      key={post.id}
                      href={`/stories/press/${post.slug}`}
                      className="group"
                    >
                      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-neutral-100">
                        {/* Image */}
                        {post.coverImage && (
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          {post.publishedAt && (
                            <div className="text-xs font-bold text-green-600 mb-3">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric'
                              })}
                            </div>
                          )}
                          
                          <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          {post.excerpt && (
                            <p className="text-neutral-600 text-sm mb-4 line-clamp-3 flex-1">
                              {post.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                            {post.readTime && (
                              <div className="text-sm text-neutral-500">
                                {post.readTime} min read
                              </div>
                            )}
                            
                            <div className="text-green-600 group-hover:translate-x-1 transition-transform">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

