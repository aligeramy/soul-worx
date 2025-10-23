import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Newspaper } from "lucide-react"

export default async function PressMediaPage() {
  const posts = await getPublishedPosts()
  const pressPosts = posts.filter(p => p.category === "announcements")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/0K0A7770.jpg"
          alt="Press & Media"
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
              PRESS & MEDIA
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              In The Spotlight
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Media coverage, press releases, and official announcements from Soulworx
            </p>
          </div>
        </div>
      </section>

      {/* Press Cards Grid */}
      <section className="pb-32 px-6 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          {pressPosts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-crimson font-normal mb-2">No press releases yet</h3>
              <p className="text-neutral-500">Check back for news and announcements</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured post (first one) */}
              {pressPosts[0] && (
                <Link 
                  href={`/stories/press/${pressPosts[0].slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                        {pressPosts[0].coverImage ? (
                          <>
                            <Image
                              src={pressPosts[0].coverImage}
                              alt={pressPosts[0].title}
                              width={600}
                              height={450}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                            <div className="text-6xl">📢</div>
                          </div>
                        )}
                        
                        <div className="absolute top-6 left-6 bg-neutral-900 text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider">
                          FEATURED
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-12 flex flex-col justify-center">
                        {pressPosts[0].publishedAt && (
                          <div className="text-sm font-bold text-neutral-600 mb-4">
                            {new Date(pressPosts[0].publishedAt).toLocaleDateString('en-US', { 
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </div>
                        )}
                        
                        <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-4 group-hover:text-neutral-600 transition-colors">
                          {pressPosts[0].title}
                        </h2>
                        
                        {pressPosts[0].excerpt && (
                          <p className="text-lg text-neutral-600 mb-6 line-clamp-4">
                            {pressPosts[0].excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-neutral-900 font-semibold group-hover:gap-4 transition-all">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
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
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              width={400}
                              height={225}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          {post.publishedAt && (
                            <div className="text-xs font-bold text-neutral-600 mb-3">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric'
                              })}
                            </div>
                          )}
                          
                          <h3 className="text-xl font-crimson font-normal tracking-tighter mb-3 group-hover:text-neutral-600 transition-colors line-clamp-2">
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
                            
                            <div className="text-neutral-900 group-hover:translate-x-1 transition-transform">
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

