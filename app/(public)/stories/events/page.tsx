import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default async function EventRecapsPage() {
  const posts = await getPublishedPosts()
  const eventPosts = posts.filter(p => p.category === "news")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/0K0A4950.jpg"
          alt="Event Recaps"
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
              EVENT RECAPS
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Moments Captured
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Relive the energy and highlights from our workshops, performances, and gatherings
            </p>
          </div>
        </div>
      </section>

      {/* Event Cards Grid */}
      <section className="pb-32 px-6 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          {eventPosts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-4xl">🎭</div>
              </div>
              <h3 className="text-2xl font-crimson font-normal mb-2">No event recaps yet</h3>
              <p className="text-neutral-500">Check back after our next event</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {eventPosts.map((post) => (
                <Link 
                  key={post.id}
                  href={`/stories/events/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-neutral-100">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {post.coverImage ? (
                        <>
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={600}
                            height={338}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                          
                          {/* Event date badge */}
                          {post.publishedAt && (
                            <div className="absolute top-6 left-6 bg-white text-neutral-900 px-4 py-2 rounded-xl shadow-lg">
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
                        <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                          <div className="text-6xl">📸</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col">
                      <h2 className="text-2xl font-crimson font-normal tracking-tighter mb-4 group-hover:text-neutral-600 transition-colors">
                        {post.title}
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-neutral-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex items-center gap-3">
                          {post.author.image && (
                            <Image
                              src={post.author.image}
                              alt={post.author.name || "Author"}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div className="text-sm">
                            <div className="font-bold text-neutral-900">
                              {post.author.name || "Anonymous"}
                            </div>
                            {post.readTime && (
                              <div className="text-neutral-600">
                                {post.readTime} min read
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-neutral-900 group-hover:translate-x-1 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </section>
    </div>
  )
}

