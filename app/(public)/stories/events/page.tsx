import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Camera, Sparkles } from "lucide-react"

export default async function EventRecapsPage() {
  const posts = await getPublishedPosts()
  const eventPosts = posts.filter(p => p.category === "news")

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
                      href="/stories" 
                      className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 group transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span className="font-medium">Back to Stories</span>
                    </Link>
            
            <div className="flex items-center gap-6">
              <Link href="/stories/poetry" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Poetry
              </Link>
              <Link href="/stories/blog" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Blog
              </Link>
              <Link href="/stories/events" className="text-sm font-semibold text-neutral-900">
                Events
              </Link>
              <Link href="/stories/press" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Press
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="/optimized/0K0A4950.jpg"
          alt="Event Recaps"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Event Recaps
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-crimson font-normal tracking-tighter text-white mb-6 leading-[1.1]">
              Moments<br />Captured
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Relive the energy and highlights from our workshops, performances, and gatherings
            </p>
            
            {/* Stats */}
            <div className="flex items-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-white/80">
                <Camera className="w-5 h-5" />
                <span className="text-sm font-medium">{eventPosts.length} Events</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Memories Forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Cards Grid */}
      <section className="pb-32 px-6 pt-20">
        <div className="max-w-7xl mx-auto">
          {eventPosts.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-neutral-200 shadow-sm">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-3xl font-crimson font-normal mb-3">No event recaps yet</h3>
              <p className="text-neutral-500 text-lg">Check back after our next event</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {eventPosts.map((post) => (
                <Link 
                  key={post.id}
                  href={`/stories/events/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-neutral-200 hover:border-neutral-300">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
                      {post.coverImage ? (
                        <>
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={800}
                            height={450}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                          
                          {/* Event date badge */}
                          {post.publishedAt && (
                            <div className="absolute top-6 left-6 bg-white text-neutral-900 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-sm">
                              <div className="text-3xl font-bold leading-none mb-1">
                                {new Date(post.publishedAt).getDate()}
                              </div>
                              <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                          )}
                          
                          {/* Category badge */}
                          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                            <div className="text-xs font-bold uppercase tracking-wider">Event Recap</div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-20 h-20 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-10 flex-1 flex flex-col">
                      <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-5 group-hover:text-neutral-600 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-neutral-600 mb-8 line-clamp-3 leading-relaxed flex-1 text-lg">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                        <div className="flex items-center gap-4">
                          {post.author.image && (
                            <Image
                              src={post.author.image}
                              alt={post.author.name || "Author"}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full ring-2 ring-neutral-200"
                            />
                          )}
                          <div>
                            <div className="font-bold text-neutral-900 text-base">
                              {post.author.name || "Anonymous"}
                            </div>
                            {post.readTime && (
                              <div className="text-neutral-500 text-sm">
                                {post.readTime} min read
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all">
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

